from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^home/$', views.home, name='home'),
    url(r'^login/$', views.login, name='login'),
    url(r'^sign-out/$', views.sign_out, name='sign-out'),
    url(r'^map/$', views.map, name='map'),
    url(r'^shop/(?P<shop_id>.+)/', views.shop, name='shop'),
    url(r'^get-shop-list/', views.get_shop_list, name='get-shop-list'),
    url(r'^item/$', views.item, name='item'),
    url(r'^cart/$', views.cart, name='cart'),
    url(r'^check-out/$', views.check_out, name='check-out'),
    url(r'^store-locator/$', views.store_locator, name='store-locator'),
    url(r'^register/$', views.register, name='register'),
    url(r'^add-to-cart/$', views.add_to_cart, name='add-to-cart'),
    url(r'^complete-purchase/(?P<data>.+)/', views.complete_purchase, name='complete-purchase'),
    url(r'^about-us/$', views.about_us, name='about-us'),
]
