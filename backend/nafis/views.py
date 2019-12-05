from django.contrib.auth import authenticate, login
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token

from staff.models import Staff

from staff.serializers import StaffSerializer


class NafisBase:
    non_updaters = []
    non_destroyers = []

    def destroy(self, request, *args, **kwargs):
        if request.user.profile.group_type in self.non_destroyers:
            raise PermissionDenied
        return super().destroy(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if request.user.profile.group_type in self.non_updaters:
            raise PermissionDenied
        return super().update(request, *args, **kwargs)


class LoginAPIView(APIView):
    authentication_classes = []
    permission_classes = (AllowAny,)
    throttle_scope = 'login'

    def post(self, request, *args, **kwargs):
        username = request.data.get('username', '')
        password = request.data.get('password', '')
        try:
            member = Staff.objects.get(username=username)
        except Staff.DoesNotExist:
            raise ValidationError(
                {'non_field_errors': ['Member does not exist.']})
        if authenticate(request=request, username=member.username, password=password):
            login(request, member)
        if request.user.is_authenticated:
            token, created = Token.objects.get_or_create(user=member)
            return Response({
                'token': token.key,
                'is_admin': getattr(member, 'is_admin', False),
                'user': StaffSerializer(member).data
            })
        raise ValidationError(
            {'non_field_errors': ['Unable to login with provided credentials.']})

