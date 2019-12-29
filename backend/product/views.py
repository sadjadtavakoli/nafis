import ast
import json

from django.core.exceptions import ObjectDoesNotExist
from rest_framework import mixins
from rest_framework.decorators import action
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework.status import HTTP_404_NOT_FOUND
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet

from bill.permissions import LoginRequired
from branch.models import Branch
from branch.serializers import BranchSerializer
from nafis.paginations import PaginationClass
from nafis.views import NafisBase
from product.models import Product, ProductId, Material, Design, Color, FType
from product.serializers import ProductSerializer, ProductIdSerializer, MaterialDropDownSerializer, \
    DesignDropDownSerializer, \
    ColorDropDownSerializer, FTypeDropDownSerializer, ProductDetailSerializer


class ProductViewSet(NafisBase, mixins.CreateModelMixin,
                     mixins.RetrieveModelMixin,
                     mixins.UpdateModelMixin,
                     mixins.ListModelMixin,
                     GenericViewSet):
    serializer_class = ProductSerializer
    permission_classes = (LoginRequired,)
    queryset = Product.objects.all()
    pagination_class = PaginationClass

    def get_serializer_class(self):
        if self.action in ["list", "retrieve"]:
            return ProductDetailSerializer
        else:
            return ProductSerializer

    @action(methods=['GET'], detail=False, url_path="code")
    def get_product_using_code(self, request):
        code = self.request.query_params.get('code', None)
        try:
            product = Product.objects.get(code=code)
            return Response(ProductDetailSerializer(product).data)
        except ObjectDoesNotExist:
            return Response({'چنین محصولی یافت نشد.'}, status=HTTP_404_NOT_FOUND)

    @action(methods=["GET"], detail=False, url_path="filter")
    def filter_products(self,request, **kwargs):
        bg_colors = self.request.query_params.get('bg_colors', None)
        design_colors = self.request.query_params.get('design_colors', None)
        designs = self.request.query_params.get('designs', None)
        f_types = self.request.query_params.get('f_types', None)
        branches = self.request.query_params.get('branches', None)
        materials = self.request.query_params.get('materials', None)

        filter_items = {}
        if bg_colors is not None and len(ast.literal_eval(bg_colors)):
            filter_items['background_color__pk__in'] = ast.literal_eval(bg_colors)
        if design_colors is not None and len(ast.literal_eval(design_colors)):
            filter_items['design_color__pk__in'] = ast.literal_eval(design_colors)
        if designs is not None and len(ast.literal_eval(designs)):
            filter_items['design__pk__in'] = ast.literal_eval(designs)
        if f_types is not None and len(ast.literal_eval(f_types)):
            filter_items['f_type__pk__in'] = ast.literal_eval(f_types)
        if branches is not None and len(ast.literal_eval(branches)):
            filter_items['branch__pk__in'] = ast.literal_eval(branches)
        if materials is not None and len(ast.literal_eval(materials)):
            filter_items['material__pk__in'] = ast.literal_eval(materials)

        products = Product.objects.filter(**filter_items)
        return Response(ProductDetailSerializer(products, many=True).data)


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
