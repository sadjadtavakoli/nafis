from django.db import models


class Branch(models.Model):
    address = models.CharField(max_length=200, null=True, blank=True)
    name = models.CharField(max_length=32, blank=False, null=False)
