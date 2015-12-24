# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='capacity',
            fields=[
                ('cid', models.AutoField(serialize=False, primary_key=True)),
                ('turn', models.IntegerField()),
                ('capacity', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='fac_ret_demand',
            fields=[
                ('did', models.AutoField(serialize=False, primary_key=True)),
                ('turn', models.IntegerField()),
                ('quantity', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='fac_ret_supply',
            fields=[
                ('sid', models.AutoField(serialize=False, primary_key=True)),
                ('turn', models.IntegerField()),
                ('quantity', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='factories',
            fields=[
                ('fid', models.AutoField(serialize=False, primary_key=True)),
                ('fcode', models.CharField(default=uuid.uuid4, unique=True, max_length=100, blank=True)),
                ('money', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='factory_factory',
            fields=[
                ('mid', models.AutoField(serialize=False, primary_key=True)),
                ('fac1', models.ForeignKey(related_name='his_factory', to='beerf_15.factories')),
                ('fac2', models.ForeignKey(related_name='opponent', to='beerf_15.factories')),
            ],
        ),
        migrations.CreateModel(
            name='factory_order',
            fields=[
                ('ord_id', models.AutoField(serialize=False, primary_key=True)),
                ('turn', models.IntegerField()),
                ('quantity', models.IntegerField()),
                ('fid', models.ForeignKey(to='beerf_15.factories')),
            ],
        ),
        migrations.CreateModel(
            name='factory_retailer',
            fields=[
                ('frid', models.AutoField(serialize=False, primary_key=True)),
                ('popularity', models.DecimalField(null=True, max_digits=11, decimal_places=10)),
                ('fid', models.ForeignKey(to='beerf_15.factories')),
            ],
        ),
        migrations.CreateModel(
            name='retailers',
            fields=[
                ('rid', models.AutoField(serialize=False, primary_key=True)),
                ('rcode', models.CharField(default=uuid.uuid4, unique=True, max_length=100, blank=True)),
                ('zone', models.IntegerField(null=True)),
            ],
        ),
        migrations.CreateModel(
            name='selling_price',
            fields=[
                ('spid', models.AutoField(serialize=False, primary_key=True)),
                ('turn', models.IntegerField()),
                ('selling_price', models.IntegerField()),
                ('frid', models.ForeignKey(to='beerf_15.factory_retailer')),
            ],
        ),
        migrations.CreateModel(
            name='status',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('turn', models.IntegerField()),
                ('stage', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='users',
            fields=[
                ('pid', models.AutoField(serialize=False, primary_key=True)),
                ('name', models.CharField(max_length=150)),
                ('email', models.EmailField(max_length=254)),
                ('factory', models.ForeignKey(to='beerf_15.factories', null=True)),
            ],
        ),
        migrations.AddField(
            model_name='status',
            name='pid',
            field=models.OneToOneField(to='beerf_15.users'),
        ),
        migrations.AddField(
            model_name='factory_retailer',
            name='rid',
            field=models.ForeignKey(to='beerf_15.retailers'),
        ),
        migrations.AddField(
            model_name='fac_ret_supply',
            name='frid',
            field=models.ForeignKey(to='beerf_15.factory_retailer'),
        ),
        migrations.AddField(
            model_name='fac_ret_demand',
            name='frid',
            field=models.ForeignKey(to='beerf_15.factory_retailer'),
        ),
        migrations.AddField(
            model_name='capacity',
            name='fid',
            field=models.ForeignKey(to='beerf_15.factories'),
        ),
    ]
