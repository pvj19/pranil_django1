import re

from django import forms

from .models import Enquiry


class EnquiryForm(forms.ModelForm):
    class Meta:
        model = Enquiry
        fields = ["name", "phone", "interest", "message"]
        widgets = {
            "name": forms.TextInput(
                attrs={"autocomplete": "name", "placeholder": ""}
            ),
            "phone": forms.TextInput(
                attrs={
                    "type": "tel",
                    "inputmode": "tel",
                    "autocomplete": "tel",
                }
            ),
            "message": forms.Textarea(attrs={"rows": 4}),
        }

    def clean_phone(self):
        phone = self.cleaned_data["phone"]
        digits = re.sub(r"\D", "", phone)
        if len(digits) < 10:
            raise forms.ValidationError(
                "Enter a phone number with at least 10 digits."
            )
        return phone
