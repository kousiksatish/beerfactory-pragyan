# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('beerf_15', '0011_score_opp_score'),
    ]

    operations = [
        migrations.CreateModel(
            name='FAQs',
            fields=[
                ('faq_id', models.AutoField(serialize=False, primary_key=True)),
                ('priority', models.IntegerField()),
                ('question', models.CharField(default=b'', max_length=200, blank=True)),
                ('answer', models.CharField(default=b'', max_length=200, blank=True)),
            ],
        ),
    ]
