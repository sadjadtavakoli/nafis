from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import DO_NOTHING, CASCADE, Sum
from django.utils import timezone

from customer.models import Customer, CustomerType
from product.models import round_up, Color, FType, Material, Design


class Bill(models.Model):
    create_date = models.DateTimeField(auto_now_add=True)
    close_date = models.DateTimeField(blank=True, null=True)
    status = models.CharField(choices=settings.BILL_STATUS, max_length=32, default='active')
    buyer = models.ForeignKey('customer.Customer', related_name='bills', on_delete=DO_NOTHING)
    seller = models.ForeignKey('staff.Staff', related_name='bills', on_delete=DO_NOTHING)
    discount = models.IntegerField(default=0)
    used_points = models.IntegerField(default=0)
    branch = models.ForeignKey('branch.Branch', related_name='bills', on_delete=DO_NOTHING, blank=True, null=True)
    bill_image = models.ImageField(null=True, blank=True)
    bill_code = models.IntegerField(default=0)

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
            price += int(item.price)
        return round_up(price, -2)

    @property
    def total_discount(self):
        return round_up(int(self.discount) + int(self.items_discount) + int(self.buyer_special_discount), -2)

    @property
    def buyer_special_discount(self):
        return round_up(self.buyer.special_discount(self.price), -2)

    @property
    def items_special_discount(self):
        discount = 0
        for item in self.items.all():
            discount += int(item.special_discount)
        return round_up(discount, -2)

    @property
    def items_discount(self):
        discount = 0
        for item in self.items.all():
            discount += int(item.total_discount)
            discount += int(item.special_discount)
        return round_up(discount, -2)

    @property
    def final_price(self):
        if int(self.total_discount) >= int(self.price):
            return 0
        return int(self.price) - int(self.total_discount)

    @property
    def paid(self):
        paid = int(self.used_points)
        if self.payments.count():
            paid += int(self.payments.aggregate(Sum('amount'))['amount__sum'])
        return paid

    @property
    def cheque_paid(self):
        if self.payments.filter(type='cheque').exists():
            return int(self.payments.filter(type='cheque').aggregate(Sum('amount'))['amount__sum'])
        return 0

    @property
    def cash_paid(self):
        if self.payments.filter(type='cash').exists():
            return int(self.payments.filter(type='cash').aggregate(Sum('amount'))['amount__sum'])
        return 0

    @property
    def card_paid(self):
        if self.payments.filter(type='card').exists():
            return int(self.payments.filter(type='card').aggregate(Sum('amount'))['amount__sum'])
        return 0

    @property
    def remaining_payment(self):
        return self.final_price - self.paid

    @property
    def profit(self):
        profit = 0
        for item in self.items.all():
            profit += item.profit
        return round_up(profit, -2)

    @property
    def items_count(self):
        return self.items.count()

    @staticmethod
    def sells_per_design_color(start_date, end_date):
        result = dict()
        query = BillItem.objects.filter(bill__close_date__date__range=[start_date, end_date],
                                        bill__status__in=["done", "remained"], rejected=False)
        for design_color in set(Color.objects.all().values_list("name", flat=True)):
            bill_items = query.filter(product__design_color__name=design_color)
            profit = 0
            price = 0
            amount = 0
            for bill_item in bill_items:
                profit += bill_item.profit
                price += bill_item.price
                amount += bill_item.amount
            result[design_color] = dict(amount=amount, profit=profit, price=price)
        return result

    @staticmethod
    def sells_per_bg_color(start_date, end_date):
        result = dict()
        query = BillItem.objects.filter(bill__close_date__date__range=[start_date, end_date],
                                        bill__status__in=["done", "remained"], rejected=False)
        for bg_color in set(Color.objects.all().values_list("name", flat=True)):
            bill_items = query.filter(product__background_color__name=bg_color)
            profit = 0
            price = 0
            amount = 0
            for bill_item in bill_items:
                profit += bill_item.profit
                price += bill_item.price
                amount += bill_item.amount
            result[bg_color] = dict(amount=amount, profit=profit, price=price)
        return result

    @staticmethod
    def sells_per_f_type(start_date, end_date):
        result = dict()
        query = BillItem.objects.filter(bill__close_date__date__range=[start_date, end_date],
                                        bill__status__in=["done", "remained"], rejected=False)
        for f_type in FType.objects.all():
            bill_items = query.filter(product__f_type=f_type)
            profit = 0
            price = 0
            amount = 0
            for bill_item in bill_items:
                profit += bill_item.profit
                price += bill_item.price
                amount += bill_item.amount
            result[f_type.name] = dict(amount=amount, profit=profit, price=price)
        return result

    @staticmethod
    def sells_per_material(start_date, end_date):
        result = dict()
        query = BillItem.objects.filter(bill__close_date__date__range=[start_date, end_date],
                                        bill__status__in=["done", "remained"], rejected=False)
        for material in Material.objects.all():
            bill_items = query.filter(product__material=material)
            profit = 0
            price = 0
            amount = 0
            for bill_item in bill_items:
                profit += bill_item.profit
                price += bill_item.price
                amount += bill_item.amount
            result[material.name] = dict(amount=amount, profit=profit, price=price)
        return result

    @staticmethod
    def sells_per_design(start_date, end_date):
        result = dict()
        query = BillItem.objects.filter(bill__close_date__date__range=[start_date, end_date],
                                        bill__status__in=["done", "remained"], rejected=False)
        for design in Design.objects.all():
            bill_items = query.filter(product__design=design)
            profit = 0
            price = 0
            amount = 0
            for bill_item in bill_items:
                profit += bill_item.profit
                price += bill_item.price
                amount += bill_item.amount
            result[design.name] = dict(amount=amount, profit=profit, price=price)
        return result

    @staticmethod
    def profit_per_customer_age(start_date, end_date):
        result = dict()
        query = Bill.objects.filter(close_date__date__range=[start_date, end_date],
                                    status__in=["done", "remained"])
        for birth_date in set(Customer.objects.all().values_list("birth_date", flat=True)):
            if birth_date is not None:
                customers = Customer.objects.filter(birth_date=birth_date)
                bills = query.filter(buyer__in=customers)
                profit = 0
                for bill in bills:
                    profit += bill.profit
                result[timezone.now().year - birth_date.year] = dict(profit=profit)
        return result

    @staticmethod
    def profit_per_customer_type(start_date, end_date):
        result = dict()
        query = Bill.objects.filter(close_date__date__range=[start_date, end_date],
                                    status__in=["done", "remained"])
        for customer_type in CustomerType.objects.all():
            bills = query.filter(buyer__class_type=customer_type)
            profit = 0
            for bill in bills:
                profit += bill.profit
            result[customer_type.name] = dict(profit=profit)
        return result


