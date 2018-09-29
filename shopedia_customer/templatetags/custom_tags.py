from django import template
from django.utils.encoding import iri_to_uri
from auth import auth

register = template.Library()

auth = auth('1234567890abcdefghijklmnopqrstuvwxyz')

@register.simple_tag
def create_list(username, item_id):
	data = {"username": username, "item_id": item_id}
	return data

@register.filter(name='change_url')
def change_url(iri):
	return str(auth.encrypt(iri))

@register.filter(name='remove_item')
def remove_item(data, id):
	print(data)
	return data+"ok"+id

@register.simple_tag
def to_list(*args):
    return args