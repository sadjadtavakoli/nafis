from datetime import datetime

from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError, PermissionDenied
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from bill.models import Bill, BillItem, CustomerPayment, CustomerCheque, OurCheque, SupplierBill, OurPayment, \
    SupplierBillItem, BillCounter
from bill.permissions import LoginRequired, CloseBillPermission
from bill.serializers import BillSerializer, CustomerPaymentSerializer, BillItemSerializer, SupplierBillSerializer, \
    SupplierBillItemSerializer, CustomerChequeSerializer, OurChequeSerializer
from customer.models import Customer, Point
from nafis.paginations import PaginationClass
from nafis.sms import SendSMS, create_message
from nafis.views import NafisBase
from product.models import Product
from staff.models import Staff


class BillsViewSet(NafisBase, ModelViewSet):
    serializer_class = BillSerializer
    # permission_classes = (LoginRequired,)
    queryset = Bill.objects.all().order_by('-pk')
    non_updaters = []
    non_destroyers = ['cashier', 'salesperson', 'storekeeper', 'accountant']
    pagination_class = PaginationClass

    def destroy(self, request, *args, **kwargs):
        bill = self.get_object()
        bill_items_data = []
        for item in bill.items.all():
            bill_items_data.append({'product': item.product, 'amount': item.amount})
        if (bill.seller.username != request.user.username) or bill.status != "active":
            staff = Staff.objects.get(username=request.user.username)
            if staff.job != "admin":
                raise PermissionDenied
                # TODO permissionDenied for who except "admin" wants to delete a bill

        if len(bill.payments.all()):
            raise PermissionDenied(
                detail="نمی‌توانید فاکتوری را که پرداخت دارد حذف کنید، ابتدا پرداخت‌ها"
                       " را حذف نموده سپس نسبت به حذف فاکتور اقدام نمایید.")
        response = super(BillsViewSet, self).destroy(request, *args, **kwargs)
        for data in bill_items_data:
            data['product'].update_stock_amount(-1 * (float(data['amount']) + 0.05))
        return response

    @action(url_path='close-all', detail=False, methods=['post'], permission_classes=(CloseBillPermission,))
    def close_all(self, request):
        for bill in Bill.objects.filter(status="active"):
            bill.check_status()
            bill.close_date = timezone.now()
            try:
                staff = Staff.objects.get(username=request.user.username)
                bill.closande = staff
            except ObjectDoesNotExist:
                pass
            bill.save()
            if not (bill.items_special_discount or bill.buyer_special_discount):
                bill.buyer.points += int(bill.final_price) * int(Point.objects.first().amount) / 100
                bill.buyer.save()
        return Response({'ok': True})

    @action(methods=['post'], detail=True, url_path='done', permission_classes=(CloseBillPermission,))
    def close_bill(self, request, **kwargs):
        instance = self.get_object()
        if instance.status == "active":
            instance.check_status()
            instance.close_date = timezone.now()
            try:
                staff = Staff.objects.get(username=request.user.username)
                instance.closande = staff
            except ObjectDoesNotExist:
                pass
            instance.save()
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

    @action(url_path='actives', detail=False, methods=['get'], permission_classes=())
    def get_actives(self, request):
        queryset = Bill.objects.filter(status='active').order_by('-pk')
        staff = Staff.objects.get(username=self.request.user.username)
        if staff.job == "salesperson":
            queryset = queryset.filter(seller=staff)
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

    @action(methods=['post'], detail=True, url_path='add-payments')
    def add_payments(self, request, **kwargs):
        payment_type = self.request.data.get('type')
        bill = self.get_object()
        if payment_type == "cash_card":
            cash_amount = self.request.data.get('cash_amount', 0)
            card_amount = self.request.data.get('card_amount', 0)
            if cash_amount:
                payment_type = "cash"
                CustomerPayment.objects.create(create_date=timezone.now(),
                                               amount=float(cash_amount),
                                               bill=bill,
                                               type=payment_type)
            if card_amount:
                payment_type = "card"
                CustomerPayment.objects.create(create_date=timezone.now(),
                                               amount=float(card_amount),
                                               bill=bill,
                                               type=payment_type)
        elif payment_type == "cheque":
            amount = self.request.data.get('amount', None)
            if amount is None:
                raise ValidationError("مقدار تمی‌تواند خالی باشد")
            bank = self.request.data.get('bank')
            number = self.request.data.get('number')
            issue_date = self.request.data.get('issue_date', timezone.now().date())
            expiry_date = self.request.data.get('expiry_date')
            cheque = CustomerCheque.objects.create(number=int(number), bank=bank,
                                                   issue_date=issue_date,
                                                   expiry_date=expiry_date,
                                                   amount=int(amount), customer=bill.buyer)
            CustomerPayment.objects.create(create_date=timezone.now(), cheque=cheque,
                                           amount=float(amount), bill=bill, type=payment_type)

        data = BillSerializer(Bill.objects.get(pk=bill.pk)).data
        return Response(data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        if self.request.data.get('used_points', None):
            points = self.request.data.get('used_points')
            buyer = self.get_object().buyer
            total_points = int(buyer.points) + self.get_object().used_points
            if int(points) > total_points:
                raise ValidationError('امتیاز استفاده شده بیشتر از حد مجاز است.')
            old_points = self.get_object().used_points

        response = super(BillsViewSet, self).update(request, *args, **kwargs)
        if self.request.data.get('used_points', None):
            points = int(self.request.data.get('used_points'))
            buyer = self.get_object().buyer
            buyer.points += (old_points - points)
            buyer.save()
        return response

    def create(self, request, *args, **kwargs):
        data = self.request.data
        phone_number = data.get('phone_number')
        buyer, created = Customer.objects.get_or_create(phone_number=phone_number)
        seller = Staff.objects.get(username=self.request.user.username)
        discount = data.get('discount', 0)
        items = data.get('items')
        bill_counter = BillCounter.objects.first()
        if not Bill.objects.filter(create_date__date=timezone.now().date()).count():
            bill_counter.reset()
        bill_code = bill_counter.increase()
        bill = Bill.objects.create(buyer=buyer, seller=seller, discount=discount, branch=seller.branch,
                                   bill_code=bill_code)

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

    @action(methods=['GET'], detail=False, url_path="daily-report")
    def daily_report(self, request):
        total_benefit, total_discount, total_price, total_final_price, total_items, total_bills = 0, 0, 0, 0, 0, 0
        total_cheque_paid, total_cash_paid, total_card_paid, total_paid, reminded_payments = 0, 0, 0, 0, 0
        data = {}
        bills = Bill.objects.filter(close_date__date=datetime.today().date(), status__in=["remained", "done"])
        bills_with_reminded_status = bills.filter(status="remained").count()
        total_bills = bills.count()
        for bill in bills:
            total_final_price += bill.final_price
            total_price += bill.price
            total_paid += bill.paid
            total_discount += bill.total_discount
            total_benefit += bill.profit
            total_items += bill.items.count()
            total_cheque_paid += bill.cheque_paid
            total_cash_paid += bill.cash_paid
            total_card_paid += bill.card_paid
            reminded_payments += bill.remaining_payment
        data['bills_data'] = BillSerializer(bills, many=True).data
        data['total_profit'] = total_benefit
        data['total_discount'] = total_discount
        data['total_price'] = total_price
        data['total_final_price'] = total_final_price
        data['total_items'] = total_items
        data['total_bills'] = total_bills
        data['total_cheque_paid'] = total_cheque_paid
        data['total_cash_paid'] = total_cash_paid
        data['total_card_paid'] = total_card_paid
        data['total_paid'] = total_paid
        data['total_reminded_payments'] = reminded_payments
        data['bills_with_reminded_status'] = bills_with_reminded_status
        return Response(data)

    @action(methods=["GET"], detail=False, url_path="interval-report")
    def total_report(self, request, **kwargs):
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        bills = Bill.objects.filter(close_date__date__range=[start_date, end_date], status__in=["done", "remained"])
        total_sales, total_sales_received, total_sales_remaining, total_profit, total_sales_card = 0, 0, 0, 0, 0
        total_sales_cash, total_sales_cheque, total_discount, total_items, total_final_price = 0, 0, 0, 0, 0
        bills_with_reminded_status = bills.filter(status="remained").count()
        total_bills = bills.count()
        data = {}
        for bill in bills:
            total_sales += bill.price
            total_final_price += bill.final_price
            total_sales_received += bill.paid
            total_profit += bill.profit
            total_sales_cash += bill.cash_paid
            total_sales_card += bill.card_paid
            total_sales_cheque += bill.cheque_paid
            total_discount += bill.total_discount
            total_items += bill.items.count()

        data['total_profit'] = total_profit
        data['total_discount'] = total_discount
        data['total_price'] = total_sales
        data['total_final_price'] = total_final_price
        data['total_items'] = total_items
        data['total_bills'] = total_bills
        data['total_cheque_paid'] = total_sales_cheque
        data['total_cash_paid'] = total_sales_cash
        data['total_card_paid'] = total_sales_card
        data['total_paid'] = total_sales_received
        data['total_reminded_payments'] = total_sales_remaining
        data['bills_with_reminded_status'] = bills_with_reminded_status
        return Response(data)

    def get_filter_kwargs(self):
        data = self.request.query_params
        data = {k: (data.getlist(k) if k.endswith('[]') else data.get(k))
                for k in data}
        return data

    @action(methods=["GET"], detail=False, url_path="bar-charts")
    def bar_chart_data(self, request, **kwargs):
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        separation = self.request.query_params.get('separation', None)
        data = self.get_filter_kwargs()
        bg_colors = data.get('bg_color[]', None)
        design_colors = data.get('design_color[]', None)
        designs = data.get('design[]', None)
        f_types = data.get('f_type[]', None)
        materials = data.get('material[]', None)
        result = dict()
        query = BillItem.objects.filter(bill__close_date__date__range=[start_date, end_date],
                                        bill__status__in=["done", "remained"], rejected=False)
        if bg_colors is not None and len(bg_colors):
            result['sells_per_bg_color'] = Bill.sells_per_bg_color(query, bg_colors, separation)
        if design_colors is not None and len(design_colors):
            result['sells_per_design_color'] = Bill.sells_per_design_color(query, design_colors, separation)
        if designs is not None and len(designs):
            result['sells_per_design'] = Bill.sells_per_design(query, designs, separation)
        if f_types is not None and len(f_types):
            result['sells_per_f_type'] = Bill.sells_per_f_type(query, f_types, separation)
        if materials is not None and len(materials):
            result['sells_per_material'] = Bill.sells_per_material(query, materials, separation)
        return Response(result)

    @action(methods=["GET"], detail=False, url_path="pie-charts")
    def pie_chart_data(self, request, **kwargs):
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        data = self.get_filter_kwargs()
        bg_colors = data.get('bg_color[]', None)
        design_colors = data.get('design_color[]', None)
        designs = data.get('design[]', None)
        f_types = data.get('f_type[]', None)
        materials = data.get('material[]', None)
        result = dict()
        query = BillItem.objects.filter(bill__close_date__date__range=[start_date, end_date],
                                        bill__status__in=["done", "remained"], rejected=False)

        # if designs is not None and len(designs):
        result['sells_per_design'] = Bill.sells_per_all_design(query)
        # if f_types is not None and len(f_types):
        result['sells_per_f_type'] = Bill.sells_per_all_f_type(query)
        # if materials is not None and len(materials):
        result['sells_per_material'] = Bill.sells_per_all_material(query)
        return Response(result)


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
        bill_item_product.update_stock_amount(-1 * (bill_item_amount + 0.05))
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


class SupplierBillsViewSet(NafisBase, ModelViewSet):
    serializer_class = SupplierBillSerializer
    permission_classes = (LoginRequired,)
    queryset = SupplierBill.objects.all().order_by('-pk')
    non_updaters = ['cashier', 'salesperson', 'storekeeper']
    non_destroyers = ['cashier', 'salesperson', 'storekeeper']
    pagination_class = PaginationClass

    def destroy(self, request, *args, **kwargs):
        bill = self.get_object()
        bill_items_data = []
        for item in bill.items.all():
            bill_items_data.append({'product': item.product, 'amount': item.amount})

        if len(bill.payments.all()):
            raise PermissionDenied(
                detail="نمی‌توانید فاکتوری را که پرداخت دارد حذف کنید، ابتدا پرداخت‌ها"
                       " را حذف نموده سپس نسبت به حذف فاکتور اقدام نمایید.")
        response = super(SupplierBillsViewSet, self).destroy(request, *args, **kwargs)
        for data in bill_items_data:
            data['product'].update_stock_amount(float(data['amount']))
        return response

    @action(methods=['post'], detail=True, url_path='add-payments')
    def add_payments(self, request, **kwargs):
        payment_type = self.request.data.get('type')
        bill = self.get_object()
        amount = self.request.data.get('amount')
        payment = OurPayment.objects.create(create_date=timezone.now(),
                                            amount=float(amount), bill=bill, type=payment_type)

        if payment_type == "cheque":
            amount = self.request.data.get('amount')
            bank = self.request.data.get('bank')
            number = self.request.data.get('number')
            issue_date = self.request.data.get('issue_date', timezone.now().date())
            expiry_date = self.request.data.get('expiry_date')
            cheque = OurCheque.objects.create(number=int(number), bank=bank,
                                              issue_date=issue_date,
                                              expiry_date=expiry_date,
                                              amount=int(amount), customer=bill.buyer)

            payment.cheque = cheque
            payment.save()

        data = SupplierBillSerializer(SupplierBill.objects.get(pk=bill.pk)).data
        return Response(data, status=status.HTTP_201_CREATED)

    # def create(self, request, *args, **kwargs):
    #     data = self.request.data
    #     items = data.get('items')
    #     supplier = data.get('supplier')
    #     bill_code = data.get('bill_code')
    #     currency_price = data.get('currency_price', 1)
    #     currency = data.get('currency', 'ریال')
    #
    #     bill = SupplierBill.objects.create(supplier=supplier, currency_price=currency_price, currency=currency,
    #                                        bill_code=bill_code)
    #
    #     for item in items:
    #         product_code = item['product']
    #         try:
    #             product = Product.objects.get(code=product_code)
    #         except ObjectDoesNotExist:
    #             raise ValidationError('محصولی با کد‌ {} وجود ندارد.'.format(product_code))
    #         amount = item['amount']
    #         raw_price = item.get('price', 0)
    #         SupplierBillItem.objects.create(product=product, amount=amount, bill=bill, raw_price=raw_price)
    #
    #     serializer = self.get_serializer(bill)
    #     headers = self.get_success_headers(serializer.data)
    #     return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class SupplierBillItemViewSet(NafisBase, ModelViewSet):
    serializer_class = SupplierBillItemSerializer
    permission_classes = (LoginRequired,)
    queryset = SupplierBillItem.objects.all()
    non_updaters = ["cashier", "salesperson"]
    non_destroyers = ['cashier', "salesperson"]
    non_creator = ['cashier', "salesperson"]

    @action(methods=['post'], detail=True, url_path='reject', permission_classes=())
    def reject(self):
        bill_item = self.get_object()
        bill_item.reject()
        return Response({'done': True})

    def destroy(self, request, *args, **kwargs):
        bill = self.get_object().bill
        bill_item_product = self.get_object().product
        bill_item_amount = self.get_object().amount
        bill_item_product.update_stock_amount(bill_item_amount)
        serializer = SupplierBillSerializer(bill)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, headers=headers)

    def update(self, request, *args, **kwargs):
        bill = self.get_object().bill
        super(SupplierBillItemViewSet, self).update(request, *args, **kwargs)
        serializer = SupplierBillSerializer(bill)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, headers=headers)

    def create(self, request, *args, **kwargs):
        bill = Bill.objects.get(pk=self.request.data.get('bill', None))
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
        raw_price = item.get('price', 0)
        SupplierBillItem.objects.create(product=product, amount=amount, bill=bill, raw_price=raw_price)

        serializer = SupplierBillSerializer(bill)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class CustomerChequeViewSet(NafisBase, ModelViewSet):
    serializer_class = CustomerChequeSerializer
    permission_classes = (LoginRequired,)
    queryset = CustomerCheque.objects.all()
    non_updaters = ["cashier", "salesperson"]
    non_destroyers = ['cashier', "salesperson"]
    non_creator = ['cashier', "salesperson"]


class OurChequeViewSet(NafisBase, ModelViewSet):
    serializer_class = OurChequeSerializer
    permission_classes = (LoginRequired,)
    queryset = OurCheque.objects.all()
    non_updaters = ["cashier", "salesperson"]
    non_destroyers = ['cashier', "salesperson"]
    non_creator = ['cashier', "salesperson"]
