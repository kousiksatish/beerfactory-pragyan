from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import redirect
from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist
from beerf_15 import middleware
import beerf_15
from django.utils.decorators import decorator_from_middleware
from beerf_15.models import *
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from beerf_algo.beerf_algo import algo as algo
from utilities import money
from utilities import inventory
from django.db.models import Sum
from django.db.models import Max
import random
import urllib
import json
from operator import itemgetter
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
'''
INITIAL FUNCTIONS
1. /register
2. /login
3. /logout
4. /home
'''

def register(request):
	if request.method == 'POST':
		form = userForm(request.POST)
		if form.is_valid():
			new_user = form.save()
			request.session["user_id"] = new_user.pid
			return redirect(beerf_15.views.home)
	else:
		form = userForm()
		return redirect(beerf_15.views.home)
	
def login(request,error=''):
	if request.method == 'POST':
		email = request.POST.get('email')
		password = request.POST.get('password')
		post_data = [('user_email',email), ('user_pass',password), ('event_id','34')]

		result = urllib.urlopen('https://api.pragyan.org/user/eventauth', urllib.urlencode(post_data))

		response = result.read()	

		res = json.loads(response)
		print res['status']
		if res['status']==0:
			return render(request, "login.html", {"error" : res['data']})
		elif res['status']==3:
			return render(request, "login.html", {"error" : 'Oh! You have not yet registered for the fun. Please register at <a href="http://prgy.in/beerf">prgy.in/beerf</a>'})

		try:
			user = users.objects.get(email = email)
		except users.DoesNotExist:			
			post_data = [('user_email',email), ('user_pass',password)]
			result = urllib.urlopen('https://api.pragyan.org/user/getDetails', urllib.urlencode(post_data))
			response = result.read()
			res = json.loads(response)
			if(res['status'] != 2):
				return render(request, "login.html", {"error" : 'There has been an error :( Please come back in sometime...'})
			user = users(prag_userid = res['data']['user_id'], prag_username = res['data']['user_name'], prag_fullname = res['data']['user_fullname'], email = res['data']['user_email'])
			user.save()

		request.session['user_id'] = user.pid
		return redirect(beerf_15.views.home)

	else:
		if 'user_id' not in request.session:
			return render(request, "login.html")
		else:
			return redirect(beerf_15.views.home)

@decorator_from_middleware(middleware.loggedIn)
def home(request):
	id = request.session["user_id"]
	user  = users.objects.get(pk=id)
	if user.factory:
		return redirect(beerf_15.views.testhome)
	return render(request, "home.html", {"name" : user.prag_fullname})

def logout(request):
	request.session.flush()
	return redirect(beerf_15.views.login)


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

#@csrf_exempt
#@decorator_from_middleware(middleware.SessionPIDAuth)
def unlockRetailers(id,turn,stage):
	#if request.method == 'POST':
		#id = request.POST.get("user_id")
	try:
		user  = users.objects.get(pk=id)
	except users.DoesNotExist:
		return 103 #return JsonResponse({"status":"103", "data":{"description":"Failed! User does not exist"}})
		user = None
	if id and user:
			#turn = request.POST.get("turn")
			#stage = request.POST.get("stage")			
		if(not (turn) or not (stage)):
			return 104 #return JsonResponse({"status":"104", "data":{"description":"Invalid request parameters. user_id,turn and stage should be provided."}})
		else:
			stat = status.objects.get(pid = id)
			if((turn != str(stat.turn)) or (stage != str(stat.stage)) or stage !="3"):
				return 105 #return JsonResponse({"status":"105", "data":{"description":"Turn or Stage mismatch"}})
			if(int(turn) % 5 != 0):
					return 106 #return JsonResponse({"status":"106", "data":{"description":"Invalid Turn."}})
			else:
				factory = user.factory
				zone = int(turn)/5 +1
				rids = factory_retailer.objects.filter(fid = factory).values_list('rid_id', flat = True)
				rets = retailers.objects.filter(rid__in = rids, zone = zone)
				for ret in rets:
					ret.unlocked = 1
					ret.save()
				return 200 #return JsonResponse({"status":"200", "data":{"description":"success.retailers unlocked."}})
	#else:
		#return JsonResponse({"status":"100", "data":{"description":"Failed! Wrong type of request"}})

