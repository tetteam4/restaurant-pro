from django.urls import  path
from . import  views


urlpatterns = [
 path('', views.TypeAPIV.as_view()),
 path('<int:pk>/', views.TypeAPIVIDeleteUpdate.as_view())
]