from django.shortcuts import render
from django.http import HttpResponseRedirect

# Create your views here.

from .models import *

def retailer_allocate(fac1, fac2):
	print 'retailer_allocate called'
	ret1 = retailers() #create retailer 1
	ret1.save()

	ret2 = retailers() #create retailer 2
	ret2.save()

	ret3 = retailers() #create retailer 3
	ret3.save()

	#create relations for factory1 and retailers
	fac_ret_relation = factory_retailer(fid = fac1, rid = ret1)
	fac_ret_relation.save()
	fac_ret_relation = factory_retailer(fid = fac1, rid = ret2)
	fac_ret_relation.save()
	fac_ret_relation = factory_retailer(fid = fac1, rid = ret3)
	fac_ret_relation.save()
	#create relations for factory2 and retailers
	fac_ret_relation = factory_retailer(fid = fac2, rid = ret1)
	fac_ret_relation.save()
	fac_ret_relation = factory_retailer(fid = fac2, rid = ret2)
	fac_ret_relation.save()
	fac_ret_relation = factory_retailer(fid = fac2, rid = ret3)
	fac_ret_relation.save()




def factory_allocate(userid):
	print 'factory_allocate called'
	fac1 = factories(money = 10000) #his factory
	fac1.save()
	print 'factory1 created'
	user = users.objects.get(pid=userid) #add this factory to users table
	user.factory = fac1
	user.save()
	print 'fac1 linked'
	fac2 = factories(money = 10000) #opponent factory
	fac2.save()
	print 'fac2 created'
	fac_fac_relation = factory_factory(fac1 = fac1, fac2 = fac2) #pair both factories
	fac_fac_relation.save()
	print 'fac1-fac2 linked'
	retailer_allocate(fac1, fac2)

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