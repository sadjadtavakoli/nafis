# Generated by Django 2.1.15 on 2020-01-12 13:23

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('bill', '0004_auto_20200106_1435'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='ourcheque',
            name='id',
        ),
        migrations.AddField(
            model_name='ourcheque',
            name='cheque_ptr',
            field=models.OneToOneField(auto_created=True, default=1, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='bill.Cheque'),
            preserve_default=False,
        ),
    ]
