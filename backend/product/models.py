from django.db import models
from django.db.models import DO_NOTHING
from rest_framework.decorators import action


class Product(models.Model):
    code = models.IntegerField(null=False, blank=False)
    name = models.CharField(max_length=64)
    branch = models.ForeignKey('branch.Branch', related_name='products', on_delete=DO_NOTHING)
    background_color = models.ForeignKey('product.Color', related_name='bg_products',
                                         on_delete=DO_NOTHING)
    design_color = models.ForeignKey('product.Color', related_name='design_products',
                                     on_delete=DO_NOTHING)
    material = models.ForeignKey('product.Material', related_name='products', on_delete=DO_NOTHING)
    design = models.ForeignKey('product.Design', related_name='products', on_delete=DO_NOTHING)
    selling_price = models.FloatField()
    buying_price = models.FloatField()
    stock_amount = models.FloatField()
    f_type = models.ForeignKey('product.FType', related_name='products', on_delete=DO_NOTHING)

    def update_stock_amount(self, amount):
        self.stock_amount -= amount
        self.save()

    @property
    def supplier(self):
        return self.supplier_bill_item.bill.supplier


class Color(models.Model):
    rgb = models.CharField(max_length=6, blank=True, null=True)
    name = models.CharField(max_length=32, null=False, blank=False)


class Design(models.Model):
    name = models.CharField(max_length=32, null=False, blank=False)

    def __str__(self):
        return self.name


class Material(models.Model):
    name = models.CharField(max_length=32, null=False, blank=False)

    def __str__(self):
        return self.name


class FType(models.Model):
    name = models.CharField(max_length=32, null=False, blank=False)

    def __str__(self):
        return self.name


class ProductId(models.Model):
    pass
