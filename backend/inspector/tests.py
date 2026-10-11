from django.test import TestCase
from .models import ContainerAuditReport, ContainerDetail

class AuditModelTests(TestCase):
    def setUp(self):
        self.report = ContainerAuditReport.objects.create(
            total_containers=2,
            root_containers_count=1,
            privileged_containers_count=0
        )
        self.container = ContainerDetail.objects.create(
            report=self.report,
            container_id="abcdef123456",
            name="test-nginx",
            image="nginx:latest",
            status="running",
            runs_as_root=True,
            is_privileged=False,
            open_ports="80/tcp -> 8080"
        )

    def test_report_data_integrity(self):
        self.assertEqual(self.report.total_containers, 2)
        self.assertEqual(self.report.containers.count(), 1)
        self.assertTrue(self.report.containers.first().runs_as_root)