# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-02-16 08:54
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('beerf_15', '0009_auto_20160214_1206'),
    ]

    operations = [
        migrations.AlterField(
            model_name='popularity_log',
            name='popularity',
            field=models.DecimalField(decimal_places=10, max_digits=11, null=True),
        ),
    ]