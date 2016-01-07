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
    url(r'^login$', views.login, name="login"),
    url(r'^home$', views.home, name="home"),
    url(r'^assign_factory$', views.assign, name="assign_factory"),
    url(r'^logout$', views.logout, name="logout"),
    url(r'^testhome$', views.testhome, name="testhome"),

    url(r'^getStatus$', views.getStatus, name="getStatus")
]
