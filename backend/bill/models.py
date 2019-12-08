from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import DO_NOTHING, CASCADE, Sum


class Bill(models.Model):
    create_date = models.DateTimeField(auto_now_add=True)
    close_date = models.DateTimeField(blank=True, null=True)
    status = models.CharField(choices=settings.BILL_STATUS, max_length=32, default='active')
    buyer = models.ForeignKey('customer.Customer', related_name='bills', on_delete=DO_NOTHING)
    seller = models.ForeignKey('staff.Staff', related_name='bills', on_delete=DO_NOTHING)
    discount = models.FloatField(default=0)
    used_points = models.FloatField(default=0)
    branch = models.ForeignKey('branch.Branch', related_name='bills', on_delete=DO_NOTHING)
    bill_image = models.ImageField(null=True, blank=True)

    def check_status(self):
        if round(self.remaining_payment) > 5000:
            self.status = 'remained'
        else:
            self.status = 'done'
        self.save()

    @property
    def price(self):
        price = 0
        for item in self.items.filter(rejected=False).all():
            if item.end_of_roll:
                price += item.end_of_roll_price
            else:
                price += item.price
        return price

    @property
    def total_discount(self):
        return self.discount + self.items_discount + self.buyer_special_discount

    @property
    def buyer_special_discount(self):
        return self.buyer.special_discount(self.price)

    @property
    def items_discount(self):
        discount = 0
        for item in self.items.all():
            discount += item.discount
            discount += item.special_discount
        return discount

    @property
    def final_price(self):
        if self.total_discount >= self.price:
            return self
        return self.price - self.total_discount

    @property
    def paid(self):
        paid = self.used_points
        if self.payments.count():
            paid += self.payments.aggregate(Sum('amount'))['amount__sum']
        return paid

    @property
    def cheque_paid(self):
        if self.payments.count():
            return self.payments.filter(type='cheque').aggregate(Sum('amount'))['amount__sum']
        return 0

    @property
    def cash_paid(self):
        if self.payments.count():
            return self.payments.filter(type='cash').aggregate(Sum('amount'))['amount__sum']
        return 0

    @property
    def card_paid(self):
        if self.payments.count():
            return self.payments.filter(type='card').aggregate(Sum('amount'))['amount__sum']
        return 0

    @property
    def remaining_payment(self):
        return self.price - self.paid


class BillItemManager(models.Manager):
    def create(self, product, amount,
               discount,
               end_of_roll,
               end_of_roll_amount):
        if product.stock_amount < amount:
            raise ValidationError("مقدار کافی از این پارچه موجود نمی‌باشد")

        item = super(BillItemManager, self).create(product=product, amount=amount,
                                                   discount=discount,
                                                   end_of_roll=end_of_roll,
                                                   end_of_roll_amount=end_of_roll_amount)
        product.update_stock_amount(amount + float(0.05))
        return item


class BillItem(models.Model):
    product = models.ManyToManyField('product.Product', related_name='bill_items')
    amount = models.FloatField(blank=False, null=False)
    discount = models.FloatField(default=0)
    bill = models.ForeignKey('bill.Bill', related_name='items', on_delete=CASCADE)
    end_of_roll = models.BooleanField(default=False)
    end_of_roll_amount = models.FloatField(default=0)
    rejected = models.BooleanField(default=False)
    objects = BillItemManager()

    @property
    def special_discount(self):
        discount = 0
        for item in self.product.special_discounts.all():
            discount += item.value(self.product.selling_price)
        return discount

    @property
    def price(self):
        if self.end_of_roll:
            return self.end_of_roll_amount * self.product.selling_price
        return self.amount * self.product.selling_price

    @property
    def final_price(self):
        if self.discount > self.price:
            return 0
        return self.price - self.discount

    def reject(self):
        self.rejected = True
        self.product.update_stock_amount(-1 * self.amount)
        self.save()


class SupplierBill(models.Model):
    create_date = models.DateTimeField(auto_now_add=True)
    supplier = models.ForeignKey('supplier.Supplier', related_name='bills',
                                 on_delete=DO_NOTHING)
    status = models.CharField(choices=settings.SUPPLIER_BILL_STATUS, max_length=32,
                              default='active')


class SupplierBillItemManager(models.Manager):
    def create(self, **kwargs):
        obj = super(SupplierBillItemManager, self).create(**kwargs)
        obj.product.buying_price = obj.price
        obj.save()
        return obj


class SupplierBillItem(models.Model):
    product = models.OneToOneField('product.Product', related_name='supplier_bill_item',
                                on_delete=DO_NOTHING)
    amount = models.FloatField(blank=False, null=False)
    bill = models.ForeignKey('bill.SupplierBill', related_name='bills', on_delete=CASCADE)
    rejected = models.BooleanField(default=False)
    raw_price = models.FloatField()
    currency_price = models.FloatField(default=1)
    currency = models.CharField(
        choices=(('ریال', 'ریال'), ('درهم', 'درهم'), ('دلار', 'دلار'), ('روپیه', 'روپیه'),
                 ('یوان', 'یوان')),
        max_length=20, default="ریال")
    objects = SupplierBillItemManager()

    @property
    def price(self):
        return self.raw_price * self.currency_price

    def reject(self):
        self.rejected = True
        self.product.update_stock_amount(self.amount)
        self.save()


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


class SpecialDiscount(models.Model):
    percentage = models.IntegerField(default=0)
    straight = models.FloatField(default=0)

    def value(self, price):
        if self.percentage > 0:
            return price * self.percentage
        return self.straight


class SpecialProductDiscount(SpecialDiscount):
    customers = models.ManyToManyField('customer.Customer', related_name='special_discounts')


class SpecialProductsDiscount(SpecialDiscount):
    products = models.ManyToManyField('product.Product', related_name='special_discounts')
