from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import redirect
from beerf_15 import middleware
import beerf_15
from django.utils.decorators import decorator_from_middleware
from beerf_15.models import *
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from beerf_algo.beerf_algo import dummy_algo
from utilities import money
from utilities import inventory

'''
INITIAL FUNCTIONS
1. /register
2. /login
3. /logout
4. /home
'''

def register(request):
	if 'user_id' in request.session:
		return redirect(beerf_15.views.home)
	if request.method == 'POST':
		form = userForm(request.POST)
		if form.is_valid():
			new_user = form.save()
			stat = status(pid = new_user,turn = 1,stage=0)
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


'''
INITIALISATION OF PARAMETERS
1. initial money
2. initial capacity
3. initial inventory
4. selling price
'''

#function for returning the initial money for the factory at start of game
def get_initial_money():
	return 10000

#function for returning the initial capacity fir the factory at start of the game
def get_initial_capacity():
	return 200

def get_initial_inventory():
	return 200

#function for returning the base price and range
def get_sp_details():
	sp_details={}
	sp_details["base"] = 50
	sp_details["range"] = 5
	return sp_details

def unlocked_ret(frids, fid):
	rids = factory_retailer.objects.filter(frid__in = frids).values_list('rid_id', flat = True)
	unlocked_rids = retailers.objects.filter(rid__in = rids , unlocked = 1).values_list('rid', flat = True)
	unlocked_frids = factory_retailer.objects.filter(rid_id__in = unlocked_rids, fid_id = fid).values_list('frid',flat = True)
	return unlocked_frids

def calculate_popularity(retailer_no):
	pops = [0.7,0.5,0.4,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5];
	return pops[retailer_no]


'''
ALLOCATION
1. retailer_allocate
2. assign_factory
'''


#creates a retailer for factory fac1 and its opponent factory
def retailer_allocate(fac1, zone, unlocked, retailer_no):
	#create the retailer
	ret = retailers(zone = zone, unlocked=unlocked)
	ret.save()

	fac_fac_relation = factory_factory.objects.get(fac1=fac1)
	fac2 = fac_fac_relation.fac2

	pop = calculate_popularity(retailer_no)
	#create the factory-retailer link
	fac_ret_relation = factory_retailer(fid = fac1, rid = ret, popularity = pop)
	fac_ret_relation.save()

	fac_ret_relation = factory_retailer(fid = fac2, rid = ret, popularity = 1-pop)
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
			fac1 = factories(money = get_initial_money(), inventory = get_initial_inventory())
			fac1.save()

			cap1 = capacity(fid=fac1, turn=1, capacity=get_initial_capacity())
			cap1.save()
			#link the factory with the user
			user.factory = fac1
			user.save()
			#create user's opponent factory with money=10000
			fac2 = factories(money = get_initial_money(), inventory = get_initial_inventory())
			fac2.save()
			cap2 = capacity(fid=fac2, turn=1, capacity=get_initial_capacity())
			cap2.save()
			#link the factories
			fac_fac_relation = factory_factory(fac1 = fac1, fac2 = fac2)
			fac_fac_relation.save()

			for zone in range(1,6):
				for i in range(0,3):
					if zone==1:
						retailer_allocate(fac1, zone, 1, (zone-1)*3+i)
					else:
						retailer_allocate(fac1, zone, 0, (zone-1)*3+i)

			return JsonResponse({"status":"200","data":{"description":"Successfully allocated Factories and Retailers"}})
		else:
			#The facrtory has been set already
			return JsonResponse({"status":"101","data":{"description":"Factory and Retailers have already been Allocated for "+user.email}})
	else:
		#The user is not authorized or logged in.
		return JsonResponse({"status":"100","data":{"description":"Failed! Wrong type of request"}})


'''
ANY TIME FUNCTIONS
1. getStatus
2. facDetails
3. map
'''

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
			data["description"] = "Success"
			fact1['fcode'] = factory1.fcode
			fact1["money"] = factory1.money
			fact1["capacity"] = capacity1.capacity
			fact1["inventory"] = factory1.inventory
			data["factory_1"] = fact1
			fact2['fcode'] = factory2.fcode
			fact2["money"] = factory2.money
			fact2["capacity"] = capacity2.capacity
			fact2["inventory"] = factory2.inventory
			data["factory_2"] = fact2
			json["data"] = data
			return JsonResponse(json)
	else:
		return JsonResponse({"status":"100", "data":{"description":"Failed! Wrong type of request"}})


