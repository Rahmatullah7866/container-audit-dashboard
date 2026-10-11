FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    netcat-traditional \
    && rm -rf /var/lib/apt/lists/*

# Create unprivileged security group and user
RUN groupadd -g 1001 appgroup && \
    useradd -u 1001 -g appgroup -s /bin/bash -m appuser

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
RUN chown -R appuser:appgroup /app

# Switch away from root
USER appuser

EXPOSE 8000

CMD ["sh", "-c", "until nc -z -v -w30 db 3306; do echo 'Waiting for MySQL...'; sleep 2; done; python manage.py makemigrations inspector && python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]