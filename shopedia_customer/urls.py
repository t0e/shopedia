from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^home/$', views.home, name='home'),
    url(r'^login/$', views.login, name='login'),
    url(r'^map/$', views.map, name='map'),
    url(r'^shop/(?P<shop_id>.+)/', views.shop, name='shop'),
    url(r'^item/$', views.item, name='item'),
    url(r'^uikit/$', views.uikit, name='uikit'),
    url(r'^store-locator/$', views.store_locator, name='store_locator'),
    url(r'^register/$', views.register, name='register'),
]
