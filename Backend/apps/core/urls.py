from django.urls import  path
from . import  views


urlpatterns = [
 path('', views.TypeAPIV.as_view()),
 path('<int:pk>/', views.TypeAPIVIDeleteUpdate.as_view()),
 path('category/', views.CategoryAPIViewSet.as_view()),
 path('category/<int:pk>/', views.CategoryAPIVIDeleteUpdate.as_view()),
 path('attribute/', views.AttributeAPIViewSet.as_view()),
 path('attribute/<int:pk>/', views.AttributeAPIVIDeleteUpdate.as_view()),
 path('attribute/value/', views.AttributeValueAPIViewSet.as_view()),
 path('attribute/value/<int:pk>/', views.AttributeValueAPIVIDeleteUpdate.as_view()),
]