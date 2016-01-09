from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import redirect
from beerf_15 import middleware
import beerf_15
from django.utils.decorators import decorator_from_middleware
from beerf_15.models import *
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
# Create your views here.
def register(request):
	if 'user_id' in request.session:
		return redirect(beerf_15.views.home)
	if request.method == 'POST':
		form = userForm(request.POST)
		if form.is_valid():
			new_user = form.save()
			stat = status(pid = new_user,turn = 0,stage=0)
			stat.save()
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

#creates a retailer for factory fac1 and its opponent factory
def retailer_allocate(fac1):
	#create the retailer
	ret = retailers()
	ret.save()

	fac_fac_relation = factory_factory.objects.get(fac1=fac1)
	fac2 = fac_fac_relation.fac2

	#create the factory-retailer link
	fac_ret_relation = factory_retailer(fid = fac1, rid = ret)
	fac_ret_relation.save()

	fac_ret_relation = factory_retailer(fid = fac2, rid = ret)
	fac_ret_relation.save()

@csrf_exempt
@decorator_from_middleware(middleware.SessionPIDAuth)
def assign(request):
	if request.method == 'POST':
		id = request.POST.get("user_id")
		try:
			user  = users.objects.get(pk=id)
		except users.DoesNotExist:
			return JsonResponse({"status":"103", "data":{"description":"Failed! User does not exist"}})

		#the user is logged in
		if not(user.factory_id):
			#The user's factory has not been set
			#create user's factory with money=10000
			fac1 = factories(money = 10000)
			fac1.save()
			#link the factory with the user
			user.factory = fac1
			user.save()
			#create user's opponent factory with money=10000
			fac2 = factories(money = 10000)
			fac2.save()
			#link the factories
			fac_fac_relation = factory_factory(fac1 = fac1, fac2 = fac2)
			fac_fac_relation.save()
			#calling the retailer_allocate function 3 times to create 3 retailers and map to fac1 and fac2
			for i in range(0,3):
				retailer_allocate(fac1) 
			return JsonResponse({"status":"200","data":{"description":"Successfully allocated Factories and Retailers"}})
		else:
			#The facrtory has been set already
			return JsonResponse({"status":"101","data":{"description":"Factory and Retailers have already been Allocated for "+user.email}})
	else:
		#The user is not authorized or logged in.
		return JsonResponse({"status":"100","data":{"description":"Failed! Wrong type of request"}})


def testhome(request):
	return render(request, "index.html")

@csrf_exempt
@decorator_from_middleware(middleware.SessionPIDAuth)
def getStatus(request):
	if request.method == 'POST':
		id = request.POST.get("user_id")
		try:
			user  = users.objects.get(pk=id)
		except users.DoesNotExist:
			return JsonResponse({"status":"103", "data":{"description":"Failed! User does not exist"}})
			user = None
		if id and user:
			stat = status.objects.get(pid=user)
			return JsonResponse({"status":"200", "data":{"description":"Success", "turn":str(stat.turn), "stage":str(stat.stage)}})
	else:
		return JsonResponse({"status":"100", "data":{"description":"Failed! Wrong type of request"}})

@csrf_exempt
@decorator_from_middleware(middleware.SessionPIDAuth)
def fac_details(request):
	if request.method == 'POST':
		id = request.POST.get("user_id")
		try:
			user  = users.objects.get(pk=id)
		except users.DoesNotExist:
			return JsonResponse({"status":"103", "data":{"description":"Failed! User does not exist"}})
			user = None
		if id and user:
			turn = status.objects.get(pid = id).turn
			factory1 = user.factory
			factory2 = factory_factory.objects.get(fac1=factory1).fac2
			
			capacity1 = capacity.objects.get(fid = factory1.fid,turn = turn)
			capacity2 = capacity.objects.get(fid = factory2.fid,turn = turn)
			
			fac_ret_1 = factory_retailer.objects.filter(fid = factory1).values_list('frid', flat = True)
			fac_ret_2 = factory_retailer.objects.filter(fid = factory2).values_list('frid', flat = True)
			
			sp1 = selling_price.objects.filter(frid__in = fac_ret_1,turn=turn)
			sp2 = selling_price.objects.filter(frid__in = fac_ret_2,turn=turn)
			json = {}
			json["status"] ="200"
			data = {}
			fact1={}
			fact2={}
			fact1['fcode'] = factory1.fcode
			fact1["money"] = factory1.money
			fact1["capacity"] = capacity1.capacity
			data["factory_1"] = fact1
			fact2['fcode'] = factory2.fcode
			fact2["money"] = factory2.money
			fact2["capacity"] = capacity2.capacity
			data["factory_2"] = fact2
			json["data"] = data
			return JsonResponse(json)
	else:
		return JsonResponse({"status":"100", "data":{"description":"Failed! Wrong type of request"}})


