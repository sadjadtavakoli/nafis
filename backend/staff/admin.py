from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserChangeForm, UserCreationForm

from staff.models import Staff


class StaffChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = Staff
        fields = '__all__'


class StaffAdmin(UserAdmin):
    form = StaffChangeForm
    ordering = ('-id',)

    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': (
        'national_id', 'birth_date', 'national_card_picture', 'profile_picture', 'job', 'employment_date', 'address', 'branch')}),
    )


admin.site.register(Staff, StaffAdmin)
