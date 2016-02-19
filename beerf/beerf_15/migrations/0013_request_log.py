# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-02-19 15:20
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('beerf_15', '0012_faqs'),
    ]

    operations = [
        migrations.CreateModel(
            name='request_log',
            fields=[
                ('lid', models.AutoField(primary_key=True, serialize=False)),
                ('request', models.CharField(blank=True, default=b'', max_length=500)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('uid', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='beerf_15.users')),
            ],
        ),
    ]
