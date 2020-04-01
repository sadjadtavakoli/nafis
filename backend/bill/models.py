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
    closande = models.ForeignKey('staff.Staff', related_name='closed_bills', on_delete=DO_NOTHING, blank=True,
                                 null=True)

    def check_status(self):
        if round(self.remaining_payment) > 5000:
            self.status = 'remained'
        else:
            self.status = 'done'
        self.close_date = timezone.now()
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
    def sale_calculation(bill_items):
        profit = 0
        price = 0
        amount = 0
        for bill_item in bill_items:
            profit += bill_item.profit
            price += bill_item.price
            amount += bill_item.amount
        return dict(amount=amount, profit=profit, price=price)

    @staticmethod
    def separated_query(starter_query, separation):
        result = dict()
        if separation == "customerType":
            for customer_type in CustomerType.objects.all():
                bill_items = starter_query.filter(bill__buyer__class_type=customer_type)
                result[customer_type.name] = Bill.sale_calculation(bill_items)
        if separation == "bg_color":
            for bg_color in set(Color.objects.all().values_list("name", flat=True)):
                bill_items = starter_query.filter(product__background_color__name=bg_color)
                result[bg_color] = Bill.sale_calculation(bill_items)
        if separation == "design_color":
            for design_color in set(Color.objects.all().values_list("name", flat=True)):
                bill_items = starter_query.filter(product__design_color__name=design_color)
                result[design_color] = Bill.sale_calculation(bill_items)
        if separation == "age":
            yo_55 = timezone.now().year - 55
            yo_40 = timezone.now().year - 40
            yo_30 = timezone.now().year - 30
            yo_20 = timezone.now().year - 20
            result["55 سال و بیشتر"] = Bill.sale_calculation(
                starter_query.filter(bill__buyer__birth_date__year__lte=yo_55 + 1))
            result["40 الی 55"] = Bill.sale_calculation(
                starter_query.filter(bill__buyer__birth_date__year__range=[yo_55 + 1, yo_40]))
            result["30 الی 40"] = Bill.sale_calculation(
                starter_query.filter(bill__buyer__birth_date__year__range=[yo_40 + 1, yo_30]))
            result["20 الی 30"] = Bill.sale_calculation(
                starter_query.filter(bill__buyer__birth_date__year__range=[yo_30 + 1, yo_20]))
            result["کمتر از 20"] = Bill.sale_calculation(
                starter_query.filter(bill__buyer__birth_date__year__gte=yo_20 + 1))
        return result

    @staticmethod
    def sells_per_design_color(query, design_colors, separation):
        result = dict()
        for design_color in set(Color.objects.filter(pk__in=design_colors).values_list("name", flat=True)):
            design_color_query = query.filter(product__design_color__name=design_color)
            result[design_color] = Bill.sale_calculation(design_color_query)
            result[design_color].update(Bill.separated_query(design_color_query, separation))
        return result

    @staticmethod
    def sells_per_bg_color(query, bg_colors, separation):
        result = dict()
        for bg_color in set(Color.objects.filter(pk__in=bg_colors).values_list("name", flat=True)):
            bg_color_query = query.filter(product__background_color__name=bg_color)
            result[bg_color] = Bill.sale_calculation(bg_color_query)
            result[bg_color].update(Bill.separated_query(bg_color_query, separation))
        return result

    @staticmethod
    def sells_per_f_type(query, f_types, separation):
        result = dict()
        for f_type in FType.objects.filter(pk__in=f_types):
            f_type_query = query.filter(product__f_type=f_type)
            result[f_type.name] = Bill.sale_calculation(f_type_query)
            result[f_type.name].update(Bill.separated_query(f_type_query, separation))
        return result

    @staticmethod
    def sells_per_material(query, materials, separation):
        result = dict()
        for material in Material.objects.filter(pk__in=materials):
            material_query = query.filter(product__material=material)
            result[material.name] = Bill.sale_calculation(material_query)
            result[material.name].update(Bill.separated_query(material_query, separation))
        return result

    @staticmethod
    def sells_per_design(query, designs, separation):
        result = dict()
        for design in Design.objects.filter(pk__in=designs):
            design_query = query.filter(product__design=design)
            result[design.name] = Bill.sale_calculation(design_query)
            result[design.name].update(Bill.separated_query(design_query, separation))
        return result

    @staticmethod
    def sells_per_all_f_type(query):
        result = dict()
        for f_type in FType.objects.all():
            f_type_query = query.filter(product__f_type=f_type)
            result[f_type.name] = dict()
            result[f_type.name] = Bill.sale_calculation(f_type_query)
            if result[f_type.name]['amount'] is not None and int(result[f_type.name]['amount']) > 0:
                result[f_type.name]['age'] = Bill.separated_query(f_type_query, "age")
                result[f_type.name]['customerType'] = Bill.separated_query(f_type_query, "customerType")
                result[f_type.name]['bg_color'] = Bill.separated_query(f_type_query, "bg_color")
                result[f_type.name]['design_color'] = Bill.separated_query(f_type_query, "design_color")
        return result

    @staticmethod
    def sells_per_all_material(query):
        result = dict()
        for material in Material.objects.all():
            material_query = query.filter(product__material=material)
            result[material.name] = dict()
            result[material.name] = Bill.sale_calculation(material_query)
            if result[material.name]['amount'] is not None and int(result[material.name]['amount']) > 0:
                result[material.name]['age'] = Bill.separated_query(material_query, "age")
                result[material.name]['customerType'] = Bill.separated_query(material_query, "customerType")
                result[material.name]['bg_color'] = Bill.separated_query(material_query, "bg_color")
                result[material.name]['design_color'] = Bill.separated_query(material_query, "design_color")
        return result

    @staticmethod
    def sells_per_all_design(query):
        result = dict()
        for design in Design.objects.all():
            design_query = query.filter(product__design=design)
            result[design.name] = Bill.sale_calculation(design_query)
            if result[design.name]['amount'] is not None and int(result[design.name]['amount']) > 0:
                result[design.name]['age'] = Bill.separated_query(design_query, "age")
                result[design.name]['customerType'] = Bill.separated_query(design_query, "customerType")
                result[design.name]['bg_color'] = Bill.separated_query(design_query, "bg_color")
                result[design.name]['design_color'] = Bill.separated_query(design_query, "design_color")
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
    bill_code = models.IntegerField(default=0)

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
        return int(float(self.amount) * float(self.raw_price) * float(self.currency_price))

    def reject(self):
        self.rejected = True
        self.product.update_stock_amount(self.amount)
        self.save()


class Payment(models.Model):
    create_date = models.DateTimeField(blank=True, null=True)
    amount = models.IntegerField()
    type = models.CharField(choices=settings.PAYMENT_TYPES,
                            max_length=10, default="cash")


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
