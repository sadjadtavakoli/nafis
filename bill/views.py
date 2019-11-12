from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from bill.models import Bill
from bill.permissions import LoginRequired
from bill.serializers import BillSerializer


class BillsViewSet(ModelViewSet):
    serializer_class = BillSerializer
    permission_classes = (LoginRequired,)
    queryset = Bill.objects.all()

    @action(url_path='close_all', detail=False, methods=['post'])
    def close_all(self, request):
        Bill.objects.filter(status="active").update(status='done')
        return Response({'ok': True})

    @action(url_path='actives', detail=False, methods=['get'])
    def get_actives(self, request):
        return Bill.objects.filter(status='active')

    @action(url_path='dones', detail=False, methods=['get'])
    def get_dones(self, request):
        return Bill.objects.filter(status='done')
