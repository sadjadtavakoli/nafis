from django.db import models
from django.utils.translation import gettext_lazy as _


class Supplier(models.Model):
    full_name = models.CharField(_('full name'), max_length=60, blank=True)
    email = models.EmailField(_('email address'), blank=True)
    phone_number = models.CharField(max_length=11, blank=False, null=False)
    address = models.CharField(max_length=200, null=True, blank=True)

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
