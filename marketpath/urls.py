from django.urls import path

from . import views

app_name = "marketpath"

urlpatterns = [
    path("", views.index, name="index"),
    path("courses/", views.courses_page, name="courses"),

]
