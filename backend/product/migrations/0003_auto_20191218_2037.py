# Generated by Django 2.2.7 on 2019-12-18 17:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0002_create_product_features'),
    ]

    operations = [
        migrations.AlterField(
            model_name='color',
            name='rgb',
            field=models.CharField(blank=True, max_length=12, null=True),
        ),
    ]
