# Docker Deployment Guide

This guide explains how to deploy the Sweets Management API using Docker and Docker Compose.

## Prerequisites

- Docker 20.10 or higher
- Docker Compose 2.0 or higher

## Quick Start with Docker

### Option 1: Docker Compose (Recommended)

The easiest way to run the entire stack:

```bash
# Start all services (API + PostgreSQL)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

The API will be available at `http://localhost:8000`

**Default Admin Credentials** (created automatically):
- Email: `admin@example.com`
- Password: `admin123`

⚠️ **Important**: Change the default admin password after first login!

### Option 2: Docker Build Only

If you have PostgreSQL running elsewhere:

```bash
# Build the image
docker build -t sweets-api .

# Run the container
docker run -d \
  --name sweets-api \
  -p 8000:8000 \
  -e DATABASE_URL="postgresql://user:password@host:5432/sweets_db" \
  -e SECRET_KEY="your-secret-key" \
  sweets-api
```

## Configuration

### Environment Variables

Configure via `docker-compose.yml` or pass as `-e` flags:

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | Required |
| SECRET_KEY | JWT secret key | Required |
| ALGORITHM | JWT algorithm | HS256 |
| ACCESS_TOKEN_EXPIRE_MINUTES | Token expiry time | 30 |
| DEBUG | Debug mode | False |

### Production Configuration

For production, create a `.env.prod` file:

```env
DATABASE_URL=postgresql://user:password@db:5432/sweets_db
SECRET_KEY=<generate-strong-secret-key>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DEBUG=False
```

Then use it with Docker Compose:

```bash
docker-compose --env-file .env.prod up -d
```

## Docker Commands Cheat Sheet

### Service Management

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose stop

# Restart services
docker-compose restart

# Remove services
docker-compose down

# Remove services and volumes
docker-compose down -v
```

### Viewing Logs

```bash
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View logs for specific service
docker-compose logs api
docker-compose logs db

# View last 100 lines
docker-compose logs --tail=100
```

### Database Management

```bash
# Connect to PostgreSQL
docker-compose exec db psql -U sweets_user -d sweets_db

# Backup database
docker-compose exec db pg_dump -U sweets_user sweets_db > backup.sql

# Restore database
docker-compose exec -T db psql -U sweets_user sweets_db < backup.sql

# View database logs
docker-compose logs db
```

### Application Management

```bash
# Execute command in API container
docker-compose exec api python -c "print('Hello')"

# Create admin user manually
docker-compose exec api python -c "
from app.database import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash

db = SessionLocal()
admin = User(
    email='newadmin@example.com',
    full_name='New Admin',
    hashed_password=get_password_hash('newpassword'),
    is_admin=True
)
db.add(admin)
db.commit()
"

# Run tests in container
docker-compose exec api pytest

# Access container shell
docker-compose exec api /bin/sh
```

## Monitoring

### Health Checks

The API includes health check endpoints:

```bash
# Check API health
curl http://localhost:8000/health

# Check via Docker
docker-compose ps
```

### Resource Usage

```bash
# View resource usage
docker stats

# View for specific service
docker stats sweets_api sweets_db
```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose logs api

# Check if database is ready
docker-compose logs db

# Verify database connection
docker-compose exec api python -c "
from app.database import engine
print(engine.connect())
"
```

### Database connection issues

```bash
# Ensure database service is healthy
docker-compose ps

# Check database logs
docker-compose logs db

# Test connection from API container
docker-compose exec api nc -zv db 5432
```

### Reset everything

```bash
# Stop and remove everything
docker-compose down -v

# Remove images
docker-compose down --rmi all -v

# Start fresh
docker-compose up -d --build
```

## Production Deployment

### 1. Security Hardening

Update `docker-compose.yml` for production:

```yaml
services:
  api:
    environment:
      # Use strong secret key
      SECRET_KEY: ${SECRET_KEY}
      DEBUG: "False"
    # Don't expose PostgreSQL port
    # Remove port mapping for db service
```

### 2. Use Docker Secrets (Swarm)

```bash
# Create secrets
echo "your-db-password" | docker secret create db_password -
echo "your-secret-key" | docker secret create api_secret_key -

# Update docker-compose.yml to use secrets
```

### 3. Reverse Proxy Setup

Use Nginx or Traefik in front of the API:

```yaml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - api
```

### 4. Enable HTTPS

```bash
# Using Let's Encrypt with certbot
docker run -it --rm \
  -v /etc/letsencrypt:/etc/letsencrypt \
  certbot/certbot certonly \
  --standalone \
  -d yourdomain.com
```

## Scaling

### Horizontal Scaling

```bash
# Scale API service to 3 instances
docker-compose up -d --scale api=3

# Use with load balancer (Nginx/Traefik)
```

### Docker Swarm Deployment

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml sweets

# Scale service
docker service scale sweets_api=3

# View services
docker stack services sweets
```

## Maintenance

### Updating the Application

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose up -d --build

# Or with zero downtime
docker-compose up -d --no-deps --build api
```

### Backup Strategy

```bash
# Automated backup script
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec -T db pg_dump -U sweets_user sweets_db | \
  gzip > backups/backup_${DATE}.sql.gz
EOF

# Schedule with cron
0 2 * * * /path/to/backup.sh
```

### Log Rotation

Configure in `docker-compose.yml`:

```yaml
services:
  api:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## Performance Optimization

### 1. Use Multi-Stage Builds

Already implemented in Dockerfile for smaller image size.

### 2. Resource Limits

```yaml
services:
  api:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

### 3. Database Connection Pooling

Already configured in SQLAlchemy settings.

## Monitoring & Logging

### Using Prometheus + Grafana

```yaml
services:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    depends_on:
      - prometheus
```

### Centralized Logging (ELK Stack)

```yaml
services:
  elasticsearch:
    image: elasticsearch:8.8.0
  
  logstash:
    image: logstash:8.8.0
  
  kibana:
    image: kibana:8.8.0
    ports:
      - "5601:5601"
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Docker Build and Push

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build image
        run: docker build -t sweets-api:latest .
      
      - name: Run tests
        run: docker run sweets-api:latest pytest
      
      - name: Push to registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push sweets-api:latest
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Best Practices for Writing Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)

## Support

For issues or questions:
1. Check container logs: `docker-compose logs`
2. Verify configuration: `docker-compose config`
3. Review this guide's troubleshooting section
4. Open an issue on GitHub
