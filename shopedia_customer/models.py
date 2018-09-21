from django.db import models


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
    username = models.TextField()
    email = models.TextField()
    user_image = models.FileField(
    	upload_to = 'users'
    	)
    phone_number = models.TextField()
    password = models.TextField()

    def __str__(self):
    	return self.username


class Items(models.Model):
    _id = models.AutoField(primary_key=True)
    item_name = models.TextField()
    item_image = models.FileField(
    	upload_to = 'users'
    	)
    price = models.IntegerField()
    qty = models.IntegerField()
    shop_id = models.IntegerField()

    def __str__(self):
    	return self.item_name