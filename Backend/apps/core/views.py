from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response

from . import models as base_models
from . import serializers as base_serializers
from .pagination import TypePagination


class TypeAPIV(generics.ListCreateAPIView):
    queryset = base_models.Type.objects.all()
    serializer_class = base_serializers.TypeSerializer
    pagination_class = TypePagination

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class TypeAPIVIDeleteUpdate(generics.RetrieveUpdateDestroyAPIView):
    queryset = base_models.Type.objects.all()
    serializer_class = base_serializers.TypeSerializer


class CategoryAPIViewSet(generics.ListCreateAPIView):
    queryset = base_models.Category.objects.select_related("type")
    serializer_class = base_serializers.CategorySerializer
    pagination_class = TypePagination

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class CategoryAPIVIDeleteUpdate(generics.RetrieveUpdateDestroyAPIView):
    queryset = base_models.Category.objects.select_related("type")
    serializer_class = base_serializers.CategorySerializer


class AttributeAPIViewSet(generics.ListCreateAPIView):
    queryset = base_models.Attributes.objects.select_related(
        "category", "category__type"
    )
    serializer_class = base_serializers.AttributesSerializer
    pagination_class = TypePagination

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class AttributeAPIVIDeleteUpdate(generics.RetrieveUpdateDestroyAPIView):
    queryset = base_models.Attributes.objects.all()
    serializer_class = base_serializers.AttributesSerializer


class AttributeValueAPIViewSet(generics.ListCreateAPIView):
    queryset = base_models.AttributesValues.objects.select_related(
        "attributes", "attributes__category", "attributes__category__type"
    )

    serializer_class = base_serializers.AttributesValuesSerializer
    pagination_class = TypePagination

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class AttributeValueAPIVIDeleteUpdate(generics.RetrieveUpdateDestroyAPIView):
    queryset = base_models.AttributesValues.objects.select_related("attributes")
    serializer_class = base_serializers.AttributesValuesSerializer
