
from django.contrib import admin
from django.urls import path, include
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions
schema_view = get_schema_view(
    openapi.Info(
        title="Tamadon MIS system Backend APIs",
        default_version="v1",
        description=(
            "This is the API documentation for TESOl LMS project APIs.\n\n"
            "Contacts:\n"
            "- Ali Sina Sultani: alisinasultani@gmail.com\n"
            "- Abbas Alizadah: abbas.alizadah1380@gmail.com \n"
            "- Anwar Mohammadi : anwarmohammadi1390@gmail.com \n"
            "- Hussain Mohammadi: aukto1390@gmail.com and pushking1390@gmail"
        ),
        contact=openapi.Contact(email="alisinasultani@gmail.com"),
        license=openapi.License(name="MIT"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)
urlpatterns = [
    path("swagger<format>/", schema_view.with_ui("redoc", cache_timeout=0)),
    path("", schema_view.with_ui("swagger", cache_timeout=0), name="schema-swagger-ui"),
    path('admin/', admin.site.urls),
    path('', include('apps.staff.urls')),
    path('core/', include('apps.core.urls'))
]
