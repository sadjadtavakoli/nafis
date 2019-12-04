from django.contrib import admin

from backend.product.models import Color, Material, Design, Product, FType

admin.site.register(Color)
admin.site.register(Material)
admin.site.register(Design)
admin.site.register(Product)
admin.site.register(FType)
