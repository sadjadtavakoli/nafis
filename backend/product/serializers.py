from rest_framework import serializers

from product.models import Product, ProductId, Color, Material, FType, Design


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


class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = '__all__'


class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = '__all__'


class FTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FType
        fields = '__all__'


class DesignSerializer(serializers.ModelSerializer):
    class Meta:
        model = Design
        fields = '__all__'
