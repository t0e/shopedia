from django import forms

class ShopForm(forms.Form):
	shop_id = forms.CharField(required=True)
	location = forms.CharField(required=True)
	longitude = forms.CharField(required=True)
	photo = forms.FileField(
		label = "Select Photo",
		)