@csrf_exempt
@decorator_from_middleware(middleware.SessionPIDAuth)
def get_selling_price(request):
	if request.method == 'POST':
		id = request.POST.get("user_id")
		try:
			user  = users.objects.get(pk=id)
		except users.DoesNotExist:
			return JsonResponse({"status":"103", "data":{"description":"Failed! User does not exist"}})
			user = None
		if id and user:
			turn = status.objects.get(pid = id).turn
			factory1 = user.factory
			factory2 = factory_factory.objects.get(fac1=factory1).fac2
			
			fac_ret_1 = factory_retailer.objects.filter(fid = factory1).values_list('frid', flat = True)
			fac_ret_2 = factory_retailer.objects.filter(fid = factory2).values_list('frid', flat = True)
			
			sp1 = selling_price.objects.filter(frid__in = fac_ret_1,turn=turn)
			sp2 = selling_price.objects.filter(frid__in = fac_ret_2,turn=turn)
			json = {}
			json["status"] ="200"
			data = {}
			fact1={}
			fact2={}
			sps = []
			for sp in sp1:
				sps.append(sp.selling_price)
			fact1["selling_price"] = sps
			data["factory_1"] = fact1
			sps = []
			for sp in sp2:
				sps.append(sp.selling_price)
			fact2["selling_price"] = sps
			data["factory_2"] = fact2
			json["data"] = data
			return JsonResponse(json)
	else:
		return JsonResponse({"status":"100", "data":{"description":"Failed! Wrong type of request"}})

@csrf_exempt
@decorator_from_middleware(middleware.SessionPIDAuth)
def placeOrder(request):
	'''
		Places order to produce beer for a particular factory at the second stage, i.e, stage == 1
	'''
	if request.method == 'POST':
		id = request.POST.get('user_id')
		try:
			user  = users.objects.get(pk=id)
		except users.DoesNotExist:
			return JsonResponse({"status":"103", "data":{"description":"Failed! User does not exist"}})
			user = None

		# after user verification is done
		if id and user:
			cur_status = status.objects.get(pid = id)
			turn = int(cur_status.turn)						# turn number as stored in DB
			stage = int(cur_status.stage) 					# stage number as stored in DB
			if stage != 1:									# current stage should be == 1
				return JsonResponse({'status':'105', 'data':{'description':'Turn or stage mismatch'}})

			try:
				quantity = int(request.POST['quantity'])
				valid_turn_and_stage = (turn == int(request.POST['turn']) and stage == int(request.POST['stage']))
			except KeyError:
				return JsonResponse({"status":"100","data":{"description":"Failed! Wrong type of request"}})

			if not valid_turn_and_stage:
				return JsonResponse({'status':'105', 'data':{'description':'Turn or stage mismatch'}})

			factory = user.factory
			cur_capacity = int(capacity.objects.get(fid=factory,turn=turn).capacity)
			if quantity > cur_capacity:
				return JsonResponse({"status":"106","data":{"description":"Quantity exceeded capacity of the factory"}})
			# create the new order in the DB
			new_order = factory_order(fid=factory,turn=turn,quantity=quantity)
			new_order.save()
			# move to next stage of the current turn
			cur_status.stage += 1
			cur_status.save()
			return JsonResponse({"status":"200","data":{"description":"Successfully placed the order"}})
		else:
			return JsonResponse({"status":"100","data":{"description":"Failed! Wrong type of request"}})
	else:
		return JsonResponse({"status":"100","data":{"description":"Failed! Wrong type of request"}})
