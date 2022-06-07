from django.contrib import admin
from .models import Profile, ProgrammingChallenge


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Profile._meta.fields if field.name not in ('id', 'qual_key', 'qual_desc')]
    list_display.insert(0, '__str__')


@admin.register(ProgrammingChallenge)
class ProgrammingChallengeAdmin(admin.ModelAdmin):
    list_display = [field.name for field in ProgrammingChallenge._meta.fields if
                    field.name not in ('id', 'qual_key', 'qual_desc')]
    list_display.insert(0, '__str__')


# @admin.register(LoggedUser)
# class LoggedUserAdmin(admin.ModelAdmin):
#     list_display = [field.name for field in LoggedUser._meta.fields if field.name not in('id', 'qual_key', 'qual_desc')]
#     list_display.insert(0, '__str__')
