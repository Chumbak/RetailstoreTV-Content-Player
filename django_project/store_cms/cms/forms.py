from django import forms

from cms.models import Store


class LoginForm(forms.Form):
    """ Used to login the store """
    store_code = forms.CharField()
    password = forms.CharField(widget=forms.PasswordInput())

    def __init__(self, *args, **kwargs):
        self.store_obj = None
        super(LoginForm, self).__init__(*args, **kwargs)

    def clean(self):
        cleaned_data = self.cleaned_data
        try:
            self.store_obj = Store.objects.get(code=cleaned_data['store_code'], disabled=False)
        except Store.DoesNotExist:
            raise forms.ValidationError("Invalid authentication")
        return cleaned_data
