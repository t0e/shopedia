from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.core import serializers
import json
from shopedia_customer.models import Shops, User, Items, Orders
from django.views.decorators.csrf import csrf_exempt
import time
import ast
# from config import *
from auth import auth

auth = auth('1234567890abcdefghijklmnopqrstuvwxyz')

def index(request):
	if 'user_id' not in request.session.keys():
		user = None
	else:
		user = json.loads(serializers.serialize('json', User.objects.filter(user_id=request.session['user_id'])))[0]

	shops = json.loads(serializers.serialize('json', Shops.objects.all()))
	return render(request, 'index.html', {"shops": shops, "user": user})

@csrf_exempt
def register(request):
	user = None
	if request.method == "POST":
		data = dict()
		for k,v in request.POST.items():
			data[k] = v
		millis = int(round(time.time() * 1000))
		if User.objects.filter(email=data['email']).count()>0:
			user = json.loads(serializers.serialize('json', User.objects.filter(email=data['email'])))[0]
			request.session['user_id'] = user['fields']['user_id']
		else:
			if data['register_type'] == "google":
				user = User(user_id=millis, username=data['username'], email=data['email'], user_image=data['user_image'], register_type=data['register_type'], google_id=data['google_id'])
			elif data['register_type'] == "facebook":
				user = User(user_id=millis, username=data['username'], email=data['email'], user_image=data['user_image'], register_type=data['register_type'], facebook_id=data['facebook_id'])
			else:
				user = User(user_id=millis, username=data['username'], email=data['email'], phone_number=data['phone_number'] ,password=data['password'], register_type=data['register_type'])
			user.save()
			request.session['user_id'] = millis
	print("registration complete")
	return index(request)

@csrf_exempt
def login(request):
	user = None
	if request.method == "POST":
		data = dict()
		for k,v in request.POST.items():
			data[k] = v

		if User.objects.filter(email=data['username'], register_type='in_app').count()>0 and User.objects.filter(email=data['username'], password=data['password']).count()>0:
			user = json.loads(serializers.serialize('json', User.objects.filter(email=data['username'], password=data['password'])))[0]
			request.session['user_id'] = user['fields']['user_id']
		elif User.objects.filter(username=data['username'], register_type='in_app').count()>0 and User.objects.filter(username=data['username'], password=data['password']).count()>0:
			user = json.loads(serializers.serialize('json', User.objects.filter(username=data['username'], password=data['password'])))[0]
			request.session['user_id'] = user['fields']['user_id']
		else:
			return JsonResponse({'status':"failed"})
	return JsonResponse({'status':"successful"})


def home(request):
	return render(request, 'shop.html')

def sign_out(request):
	print('user has been signed out');
	del request.session['user_id']
	return JsonResponse({'status':"successful"})

def map(request):
	return render(request, 'map.html')

def store_locator(request):
	print("store-locator")
	return render(request, 'store-locator.html')

def shop(request, shop_id):
	if 'user_id' not in request.session.keys():
		user = None
	else:
		user = json.loads(serializers.serialize('json', User.objects.filter(user_id=request.session['user_id'])))[0]

	items = json.loads(serializers.serialize('json', Items.objects.filter(shop_id = shop_id)))
	shop = json.loads(serializers.serialize('json', Shops.objects.filter(shop_id = shop_id)))[0]
	return render(request, 'shop.html', {"items": items, "user": user, "shop": shop})	

def zzz(request):
	return render(request, 'thank-you-page.html')	

