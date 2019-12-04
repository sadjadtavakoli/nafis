from rest_framework import mixins
from rest_framework.decorators import action
from rest_framework.generics import CreateAPIView
from rest_framework.viewsets import GenericViewSet

from backend.bill.permissions import LoginRequired
from nafis.paginations import PaginationClass
from nafis.views import NafisBase
from backend.product.models import Product, ProductId
from backend.product.serializers import ProductSerializer, ProductIdSerializer


class ProductViewSet(NafisBase, mixins.CreateModelMixin,
                     mixins.RetrieveModelMixin,
                     mixins.UpdateModelMixin,
                     mixins.ListModelMixin,
                     GenericViewSet):
    serializer_class = ProductSerializer
    permission_classes = (LoginRequired,)
    queryset = Product.objects.all()
    pagination_class = PaginationClass


class ProductIdCreateApiView(NafisBase, CreateAPIView):
    serializer_class = ProductIdSerializer
    permission_classes = (LoginRequired,)
    queryset = ProductId.objects.all()
