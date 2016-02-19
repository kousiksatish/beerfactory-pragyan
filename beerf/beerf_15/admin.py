from django.contrib import admin
from .models import *

admin.site.register(users)
admin.site.register(factories)
admin.site.register(factory_factory)
admin.site.register(retailers)
admin.site.register(factory_retailer)
admin.site.register(status)
admin.site.register(selling_price)
admin.site.register(capacity)
admin.site.register(fac_ret_demand)
admin.site.register(fac_ret_supply)
admin.site.register(factory_order)
admin.site.register(money_log)
admin.site.register(inventory_log)
admin.site.register(popularity_log)
admin.site.register(score)
admin.site.register(FAQs)


