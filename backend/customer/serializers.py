from rest_framework import serializers

from customer.models import Customer


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ('pk', 'first_name', 'last_name', 'email', 'phone_number', 'address', 'birth_date',
                  'marriage_date', 'points', 'class_type')