#@csrf_exempt
#@decorator_from_middleware(middleware.SessionPIDAuth)
def updateInventory(id,turn,stage):
	
	#if request.method == 'POST':
		#id = request.POST.get("user_id")
	try:
		user  = users.objects.get(pk=id)
		
	except users.DoesNotExist:
		return JsonResponse({"status":"103", "data":{"description":"Failed! User does not exist"}})
		user = None
	if id and user:
			#turn = request.POST.get("turn")
			#stage = request.POST.get("stage")			
		if(not (turn) or not (stage)):
			return 104 #return JsonResponse({"status":"104", "data":{"description":"Invalid request parameters. user_id,turn and stage should be provided."}})
		else:
			stat = status.objects.get(pid = id)
			if((turn != str(stat.turn)) or (stage != str(stat.stage)) or stage !="3"):
				return 105 #return JsonResponse({"status":"105", "data":{"description":"Turn or Stage mismatch"}})
			else:
				factory = user.factory
				order = factory_order.objects.get(fid_id = factory.fid, turn = turn)
				inventory.increase(factory.fid, order.quantity, int(turn))
				return 200 #return JsonResponse({"status":"200", "data":{"description":"success.Inventory updated."}})
	#else:
		#return JsonResponse({"status":"100", "data":{"description":"Failed! Wrong type of request"}})


'''
ALLOCATION
1. retailer_allocate
2. assign_factory
'''


#creates a retailer for factory fac1 and its opponent factory
def retailer_allocate(fac1, zone, unlocked, retailer_no):
	#create the retailer
	rcodes = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O']
	retDetails = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O']
	initial_demands = [[70,75,80][random.randint(0,2)] for i in range(2)]
	ret = retailers(rcode = rcodes[retailer_no], zone = zone, details = retDetails[retailer_no], unlocked=unlocked)
	ret.save()

	fac_fac_relation = factory_factory.objects.get(fac1=fac1)
	fac2 = fac_fac_relation.fac2

	#create the factory-retailer link
	fac_ret_relation = factory_retailer(fid = fac1, rid = ret, popularity = 1)
	fac_ret_relation.save()
	demand_turn = (zone-1)*5
	user_demand = fac_ret_demand(frid=fac_ret_relation,turn=demand_turn,quantity = initial_demands[0])
	user_demand.save()
	fac_ret_relation = factory_retailer(fid = fac2, rid = ret, popularity = 1)
	fac_ret_relation.save()
	opponent_demand = fac_ret_demand(frid=fac_ret_relation,turn=demand_turn,quantity = initial_demands[1])
	opponent_demand.save()

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
			#initialise status table (stage=0, turn=1)
			stat = status(pid = user, turn = 1, stage = 0)
			stat.save()
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
4. getPopularity
5. restart
6. history
7. getCapacityDetails
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
			capacity1 = capacity.objects.get(fid = factory1.fid,turn = turn)
			points = score.objects.filter(pid = user).aggregate(Sum('score'))['score__sum']
			if not points:
				points = 0
			json = {}
			json["status"] ="200"
			data = {}
			fact1={}
			data["description"] = "Success"
			fact1['fcode'] = factory1.fcode
			fact1["money"] = factory1.money
			fact1["capacity"] = capacity1.capacity
			fact1["inventory"] = factory1.inventory
			fact1["score"] = points
			fact1["next_upgrade_capacity"] = algo.calculate_next_capacity(capacity1.capacity)
			fact1["upgrade_cost"] = algo.calculate_money(capacity1.capacity)
			data["factory_1"] = fact1
			# fact2['fcode'] = factory2.fcode
			# fact2["money"] = factory2.money
			# fact2["capacity"] = capacity2.capacity
			# fact2["inventory"] = factory2.inventory
			# data["factory_2"] = fact2
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
			user = users.objects.get(pk=id)
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
			popularity = []
			opp_popularity = []
			opopularity = []
			unlocked = []
			for retailer in retailers1:
				retailer_details = retailers.objects.get(pk=retailer.rid_id)
				rcode.append(retailer_details.rcode)
				zone.append(retailer_details.zone)
				unlocked.append(retailer_details.unlocked)
				popularity.append(retailer.popularity)
			
			retailers1 = factory_retailer.objects.filter(fid=opponents[0].fac2)
			for retailer in retailers1:
				opp_popularity.append(retailer.popularity)
			json={}
			json["status"] = "200"
			data = {}
			data["fcode"] = fcode
			data["rcode"] = rcode
			data["popularity"] = popularity
			data["opopularity"] = opp_popularity
			json["data"] = data
			json["zone"] = zone
			json["unlocked"] = unlocked
			return JsonResponse(json)
	else:
		return JsonResponse({"status":"100", "data":{"description":"Failed! Wrong type of request"}})