@csrf_exempt
@decorator_from_middleware(middleware.SessionPIDAuth)
def map(request):
	if request.method == 'POST':
		id = request.POST.get("user_id")
		try:
			user  = users.objects.get(pk=id)
		except users.DoesNotExist:
			return JsonResponse({"status":"103", "data":{"description":"Failed! User does not exist"}})
			user = None
		
		if id and user:
			user_fac = factories.objects.get(pk=user.factory_id)
			
			opponents = factory_factory.objects.filter(fac1_id=user.factory_id)
			fcode = []
			fcode.append(user_fac.fcode)
			for opponent in opponents:
				opponent_fac = factories.objects.get(pk=opponent.fac2_id)
				fcode.append(opponent_fac.fcode) 

			retailers1 = factory_retailer.objects.filter(fid_id=user.factory_id)
			rcode = []
			zone = []
			unlocked = []
			for retailer in retailers1:
				retailer_details = retailers.objects.get(pk=retailer.rid_id)
				rcode.append(retailer_details.rcode)
				zone.append(retailer_details.zone)
				unlocked.append(retailer_details.unlocked)
			
			json={}
			json["status"] = "200"
			data = {}
			data["fcode"] = fcode
			data["rcode"] = rcode
			json["data"] = data
			json["zone"] = zone
			json["unlocked"] = unlocked
			return JsonResponse(json)
	else:
		return JsonResponse({"status":"100", "data":{"description":"Failed! Wrong type of request"}})

'''
TURN & STAGE BASED OPERATIONS
1. getDemand (Turn, Stage = 0)
	-calculate_demand(utility function)
2. viewDemand (Turn, Stage = 1)
3. supply(Turn, Stage = 1)
4. viewDemandSupply (Turn, Stage = 2)
5. placeOrder(Turn, Stage = 2)
6. update_selling_price(Turn, Stage=)
7. updateValues(Turn, stage = 3)


'''

@csrf_exempt
@decorator_from_middleware(middleware.SessionPIDAuth)
def get_demand(request):
	if request.method == 'POST':
		id = request.POST.get("user_id")
		try:
			user  = users.objects.get(pk=id)
		except users.DoesNotExist:
			return JsonResponse({"status":"103", "data":{"description":"Failed! User does not exist"}})
			user = None
		if id and user:
			turn = request.POST.get("turn")
			stage = request.POST.get("stage")
			if(not (stage) or not (turn)):
				return JsonResponse({"status":"104", "data":{"description":"Invalid request parameters. user_id,turn and stage should be provided."}})
			else:
				if((turn != str(status.objects.get(pid = id).turn)) or (stage != str(status.objects.get(pid = id).stage)) or stage!="0"):
					return JsonResponse({"status":"105", "data":{"description":"Turn or Stage mismatch."}})
				else:
					factory = user.factory
					frids = factory_retailer.objects.filter(fid = factory).values_list('frid', flat = True)
					unlocked_frids = unlocked_ret(frids, user.factory_id)
					json={}
					json["status"] = 200
					data={}
					demand = []
					#get the demand from the algo foreach retailer
					for frid in unlocked_frids:
						retailer_demand = dummy_algo.calculate_demand(frid,turn)
						demand.append(retailer_demand)
						fac_ret = factory_retailer.objects.get(pk=frid)
						fr_demand = fac_ret_demand( frid = fac_ret, turn = turn,quantity = retailer_demand)
						fr_demand.save()
					data["description"] = "Success"
					data["demand"] = demand
					json["data"] = data

					# increment the stage of the user
					stat = status.objects.get(pid = id)
					stat.stage = stat.stage+1
					stat.save()

					return JsonResponse(json)
	else:
		return JsonResponse({"status":"100", "data":{"description":"Failed! Wrong type of request"}})

def calculate_demand(frid,turn):
	return 100

@csrf_exempt
@decorator_from_middleware(middleware.SessionPIDAuth)
def viewDemand(request):
	if request.method == 'POST':
		id = request.POST.get("user_id")
		try:
			user  = users.objects.get(pk=id)
		except users.DoesNotExist:
			return JsonResponse({"status":"103", "data":{"description":"Failed! User does not exist"}})
			user = None
		if id and user:
			turn = request.POST.get("turn")
			stage = request.POST.get("stage")
			if(not (stage) or not (turn)):
				return JsonResponse({"status":"104", "data":{"description":"Invalid request parameters. user_id,turn and stage should be provided."}})
			else:
				if((turn != str(status.objects.get(pid = id).turn)) or (stage != str(status.objects.get(pid = id).stage)) or stage!="1"):
					return JsonResponse({"status":"105", "data":{"description":"Turn or Stage mismatch."}})
				else:
					factory = user.factory
					frids = factory_retailer.objects.filter(fid = factory).values_list('frid', flat = True)
					json={}
					json["status"] = 200
					data={}
					demand = []
					for frid in frids:
						fac_ret = factory_retailer.objects.get(pk=frid)
						fr_demand = fac_ret_demand.objects.get(frid=fac_ret, turn=turn)
						demand.append(fr_demand.quantity)
					data["description"] = "Success"
					data["demand"] = demand
					json["data"] = data

					return JsonResponse(json)
	else:
		return JsonResponse({"status":"100", "data":{"description":"Failed! Wrong type of request"}})

