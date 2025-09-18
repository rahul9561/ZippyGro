from rest_framework import permissions

class OrderPermission(permissions.BasePermission):
    """
    Role-based permissions for OrderViewSet
    """

    def has_permission(self, request, view):
        # Must be authenticated
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        user = request.user

        # Admin → full access
        if user.role == "admin":
            return True

        # Delivery agent → can only view/update assigned orders
        if user.role == "delivery_agent":
            if request.method in permissions.SAFE_METHODS:
                return obj.assigned_agent == user
            return obj.assigned_agent == user  # allow update only if assigned

        # Customer → can only view their own orders
        if user.role == "customer":
            if request.method in ["GET", "POST"]:  # can read & create
                return obj.user == user
            return False  # cannot update/delete

        return False
