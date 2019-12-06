from django.db import migrations, models
from django.conf import settings


def create_customer_type(apps, schema):
    CustomerType = apps.get_model("customer", "CustomerType")
    for customer_type in settings.CUSTOMER_TYPE:
        CustomerType.objects.create(name=customer_type)


class Migration(migrations.Migration):
    dependencies = [
        ('customer', '0002_auto_20191206_1517'),
    ]

    operations = [
        migrations.RunPython(create_customer_type, reverse_code=migrations.RunPython.noop),
    ]
