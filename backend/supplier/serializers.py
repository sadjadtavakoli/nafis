from rest_framework import serializers

from backend.supplier.models import Supplier


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = ('full_name', 'email', 'phone_number', 'address')
