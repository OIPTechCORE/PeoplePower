# People Power Journey - Docker Configuration

## Overview
This directory contains Docker configurations for containerized deployment of the People Power Journey application.

## Architecture
- **api**: Node.js/Express API server
- **mini-app**: Next.js frontend application
- **database**: PostgreSQL database
- **redis**: Redis cache
- **nginx**: Reverse proxy and load balancer

## Quick Start

### Development Environment
```bash
# Build and start all services
docker-compose up --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Environment
```bash
# Use production configuration
docker-compose -f docker-compose.prod.yml up --build -d

# Scale API instances
docker-compose -f docker-compose.prod.yml up --scale api=3 --build -d
```

## Environment Variables

### .env file (required)
```bash
# Database
POSTGRES_DB=peoplepower
POSTGRES_USER=appuser
POSTGRES_PASSWORD=your_secure_password

# Redis
REDIS_PASSWORD=your_redis_password

# API
JWT_SECRET=your_jwt_secret_key
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
ADMIN_API_KEY=your_admin_api_key

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=your_bot_username
```

## Service Details

### API Server
- **Port**: 3001
- **Health Check**: `/health`
- **Metrics**: `/metrics`
- **Environment**: Node.js 18 Alpine

### Mini App
- **Port**: 3000
- **Build**: Static export for production
- **Environment**: Node.js 18 Alpine

### Database
- **Port**: 5432
- **Volume**: Persistent data storage
- **Backups**: Automated with pg_dump

### Redis
- **Port**: 6379
- **Persistence**: AOF enabled
- **Memory**: 512MB limit

### Nginx
- **Ports**: 80, 443
- **SSL**: Let's Encrypt support
- **Load Balancing**: Round-robin

## Production Deployment

### SSL Certificate Setup
```bash
# Create certificates directory
mkdir -p nginx/certificates

# Copy your SSL certificates
cp your-domain.crt nginx/certificates/
cp your-domain.key nginx/certificates/

# Or use Let's Encrypt
certbot certonly --standalone -d your-domain.com
```

### Environment-Specific Configurations
```bash
# Development
docker-compose up --build

# Staging
docker-compose -f docker-compose.staging.yml up --build -d

# Production
docker-compose -f docker-compose.prod.yml up --build -d
```

## Monitoring and Logs

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f database

# Last 100 lines
docker-compose logs --tail=100 api
```

### Health Checks
```bash
# Check service status
docker-compose ps

# Health check endpoint
curl http://localhost:3001/health
```

## Data Management

### Database Backups
```bash
# Manual backup
docker-compose exec database pg_dump -U appuser peoplepower > backup.sql

# Restore backup
docker-compose exec -T database psql -U appuser peoplepower < backup.sql

# Automated backups (enabled in production)
# Backups stored in ./backups/database/
```

### Redis Persistence
```bash
# View Redis data
docker-compose exec redis redis-cli keys "*"

# Clear cache
docker-compose exec redis redis-cli flushall
```

## Performance Optimization

### Resource Limits
Production configuration includes:
- CPU limits for all services
- Memory limits with safety margins
- Disk space monitoring
- Connection pooling

### Caching Strategy
- Redis for application cache
- Nginx for static assets
- Database query caching
- CDN integration ready

## Security Features

### Network Security
- Internal network isolation
- Port exposure minimization
- Firewall rules via Docker
- SSL/TLS encryption

### Application Security
- Environment variable secrets
- Health check authentication
- Rate limiting
- Security headers

## Troubleshooting

### Common Issues

#### Service Won't Start
```bash
# Check logs
docker-compose logs service-name

# Check resource usage
docker stats

# Restart service
docker-compose restart service-name
```

#### Database Connection Issues
```bash
# Check database status
docker-compose exec database pg_isready

# Test connection
docker-compose exec api npm run db:test

# Reset database
docker-compose down -v
docker-compose up --build
```

#### Performance Issues
```bash
# Monitor resource usage
docker stats

# Check slow queries
docker-compose exec database psql -U appuser -c "SELECT * FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;"

# Clear Redis cache
docker-compose exec redis redis-cli flushall
```

## Scaling

### Horizontal Scaling
```bash
# Scale API instances
docker-compose -f docker-compose.prod.yml up --scale api=5 --build -d

# Add load balancer
docker-compose -f docker-compose.prod.yml up --scale nginx=2 --build -d
```

### Vertical Scaling
Update resource limits in `docker-compose.prod.yml`:
```yaml
services:
  api:
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 4G
        reservations:
          cpus: '1.0'
          memory: 2G
```

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to server
        run: |
          docker-compose -f docker-compose.prod.yml pull
          docker-compose -f docker-compose.prod.yml up -d
```

## Maintenance

### Updates
```bash
# Pull latest images
docker-compose pull

# Rebuild with latest code
docker-compose up --build

# Clean up unused images
docker image prune -f
```

### Cleanup
```bash
# Remove stopped containers
docker container prune

# Remove unused volumes (careful!)
docker volume prune

# Full cleanup
docker system prune -a
```

## Environment Variables Reference

### API Environment Variables
| Variable | Required | Default | Description |
|-----------|----------|---------|-------------|
| NODE_ENV | No | development | Environment mode |
| PORT | No | 3001 | API server port |
| DATABASE_URL | Yes | - | PostgreSQL connection string |
| REDIS_URL | Yes | - | Redis connection string |
| JWT_SECRET | Yes | - | JWT signing secret |
| TELEGRAM_BOT_TOKEN | Yes | - | Telegram bot token |
| ADMIN_API_KEY | Yes | - | Admin API key |

### Frontend Environment Variables
| Variable | Required | Default | Description |
|-----------|----------|---------|-------------|
| NEXT_PUBLIC_API_URL | Yes | - | API server URL |
| NEXT_PUBLIC_TELEGRAM_BOT_USERNAME | Yes | - | Telegram bot username |
| NEXT_PUBLIC_WS_URL | No | - | WebSocket server URL |

## Support

For issues with Docker deployment:
1. Check logs: `docker-compose logs`
2. Verify environment variables
3. Check resource usage: `docker stats`
4. Review this documentation
5. Check GitHub issues

## License

This Docker configuration is part of the People Power Journey project. See main project LICENSE for details.
