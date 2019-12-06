from django.db import migrations, models
from django.conf import settings


def create_design(apps, schema):
    Design = apps.get_model("product", "Design")
    for design in settings.PRODUCT_DESIGN_CHOICES:
        Design.objects.create(name=design)


def create_ftype(apps, schema):
    FType = apps.get_model("product", "FType")
    for ftype in settings.FTYPE:
        FType.objects.create(name=ftype)


class Migration(migrations.Migration):
    dependencies = [
        ('product', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_design, reverse_code=migrations.RunPython.noop),
        migrations.RunPython(create_ftype, reverse_code=migrations.RunPython.noop),

    ]
