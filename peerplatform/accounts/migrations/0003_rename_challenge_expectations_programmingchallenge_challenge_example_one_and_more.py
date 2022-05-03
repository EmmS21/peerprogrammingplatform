# Generated by Django 4.0.2 on 2022-05-02 15:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_rename_programmingchallenges_programmingchallenge'),
    ]

    operations = [
        migrations.RenameField(
            model_name='programmingchallenge',
            old_name='challenge_expectations',
            new_name='challenge_example_one',
        ),
        migrations.AddField(
            model_name='programmingchallenge',
            name='challenge_example_three',
            field=models.TextField(default='on'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='programmingchallenge',
            name='challenge_example_two',
            field=models.TextField(default='one'),
            preserve_default=False,
        ),
    ]