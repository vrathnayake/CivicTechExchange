# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2018-09-11 16:18
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('democracylab', '0003_auto_20180911_0124'),
        ('civictechprojects', '0015_project_project_date_modified'),
    ]

    operations = [
        migrations.AddField(
            model_name='projectfile',
            name='file_user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='files', to='democracylab.Contributor'),
        ),
        migrations.AddField(
            model_name='projectlink',
            name='link_user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='links', to='democracylab.Contributor'),
        ),
        migrations.AlterField(
            model_name='projectfile',
            name='file_project',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='files', to='civictechprojects.Project'),
        ),
        migrations.AlterField(
            model_name='projectlink',
            name='link_project',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='links', to='civictechprojects.Project'),
        ),
    ]