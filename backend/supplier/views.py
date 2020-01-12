from rest_framework.decorators import action
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from bill.permissions import LoginRequired
from bill.serializers import OurChequeSerializer, SupplierBillSerializer
from nafis.paginations import PaginationClass
from nafis.views import NafisBase
from supplier.models import Supplier
from supplier.serializers import SupplierSerializer


class SupplierViewSet(NafisBase, ModelViewSet):
    serializer_class = SupplierSerializer
    permission_classes = (LoginRequired,)
    queryset = Supplier.objects.all()
    non_updaters = []
    non_destroyers = []
    pagination_class = PaginationClass

    # @action(methods=['POST'], url_path="add-bill")
    # def add_bill(self, request, **kwargs):
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
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = SupplierBillSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = SupplierBillSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(methods=['GET'], detail=True, url_path="bills")
    def get_done_bills(self, request, **kwargs):
        supplier = self.get_object()
        queryset = supplier.bills.all()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = SupplierBillSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = SupplierBillSerializer(queryset, many=True)
        return Response(serializer.data)
