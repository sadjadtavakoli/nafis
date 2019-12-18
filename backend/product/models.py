from math import floor, ceil

from django.db import models
from django.db.models import DO_NOTHING


def round_down(n, decimals=0):
    multiplier = 10 ** decimals
    return floor(n * multiplier) / multiplier


def round_up(n, decimals=0):
    multiplier = 10 ** decimals
    return int(ceil(n * multiplier) / multiplier)


class Product(models.Model):
    code = models.IntegerField(null=False, blank=False)
    name = models.CharField(max_length=64)
    branch = models.ForeignKey('branch.Branch', related_name='products', on_delete=DO_NOTHING)
    background_color = models.ForeignKey('product.Color', related_name='bg_products',
                                         on_delete=DO_NOTHING, blank=True, null=True)
    design_color = models.ForeignKey('product.Color', related_name='design_products',
                                     on_delete=DO_NOTHING, blank=True, null=True)
    material = models.ForeignKey('product.Material', related_name='products', on_delete=DO_NOTHING, blank=True,
                                 null=True)
    design = models.ForeignKey('product.Design', related_name='products', on_delete=DO_NOTHING, blank=True, null=True)
    selling_price = models.IntegerField()
    buying_price = models.IntegerField()
    stock_amount = models.FloatField()
    f_type = models.ForeignKey('product.FType', related_name='products', on_delete=DO_NOTHING, blank=True, null=True)

    def __str__(self):
        return str(self.code) + " " + self.name

    def update_stock_amount(self, amount):
        self.stock_amount -= amount
        self.stock_amount = round_down(self.stock_amount, 1)
        self.save()

    @property
    def supplier(self):
        return self.supplier_bill_item.bill.supplier


class Color(models.Model):
    rgb = models.CharField(max_length=12, blank=True, null=True)
    name = models.CharField(max_length=32, null=False, blank=False)

    def __str__(self):
        return self.name + " " + self.rgb if self.rgb is not None else self.name


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
