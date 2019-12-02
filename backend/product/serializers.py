from rest_framework import serializers

from product.models import Product


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = (
            'code', 'name', 'branch', 'background_color', 'design_color', 'f_type', 'material',
            'design', 'selling_price', 'buying_price', 'stock_amount')
        depth = 1
