import beerf_15
from beerf_15.models import *

def moneyDecrease (fid, amount, turn):
	fac = factories.objects.get(fid = fid)
	if fac.money < amount:
		raise ValueError("Not enough cash!")
	fac.money -= amount
	fac.save()
	log = money_log(turn = turn, money_change = -amount, fid = fac)
	log.save()
	return True

def moneyIncrease (fid, amount, turn):
	fac = factories.objects.get(fid = fid)
	fac.money += amount
	fac.save()
	log = money_log(turn = turn, money_change = amount, fid = fac)
	log.save()

def moneySupply (fid, units, turn):
	amount = units * 50
	moneyIncrease (fid, amount, turn)

def getMoneyForOrder():
	return 40

def moneyPlaceOrder (fid, units, turn):
	amount = units * getMoneyForOrder()
	print amount
	moneyDecrease (fid, amount, turn)

def moneyInventory (fid, units, turn):
	amount = units * 2
	moneyDecrease (fid, amount, turn)

def moneyUpdate(fid, level, turn):
	if level == 2:
		moneyDecrease (fid, 3000, turn)
	elif level == 3:
		moneyDecrease (fid, 5000, turn)

def getMoney(fid):
	fac = factories.objects.get(fid = fid)
	return fac.money

