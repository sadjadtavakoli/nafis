from django.conf import settings
from django.db import models
from django.db.models import DO_NOTHING, CASCADE


class Bill(models.Model):
    create_date = models.DateTimeField(auto_now_add=True)
    close_date = models.DateTimeField(blank=True, null=True)
    status = models.CharField(choices=settings.BILL_STATUS, max_length=32, default='active')
    buyer = models.ForeignKey('customer.Customer', related_name='bills', on_delete=DO_NOTHING)
    seller = models.ForeignKey('staff.Staff', related_name='bills', on_delete=DO_NOTHING)
    straight_discount = models.FloatField(default=0)
    percentage_discount = models.IntegerField(default=0)
    used_points = models.IntegerField(default=0, null=True)
    branch = models.ForeignKey('branch.Branch', related_name='bills', on_delete=DO_NOTHING)


class BillItem(models.Model):
    product = models.ManyToManyField('product.Product', related_name='bill_items')
    amount = models.FloatField(blank=False, null=False)
    straight_discount = models.FloatField(default=0)
    percentage_discount = models.IntegerField(default=0)
    bill = models.ForeignKey('bill.Bill', related_name='items', on_delete=CASCADE)


class SupplierBill(models.Model):
    create_date = models.DateTimeField(auto_now_add=True)
    supplier = models.ForeignKey('supplier.Supplier', related_name='bills',
                                 on_delete=DO_NOTHING)


class SupplierBillItem(models.Model):
    product = models.ForeignKey('product.Product', related_name='supplier_bill_items',
                                on_delete=DO_NOTHING)
    amount = models.FloatField(blank=False, null=False)
    bill = models.ForeignKey('bill.SupplierBill', related_name='bills', on_delete=CASCADE)


class Payment(models.Model):
    create_date = models.DateTimeField(blank=True, null=True)
    amount = models.IntegerField()
    type = models.CharField(choices=settings.PAYMENT_TYPES,
                            max_length=10, default="نقد")


class CustomerPayment(Payment):
    cheque = models.OneToOneField('bill.CustomerCheque', blank=True, null=True, related_name="+",
                                  on_delete=models.DO_NOTHING)
    bill = models.ForeignKey('bill.Bill', related_name="payments", on_delete=models.CASCADE)


class OurPayment(Payment):
    cheque = models.OneToOneField('bill.OurCheque', blank=True, null=True, related_name="+",
                                  on_delete=models.DO_NOTHING)

    bill = models.ForeignKey('bill.SupplierBill', related_name="payments",
                             on_delete=models.CASCADE)


class Cheque(models.Model):
    number = models.IntegerField(unique=True)
    bank = models.CharField(max_length=32)
    issue_date = models.DateField(null=True)
    expiry_date = models.DateField()
    amount = models.IntegerField()
    status = models.CharField(choices=(('تسویه', 'تسویه'), ('مانده', 'مانده')), max_length=10,
                              default='مانده')


class CustomerCheque(Cheque):
    customer = models.ForeignKey('customer.Customer', related_name="cheques", on_delete=DO_NOTHING)


class OurCheque(models.Model):
    supplier = models.ForeignKey('supplier.Supplier', related_name="cheques", on_delete=DO_NOTHING)
