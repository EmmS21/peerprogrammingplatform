# Generated by Django 4.0.2 on 2022-06-03 04:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0005_remove_profile_is_online'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='is_online',
            field=models.BooleanField(default=False),
        ),
    ]
