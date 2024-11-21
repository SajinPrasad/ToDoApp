from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TodoViewSet, BulkDestroyView

router = DefaultRouter()

router.register(r"todos", TodoViewSet, basename="todo")

urlpatterns = [
    path("", include(router.urls)),
    path("destroy/", BulkDestroyView.as_view(), name="destroy"),
]
