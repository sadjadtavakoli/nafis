from rest_framework import serializers

from staff.models import Staff


class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staff
        fields = ('username', 'first_name', 'last_name', 'email', 'national_id', 'birth_date',
                  'national_card_picture', 'profile_picture', 'job', 'employment_date', 'address')
