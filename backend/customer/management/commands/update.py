import json
import subprocess

from django.core.management.base import BaseCommand

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
        with open('customer/management/commands/data/customers_data.json', encoding='UTF-8') as json_file:
            data = json.load(json_file)
            for item in data:
                customer_type, _ = CustomerType.objects.get_or_create(name=item['customer_class'])
                address = ""
                if item['region'] is not None:
                    address = item['region']
                if item['city'] is not None:
                    address += ", " + str(item['city'])
                if item['address'] is not None:
                    address += ", " + str(item['address'])
                Customer.objects.create(phone_number="0" + str(item['phone_number']),
                                        first_name=item['first_name'],
                                        last_name=item['last_name'],
                                        address=address,
                                        birth_date=item['birth_date_date'],
                                        marriage_date=item['marriage_date_date'],
                                        points=item['points'], class_type=customer_type)

        with open('customer/management/commands/data/products_data.json', encoding='UTF-8') as json_file:
            data = json.load(json_file)
            for item in data:
                creation_data = {}
                if item['material'] is not None:
                    creation_data['material'], _ = Material.objects.get_or_create(name=item['material'])
                if item['bg_color'] is not None:
                    try:
                        bg_color_parts = item['bg_color'].split(' ')
                        creation_data['background_color'], _ = Color.objects.get_or_create(
                            rgb=bg_color_parts[0],
                            name=bg_color_parts[1])
                    except IndexError:
                        creation_data['background_color'], _ = Color.objects.get_or_create(
                            name=bg_color_parts[0],
                            rgb=bg_color_parts[0])
                if item['design_color'] is not None:
                    try:
                        design_color_parts = item['design_color'].split(' ')
                        creation_data['design_color'], _ = Color.objects.get_or_create(rgb=design_color_parts[0],
                                                                                             name=design_color_parts[1])
                    except IndexError:
                        creation_data['design_color'], _ = Color.objects.get_or_create(name=design_color_parts[0],
                                                                                             rgb=design_color_parts[0])

                if item['f_type'] is not None:
                    creation_data['f_type'], _ = FType.objects.get_or_create(name=item['f_type'])
                if item['design_type'] is not None:
                    creation_data['design'], _ = Design.objects.get_or_create(name=item['design_type'])
                creation_data['branch'], _ = Branch.objects.get_or_create(name='گاندی')
                ProductId.objects.create()
                creation_data['code'] = ProductId.objects.last().pk
                Product.objects.create(name=item['name'], selling_price=item['stock_price'],
                                       buying_price=item['purchase_price'], stock_amount=item['stock_amount'],
                                       **creation_data)

    # with open('entries_data.json', encoding='UTF-8') as json_file:
    #     data = json.load(json_file)
    #     for item in data:
    #         pass
    #
        with open('customer/management/commands/data/staffs_data.json', encoding='UTF-8') as json_file:

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

        with open('customer/management/commands/data/suppliers_data.json', encoding='UTF-8') as json_file:
            data = json.load(json_file)
            for item in data:
                Supplier.objects.create(full_name=item['name'], email='', phone_number=item['phone_number'])

