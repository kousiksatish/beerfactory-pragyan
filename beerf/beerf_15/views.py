from django.shortcuts import render
from django.http import HttpResponseRedirect

# Create your views here.

from .models import userForm

def register(request):
	if request.method == 'POST':
		form = userForm(request.POST)
		if form.is_valid():
			form.save()
			return HttpResponseRedirect('/thanks/')

	else:
		form = userForm()

	return render(request, "register.html", {"form" : form})

def thanks(request):
	return render(request, "thanks.html")