@csrf_exempt
@decorator_from_middleware(middleware.SessionPIDAuth)
def getPopularity(request):
	'''
		Returns popularity of each factory with each retailer.
	'''
	if request.method == 'POST':
		id = request.POST.get("user_id")
		try:
			user = users.objects.get(pk=id)
		except users.DoesNotExist:
			return JsonResponse({"status":"103", "data":{"description":"Failed! User does not exist"}})
			user = None
		
		# after all verification is done.	
		if id and user:
			fid = int(factories.objects.get(pk=user.factory_id).fid)
			fac_rets = factory_retailer.objects.filter(fid=fid)
			popularities = dict()
			for retailer in fac_rets:
				popularities[str(retailer.rid.rid)] = str(retailer.popularity)
			return JsonResponse({'status':'200','data':popularities})
	else:
		return JsonResponse({"status":"100", "data":{"description":"Failed! Wrong type of request"}})

@csrf_exempt
@decorator_from_middleware(middleware.SessionPIDAuth)
def restart(request):
	'''
		Restarts the user's game by deleting all his data from the DB.
		Deletion process(proper order of deleting):
			* Get pid, and then fid. 
			* Make factory field=NULL in users model.
			* For the fid, get the opponent factory fid from factory_factory
			* Delete the fid from factory_factory model, delete fid, opp_fid from factory model
			* Delete status of user using pid.
			* Delete factory orders using fid,opp_fid
			* Using fid, opp_fid get the factory's retailers' rid,frid in factory_retailer model.
			* Using frid, delete rows from fac_ret_demand,fac_ret_supply,selling_price models.
			* Using rid delete retailers in retailers model and in factory_retailer model. 
			* Using fid,opp_fid, delete factory capacity, money_log, inventory_log
	'''
	if request.method == 'POST':
		id = request.POST.get("user_id")
		try:
			user = users.objects.get(pk=id)
		except users.DoesNotExist:
			return JsonResponse({"status":"103", "data":{"description":"Failed! User does not exist"}})
			user = None
		
		# after all verification is done.
		if id and user:
			fid = user.factory
			user.factory = None
			user.save()

			try:
				opp_fid = factory_factory.objects.get(fac1=fid).fac2
				factory_factory.objects.get(fac1=fid).delete()
				factories.objects.get(fid=fid.fid).delete()
				factories.objects.get(fid=opp_fid.fid).delete()
			except ObjectDoesNotExist:
				return JsonResponse({"status":"109", "data":{"description":"User already in a new state!"}}) 

			status.objects.filter(pid=id).delete()
			fac_rets = factory_retailer.objects.filter(Q(fid=fid)|Q(fid=opp_fid))
			frids = [ret.frid for ret in fac_rets]
			rids = [ret.rid for ret in fac_rets]
			fac_rets.delete()

			for frid in frids:
				fac_ret_demand.objects.filter(frid=frid).delete()
				fac_ret_supply.objects.filter(frid=frid).delete()
				selling_price.objects.filter(frid=frid).delete()
			for rid in rids:
				retailers.objects.filter(rid=rid).delete()

			capacity.objects.filter(Q(fid=fid)|Q(fid=opp_fid)).delete()
			money_log.objects.filter(Q(fid=fid)|Q(fid=opp_fid)).delete()
			inventory_log.objects.filter(Q(fid=fid)|Q(fid=opp_fid)).delete()
			score.objects.filter(pid = user).delete()
			return JsonResponse({"status":"200", "data":{"description":"Success!"}})
	else:
		return JsonResponse({"status":"100", "data":{"description":"Failed! Wrong type of request"}})

