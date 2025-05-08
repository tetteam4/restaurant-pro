from django.contrib import admin

from . models import  Category,Attributes,Type, AttributesValues
admin.site.register(Category)
admin.site.register(Attributes)
admin.site.register(Type)
admin.site.register(AttributesValues)
