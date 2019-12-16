from django.contrib import admin

from customer.models import Customer, Point, CustomerType

admin.site.register(Customer)
admin.site.register(CustomerType)
admin.site.register(Point)