class BillItemManager(models.Manager):
    def create(self, product, amount,
               discount,
               end_of_roll,
               end_of_roll_amount, bill):
        if float(product.stock_amount) < float(amount):
            raise ValidationError("مقدار کافی از این پارچه موجود نمی‌باشد")

        item = super(BillItemManager, self).create(product=product, amount=amount,
                                                   discount=discount,
                                                   end_of_roll=end_of_roll,
                                                   end_of_roll_amount=end_of_roll_amount, bill=bill)
        product.update_stock_amount(float(amount) + float(0.05))
        return item


class BillItem(models.Model):
    product = models.ForeignKey('product.Product', related_name='bill_items', on_delete=DO_NOTHING)
    amount = models.FloatField(blank=False, null=False)
    discount = models.IntegerField(default=0)
    bill = models.ForeignKey('bill.Bill', related_name='items', on_delete=CASCADE)
    end_of_roll = models.BooleanField(default=False)
    end_of_roll_amount = models.FloatField(default=0, null=True, blank=True)
    rejected = models.BooleanField(default=False)
    objects = BillItemManager()

    @property
    def profit(self):
        total_buying_price = int(self.amount * float(self.product.buying_price))
        return self.final_price - total_buying_price

    @property
    def special_discount(self):
        discount = 0
        for item in self.product.special_discounts.all():
            discount += item.value(self.product.selling_price)
        return discount

    @property
    def price(self):
        if self.end_of_roll:
            return int(self.end_of_roll_amount * float(self.product.selling_price))
        return int(self.amount * float(self.product.selling_price))

    @property
    def final_price(self):
        if int(self.total_discount) > int(self.price):
            return 0
        return int(self.price) - int(self.total_discount)

    def reject(self):
        self.rejected = True
        self.product.update_stock_amount(-1 * self.amount)
        self.save()

    @property
    def total_discount(self):
        if self.end_of_roll:
            return int(self.end_of_roll_amount * float(self.discount))
        return int(self.amount * float(self.discount))


class SupplierBill(models.Model):
    create_date = models.DateTimeField(auto_now_add=True)
    supplier = models.ForeignKey('supplier.Supplier', related_name='bills',
                                 on_delete=DO_NOTHING)
    status = models.CharField(choices=settings.SUPPLIER_BILL_STATUS, max_length=32,
                              default='remained')
    currency_price = models.IntegerField(default=1)
    currency = models.CharField(
        choices=(('ریال', 'ریال'), ('درهم', 'درهم'), ('دلار', 'دلار'), ('روپیه', 'روپیه'),
                 ('یوان', 'یوان')),
        max_length=20, default="ریال")

    @property
    def price(self):
        price = 0
        for item in self.items.filter(rejected=False).all():
            price += int(item.price)
        return round_up(price, -2)


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
    bill = models.ForeignKey('bill.SupplierBill', related_name='items', on_delete=CASCADE)
    rejected = models.BooleanField(default=False)
    raw_price = models.IntegerField()
    objects = SupplierBillItemManager()

    @property
    def currency(self):
        return self.bill.currency

    @property
    def currency_price(self):
        return self.bill.currency_price

    @property
    def price(self):
        return int(self.raw_price) * int(self.currency_price)

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
    status = models.CharField(choices=(('done', 'done'), ('remained', 'remained')), max_length=10,
                              default='remained')


class CustomerCheque(Cheque):
    customer = models.ForeignKey('customer.Customer', related_name="cheques", on_delete=DO_NOTHING)


class OurCheque(Cheque):
    supplier = models.ForeignKey('supplier.Supplier', related_name="cheques", on_delete=DO_NOTHING)


class SpecialDiscount(models.Model):
    percentage = models.IntegerField(default=0)
    straight = models.IntegerField(default=0)

    def value(self, price):
        if self.percentage > 0:
            return int(price) * int(self.percentage)
        return self.straight


class SpecialProductDiscount(SpecialDiscount):
    customers = models.ManyToManyField('customer.Customer', related_name='special_discounts')


class SpecialProductsDiscount(SpecialDiscount):
    products = models.ManyToManyField('product.Product', related_name='special_discounts')


class BillCounter(models.Model):
    number = models.IntegerField(blank=False, null=False, default=1)

    def reset(self):
        self.number = 0
        self.save()

    def increase(self):
        self.number += 1
        self.save()
        return self.number
