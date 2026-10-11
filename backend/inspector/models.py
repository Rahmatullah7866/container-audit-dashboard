from django.db import models

class ContainerAuditReport(models.Model):
    scanned_at = models.DateTimeField(auto_now_add=True)
    total_containers = models.IntegerField(default=0)
    root_containers_count = models.IntegerField(default=0)
    privileged_containers_count = models.IntegerField(default=0)

    def __str__(self):
        return f"Scan {self.id} at {self.scanned_at} (Containers: {self.total_containers})"

class ContainerDetail(models.Model):
    report = models.ForeignKey(ContainerAuditReport, related_name='containers', on_delete=models.CASCADE)
    container_id = models.CharField(max_length=64)
    name = models.CharField(max_length=255)
    image = models.CharField(max_length=255)
    status = models.CharField(max_length=50)
    runs_as_root = models.BooleanField(default=True)
    is_privileged = models.BooleanField(default=False)
    open_ports = models.TextField(blank=True, default='')

    def __str__(self):
        return f"{self.name} ({self.container_id[:12]})"