@csrf_exempt
@decorator_from_middleware(middleware.SessionPIDAuth)
def history(request):
	'''
		Returns the user's game moves history by retrieving all his data from the DB.
		Retrieves from:
			* fac_ret_demand
			* fac_ret_supply
			* factory_order
		Returns as:
		history = 
		{
			'status':'200',
			'data': {
				#turn_no_1 : {
					'supply':
					'demand':
					'order':
				}
				#turn_no_2:{
				....
				...
				}
				...
				..
			}
		}
	'''
	if request.method == 'POST':
		id = request.POST.get("user_id")
		try:
			user = users.objects.get(pk=id)
		except users.DoesNotExist:
			return JsonResponse({"status":"103", "data":{"description":"Failed! User does not exist"}})
			user = None
		
		# after all verification is done.
		if id and user:
			fid = user.factory
			history = dict()
			frids = [f.frid for f in factory_retailer.objects.filter(fid=fid)]
			unlocked_frids = unlocked_ret(frids, fid)
			fac_ret_demands = [fac_ret_demand.objects.filter(frid=frid) for frid in unlocked_frids]
			# fac_ret_demands.reverse()
			for fac_ret in fac_ret_demands:
				for demand in fac_ret:
					zone = int(demand.frid.rid.zone)
					turn = int(demand.turn)
					print turn
					if turn > (zone-1)*5:
						quantity = int(demand.quantity)
						if turn not in history:
							history[turn] = dict()
							history[turn]['demand'] = []
							history[turn]['supply'] = []
						history[turn]['demand'].append(quantity)
			fac_ret_supplies = [fac_ret_supply.objects.filter(frid=frid) for frid in unlocked_frids]
			for fac_ret in fac_ret_supplies:
				for supply in fac_ret:
					zone = int(supply.frid.rid.zone)
					turn = int(supply.turn)
					if turn > (zone-1)*5:
						quantity = int(supply.quantity)
						history[turn]['supply'].append(quantity)
			factory_orders = factory_order.objects.filter(fid=fid)
			for order in factory_orders:
				turn = int(order.turn)
				history[turn]['order'] = int(order.quantity)

			
			return JsonResponse({"status":"200", "data":{"description":"Success","history":history}})
	else:
		return JsonResponse({"status":"100", "data":{"description":"Failed! Wrong type of request"}})

@csrf_exempt
@decorator_from_middleware(middleware.SessionPIDAuth)
def getCapacityDetails(request):
	id = request.POST.get("user_id")
	try:
		user = users.objects.get(pk=id)
	except users.DoesNotExist:
		return JsonResponse({"status":"103", "data":{"description":"Failed! User does not exist"}})
		user = None
	if id and user:
		stat = status.objects.get(pid = id)
		cur_capacity = capacity.objects.get(fid = user.factory, turn = stat.turn).capacity
		next_upgrade_capacity = algo.calculate_next_capacity(cur_capacity)
		upgrade_cost = algo.calculate_money(cur_capacity)
		json = {}
		json["status"] = 200
		data = {}
		data["current_capacity"] = cur_capacity
		data["next_upgrade_capacity"] = next_upgrade_capacity
		data["upgrade_cost"] = upgrade_cost
		json["data"] = data
		return JsonResponse(json)