@csrf_exempt
@decorator_from_middleware(middleware.SessionPIDAuth)
def supply(request):
	
	if request.method == 'POST':
		id = request.POST.get("user_id")
		try:
			user  = users.objects.get(pk=id)
		except users.DoesNotExist:
			return JsonResponse({"status":"103", "data":{"description":"Failed! User does not exist"}})
			user = None
		
		if id and user:
			turn = request.POST.get("turn")
			stage = request.POST.get("stage")
			
			if(not (stage) or not (turn)):
				return JsonResponse({"status":"104", "data":{"description":"Invalid request parameters. user_id,turn and stage should be provided."}})
			else:
				stat = status.objects.get(pid = id)
				if((turn != str(stat.turn)) or (stage != str(stat.stage)) or stage !="1"):
					return JsonResponse({"status":"105", "data":{"description":"Turn or Stage mismatch."}})
				else:
					factory = user.factory
					quantity1 = request.POST.get("quantity").split(',')
					quantity_sum = 0
					for q in quantity1:
				 		if not(q.isdigit()):
				 			return JsonResponse({"status":"106", "data":{"description":"Invalid Quantity. Quantity must be an integer"}})
				 		quantity_sum += int(q)
				 	
				 	if quantity_sum > factory.inventory:
				 		return JsonResponse({"status":"107", "data":{"description":"Invalid Quantity. supply must be less than inventory"}})
				 		
					frids = factory_retailer.objects.filter(fid = factory).values_list('frid', flat = True)
					unlocked_frids = unlocked_ret(frids, user.factory_id)
					demands = fac_ret_demand.objects.filter(frid_id__in = unlocked_frids, turn = stat.turn)
					if len(demands) != len(quantity1):
						return JsonResponse({"status":"108", "data":{"description":"Supply Demand mismatch."}})
					else:
						i=0
						for demand in demands:
					 		
					 		if int(quantity1[i]) > demand.quantity:
					 			return JsonResponse({"status":"109", "data":{"description":"Invalid supply quantity. Supply should not be greater than demand"}})
					 		i=i+1
					 	i=0				 		
					 	for demand in demands:
					 		supply_value = fac_ret_supply(turn = int(turn), quantity = int(quantity1[i]), frid_id = demand.frid_id )
					 		supply_value.save()
					 		i=i+1
						dummy_algo.calculate_supply(factory.fid,int(turn))
						money.moneySupply(factory.fid, quantity_sum, int(turn))
						inventory.decrease(factory.fid, quantity_sum, int(turn))
						stat.stage = stat.stage+1
						stat.save()
						return JsonResponse({"status":"200", "data":{"description":"Success"}})

	else:
		return JsonResponse({"status":"100", "data":{"description":"Failed! Wrong type of request"}})

@csrf_exempt
@decorator_from_middleware(middleware.SessionPIDAuth)
def viewDemandSupply(request):
	if request.method == 'POST':
		id = request.POST.get("user_id")
		try:
			user  = users.objects.get(pk=id)
		except users.DoesNotExist:
			return JsonResponse({"status":"103", "data":{"description":"Failed! User does not exist"}})
			user = None
		if id and user:
			turn = request.POST.get("turn")
			stage = request.POST.get("stage")
			if(not (stage) or not (turn)):
				return JsonResponse({"status":"104", "data":{"description":"Invalid request parameters. user_id,turn and stage should be provided."}})
			else:
				if((turn != str(status.objects.get(pid = id).turn)) or (stage != str(status.objects.get(pid = id).stage)) or stage!="2"):
					return JsonResponse({"status":"105", "data":{"description":"Turn or Stage mismatch."}})
				else:
					factory = user.factory
					frids = factory_retailer.objects.filter(fid = factory).values_list('frid', flat = True)
					json={}
					json["status"] = 200
					data={}
					demand = []
					supply = []
					for frid in frids:
						fac_ret = factory_retailer.objects.get(pk=frid)
						fr_demand = fac_ret_demand.objects.get(frid=fac_ret, turn=turn)
						demand.append(fr_demand.quantity)
						fr_supply = fac_ret_supply.objects.get(frid=fac_ret, turn=turn)
						supply.append(fr_supply.quantity)
					data["description"] = "Success"
					data["demand"] = demand
					data["supply"] = supply
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
			if stage != 2:									# current stage should be == 1
				return JsonResponse({'status':'105', 'data':{'description':'Turn or stage mismatch'}})

			try:
				quantity1 = request.POST['quantity']
				if not(quantity1.isdigit()):
					return JsonResponse({"status":"106","data":{"description":"Invalid Quantity. It must be a number"}})
				quantity = int(quantity1)
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
			money.moneyPlaceOrder(factory.fid, quantity, int(turn))
			inventory.increase(factory.fid, quantity, int(turn))
			# move to next stage of the current turn
			cur_status.turn=turn+1
			cur_status.stage = 0
			cur_status.save()

			return JsonResponse({"status":"200","data":{"description":"Successfully placed the order"}})
		else:
			return JsonResponse({"status":"100","data":{"description":"Failed! Wrong type of request"}})
	else:
		return JsonResponse({"status":"100","data":{"description":"Failed! Wrong type of request"}})

	
