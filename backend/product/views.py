import ast
import json

from django.core.exceptions import ObjectDoesNotExist
from rest_framework import mixins, status
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
    # permission_classes = (LoginRequired,)
    queryset = Product.objects.all()
    pagination_class = PaginationClass

    def get_serializer_class(self):
        if self.action in ["list", "retrieve"]:
            return ProductDetailSerializer
        else:
            return ProductSerializer

    def create(self, request, *args, **kwargs):
        response = super(ProductViewSet, self).create(request, *args, **kwargs)
        code = self.request.data['code']
        product_id = ProductId.objects.get(pk=code)
        product_id.is_used = True
        product_id.save()
        return response

    @action(methods=['GET'], detail=False, url_path="code")
    def get_product_using_code(self, request):
        code = self.request.query_params.get('code', None)
        try:
            product = Product.objects.get(code=code)
            return Response(ProductDetailSerializer(product).data)
        except ObjectDoesNotExist:
            return Response({'چنین محصولی یافت نشد.'}, status=HTTP_404_NOT_FOUND)

    def get_filter_kwargs(self):
        data = self.request.query_params
        data = {k: (data.getlist(k) if k.endswith('[]') else data.get(k))
                for k in data}
        return data

    @action(methods=["GET"], detail=False, url_path="filter")
    def filter_products(self,request, **kwargs):
        data = self.get_filter_kwargs()
        bg_colors = data.get('bg_color[]', None)
        design_colors = data.get('design_color[]', None)
        designs = data.get('design[]', None)
        f_types = data.get('f_type[]', None)
        branches = data.get('branch[]', None)
        materials = data.get('material[]', None)
        filter_items = {}
        if bg_colors is not None and len(bg_colors):
            filter_items['background_color__pk__in'] = bg_colors
        if design_colors is not None and len(design_colors):
            filter_items['design_color__pk__in'] = design_colors
        if designs is not None and len(designs):
            filter_items['design__pk__in'] = designs
        if f_types is not None and len(f_types):
            filter_items['f_type__pk__in'] = f_types
        if branches is not None and len(branches):
            filter_items['branch__pk__in'] = branches
        if materials is not None and len(materials):
            filter_items['material__pk__in'] = materials

        products = Product.objects.filter(**filter_items)
        page = self.paginate_queryset(products)
        if page is not None:
            serializer = ProductDetailSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = ProductDetailSerializer(products, many=True)
        return Response(serializer.data)


class ProductIdCreateApiView(NafisBase, CreateAPIView):
    serializer_class = ProductIdSerializer
    permission_classes = (LoginRequired,)
    queryset = ProductId.objects.all()

    def create(self, request, *args, **kwargs):
        if not self.queryset.last().is_used:
            instance = self.queryset.last()
        else:
            ProductId.objects.create()
            instance = ProductId.objects.last()
        serializer = ProductIdSerializer(instance)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


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
