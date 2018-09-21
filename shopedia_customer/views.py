from django.shortcuts import render
from django.http import HttpResponse
from django.core import serializers
import json
from shopedia_customer.models import Shops, User, Items
from django.views.decorators.csrf import csrf_exempt

def index(request):
	if 'username' not in request.session.keys():
		user = None
	else:
		user = User.objects.get(username=request.session['username'])

	shops = json.loads(serializers.serialize('json', Shops.objects.all()))
	return render(request, 'index.html', {"shops": shops, "user": user})

@csrf_exempt
def register(request):
	user = None
	if request.method == "POST":
		# print(request.POST.items())
		data = dict()
		for k,v in request.POST.items():
			data[k] = v
		print(data)
		user = User(username=data['username'], email=data['email'], phone_number=data['phone_number'] ,password=data['password'])
		user.save()
		user = User.objects.get(username = data['username'])
		request.session['username'] = str(user.username)
	shops = json.loads(serializers.serialize('json', Shops.objects.all()))
	return render(request, 'index.html', {"shops": shops, "user":user})

def home(request):
	return render(request, 'shop.html')

def map(request):
	return render(request, 'map.html')

def store_locator(request):
	return render(request, 'store-locator.html')

def shop(request, shop_id):
	items = json.loads(serializers.serialize('json', Items.objects.filter(shop_id = shop_id)))
	return render(request, 'shop.html', {"items": items})	

def login(request):
	
	return render(request, 'index.html')	

def uikit(request):
	return render(request, 'uikit.html')

def item(request):
	return render(request, 'item.html')
