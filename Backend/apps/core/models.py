from django.db import models

class Type(models.Model):
    name = models.CharField(max_length=250)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Type"
        verbose_name_plural = "Types"

    def __str__(self):
        return  self.name

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=250)
    type = models.ForeignKey(Type, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"
    def __str__(self):
        return self.name




class Attributes(models.Model):
    name = models.CharField(max_length=250)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Attribute"
        verbose_name_plural = "Attributes"


    def __str__(self):
        return  f'{self.name} - {self.category.name}'

class AttributesValues(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    attributes = models.ForeignKey(Attributes, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Attributes Value"
        verbose_name_plural = "Attribute Values"


    def __str__(self):
        return  f'{self.category.name} - {self.attributes.name}'