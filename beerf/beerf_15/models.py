from django.db import models
from django.forms import ModelForm
import uuid
from django.utils.encoding import python_2_unicode_compatible
# Create your models here.


@python_2_unicode_compatible
class factories(models.Model):
	fid = models.AutoField(primary_key=True)
	fcode = models.CharField(max_length=100, blank=True, unique=True, default = uuid.uuid4)
	money = models.IntegerField()
	def __str__(self):
		return str(self.fid) + " (" + self.fcode + ")"

@python_2_unicode_compatible
class users(models.Model):
	pid = models.AutoField(primary_key=True)
	name = models.CharField(max_length=150)
	email = models.EmailField()
	factory = models.ForeignKey(factories, null=True)
	def __str__(self):
		return str(self.name) + " (" + self.email + ")"

class status(models.Model):
	pid = models.OneToOneField(users)
	turn = models.IntegerField()
	stage = models.IntegerField()

@python_2_unicode_compatible
class retailers(models.Model):
	rid = models.AutoField(primary_key=True)
	rcode = models.CharField(max_length=100, blank=True, unique=True, default = uuid.uuid4)
	zone = models.IntegerField(null=True)
	def __str__(self):
		return str(self.rid) + " (" + self.rcode + ")"

class factory_order(models.Model):
	ord_id = models.AutoField(primary_key = True)
	fid = models.ForeignKey(factories)
	turn = models.IntegerField()
	quantity = models.IntegerField()

@python_2_unicode_compatible
class factory_retailer(models.Model):
	frid = models.AutoField(primary_key = True)
	fid = models.ForeignKey(factories)
	rid = models.ForeignKey(retailers)
	popularity = models.DecimalField(null=True,max_digits=11, decimal_places=10)
	def __str__(self):
		return str(self.frid) + " ( Factory-id: " + str(self.fid) + " - Retailer-id: "+str(self.rid)+")"

class capacity(models.Model):
	cid = models.AutoField(primary_key = True)
	fid = models.ForeignKey(factories)
	turn = models.IntegerField()
	capacity = models.IntegerField()

class selling_price(models.Model):
	spid = models.AutoField(primary_key = True)
	frid = models.ForeignKey(factory_retailer)
	turn = models.IntegerField()
	selling_price = models.IntegerField()

class fac_ret_demand(models.Model):
	did = models.AutoField(primary_key=True)
	frid = models.ForeignKey(factory_retailer)
	turn = models.IntegerField()
	quantity = models.IntegerField()

class fac_ret_supply(models.Model):
	sid = models.AutoField(primary_key=True)
	frid = models.ForeignKey(factory_retailer)
	turn = models.IntegerField()
	quantity = models.IntegerField()

@python_2_unicode_compatible
class factory_factory(models.Model):
	mid = models.AutoField(primary_key=True)
	fac1 = models.ForeignKey(factories, related_name="his_factory")
	fac2 = models.ForeignKey(factories, related_name="opponent")
	def __str__(self):
		return str(self.mid) + " ( Factory-id: " + self.fac1 + " - OppFactory-id: "+self.fac2+")"


class userForm(ModelForm):
    class Meta:
        model = users
        fields = ['name', 'email']

class userLoginForm(ModelForm):
	class Meta:
		model = users
		fields = ['email']

