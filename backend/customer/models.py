from django.db import models
from django.db.models import DO_NOTHING
from django.utils.translation import gettext_lazy as _


class Customer(models.Model):
    first_name = models.CharField(_('first name'), max_length=30, blank=True, null=True)
    last_name = models.CharField(_('last name'), max_length=150, blank=True, null=True)
    email = models.EmailField(_('email address'), blank=True, null=True)
    phone_number = models.CharField(max_length=11, blank=False, null=False, unique=True)
    address = models.CharField(max_length=200, null=True, blank=True)
    city = models.ForeignKey('customer.City', related_name="customers", on_delete=DO_NOTHING, null=True, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    marriage_date = models.DateField(null=True, blank=True)
    points = models.IntegerField(default=0, null=True, blank=True)
    class_type = models.ForeignKey('customer.CustomerType', related_name='customers', on_delete=DO_NOTHING, null=True,
                                   blank=True)

    def special_discount(self, value):
        discount = 0
        for item in self.special_discounts.all():
            discount += item.value(value)
        return discount

    @property
    def remained_bills(self):
        return self.bills.filter(status="remained")

    @property
    def done_bills(self):
        return self.bills.filter(status="done")

    @property
    def remained_cheques(self):
        return self.cheques.filter(status="remained")

    @property
    def done_cheques(self):
        return self.cheques.filter(status="done")


class CustomerType(models.Model):
    name = models.CharField(max_length=32, null=False, blank=False)

    def __str__(self):
        return self.name


class Point(models.Model):
    amount = models.IntegerField(null=False, blank=False)


class City(models.Model):
    name = models.CharField(max_length=32, null=False, blank=False)

    def __str__(self):
        return self.name
