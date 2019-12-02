from rest_framework.permissions import BasePermission


class NafisBasePermission(BasePermission):
    login_required = False

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            if not self.login_required:
                return True
            return False
        return True


class LoginRequired(NafisBasePermission):
    login_required = True
