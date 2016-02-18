# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('beerf_15', '0010_auto_20160216_0854'),
    ]

    operations = [
        migrations.AddField(
            model_name='score',
            name='opp_score',
            field=models.IntegerField(default=0),
        ),
    ]
