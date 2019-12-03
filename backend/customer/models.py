from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _


class Customer(models.Model):
    first_name = models.CharField(_('first name'), max_length=30, blank=True)
    last_name = models.CharField(_('last name'), max_length=150, blank=True)
    email = models.EmailField(_('email address'), blank=True)
    phone_number = models.CharField(max_length=11, blank=False, null=False)
    address = models.CharField(max_length=200, null=True, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    marriage_date = models.DateField(null=True, blank=True)
    points = models.IntegerField(default=0)
    class_type = models.CharField(choices=settings.CUSTOMER_TYPE, max_length=20)

    def special_discount(self, value):
        discount = 0
        for item in self.special_discounts.all():
            discount += item.value(value)
        return discount
