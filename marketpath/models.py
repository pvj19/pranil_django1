from django.db import models


class Enquiry(models.Model):
    INTEREST_CHOICES = [
        # ("not_sure", "Not sure yet"),
        ("foundations", "Foundations course"),
        ("advanced", "Advanced course"),
        ("excel_tools", "Excel tools"),
    ]

    name = models.CharField(max_length=120)
    phone = models.CharField(max_length=20)
    interest = models.CharField(
        max_length=20, choices=INTEREST_CHOICES, default="not_sure"
    )
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "Enquiries"

    def __str__(self):
        return f"{self.name} ({self.get_interest_display()})"
