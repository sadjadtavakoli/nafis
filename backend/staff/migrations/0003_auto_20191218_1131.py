# Generated by Django 2.2.7 on 2019-12-18 08:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('staff', '0002_auto_20191216_1936'),
    ]

    operations = [
        migrations.AlterField(
            model_name='staff',
            name='national_card_picture',
            field=models.ImageField(blank=True, null=True, upload_to=''),
        ),
        migrations.AlterField(
            model_name='staff',
            name='profile_picture',
            field=models.ImageField(blank=True, null=True, upload_to=''),
        ),
    ]