# Generated by Django 2.1.15 on 2020-02-15 20:09

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('staff', '0003_auto_20191218_1131'),
        ('bill', '0009_auto_20200209_1645'),
    ]

    operations = [
        migrations.AddField(
            model_name='bill',
            name='closande',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='closed_bills', to='staff.Staff'),
        ),
    ]
