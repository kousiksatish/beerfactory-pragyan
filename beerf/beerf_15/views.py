from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import redirect
from beerf_15 import middleware
import beerf_15
from django.utils.decorators import decorator_from_middleware
from beerf_15.models import *
from django.http import JsonResponse
# Create your views here.
def register(request):
	if 'user_id' in request.session:
		return redirect(beerf_15.views.home)
	if request.method == 'POST':
		form = userForm(request.POST)
		if form.is_valid():
			new_user = form.save()
			request.session["user_id"] = new_user.pid
			return redirect(beerf_15.views.home)
	else:
		form = userForm()
		return render(request, "register.html", {"form" : form})
	
def login(request,error=''):
	if 'user_id' in request.session:
		return redirect(beerf_15.views.home)
	if request.method == 'POST':
		email = request.POST.get('email')
		try:
			user  = users.objects.get(email=email)
		except users.DoesNotExist:
			user = None
		if(user):
			request.session["user_id"] = user.pid
			return redirect(beerf_15.views.home)
		else:
			form = userLoginForm()
			return render(request, "login.html", {"form" : form,"error" : "No user. Please Register...."})
	else:
		form = userLoginForm()
		return render(request, "login.html", {"form" : form,"error" : error})

@decorator_from_middleware(middleware.UserAuth)
def home(request):
	id = request.session["user_id"]
	user = users.objects.get(pid = id)
	return render(request, "home.html",{ "name" : user.name })

@decorator_from_middleware(middleware.UserAuth)
def logout(request):
	request.session.flush()
	form = userLoginForm()
	return render(request, "login.html", {"form" : form,"error" : "logged out"})

@decorator_from_middleware(middleware.UserAuth)
def assign(request):
	return JsonResponse({"status":"SUCCESS"})