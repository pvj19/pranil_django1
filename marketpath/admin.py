from django.contrib import admin

from .models import Enquiry


@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display = ("name", "phone", "interest", "created_at")
    list_filter = ("interest", "created_at")
    search_fields = ("name", "phone", "message")
    readonly_fields = ("created_at",)