'''
TURN & STAGE BASED OPERATIONS
1. getDemand (Turn, Stage = 0)
	-calculate_demand(utility function)
2. viewDemand (Turn, Stage = 1)
3. supply(Turn, Stage = 1)
4. viewDemandSupply (Turn, Stage = 2)
5. placeOrder(Turn, Stage = 2)
6. update_selling_price(Turn, Stage=)
7. updateCapacity(Turn, stage = 3)


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
						retailer_demand = algo.calculate_demand(frid,turn)
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
					unlocked_frids = unlocked_ret(frids, user.factory_id)
					json={}
					json["status"] = 200
					data={}
					demand = []
					for frid in unlocked_frids:
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
				 	inventoryCost = (factory.inventory - quantity_sum )* 2
				 	cur_money = (quantity_sum * 50) + factory.money
				 	if inventoryCost > cur_money:
				 		return JsonResponse({"status":"102", "data":{"description":"Invalid Quantity. Insufficient money to bear Inventory cost, Increase Supply amount. "}})	
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
						algo.calculate_supply(factory.fid,int(turn))
						money.moneySupply(factory.fid, quantity_sum, int(turn))
						inventory.decrease(factory.fid, quantity_sum, int(turn))
						money.moneyInventory(factory.fid, factory.inventory-quantity_sum, int(turn))
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
					frids = unlocked_ret(frids,factory)
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
				return JsonResponse({"status":"104","data":{"description":"Invalid request parameters. user_id,turn,stage,quantity should be provided."}})
			if not valid_turn_and_stage:
				return JsonResponse({'status':'105', 'data':{'description':'Turn or stage mismatch'}})
			factory = user.factory
			cur_capacity = int(capacity.objects.get(fid=factory,turn=turn).capacity)
			if quantity > cur_capacity:
				return JsonResponse({"status":"106","data":{"description":"Quantity exceeded capacity of the factory"}})
			# create the new order in the DB
			new_order = factory_order(fid=factory,turn=turn,quantity=quantity)
			new_order.save()
			try:
				money.moneyPlaceOrder(factory.fid, quantity, int(turn))
				#calculate the order of the simulated factory
				algo.calculate_order(factory,int(turn))
			except ValueError as err:
				new_order.delete()
				return JsonResponse({"status":"111","data":{"description":str(err)}})
			#calculate the order of the simulated factory
			# move to next stage of the current turn
			
			cur_status.stage = stage+1
			cur_status.save()

			result1 = updateInventory(str(id), str(turn), str(3))
			result2 = 200
			if int(turn) % 5 == 0 :
				result2 =unlockRetailers(str(id), str(turn), str(3))
			if result1 == 200 and result2 == 200:
				cur_status.turn=turn
				cur_status.stage = 3
				cur_status.save()
	
			
			return JsonResponse({"status":"200","data":{"description":"Successfully placed the order"}})

	
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
def updateCapacity(request):
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
					flag = request.POST.get("flag")
					cap_old = capacity.objects.get(turn = int(turn), fid_id = user.factory_id).capacity
					if(int(flag)==1):
						cost = algo.calculate_money(cap_old)
						if cost==0:
							return JsonResponse({"status":"107", "data":{"description":"No More Upgrades"}})
						cur_money = money.getMoney(user.factory_id)
						if(cur_money < cost):
							return JsonResponse({"status":"106", "data":{"description":"Not enough money for upgrade!"}})

						cap = capacity(turn = int(turn)+1 , fid_id = user.factory_id)
						cap.capacity = algo.calculate_next_capacity(cap_old)
						cap.save()
						money.moneyDecrease(user.factory_id, cost, int(turn))
					else:
						cap = capacity(turn = int(turn)+1,capacity=cap_old,fid_id=user.factory_id)
						cap.save()
					algo.calculate_capacity_upgrade(user.factory_id, int(turn))
					algo.calculate_score(user.factory,int(turn))
					stat.turn = int(turn) + 1
					stat.stage = 0
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


@decorator_from_middleware(middleware.loggedIn)
def testhome(request):
	id = request.session["user_id"]
	user = users.objects.get(pid = id)
	if user.factory:
		stat = status.objects.get(pid = user)
		if(stat.turn > 25):
			return redirect(beerf_15.views.review) 
		return render(request, "index.html",{ "name" : user.prag_fullname })
	return redirect(beerf_15.views.home)

def instructions(request):
	return render(request,"instructions.html")

def locked(request):
	return render(request, "locked.html")

def graph(request):
	if 'user_id' not in request.session:
		return redirect(beerf_15.views.login)
	user = users.objects.get(pk=request.session['user_id'])
	if not user.factory:
		return redirect(beerf_15.views.home)
	turn = status.objects.get(pid=user).turn
	if turn<=25:
		return redirect(beerf_15.views.testhome)
	user_id = request.session["user_id"]
	user = users.objects.get(pid = user_id)
	return render(request, "graph.html", {"name":user.prag_fullname, "user_id":user_id})

@csrf_exempt
@decorator_from_middleware(middleware.loggedInSession)
def graph_back(request):
	if request.method == 'POST':
		id = request.POST.get("user_id")
		try:
			user = users.objects.get(pk=id)
		except users.DoesNotExist:
			return JsonResponse({"status":"103", "data":{"description":"Failed! User does not exist"}})
			user = None
		
		# after all verification is done.
		if id and user:
			fid = user.factory
			retailers = dict
			demands = dict()
			supplies = dict()
			popularity = dict()
			frids = [f.frid for f in factory_retailer.objects.filter(fid=fid)]
			unlocked_frids = unlocked_ret(frids, fid)
			retailer = 0
			for frid in unlocked_frids:
				retailer=retailer+1
				demands[retailer] = []
				fac_ret_demands = [fac_ret_demand.objects.filter(frid=frid)]
				for fac_ret in fac_ret_demands:
					for demand in fac_ret:
						zone = int(demand.frid.rid.zone)
						turn = int(demand.turn)
						if turn > (zone-1)*5:
							new = dict()
							new['turn']=turn
							new['demand']=int(demand.quantity)
							demands[retailer].append(new)

			retailer = 0			
			for frid in unlocked_frids:
				retailer=retailer+1
				supplies[retailer] = []
				fac_ret_supplies = [fac_ret_supply.objects.filter(frid=frid)]
				for fac_ret in fac_ret_supplies:
					for supply in fac_ret:
						zone = int(supply.frid.rid.zone)
						turn = int(supply.turn)
						if turn > (zone-1)*5:
							demands[retailer][turn-(zone-1)*5-1]['supply'] = int(supply.quantity)
			opponent_fac = factory_factory.objects.get(fac1=fid).fac2
			retailers = dict
			demands2 = dict()
			frids = [f.frid for f in factory_retailer.objects.filter(fid=opponent_fac)]
			unlocked_frids = unlocked_ret(frids, opponent_fac)
			retailer = 0
			for frid in unlocked_frids:
				retailer=retailer+1
				demands2[retailer] = []
				fac_ret_demands = [fac_ret_demand.objects.filter(frid=frid)]
				for fac_ret in fac_ret_demands:
					for demand in fac_ret:
						zone = int(demand.frid.rid.zone)
						turn = int(demand.turn)
						if turn > (zone-1)*5:
							new = dict()
							new['turn']=turn
							new['demand']=int(demand.quantity)
							demands2[retailer].append(new)

			return JsonResponse({"status":"200", "data":{"history":demands,"opp_history":demands2}})
	else:
		return JsonResponse({"status":"100", "data":{"description":"Failed! Wrong type of request"}})

@decorator_from_middleware(middleware.SessionPIDAuth)
@csrf_exempt
def getScore(request):
	user_id = int(request.POST.get("user_id"))
	user = users.objects.get(pk=user_id)
	turn = int(request.POST.get("turn"))
	scr = score.objects.get(pid = user, turn = turn).score
	return JsonResponse({"status":"200", "data":{"description":"Success!","turn":turn,"score":scr}})

@decorator_from_middleware(middleware.SessionPIDAuth)
@csrf_exempt
def getTotalScore(request):
	user_id = int(request.POST.get("user_id"))
	user = users.objects.get(pk=user_id)
	scores = score.objects.filter(pid = user)
	sum_of_scores = 0
	for scr in scores:
		sum_of_scores += scr.score
	return JsonResponse({"status":"200", "data":{"description":"Success!","score":sum_of_scores}})

@decorator_from_middleware(middleware.loggedIn)
def review(request):
	user = users.objects.get(pk=request.session['user_id'])
	if not user.factory:
		return redirect(beerf_15.views.home)
	turn = status.objects.get(pid=user).turn
	if turn<=25:
		return redirect(beerf_15.views.testhome)
	scores_obj = score.objects.filter(pid = user)
	sum_of_scores = 0
	scores = []
	eachscr = dict()
	for scr in scores_obj:
		eachscr['turn'] = scr.turn
		eachscr['score'] = scr.score
		sum_of_scores += scr.score
		scores.append(scr)
	return render(request, "review.html", {"scores":scores, "total_score":sum_of_scores, "name":user.prag_fullname})

@csrf_exempt
def leaderBoard(request):
	#finding whether there is a logged in user
	try:
		logged_in_user = request.session["user_id"]
	except Exception, e:
		logged_in_user = None

	#Sum of scores of all rounds in descending order
	distinctUsers = score.objects.values_list('pid',flat = True).distinct()
	points = []
	for user in distinctUsers:
		details = users.objects.get(pk=user)
		points.append({'pid': user , 'score' : score.objects.filter(pid = user).aggregate(Sum('score'))['score__sum'] , 'name' : details.prag_fullname})
		
	highScores = sorted(points, key=itemgetter('score'), reverse=True)
	user_in_highscores = 0

	#add details like rank and no of turns played
	for highScore in highScores:
		# user_in_highscores += 1 if highScore['pid'] == logged_in_user else 0
		rounds = min(score.objects.filter(pid = highScore['pid']).aggregate(Max('turn'))['turn__max'],25)
		highScore['rounds'] = rounds
		highScore['rank'] = highScores.index(highScore) + 1
	paginator = Paginator(highScores, 10)
	page = request.GET.get('page')
	try:
		highScores = paginator.page(page)
	except PageNotAnInteger:
		# If page is not an integer, deliver first page.
		highScores = paginator.page(1)
	except EmptyPage:
		# If page is out of range (e.g. 9999), deliver last page of results.
		highScores = paginator.page(paginator.num_pages)
	#if the user is in the top 10 render the view
	if not logged_in_user:
		return render(request,'leaderboard.html',{'highScores':highScores})

	#if the user not in the top 10. Caluclate his rank and append to list to highscores and return
	user_details = users.objects.get(pk=logged_in_user)
	user_score_obj = {}
	user_score_obj['pid'] = logged_in_user
	user_score_obj['name'] = user_details.prag_fullname

	#calculate user score and rank. Set rank to '-' and rounds to '-' if he has not started playing.
	user_score = score.objects.filter(pid = logged_in_user).aggregate(Sum('score'))['score__sum']
	print "user score : ",user_score
	if user_score == None:
		user_rank = '-'
		user_rounds = '-'
		user_score = 0
	else:
		user_rounds = min(score.objects.filter(pid = highScore['pid']).aggregate(Max('turn'))['turn__max'],25)
		points = sorted(points, key=itemgetter('score'), reverse=True)
		user_rank = 1
		for point in points:
			if point['score'] > user_score or (point['score'] == user_score and logged_in_user > point['pid']):
				user_rank += 1;
			elif point['score'] < user_score:
				break
	user_score_obj['score'] = user_score
	user_score_obj['rank'] = user_rank
	user_score_obj['rounds'] = user_rounds

	return render(request,'leaderboard.html',{'highScores':highScores, 'userScore':user_score_obj})

#Query all the faqs and arrange them in desc order of their priority and paginate
@csrf_exempt
def FAQ(request):
	faqs = FAQs.objects.filter().order_by('-priority')
	paginator = Paginator(faqs, 10)
	page = request.GET.get('page')
	try:
		faqs = paginator.page(page)
	except PageNotAnInteger:
		# If page is not an integer, deliver first page.
		faqs = paginator.page(1)
	except EmptyPage:
		# If page is out of range (e.g. 9999), deliver last page of results.
		faqs = paginator.page(paginator.num_pages)
	return render(request,'faq.html',{'faqs':faqs})