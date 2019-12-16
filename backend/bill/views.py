from datetime import datetime

from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError, PermissionDenied
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from bill.models import Bill, BillItem, CustomerPayment, CustomerCheque
from bill.permissions import LoginRequired, CloseBillPermission, AddPaymentPermission
from bill.serializers import BillSerializer, CustomerPaymentSerializer, BillItemSerializer
from customer.models import Customer, Point
from nafis.paginations import PaginationClass
from nafis.sms import SendSMS, create_message
from nafis.views import NafisBase
from product.models import Product
from staff.models import Staff


class BillsViewSet(NafisBase, ModelViewSet):
    serializer_class = BillSerializer
    permission_classes = (LoginRequired,)
    queryset = Bill.objects.all().order_by('-pk')
    non_updaters = []
    non_destroyers = ['cashier', 'salesperson', 'storekeeper', 'accountant']
    pagination_class = PaginationClass

    def destroy(self, request, *args, **kwargs):
        bill = self.get_object()
        bill_items_data = []
        for item in bill.items.all():
            bill_items_data.append({'product': item.product, 'amount': item.amount})
        if bill.seller.username != request.user.username or bill.status != "active":
            raise PermissionDenied
        if len(bill.payments.all()):
            raise PermissionDenied(
                detail="نمی‌توانید فاکتوری را که پرداخت دارد حذف کنید، ابتدا پرداخت‌ها"
                       " را حذف نموده سپس نسبت به حذف فاکتور اقدام نمایید.")
        response = super(BillsViewSet, self).destroy(request, *args, **kwargs)
        for data in bill_items_data:
            data['product'].update_stock_amount(-1 * data['amount'])
        return response

    @action(url_path='close-all', detail=False, methods=['post'], permission_classes=(CloseBillPermission,))
    def close_all(self, request):
        for bill in Bill.objects.filter(status="active"):
            bill.check_status()
            bill.buyer.points += int(bill.final_price) * int(Point.objects.first().amount) / 100
            bill.buyer.save()
        return Response({'ok': True})

    @action(url_path='actives', detail=False, methods=['get'], permission_classes=())
    def get_actives(self, request):
        queryset = Bill.objects.filter(status='active').order_by('-pk')
        staff = Staff.objects.get(username=self.request.user.username)
        if staff.job == "salesperson":
            queryset.filter(buyer=staff)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(url_path='dones', detail=False, methods=['get'], permission_classes=())
    def get_dones(self, request):
        queryset = Bill.objects.filter(status='done').order_by('-pk')
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(methods=['post'], detail=True, url_path='add-payments', permission_classes=(AddPaymentPermission,))
    def add_payments(self, request, **kwargs):
        payment_type = self.request.data.get('type')
        if payment_type == "cash_card":
            cash_amount = self.request.data.get('cash_amount', 0)
            card_amount = self.request.data.get('card_amount', 0)
            if cash_amount:
                amount = cash_amount
                payment_type = "cash"
            else:
                amount = card_amount
                payment_type = "card"
        else:
            amount = self.request.data.get('amount')

        bill = self.get_object()
        payment = CustomerPayment.objects.create(create_date=datetime.now(),
                                                 amount=float(amount), bill=bill, type=payment_type)

        if payment_type == "cheque":
            bank = self.request.data.get('bank')
            number = self.request.data.get('number')
            issue_date = self.request.data.get('issue_date', datetime.now().date())
            expiry_date = self.request.data.get('expiry_date')
            cheque = CustomerCheque.objects.create(number=int(number), bank=bank,
                                                   issue_date=issue_date,
                                                   expiry_date=expiry_date,
                                                   amount=int(amount), customer=bill.buyer)

            payment.cheque = cheque
            payment.save()

        serializer = CustomerPaymentSerializer(payment)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(methods=['post'], detail=True, url_path='done', permission_classes=(CloseBillPermission,))
    def close_bill(self, request, **kwargs):
        instance = self.get_object()
        if instance.status == "active":
            instance.check_status()
            send_message = self.request.data.get('send_message', True)
            if send_message:
                try:
                    sms = SendSMS()
                    sms.group_sms(create_message(instance), [instance.buyer.phone_number], instance.buyer.phone_number)
                except:
                    pass
            if not (instance.items_special_discount or instance.buyer_special_discount):
                instance.buyer.points += int(instance.final_price) * int(Point.objects.first().amount) / 100
                instance.buyer.save()
        return Response({'status': instance.status})

    def create(self, request, *args, **kwargs):
        data = self.request.data
        phone_number = data.get('phone_number')
        buyer, created = Customer.objects.get_or_create(phone_number=phone_number)
        seller = Staff.objects.get(username=self.request.user.username)
        discount = data.get('discount', 0)
        used_points = data.get('used_points', 0)
        items = data.get('items')

        if int(used_points) > buyer.points:
            raise ValidationError('امتیاز استفاده شده بیشتر از حد مجاز است.')

        bill = Bill.objects.create(buyer=buyer, seller=seller, discount=discount, branch_id=seller.branch,
                                   used_points=used_points)

        for item in items:
            product_code = item['product']
            try:
                product = Product.objects.get(code=product_code)
            except ObjectDoesNotExist:
                raise ValidationError('محصولی با کد‌ {} وجود ندارد.'.format(product_code))
            amount = item['amount']
            end_of_roll_amount = None
            end_of_roll = item.get('end_of_roll', False)
            if end_of_roll:
                end_of_roll_amount = item['end_of_roll_amount']
            discount = item.get('discount', 0)
            BillItem.objects.create(product=product, amount=amount,
                                    discount=discount,
                                    end_of_roll=end_of_roll,
                                    end_of_roll_amount=end_of_roll_amount, bill=bill)

        serializer = self.get_serializer(bill)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class BillItemViewSet(ModelViewSet):
    serializer_class = BillItemSerializer
    permission_classes = (LoginRequired,)
    queryset = BillItem.objects.all()
    non_updaters = ["cashier", "accountant"]
    non_destroyers = ['cashier', "accountant"]
    non_creator = ['cashier', "accountant"]

    @action(methods=['post'], detail=True, url_path='reject', permission_classes=())
    def reject(self):
        bill_item = self.get_object()
        bill_item.reject()
        return Response({'done': True})

    def destroy(self, request, *args, **kwargs):
        bill = self.get_object().bill
        bill_item_product = self.get_object().product
        bill_item_amount = self.get_object().amount
        if bill.seller.username != request.user.username or bill.status != "active":
            raise PermissionDenied
        super(BillItemViewSet, self).destroy(request, *args, **kwargs)
        bill_item_product.update_stock_amount(-1 * bill_item_amount)
        serializer = BillSerializer(bill)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, headers=headers)

    def update(self, request, *args, **kwargs):
        bill = self.get_object().bill
        if bill.seller.username != request.user.username or bill.status != "active":
            raise PermissionDenied
        super(BillItemViewSet, self).update(request, *args, **kwargs)
        serializer = BillSerializer(bill)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, headers=headers)

    def create(self, request, *args, **kwargs):
        bill = Bill.objects.get(pk=self.request.data.get('bill', None))
        if bill.status != "active":
            raise PermissionDenied

        staff = Staff.objects.get(username=request.user.username)
        if staff.job in self.non_creator:
            raise PermissionDenied

        item = self.request.data
        product_code = item['product']
        try:
            product = Product.objects.get(code=product_code)
        except ObjectDoesNotExist:
            raise ValidationError('محصولی با کد‌ {} وجود ندارد.'.format(product_code))
        amount = item['amount']
        end_of_roll_amount = None
        end_of_roll = item.get('end_of_roll', False)
        if end_of_roll:
            end_of_roll_amount = item['end_of_roll_amount']
        discount = item.get('discount', 0)
        BillItem.objects.create(product=product, amount=amount,
                                discount=discount,
                                end_of_roll=end_of_roll,
                                end_of_roll_amount=end_of_roll_amount, bill=bill)

        serializer = BillSerializer(bill)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class CustomerPaymentViewSet(NafisBase, ModelViewSet):
    serializer_class = CustomerPaymentSerializer
    queryset = CustomerPayment.objects.all()
    permission_classes = (LoginRequired,)
    non_updaters = ["salesperson", "storekeeper", 'accountant']
    non_destroyers = ['salesperson', "storekeeper", 'accountant']
    non_creator = ['salesperson', "storekeeper", 'accountant']

    def destroy(self, request, *args, **kwargs):
        bill = self.get_object().bill
        if bill.status == "done":
            raise PermissionDenied
        cheque = None
        if self.get_object().type == "cheque":
            cheque = self.get_object().cheque
        response = super(CustomerPaymentViewSet, self).destroy(request, *args, **kwargs)
        if cheque:
            cheque.delete()
        return response

    def update(self, request, *args, **kwargs):
        bill = self.get_object().bill
        if bill.status == "done":
            raise PermissionDenied
        return super(CustomerPaymentViewSet, self).update(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        bill = Bill.objects.get(pk=self.request.data.get('bill', None))
        if bill.status == "done":
            raise PermissionDenied
        return super(CustomerPaymentViewSet, self).create(request, *args, **kwargs)
