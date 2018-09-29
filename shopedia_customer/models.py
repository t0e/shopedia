from django.db import models
from django.core.validators import RegexValidator
from jsonfield import JSONField

class Shops(models.Model):
	_id = models.TextField(primary_key=True)
	shop_id = models.TextField()
	shop_name = models.TextField()
	shop_image = models.FileField(
    	upload_to = 'shops'
    	)
	location = models.TextField()
	shop_type = models.TextField()
	description = models.TextField()
	open_hour = models.IntegerField()
	close_hour = models.IntegerField()

	def __str__(self):
		return self.description

class User(models.Model):
    _id = models.AutoField(primary_key=True)
    user_id = models.IntegerField()
    username = models.TextField()
    email = models.EmailField(max_length=70,blank=True)
    user_image = models.FileField(
    	upload_to = 'users'
    	)
    phone_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")
    phone_number = models.CharField(validators=[phone_regex], max_length=17, blank=True)
    password = models.TextField()
    register_type = models.TextField()
    google_id = models.CharField(max_length=50, blank=True)
    facebook_id = models.IntegerField()

    def __str__(self):
    	return self.username


class Items(models.Model):
	_id = models.AutoField(primary_key=True)
	item_id = models.IntegerField()
	item_name = models.TextField()
	item_image = models.FileField(
    	upload_to = 'users'
    	)
	price = models.IntegerField()
	no_of_stocks = models.IntegerField()
	shop_id = models.IntegerField()

	def __str__(self):
		return self.item_name

class Orders(models.Model):
    _id = models.AutoField(primary_key=True)
    order_id = models.IntegerField()
    user_id = models.IntegerField()
    items = JSONField()
    sub_total = models.DecimalField(decimal_places=4, max_digits=10)
    internet_transaction_fee = models.DecimalField(decimal_places=4, max_digits=10)
    total = models.DecimalField(decimal_places=4, max_digits=10)


    def __str__(self):
    	return self.username