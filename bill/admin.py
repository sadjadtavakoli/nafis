from django.contrib import admin

from bill.models import Bill, SupplierBill, BillItem, SupplierBillItem, OurPayment, \
    CustomerPayment, OurCheque, CustomerCheque

admin.site.register(Bill)
admin.site.register(SupplierBill)
admin.site.register(BillItem)
admin.site.register(SupplierBillItem)
admin.site.register(OurPayment)
admin.site.register(CustomerPayment)
admin.site.register(OurCheque)
admin.site.register(CustomerCheque)
