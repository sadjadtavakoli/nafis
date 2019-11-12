from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from bill.models import Bill, BillItem, CustomerPayment
from bill.permissions import LoginRequired
from bill.serializers import BillSerializer, CustomerPaymentSerializer
from customer.models import Customer
from nafis.views import NafisBase
from staff.models import Staff


class BillsViewSet(NafisBase, ModelViewSet):
    serializer_class = BillSerializer
    permission_classes = (LoginRequired,)
    queryset = Bill.objects.all()
    non_updaters = ["cashier"]
    non_destroyers = ['cashier']

    @action(url_path='close_all', detail=False, methods=['post'], permission_classes=())
    def close_all(self, request):
        Bill.objects.filter(status="active").update(status='done')
        return Response({'ok': True})

    @action(url_path='actives', detail=False, methods=['get'], permission_classes=())
    def get_actives(self, request):
        return Bill.objects.filter(status='active')

    @action(url_path='dones', detail=False, methods=['get'], permission_classes=())
    def get_dones(self, request):
        return Bill.objects.filter(status='done')

    @action(methods=['post'], detail=True, url_path='add-payments', permission_classes=())
    def add_payments(self, request):
        data = self.request.data
        payment = CustomerPayment.objects.create(**data, bill=self.get_object())
        return Response(CustomerPaymentSerializer(payment).data)

    @action(methods=['post'], detail=True, url_path='done', permission_classes=())
    def close_bill(self, request):
        instance = self.get_object()
        instance.make_done()
        return Response({'ok': True})

    def create(self, request, *args, **kwargs):
        data = self.request.data
        phone_number = data.get('phone_number')
        buyer = Customer.objects.get_or_create(phone_number=phone_number)
        seller = Staff.objects.get(username=self.request.user.username)
        straight_discount = data.get('straight_discount', 0)
        percentage_discount = data.get('percentage_discount', 0)
        used_points = data.get('used_points', 0)
        branch = data.get('branch')
        items = data.get('items')
        items_objects = []
        for item in items:
            product = item['product']
            amount = item['amount']
            straight_discount = item['straight_discount']
            percentage_discount = item['percentage_discount']
            items_objects.append(BillItem.objects.create(product_id=product, amount=amount,
                                                         straight_discount=straight_discount,
                                                         percentage_discount=percentage_discount))
        bill = Bill.objects.create(buyer=buyer, seller=seller, straight_discount=straight_discount,
                                   percentage_discount=percentage_discount, branch_id=branch)

        bill.items.add(*items_objects)

        serializer = self.get_serializer(bill)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
