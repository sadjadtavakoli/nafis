# Generated by Django 2.2.7 on 2019-11-12 19:46

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('supplier', '0001_initial'),
        ('customer', '0001_initial'),
        ('product', '0001_initial'),
        ('branch', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Bill',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('create_date', models.DateTimeField(auto_now_add=True)),
                ('close_date', models.DateTimeField(blank=True, null=True)),
                ('status', models.CharField(choices=[('done', 'done'), ('active', 'active')], default='active', max_length=32)),
                ('straight_discount', models.FloatField(default=0)),
                ('percentage_discount', models.IntegerField(default=0)),
                ('used_points', models.IntegerField(default=0, null=True)),
                ('branch', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='bills', to='branch.Branch')),
                ('buyer', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='bills', to='customer.Customer')),
            ],
        ),
        migrations.CreateModel(
            name='Cheque',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('number', models.IntegerField(unique=True)),
                ('bank', models.CharField(max_length=32)),
                ('issue_date', models.DateField(null=True)),
                ('expiry_date', models.DateField()),
                ('amount', models.IntegerField()),
                ('status', models.CharField(choices=[('تسویه', 'تسویه'), ('مانده', 'مانده')], default='مانده', max_length=10)),
            ],
        ),
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('create_date', models.DateTimeField(blank=True, null=True)),
                ('amount', models.IntegerField()),
                ('type', models.CharField(choices=[('چک', 'چک'), ('نقد', 'نقد'), ('نقد و چک', 'نقد و چک'), ('کارت', 'کارت')], default='نقد', max_length=10)),
            ],
        ),
        migrations.CreateModel(
            name='SupplierBill',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('create_date', models.DateTimeField(auto_now_add=True)),
                ('supplier', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='bills', to='supplier.Supplier')),
            ],
        ),
        migrations.CreateModel(
            name='CustomerCheque',
            fields=[
                ('cheque_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='bill.Cheque')),
            ],
            bases=('bill.cheque',),
        ),
        migrations.CreateModel(
            name='CustomerPayment',
            fields=[
                ('payment_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='bill.Payment')),
            ],
            bases=('bill.payment',),
        ),
        migrations.CreateModel(
            name='OurPayment',
            fields=[
                ('payment_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='bill.Payment')),
            ],
            bases=('bill.payment',),
        ),
        migrations.CreateModel(
            name='SupplierBillItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.FloatField()),
                ('bill', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bills', to='bill.SupplierBill')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='supplier_bill_items', to='product.Product')),
            ],
        ),
        migrations.CreateModel(
            name='OurCheque',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('supplier', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='cheques', to='supplier.Supplier')),
            ],
        ),
        migrations.CreateModel(
            name='BillItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.FloatField()),
                ('straight_discount', models.FloatField(default=0)),
                ('percentage_discount', models.IntegerField(default=0)),
                ('bill', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='bill.Bill')),
                ('product', models.ManyToManyField(related_name='bill_items', to='product.Product')),
            ],
        ),
    ]
