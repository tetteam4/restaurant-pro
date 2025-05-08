from rest_framework import serializers
from . models import  Category,Attributes,AttributesValues,Type

class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = ['id','name']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        type = TypeSerializer()

        model = Category
        fields = ['id','name','type']


class AttributesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attributes
        fields = ['id','name','category', 'type']

class AttributesValuesSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttributesValues
        fields = ['id','name','attributes']