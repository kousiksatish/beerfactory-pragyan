import beerf_15
from beerf_15.models import *

def decrease (fid, units, turn):
	fac = factories.objects.get(fid = fid)
	if fac.inventory < units:
		raise ValueError("Not enough units available")
	fac.inventory -= units
	fac.save()
	log = inventory_log(turn = turn, inventory_change = -units, fid = fac)
	log.save()

def increase (fid, units, turn):
	fac = factories.objects.get(fid = fid)
	fac.inventory += units
	fac.save()
	log = inventory_log(turn = turn, inventory_change = units, fid = fac)
	log.save()