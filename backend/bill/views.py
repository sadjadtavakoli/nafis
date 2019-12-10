from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError, PermissionDenied
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from bill.models import Bill, BillItem, CustomerPayment
from bill.permissions import LoginRequired, CloseBillPermission, AddPaymentPermission
from bill.serializers import BillSerializer, CustomerPaymentSerializer, BillItemSerializer
from customer.models import Customer
from nafis.paginations import PaginationClass
from nafis.views import NafisBase
from product.models import Product
from staff.models import Staff


class BillsViewSet(NafisBase, ModelViewSet):
    serializer_class = BillSerializer
    permission_classes = (LoginRequired,)
    queryset = Bill.objects.all()
    non_updaters = ["cashier"]
    non_destroyers = ['cashier']
    pagination_class = PaginationClass

    @action(url_path='close-all', detail=False, methods=['post'], permission_classes=(CloseBillPermission,))
    def close_all(self, request):
        Bill.objects.filter(status="active").update(status='done')
        return Response({'ok': True})

    @action(url_path='actives', detail=False, methods=['get'], permission_classes=())
    def get_actives(self, request):
        return Response(BillSerializer(Bill.objects.filter(status='active'), many=True).data)

    @action(url_path='dones', detail=False, methods=['get'], permission_classes=())
    def get_dones(self, request):
        return Response(BillSerializer(Bill.objects.filter(status='done'), many=True).data)

    @action(methods=['post'], detail=True, url_path='add-payments', permission_classes=(AddPaymentPermission,))
    def add_payments(self, request):
        data = self.request.data
        payment = CustomerPayment.objects.create(**data, bill=self.get_object())
        return Response(CustomerPaymentSerializer(payment).data)

    @action(methods=['post'], detail=True, url_path='done', permission_classes=(CloseBillPermission,))
    def close_bill(self, request):
        instance = self.get_object()
        instance.check_status()
        instance.buyer.points += instance.final_price * settings.POINT_PERCENTAGE
        instance.buyer.save()
        return Response({'status': instance.status})

    def create(self, request, *args, **kwargs):
        data = self.request.data
        phone_number = data.get('phone_number')
        buyer, created = Customer.objects.get_or_create(phone_number=phone_number)
        seller = Staff.objects.get(username=self.request.user.username)
        discount = data.get('discount', 0)
        used_points = data.get('used_points', 0)
        branch = data.get('branch')
        items = data.get('items')
        items_objects = []

        if int(used_points) > buyer.points:
            raise ValidationError('امتیاز استفاده شده بیشتر از حد مجاز است.')

        for item in items:
            product_code = item['product']
            try:
                product = Product.objects.get(code=product_code)
            except ObjectDoesNotExist:
                raise ValidationError('محصولی با کد‌ {} وجود ندارد.'.format(product_code))
            amount = item['amount']
            end_of_roll_amount = None
            end_of_roll = item['end_of_roll']
            if end_of_roll:
                end_of_roll_amount = item['end_of_roll_amount']
            discount = item['discount']
            items_objects.append(BillItem.objects.create(product=product, amount=amount,
                                                         discount=discount,
                                                         end_of_roll=end_of_roll,
                                                         end_of_roll_amount=end_of_roll_amount))
        bill = Bill.objects.create(buyer=buyer, seller=seller, discount=discount, branch_id=branch,
                                   used_points=used_points)

        bill.items.add(*items_objects)

        serializer = self.get_serializer(bill)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class BillItemViewSet(NafisBase, ModelViewSet):
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
        if bill.seller.username != request.user.username or bill.status != "active":
            raise PermissionDenied
        response = super(BillItemViewSet, self).destroy(request, *args, **kwargs)
        bill_item = self.get_object()
        bill_item.product.update_stock_amount(-1 * bill_item.amount)
        return response

    def update(self, request, *args, **kwargs):
        bill = self.get_object().bill
        if bill.seller.username != request.user.username or bill.status != "active":
            raise PermissionDenied
        return super(BillItemViewSet, self).update(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        bill = Bill.objects.get(pk=self.request.data.get('bill', None))
        if bill.status != "active":
            raise PermissionDenied
        return super(BillItemViewSet, self).create(request, *args, **kwargs)


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
        return super(CustomerPaymentViewSet, self).destroy(request, *args, **kwargs)

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
