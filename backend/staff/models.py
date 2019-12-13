from django.conf import settings
from django.contrib.auth.models import User
from django.db import models
from django.db.models import DO_NOTHING


class Staff(User):
    national_id = models.CharField(max_length=10, blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)
    national_card_picture = models.ImageField()
    profile_picture = models.ImageField()
    job = models.CharField(choices=settings.STAFF_JOB_CHOICES, max_length=30, null=False,
                           blank=False)
    employment_date = models.DateField(blank=True, null=True)
    address = models.CharField(max_length=200, blank=True, null=True)
    REQUIRED_FIELDS = ('username', 'job')
    branch = models.ForeignKey('branch.Branch', related_name='staffs', on_delete=DO_NOTHING)

