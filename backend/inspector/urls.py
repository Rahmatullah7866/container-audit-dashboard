from django.urls import path
from .views import RunAuditScanView, AuditHistoryView

urlpatterns = [
    path('scan/', RunAuditScanView.as_view(), name='run-scan'),
    path('history/', AuditHistoryView.as_view(), name='scan-history'),
]