@csrf_exempt
@decorator_from_middleware(middleware.SessionPIDAuth)
def updateSellingPrice(request):
	if request.method == 'POST':
		id = request.POST.get("user_id")
		try:
			user  = users.objects.get(pk=id)
		except users.DoesNotExist:
			return JsonResponse({"status":"103", "data":{"description":"Failed! User does not exist"}})
			user = None
		if id and user:
			turn = request.POST.get("turn")
			stage = request.POST.get("stage")
			sp = request.POST.get("selling_price")
			if(not (stage) or not (turn) or not(sp)):
				return JsonResponse({"status":"104", "data":{"description":"Invalid request parameters. user_id,turn,stage,selling prices should be provided."}})
			else:
				if((turn != str(status.objects.get(pid = id).turn)) or (stage != str(status.objects.get(pid = id).stage)) or stage!="4"):
					return JsonResponse({"status":"105", "data":{"description":"Turn or Stage mismatch."}})
				else:
					sp_list1 = sp.split(',')
					sp_list2 = [s for s in sp_list1 if s.isdigit()]
					sp_list2 = [int(s) for s in sp_list2]
					sp_details = get_sp_details()
					sp_range = range(sp_details["base"]-sp_details["range"],sp_details["base"]+sp_details["range"]+1)
					sp_list2 = [s for s in sp_list2 if s in sp_range]
					sp_length1 = len(sp_list1)
					sp_length2 = len(sp_list2)
					factory = user.factory
					frids = factory_retailer.objects.filter(fid = factory).values_list('frid', flat = True)
					frid_length = len(frids)
					if(sp_length1 != frid_length or sp_length2 !=frid_length):
						return JsonResponse({"status":"106", "data":{"description":"Invalid Selling Prices Array."}})
					for i in range(0,sp_length2):
						fr = factory_retailer.objects.get(pk = frids[i])
						sp = selling_price(frid = fr,turn = turn,selling_price = sp_list2[i])
						sp.save()
					json = {}
					json["status"] = 200
					data = {}
					data["description"] = "Successfully Updated Selling Prices for all retailers"
					json["data"] = data

					# increment the stage of the user
					stat = status.objects.get(pid = id)
					stat.stage = stat.stage+1
					stat.save()
					return JsonResponse(json)
	else:
		return JsonResponse({"status":"100", "data":{"description":"Failed! Wrong type of request"}})



@csrf_exempt
@decorator_from_middleware(middleware.SessionPIDAuth)
def updateValues(request):
	
	if request.method == 'POST':
		id = request.POST.get("user_id")
		try:
			user  = users.objects.get(pk=id)
		except users.DoesNotExist:
			return JsonResponse({"status":"103", "data":{"description":"Failed! User does not exist"}})
			user = None
		
		if id and user:
			turn = request.POST.get("turn")
			stage = request.POST.get("stage")
			
			if(not (stage) or not (turn)):
				return JsonResponse({"status":"104", "data":{"description":"Invalid request parameters. user_id,turn and stage should be provided."}})
			else:
				stat = status.objects.get(pid = id)
				if((turn != str(stat.turn)) or (stage != str(stat.stage)) or stage !="3"):
					return JsonResponse({"status":"105", "data":{"description":"Turn or Stage mismatch."}})
				else:
					updates = request.POST.get("values").split(',')
					for u in updates:
				 		if not(u.isdigit()):
				 			return JsonResponse({"status":"106", "data":{"description":"Invalid value. It must be an integer"}})

															 		
					new_capacity = capacity(turn = int(turn), capacity = int(updates[0]) , fid_id = user.factory_id)
					new_capacity.save()
	
					stat.stage = stat.stage+1
					stat.save()
					return JsonResponse({"status":"200", "data":{"description":"Success"}})

	else:
		return JsonResponse({"status":"100", "data":{"description":"Failed! Wrong type of request"}})


'''
OTHERS
1. get_selling_price
'''

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

'''
FRONT END TEST FUNCTIONS
1. mapp
2. testmap
3. testhome
'''

def mapp(request):
	return render(request,"map_test.html")

def testmap(request):
	return render(request, "map_test.html")

def testhome(request):
	id = request.session["user_id"]
	user = users.objects.get(pid = id)
	return render(request, "index.html",{ "name" : user.name })
