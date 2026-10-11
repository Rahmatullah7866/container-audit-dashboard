import docker
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ContainerAuditReport, ContainerDetail
from .serializers import ContainerAuditReportSerializer

class RunAuditScanView(APIView):
    def post(self, request):
        try:
            client = docker.from_env()
            container_list = client.containers.list(all=True)
        except Exception as e:
            return Response(
                {"error": f"Failed to connect to Docker socket: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        root_count = 0
        priv_count = 0
        details_to_create = []

        for c in container_list:
            attrs = c.attrs
            config = attrs.get('Config', {})
            host_config = attrs.get('HostConfig', {})

            user = config.get('User', '')
            runs_root = (user == '' or user == '0' or user == 'root')
            if runs_root:
                root_count += 1

            is_priv = host_config.get('Privileged', False)
            if is_priv:
                priv_count += 1

            
            port_bindings = host_config.get('PortBindings', {})
            ports_str = ", ".join([f"{k} -> {v[0].get('HostPort')}" for k, v in port_bindings.items() if v]) if port_bindings else "None"

            details_to_create.append({
                "container_id": c.id[:12],
                "name": c.name.lstrip('/'),
                "image": attrs.get('Config', {}).get('Image', 'unknown'),
                "status": c.status,
                "runs_as_root": runs_root,
                "is_privileged": is_priv,
                "open_ports": ports_str
            })

        # Save scan report to MySQL
        report = ContainerAuditReport.objects.create(
            total_containers=len(container_list),
            root_containers_count=root_count,
            privileged_containers_count=priv_count
        )

        for detail in details_to_create:
            ContainerDetail.objects.create(report=report, **detail)

        serializer = ContainerAuditReportSerializer(report)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class AuditHistoryView(APIView):
    def get(self, request):
        reports = ContainerAuditReport.objects.order_by('-scanned_at')[:10]
        serializer = ContainerAuditReportSerializer(reports, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)