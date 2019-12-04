from rest_framework import serializers

from backend.product.models import Product, ProductId


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = (
            'code', 'name', 'branch', 'background_color', 'design_color', 'f_type', 'material',
            'design', 'selling_price', 'buying_price', 'stock_amount', 'supplier')
        depth = 1


class ProductIdSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductId
        fields = ('pk',)