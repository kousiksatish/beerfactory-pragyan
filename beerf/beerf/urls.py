"""beerf URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin
from beerf_15 import views

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^register/$',views.register, name="register"),
    url(r'^$', views.login, name="login"),
    url(r'^home$', views.home, name="home"),
    url(r'^assign_factory$', views.assign, name="assign_factory"),
    url(r'^logout$', views.logout, name="logout"),
    url(r'^demo$', views.testhome, name="testhome"),
    url(r'^mapp$', views.mapp, name="mapp"),
    url(r'^getStatus$', views.getStatus, name="getStatus"),
    url(r'^fac_details$', views.fac_details, name="fac_details"),
    url(r'^getSellingPrice$', views.get_selling_price, name="get_selling_price"),
    url(r'^instructions$',views.instructions,name="instructions"),
    url(r'^getDemand$', views.get_demand, name="get_demand"),
    url(r'^map$', views.map, name="map"),
    url(r'^supply$', views.supply, name="supply"),
    url(r'^testmap$', views.testmap, name="testmap"),
    url(r'^updateSellingPrice$', views.updateSellingPrice, name="updateSellingPrice"),
    url(r'^updateCapacity$', views.updateCapacity, name="updateCapacity"),
    url(r'^getCapacityDetails$', views.getCapacityDetails, name="getCapacityDetails"),
    url(r'^placeOrder$', views.placeOrder,name='placeOrder'),
    url(r'^viewDemand$', views.viewDemand, name='viewDemand'),
    url(r'^viewDemandSupply$', views.viewDemandSupply, name='viewDemandSupply'),
    url(r'^getPopularity$', views.getPopularity, name='getPopularity'),
    url(r'^restart$',views.restart, name='restart'),
    url(r'^history$',views.history, name='history'),
]
