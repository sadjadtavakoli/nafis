from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from bill.models import SupplierBill, SupplierBillItem
from bill.permissions import LoginRequired
from bill.serializers import OurChequeSerializer, SupplierBillSerializer
from nafis.paginations import PaginationClass
from nafis.views import NafisBase
from product.models import Product
from supplier.models import Supplier
from supplier.serializers import SupplierSerializer


class SupplierViewSet(NafisBase, ModelViewSet):
    serializer_class = SupplierSerializer
    # permission_classes = (LoginRequired,)
    queryset = Supplier.objects.all()
    non_updaters = []
    non_destroyers = []
    pagination_class = PaginationClass

    @action(methods=['get'], detail=False, url_path="search")
    def get_suppliers(self, request, **kwargs):
        data = self.request.query_params
        query = data.get('query', None)
        if query:
            suppliers = Supplier.objects.filter(
                Q(phone_number__contains=query) | Q(mobile_number__contains=query) | Q(store__contains=query) | Q(
                    first_name__contains=query) | Q(last_name__contains=query))
        else:
            suppliers = Supplier.objects.all()
        suppliers = SupplierSerializer(suppliers, many=True)
        return Response(suppliers.data)

    @action(methods=['POST'], detail=True, url_path="add-bill")
    def add_bill(self, request, **kwargs):
        data = self.request.data
        items = data.get('items')
        supplier = self.get_object()
        currency_price = data.get('currency_price', 1)
        currency = data.get('currency', 'ریال')
        bill_code = data.get('bill_code')
        bill = SupplierBill.objects.create(supplier=supplier, currency_price=currency_price, currency=currency,
                                           bill_code=bill_code)

        for item in items:
            product_code = item['product']
            try:
                product = Product.objects.get(code=product_code)
            except ObjectDoesNotExist:
                raise ValidationError('محصولی با کد‌ {} وجود ندارد.'.format(product_code))
            amount = item['amount']
            raw_price = item.get('price', 0)
            if raw_price > 0:
                product.buying_price = raw_price
                product.save()
            else:
                raw_price = product.buying_price
            SupplierBillItem.objects.create(product=product, amount=amount, bill=bill, raw_price=raw_price)

        serializer = SupplierBillSerializer(bill)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(methods=['GET'], detail=True, url_path="cheques")
    def get_passed_cheques(self, request, **kwargs):
        supplier = self.get_object()
        queryset = supplier.cheques.all()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = OurChequeSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = OurChequeSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(methods=['GET'], detail=True, url_path="remained-cheques")
    def get_remained_cheques(self, request, **kwargs):
        supplier = self.get_object()
        queryset = supplier.remained_cheques.all()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = OurChequeSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = OurChequeSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(methods=['GET'], detail=True, url_path="remained-bills")
    def get_remained_bills(self, request, **kwargs):
        supplier = self.get_object()
        queryset = supplier.remained_bills.all()
        bill_code = self.request.query_params.get('bill_code', None)
        create_date = self.request.query_params.get('create_date', None)
        if create_date:
            queryset = queryset.filter(create_date=create_date)
        if bill_code:
            queryset = queryset.filter(bill_code=bill_code)

        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = SupplierBillSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = SupplierBillSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(methods=['GET'], detail=True, url_path="bills")
    def get_all_bills(self, request, **kwargs):
        supplier = self.get_object()
        queryset = supplier.bills.all()
        bill_code = self.request.query_params.get('bill_code', None)
        create_date = self.request.query_params.get('create_date', None)
        if create_date:
            queryset = queryset.filter(create_date=create_date)
        if bill_code:
            queryset = queryset.filter(bill_code=bill_code)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = SupplierBillSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = SupplierBillSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(methods=['GET'], detail=True, url_path="products")
    def get_products(self, request, **kwargs):
        supplier = self.get_object()
        ids = supplier.bills.values_list('items__product', flat=True)
        return Product.objects.filter(pk__in=ids)
