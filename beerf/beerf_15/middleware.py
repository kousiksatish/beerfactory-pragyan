from django.shortcuts import redirect
import beerf_15
from beerf_15.models import *
from django.http import JsonResponse,HttpResponseRedirect

class UserAuth(object):
	def process_request(self, request):
		if 'user_id' not in request.session:
			return redirect(beerf_15.views.login)
		return None

class SessionPIDAuth(object):
	def process_request(self, request):
		if 'user_id' not in request.session:
			id = request.session.get("user_id")
			return JsonResponse({"status":"101", "data":{"description":"Failed! Session not set"}})
		if 'user_id' not in request.POST:
			return JsonResponse({"status":"100", "data":{"description":"Failed! Wrong Request"}})
		if(int(request.session.get('user_id')) != int(request.POST.get("user_id"))):
		 	return JsonResponse({"status":"102", "data":{"description":"Failed! Session mismatch"}})
		user = users.objects.get(pk=request.session['user_id'])
		if user.factory:
			turn = status.objects.get(pid=user).turn
			params = []
			params.append(request.path_info)
			params.append(request.body)
		 	parameters = ",".join(params)
			request_logger = request_log(request = parameters, uid = user)
			request_logger.save()
			if(turn>25):
				return redirect(beerf_15.views.review)
		return None

class loggedIn(object):
	def process_request(self, request):
		if 'user_id' not in request.session:
			return redirect(beerf_15.views.login)