def check_out(request):
	if 'user_id' not in request.session.keys():
		user = None
	else:
		user = json.loads(serializers.serialize('json', User.objects.filter(user_id=request.session['user_id'])))[0]

	try:
		cart = request.session["cart"]
		items = []
		total = 0
		sub_total = 0
		internet_transaction_fees = 0

		for item in cart[str(request.session['user_id'])]:
			cart_item = json.loads(serializers.serialize('json', Items.objects.filter(item_id = item)))[0]
			cart_item['fields']['qty'] = cart[str(request.session['user_id'])][item]
			cart_item['fields']['amount'] = cart_item['fields']['qty']*cart_item['fields']['price']
			sub_total += cart_item['fields']['amount']
			items.append(cart_item)

		internet_transaction_fees = sub_total*0.05
		total = sub_total+internet_transaction_fees

		return render(request, 'check-out.html', {"items": items, "user": user, "sub_total": sub_total, "internet_transaction_fees": internet_transaction_fees, "total": total})
	except KeyError:
		return render(request, 'cart-empty.html', {"user": user})

def item(request):
	if 'user_id' not in request.session.keys():
		user = None
	else:
		user = json.loads(serializers.serialize('json', User.objects.filter(user_id=request.session['user_id'])))[0]
	return render(request, 'item.html', {"user": user})

def cart(request):
	if 'user_id' not in request.session.keys():
		user = None
		return render(request, 'login-request.html', {"user": user})
	else:
		user = json.loads(serializers.serialize('json', User.objects.filter(user_id=request.session['user_id'])))[0]

	try:
		cart = request.session["cart"]
		items = []
		total = 0

		for item in cart[str(request.session['user_id'])]:
			cart_item = json.loads(serializers.serialize('json', Items.objects.filter(item_id = item)))[0]
			cart_item['fields']['qty'] = cart[str(request.session['user_id'])][item]
			cart_item['fields']['amount'] = cart_item['fields']['qty']*cart_item['fields']['price']
			total += cart_item['fields']['amount']
			items.append(cart_item)
		return render(request, 'cart.html', {"items": items, "user": user, "total": total})
	except KeyError:
		return render(request, 'cart-empty.html', {"user": user})

@csrf_exempt
def add_to_cart(request):
	if request.method == 'POST':
		if request.is_ajax()== True:
			for k,v in request.POST.items():
				if 'cart' not in request.session.keys():
					print(k)
					k = json.loads(k)
					request.session['cart'] = dict()
					user_id = str(k['user_id'])
					item_id = str(k['items'][0])
					request.session['cart'] ={ user_id: {item_id: 1 }}
					print("not")
				else:
					print("yes")
					cart = request.session['cart']
					k = json.loads(k)
					if str(k['items'][0]) in cart[k['user_id']]:
						cart[k['user_id']][str(k['items'][0])]+=1
					else:
						cart[k['user_id']][str(k['items'][0])]=1
					request.session['cart'] = cart
	print(request.session['cart'])
	return JsonResponse({'response':"success"})

def get_shop_list(request):
	if request.method == 'GET':
		if request.is_ajax()== True:
			shops = json.loads(serializers.serialize('json', Shops.objects.all()))
			print(shops)
			return JsonResponse({'shops':shops})

def complete_purchase(request, data):
	if 'user_id' not in request.session.keys():
		user = None
	else:
		user = json.loads(serializers.serialize('json', User.objects.filter(user_id=request.session['user_id'])))[0]

	data = ast.literal_eval(str(auth.decrypt(data)))
	content = json.loads(json.dumps(data))
	millis = int(round(time.time() * 1000))
	items = dict()
	for item in content[0]:
		items[item['fields']['item_id']] = {"qty": item['fields']['qty'], "price": item['fields']['price']}
	print(items)
	order = Orders(order_id=millis, user_id=1, items=items, sub_total=float(content[1]) , internet_transaction_fee=float(content[2]), total=float(content[3]))
	order.save()
	del request.session['cart']
	return render(request, 'thank-you-page.html', {"user": user})


def about_us(request):
	if 'user_id' not in request.session.keys():
		user = None
	else:
		user = json.loads(serializers.serialize('json', User.objects.filter(user_id=request.session['user_id'])))[0]

	return render(request, 'about-us.html', {"user": user})
