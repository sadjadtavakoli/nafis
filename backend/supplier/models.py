from django.db import models
from django.utils.translation import gettext_lazy as _


class Supplier(models.Model):
    first_name = models.CharField(_('first name'), max_length=30, blank=True, null=True)
    last_name = models.CharField(_('last name'), max_length=60, blank=True)
    email = models.EmailField(_('email address'), blank=True)
    phone_number = models.CharField(max_length=11, blank=False, null=False)
    mobile_number = models.CharField(max_length=11, blank=True, null=True)
    address = models.CharField(max_length=200, null=True, blank=True)
    store = models.CharField(_('store'), max_length=60, blank=True)

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
