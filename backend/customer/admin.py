from django.contrib import admin

from customer.models import Customer, Point, CustomerType, City

admin.site.register(Customer)
admin.site.register(CustomerType)
admin.site.register(Point)
admin.site.register(City)
