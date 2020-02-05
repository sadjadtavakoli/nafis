from rest_framework import serializers

from customer.models import Customer, CustomerType, City


class CustomerTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerType
        fields = ('name', 'pk')


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ('name', 'pk')


class CustomerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Customer
        fields = ('pk', 'first_name', 'last_name', 'email', 'phone_number', 'city', 'address', 'birth_date',
                  'marriage_date', 'points', 'class_type')


class CustomerDetailedSerializer(serializers.ModelSerializer):
    city = CitySerializer()
    class_type = CustomerTypeSerializer()

    class Meta:
        model = Customer
        fields = ('pk', 'first_name', 'last_name', 'email', 'phone_number', 'city', 'address', 'birth_date',
                  'marriage_date', 'points', 'class_type')


