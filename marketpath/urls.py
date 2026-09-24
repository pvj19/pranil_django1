from django.urls import path

from . import views

app_name = "marketpath"

urlpatterns = [
    path("", views.index, name="index"),
]
