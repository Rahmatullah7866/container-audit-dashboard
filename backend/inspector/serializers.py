from rest_framework import serializers
from .models import ContainerAuditReport, ContainerDetail

class ContainerDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContainerDetail
        fields = '__all__'

class ContainerAuditReportSerializer(serializers.ModelSerializer):
    containers = ContainerDetailSerializer(many=True, read_only=True)

    class Meta:
        model = ContainerAuditReport
        fields = ['id', 'scanned_at', 'total_containers', 'root_containers_count', 'privileged_containers_count', 'containers']