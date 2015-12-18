from django.contrib import admin
from .models import users
from .models import factories
from .models import factory_factory
from .models import retailers
from .models import factory_retailer

admin.site.register(users)
admin.site.register(factories)
admin.site.register(factory_factory)
admin.site.register(retailers)
admin.site.register(factory_retailer)
