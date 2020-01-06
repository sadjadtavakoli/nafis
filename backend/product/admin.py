from django.contrib import admin

from product.models import Color, Material, Design, Product, FType, ProductId

admin.site.register(Color)
admin.site.register(Material)
admin.site.register(Design)
admin.site.register(Product)
admin.site.register(ProductId)
admin.site.register(FType)
