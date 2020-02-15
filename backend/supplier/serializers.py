from rest_framework import serializers

from supplier.models import Supplier


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = ('pk', 'first_name', 'last_name', 'store', 'email', 'phone_number', 'mobile_number', 'address')
