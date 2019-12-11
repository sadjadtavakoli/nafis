from rest_framework import serializers

from bill.models import Bill, BillItem, SupplierBill, SupplierBillItem, CustomerPayment, \
    OurPayment, CustomerCheque, OurCheque
from branch.serializers import BranchSerializer
from customer.serializers import CustomerSerializer
from product.serializers import ProductSerializer, ProductDetailSerializer
from staff.serializers import StaffSerializer
from supplier.serializers import SupplierSerializer


class CustomerChequeSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer()

    class Meta:
        model = CustomerCheque
        fields = ('pk', 'number', 'bank', 'issue_date', 'expiry_date', 'amount', 'status', 'customer')


class OurChequeSerializer(serializers.ModelSerializer):
    supplier = SupplierSerializer()

    class Meta:
        model = OurCheque
        fields = ('pk', 'number', 'bank', 'issue_date', 'expiry_date', 'amount', 'status', 'supplier')


class CustomerPaymentSerializer(serializers.ModelSerializer):
    cheque = CustomerChequeSerializer()

    class Meta:
        model = CustomerPayment
        fields = ('pk', 'create_date', 'amount', 'type', 'cheque')


class OurPaymentSerializer(serializers.ModelSerializer):
    cheque = OurChequeSerializer()

    class Meta:
        model = OurPayment
        fields = ('pk', 'create_date', 'amount', 'type', 'cheque')


class BillItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    special_discount = serializers.ReadOnlyField()
    price = serializers.ReadOnlyField()
    final_price = serializers.ReadOnlyField()

    class Meta:
        model = BillItem
        fields = ('pk', 'product', 'amount', 'discount', 'end_of_roll', 'end_of_roll_amount', 'rejected',
                  'special_discount', 'price', 'final_price')


class BillSerializer(serializers.ModelSerializer):
    items = BillItemSerializer(many=True, required=False)
    buyer = CustomerSerializer()
    seller = StaffSerializer()
    branch = BranchSerializer()
    payments = CustomerPaymentSerializer(many=True, required=False)
    price = serializers.ReadOnlyField()
    total_discount = serializers.ReadOnlyField()
    buyer_special_discount = serializers.ReadOnlyField()
    items_discount = serializers.ReadOnlyField()
    final_price = serializers.ReadOnlyField()
    paid = serializers.ReadOnlyField()
    cheque_paid = serializers.ReadOnlyField()
    card_paid = serializers.ReadOnlyField()
    cash_paid = serializers.ReadOnlyField()
    remaining_payment = serializers.ReadOnlyField()

    class Meta:
        model = Bill
        fields = ('pk', 'create_date', 'close_date', 'buyer', 'seller',
                  'discount', 'used_points', 'branch', 'payments', 'items',
                  'bill_image', 'price', 'total_discount', 'buyer_special_discount',
                  'items_discount', 'final_price', 'paid', 'cheque_paid', 'cash_paid', 'card_paid',
                  'remaining_payment')


class SupplierBillItemSerializer(serializers.ModelSerializer):
    product = ProductDetailSerializer()

    class Meta:
        model = SupplierBillItem
        fields = ('pk', 'product', 'amount')


class SupplierBillSerializer(serializers.ModelSerializer):
    items = SupplierBillItemSerializer(many=True)
    supplier = SupplierSerializer()
    payments = OurPaymentSerializer(many=True)

    class Meta:
        model = SupplierBill
        fields = ('pk', 'create_date', 'supplier', 'status', 'items', 'payments')
