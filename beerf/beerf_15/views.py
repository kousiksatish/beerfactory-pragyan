from django.shortcuts import render
from django.http import HttpResponseRedirect

# Create your views here.

from .models import *

def factory_allocate(userid):
	print 'factory_allocate called'
	fac1 = factories(money = 10000) #his factory
	fac1.save()
	fac1_id = fac1.fid
	print 'factory1 created'
	user = users.objects.get(pid=userid) #add this factory to users table
	user.factory = fac1
	user.save()
	print 'fac1 linked'
	fac2 = factories(money = 10000) #opponent factory
	fac2.save()
	fac2_id = fac2.fid
	print 'fac2 created'
	fac_fac_relation = factory_factory(fac1 = fac1, fac2 = fac2) #pair both factories
	fac_fac_relation.save()
	print 'fac1-fac2 linked'

def register(request):
	if request.method == 'POST':
		form = userForm(request.POST)
		if form.is_valid():
			new_user = form.save()
			factory_allocate(new_user.pid)
			return HttpResponseRedirect('/thanks/')

	else:
		form = userForm()

	return render(request, "register.html", {"form" : form})

def thanks(request):
	return render(request, "thanks.html")