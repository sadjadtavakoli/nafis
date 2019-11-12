from rest_framework import serializers

from bill.models import Bill, BillItem, SupplierBill, SupplierBillItem, CustomerPayment, \
    OurPayment, CustomerCheque, OurCheque
from branch.serializers import BranchSerializer
from customer.serializers import CustomerSerializer
from product.serializers import ProductSerializer
from staff.serializers import StaffSerializer
from supplier.serializers import SupplierSerializer


class CustomerChequeSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer()

    class Meta:
        model = CustomerCheque
        fields = ('number', 'bank', 'issue_date', 'expiry_date', 'amount', 'status', 'customer')


class OurChequeSerializer(serializers.ModelSerializer):
    supplier = SupplierSerializer()

    class Meta:
        model = OurCheque
        fields = ('number', 'bank', 'issue_date', 'expiry_date', 'amount', 'status', 'supplier')


class CustomerPaymentSerializer(serializers.ModelSerializer):
    cheque = CustomerChequeSerializer()

    class Meta:
        model = CustomerPayment
        fields = ('create_date', 'amount', 'type', 'cheque')


class OurPaymentSerializer(serializers.ModelSerializer):
    cheque = OurChequeSerializer()

    class Meta:
        model = OurPayment
        fields = ('create_date', 'amount', 'type', 'cheque')


class BillItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = BillItem
        fields = ('product', 'amount', 'percentage_discount', 'straight_discount')


class BillSerializer(serializers.ModelSerializer):
    items = BillItemSerializer(many=True)
    buyer = CustomerSerializer()
    seller = StaffSerializer()
    branch = BranchSerializer()
    payments = CustomerPaymentSerializer(many=True)

    class Meta:
        model = Bill
        fields = ('create_date', 'close_date', 'buyer', 'seller', 'straight_discount',
                  'percentage_discount', 'used_points', 'branch', 'payments')


class SupplierBillItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = SupplierBillItem
        fields = ('product', 'amount')


class SupplierBillSerializer(serializers.ModelSerializer):
    items = SupplierBillItemSerializer(many=True)
    supplier = SupplierSerializer()
    payments = OurPaymentSerializer(many=True)

    class Meta:
        model = SupplierBill
        fields = ('create_date', 'supplier', 'payments')
