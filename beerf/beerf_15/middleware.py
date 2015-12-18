from django.shortcuts import redirect
import beerf_15
class UserAuth(object):
	def process_request(self, request):
		if 'user_id' not in request.session:
			return redirect(beerf_15.views.login)
		return None
