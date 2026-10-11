import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchLatestScan = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/audit/history/');
      if (res.data && res.data.length > 0) {
        setReport(res.data[0]);
      }
    } catch (err) {
      console.log('No previous scans found or server unreachable.');
    }
  };

  useEffect(() => {
    fetchLatestScan();
  }, []);

  const triggerAudit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:8000/api/audit/scan/');
      setReport(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to execute Docker audit scan.');
    }
    setLoading(false);
  };

  return (
    <div className="container-fluid bg-light min-vh-100 py-4 px-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <div>
          <h2 className="fw-bold text-dark mb-0">🛡️ Container Security & Health Dashboard</h2>
          <small className="text-muted">Real-time Docker Daemon Audit & Hardening Inspector</small>
        </div>
        <button 
          className="btn btn-primary btn-lg shadow-sm px-4" 
          onClick={triggerAudit} 
          disabled={loading}
        >
          {loading ? 'Auditing Host...' : '⚡ Run Full Scan'}
        </button>
      </div>

      {error && <div className="alert alert-danger shadow-sm">{error}</div>}

      {/* KPI Cards */}
      {report && (
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-body">
                <h6 className="text-muted text-uppercase fw-semibold mb-2">Total Containers</h6>
                <h2 className="fw-bold text-primary mb-0">{report.total_containers}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-body">
                <h6 className="text-muted text-uppercase fw-semibold mb-2">Running as Root (Risk)</h6>
                <h2 className={`fw-bold mb-0 ${report.root_containers_count > 0 ? 'text-danger' : 'text-success'}`}>
                  {report.root_containers_count}
                </h2>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-body">
                <h6 className="text-muted text-uppercase fw-semibold mb-2">Privileged Mode (Critical)</h6>
                <h2 className={`fw-bold mb-0 ${report.privileged_containers_count > 0 ? 'text-danger' : 'text-success'}`}>
                  {report.privileged_containers_count}
                </h2>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audit Table */}
      {report && (
        <div className="card border-0 shadow-sm rounded-3">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0 fw-bold">Live Container Audit Inspection</h5>
            <small className="text-muted">Scan timestamp: {new Date(report.scanned_at).toLocaleString()}</small>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Container ID</th>
                  <th>Name</th>
                  <th>Image</th>
                  <th>Status</th>
                  <th>Least-Privilege (User)</th>
                  <th>Privileged Mode</th>
                  <th>Port Forwarding</th>
                </tr>
              </thead>
              <tbody>
                {report.containers && report.containers.length > 0 ? (
                  report.containers.map((c) => (
                    <tr key={c.id}>
                      <td><code>{c.container_id}</code></td>
                      <td className="fw-bold">{c.name}</td>
                      <td><span className="badge bg-secondary">{c.image}</span></td>
                      <td>
                        <span className={`badge ${c.status === 'running' ? 'bg-success' : 'bg-warning text-dark'}`}>
                          {c.status}
                        </span>
                      </td>
                      <td>
                        {c.runs_as_root ? (
                          <span className="badge bg-danger">HIGH: Root User</span>
                        ) : (
                          <span className="badge bg-success">PASS: Non-Root</span>
                        )}
                      </td>
                      <td>
                        {c.is_privileged ? (
                          <span className="badge bg-danger">CRITICAL: Privileged</span>
                        ) : (
                          <span className="badge bg-light text-dark border">Standard Isolation</span>
                        )}
                      </td>
                      <td><small>{c.open_ports}</small></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">
                      No containers detected. Make sure Docker is running on your host.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;