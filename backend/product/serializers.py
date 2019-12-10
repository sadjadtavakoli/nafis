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


class ColorDropDownSerializer(serializers.ModelSerializer):
    key = serializers.IntegerField(source='pk')
    value = serializers.IntegerField(source='pk')
    text = serializers.CharField(source='name')
    color = serializers.CharField(source='rgb')

    class Meta:
        model = Color
        fields = ('key', 'value', 'text', 'color')


class MaterialDropDownSerializer(serializers.ModelSerializer):
    key = serializers.IntegerField(source='pk')
    value = serializers.IntegerField(source='pk')
    text = serializers.CharField(source='name')

    class Meta:
        model = Material
        fields = ('key', 'value', 'text')


class FTypeDropDownSerializer(serializers.ModelSerializer):
    key = serializers.IntegerField(source='pk')
    value = serializers.IntegerField(source='pk')
    text = serializers.CharField(source='name')

    class Meta:
        model = FType
        fields = ('key', 'value', 'text')


class DesignDropDownSerializer(serializers.ModelSerializer):
    key = serializers.IntegerField(source='pk')
    value = serializers.IntegerField(source='pk')
    text = serializers.CharField(source='name')

    class Meta:
        model = Design
        fields = ('key', 'value', 'text')
