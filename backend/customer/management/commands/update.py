import json
import subprocess

from django.core.management.base import BaseCommand
from django.db import IntegrityError

from branch.models import Branch
from customer.models import CustomerType, Customer
from product.models import Material, Color, FType, Design, ProductId, Product
from staff.models import Staff
from supplier.models import Supplier


class Command(BaseCommand):
    def _run(self, command):
        with subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, universal_newlines=True) as x:
            for line in x.stdout.readlines():
                self.stdout.write(line)

    def handle(self, *args, **options):
        with open('customer/management/commands/customers_data.json', encoding='UTF-8') as json_file:
            data = json.load(json_file)
            for item in data:
                customer_type, created = CustomerType.objects.get_or_create(name=item['customer_class'])
                address = ""
                if item['region'] is not None:
                    address = item['region']
                if item['city'] is not None:
                    address += ", " + str(item['city'])
                if item['address'] is not None:
                    address += ", " + str(item['address'])
                Customer.objects.create(phone_number=item['phone_number'],
                                        first_name=item['first_name'],
                                        last_name=item['last_name'],
                                        address=address,
                                        birth_date=item['birth_date_date'],
                                        marriage_date=item['marriage_date_date'],
                                        points=item['points'], class_type=customer_type)

        with open('customer/management/commands/products_data.json', encoding='UTF-8') as json_file:
            data = json.load(json_file)
            counter = 0
            for item in data:
                try:
                    creation_data = {}
                    creation_data['material'], created = Material.objects.get_or_create(name=item['material'])
                    if item['bg_color'] is not None:
                        try:
                            bg_color_parts = item['bg_color'].split(' ')
                            creation_data['background_color'], created = Color.objects.get_or_create(
                                name=bg_color_parts[0],
                                rgb=bg_color_parts[1])
                        except IndexError:
                            creation_data['background_color'], created = Color.objects.get_or_create(
                                name=bg_color_parts[0],
                                rgb=bg_color_parts[0])
                    if Color.objects.filter(name=item['design_color']).exists():
                        creation_data['design_color'] = Color.objects.filter(name=item['design_color']).first()
                    else:
                        creation_data['design_color'] = Color.objects.create(name=item['design_color'])
                    if item['f_type'] is not None:
                        creation_data['f_type'], created = FType.objects.get_or_create(name=item['f_type'])
                    if item['design_type'] is not None:
                        creation_data['design'], created = Design.objects.get_or_create(name=item['design_type'])
                    creation_data['branch'], created = Branch.objects.get_or_create(name='گاندی')
                    ProductId.objects.create()
                    creation_data['code'] = ProductId.objects.last().pk
                    Product.objects.create(name=item['name'], selling_price=item['stock_price'],
                                           buying_price=item['purchase_price'], stock_amount=item['stock_amount'],
                                           **creation_data)
                except IntegrityError:
                    print(counter)
                    continue

        with open('entries_data.json', encoding='UTF-8') as json_file:
            data = json.load(json_file)
            for item in data:
                pass

        with open('customer/management/commands/staffs_data.json', encoding='UTF-8') as json_file:

            data = json.load(json_file)
            job_mapping = {'admin': 'admin',
                           'stockman': 'storekeeper',
                           'cashier': 'cashier',
                           'salesperson': 'salesperson',
                           'accountant': 'accountant'}
            for item in data:
                Staff.objects.create(username=item['username'], first_name=item['first_name'],
                                     last_name=item['last_name'],
                                     job=job_mapping[item['group_type']], email=item['email'],
                                     branch=Branch.objects.first())

        with open('customer/management/commands/suppliers_data.json', encoding='UTF-8') as json_file:
            data = json.load(json_file)
            for item in data:
                Supplier.objects.create(full_name=item['name'], email='', phone_number=item['phone_number'])
