# 🛡️ Container Health & DevSecOps Audit Dashboard

[![DevSecOps CI Pipeline](https://github.com/Rahmatullah7866/container-audit-dashboard/actions/workflows/devsecops.yml/badge.svg)](https://github.com/Rahmatullah7866/container-audit-dashboard/actions/workflows/devsecops.yml)

A full-stack DevSecOps platform that inspects host Docker containers in real time via the Docker daemon socket (`/var/run/docker.sock:ro`), identifies privilege escalation risks (root users and privileged containers), and logs audit snapshots into MySQL.

---

## 🏗️ Architecture & Tech Stack

* **Frontend:** React.js (Vite), Bootstrap 5, Axios.
* **Backend:** Python, Django REST Framework, Docker SDK for Python.
* **Database:** MySQL 8.0 with relational audit snapshots.
* **Infrastructure:** Docker Compose with read-only Docker socket integration (`:ro`).
* **DevSecOps Pipeline:**
  * **Linter:** Flake8 (PEP 8 compliance & syntax checking).
  * **SAST:** Bandit (AST-level vulnerability scanning).
  * **Secret Detection:** TruffleHog (Entropy & verified credential scanning).
  * **Container Security:** Aqua Security Trivy (Docker base image CVE scanning).

---

## 🚀 Quickstart Guide

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Rahmatullah7866/container-audit-dashboard.git](https://github.com/Rahmatullah7866/container-audit-dashboard.git)
   cd container-audit-dashboard
