from rest_framework.permissions import BasePermission

from staff.models import Staff


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


class CloseBillPermission(NafisBasePermission):
    def has_permission(self, request, view):
        permission = super(CloseBillPermission, self).has_permission(request, view)
        if not permission:
            return False
        staff = Staff.objects.get(username=request.user.username)
        if staff.job not in ["cashier", "admin"]:
            return False
        return True


class AddPaymentPermission(NafisBasePermission):
    def has_permission(self, request, view):
        permission = super(AddPaymentPermission, self).has_permission(request, view)
        if not permission:
            return False
        staff = Staff.objects.get(username=request.user.username)
        if staff.job in ['salesperson', "storekeeper", 'accountant']:
            return False
        return True
