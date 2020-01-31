from django.core.exceptions import ObjectDoesNotExist
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.status import HTTP_404_NOT_FOUND
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from bill.serializers import CustomerChequeSerializer, BillSerializer
from customer.models import Customer, CustomerType, City
from customer.serializers import CustomerSerializer, CustomerTypeSerializer, CustomerDetailedSerializer, CitySerializer
from nafis.paginations import PaginationClass


class CustomersViewSet(ModelViewSet):
    serializer_class = CustomerSerializer
    # permission_classes = (LoginRequired,)
    queryset = Customer.objects.all()
    non_updaters = ["cashier", "salesperson", "accountant", "storekeeper"]
    non_destroyers = ["cashier", "salesperson", "accountant", "storekeeper"]
    pagination_class = PaginationClass

    def get_serializer_class(self):
        if self.action in ["list", "retrieve"]:
            return CustomerDetailedSerializer
        else:
            return CustomerSerializer

    @action(methods=['GET'], detail=False, url_path='phone')
    def get_customer_using_phone(self, request, **kwargs):
        phone_number = self.request.query_params.get('phone_number', None)
        try:
            customer = Customer.objects.get(phone_number=phone_number)
            return Response(CustomerDetailedSerializer(customer).data)
        except ObjectDoesNotExist:
            return Response({'چنین کاربری یافت نشد.'}, status=HTTP_404_NOT_FOUND)

    @action(methods=['GET'], detail=True, url_path="cheques")
    def get_passed_cheques(self, request, **kwargs):
        customer = self.get_object()
        queryset = customer.cheques.all()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = CustomerChequeSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = CustomerChequeSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(methods=['GET'], detail=True, url_path="remained-cheques")
    def get_remained_cheques(self, request, **kwargs):
        customer = self.get_object()
        queryset = customer.remained_cheques.all()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = CustomerChequeSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = CustomerChequeSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(methods=['GET'], detail=True, url_path="remained-bills")
    def get_remained_bills(self, request, **kwargs):
        customer = self.get_object()
        queryset = customer.remained_bills.all()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = BillSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = BillSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(methods=['GET'], detail=True, url_path="bills")
    def get_done_bills(self, request, **kwargs):
        customer = self.get_object()
        queryset = customer.bills.all()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = BillSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = BillSerializer(queryset, many=True)
        return Response(serializer.data)


class GetCustomerFieldsApiView(APIView):
    def get(self, request, **kwargs):
        response = {}
        response['customer-types'] = CustomerTypeSerializer(CustomerType.objects.all(), many=True).data
        response['cities'] = CitySerializer(City.objects.all(), many=True).data
        return Response(response)
