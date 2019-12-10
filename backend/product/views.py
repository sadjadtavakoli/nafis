from rest_framework import mixins
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet

from bill.permissions import LoginRequired
from branch.models import Branch
from branch.serializers import BranchSerializer
from nafis.paginations import PaginationClass
from nafis.views import NafisBase
from product.models import Product, ProductId, Material, Design, Color, FType
from product.serializers import ProductSerializer, ProductIdSerializer, MaterialDropDownSerializer, DesignDropDownSerializer, \
    ColorDropDownSerializer, FTypeDropDownSerializer


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


class ProductFieldsOptionsView(NafisBase, APIView):
    def get(self, request):
        material_data = MaterialDropDownSerializer(Material.objects.all(), many=True).data
        design_data = DesignDropDownSerializer(Design.objects.all(), many=True).data
        color_data = ColorDropDownSerializer(Color.objects.all(), many=True).data
        f_type_data = FTypeDropDownSerializer(FType.objects.all(), many=True).data
        branch_data = BranchSerializer(Branch.objects.all(), many=True).data
        response = dict(branch=branch_data, background_color=color_data, design_color=color_data,
                        material=material_data, design=design_data, f_type=f_type_data)
        return Response(response)
