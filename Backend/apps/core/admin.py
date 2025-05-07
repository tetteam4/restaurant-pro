from django.contrib import admin

from . models import  Category,SubCategory,Type, SelectedCategory
admin.site.register(Category)
admin.site.register(SubCategory)
admin.site.register(Type)
admin.site.register(SelectedCategory)
