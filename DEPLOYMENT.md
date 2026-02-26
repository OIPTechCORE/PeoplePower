# People Power Journey - Production Deployment Guide

## Overview
This guide covers the production deployment of the People Power Journey application, including infrastructure setup, security configurations, monitoring, and maintenance procedures.

## Architecture Overview

### Components
- **API Server** (Node.js/Express/TypeScript)
- **Mini App** (Next.js/React)
- **Database** (PostgreSQL)
- **Cache** (Redis)
- **Real-time** (Socket.IO)
- **Monitoring** (Prometheus/Grafana)
- **Load Balancer** (Nginx)

### Infrastructure Requirements

#### Minimum Production Specs
- **API Server**: 4 CPU, 8GB RAM, 80GB SSD
- **Database**: 4 CPU, 16GB RAM, 200GB SSD
- **Redis**: 2 CPU, 4GB RAM, 40GB SSD
- **Load Balancer**: 2 CPU, 4GB RAM

#### Recommended Production Specs
- **API Server**: 8 CPU, 16GB RAM, 160GB SSD (2 instances)
- **Database**: 8 CPU, 32GB RAM, 500GB SSD (with replication)
- **Redis**: 4 CPU, 8GB RAM, 80GB SSD (clustered)
- **Load Balancer**: 4 CPU, 8GB RAM (HA setup)

## Environment Configuration

### Required Environment Variables

#### API Server (.env)
```bash
# Server Configuration
NODE_ENV=production
PORT=3001
HOST=0.0.0.0

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/peoplepower
DATABASE_POOL_MIN=10
DATABASE_POOL_MAX=20

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your_redis_password

# JWT
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRES_IN=7d

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
ADMIN_API_KEY=your_admin_api_key

# Telegram
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_WEBHOOK_SECRET=your_webhook_secret

# Monitoring
PROMETHEUS_PORT=9090
METRICS_ENABLED=true

# Logging
LOG_LEVEL=info
LOG_FORMAT=json

# CORS
FRONTEND_URL=https://your-domain.com
ALLOWED_ORIGINS=https://t.me,https://web.telegram.org

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=/var/uploads

# External Services
WEBHOOK_URL=https://your-domain.com/webhooks
NOTIFICATION_SERVICE_URL=https://notifications.your-domain.com
```

#### Mini App (.env)
```bash
# Next.js
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.your-domain.com
NEXT_PUBLIC_WS_URL=wss://api.your-domain.com

# Telegram
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=your_bot_username
NEXT_PUBLIC_TELEGRAM_WEB_APP_URL=https://t.me/your_bot_name

# Analytics
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_ERROR_REPORTING=true
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true
```

## Database Setup

### PostgreSQL Configuration

#### postgresql.conf (Production Optimizations)
```ini
# Memory Settings
shared_buffers = 4GB
effective_cache_size = 12GB
work_mem = 256MB
maintenance_work_mem = 1GB

# Connection Settings
max_connections = 200
listen_addresses = '*'
port = 5432

# Performance Settings
random_page_cost = 1.1
effective_io_concurrency = 200

# WAL Settings
wal_buffers = 64MB
checkpoint_completion_target = 0.9
wal_writer_delay = 200ms

# Logging
log_destination = 'stderr'
logging_collector = on
log_directory = 'pg_log'
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
log_statement = 'all'
log_min_duration_statement = 1000
```

#### pg_hba.conf (Security)
```
# TYPE  DATABASE        USER            ADDRESS                 METHOD

# Local connections
local   all             postgres                                peer
local   all             all                                     md5

# IPv4 local connections
host    all             all             127.0.0.1/32            md5
host    all             all             10.0.0.0/8               md5

# IPv6 local connections
host    all             all             ::1/128                 md5

# Application connections
host    peoplepower     app_user        app_server_ip/32        md5
```

### Database Migration
```bash
# Run migrations
cd api
npm run migrate

# Verify schema
psql -d peoplepower -c "\dt"

# Create indexes for performance
psql -d peoplepower -c "
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_players_telegram_id ON players(telegram_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_players_referral_code ON players(referral_code);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_token_transactions_player_id ON token_transactions(player_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_token_transactions_created_at ON token_transactions(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_chat_messages_channel_id ON chat_messages(channel_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
"
```

## Redis Configuration

### redis.conf (Production)
```ini
# Network
bind 127.0.0.1
port 6379
protected-mode yes
requirepass your_redis_password

# Memory
maxmemory 2gb
maxmemory-policy allkeys-lru

# Persistence
save 900 1
save 300 10
save 60 10000
rdbcompression yes
rdbchecksum yes
dbfilename dump.rdb
dir /var/lib/redis

# Logging
loglevel notice
logfile /var/log/redis/redis-server.log

# Performance
tcp-keepalive 300
timeout 0
```

## Nginx Configuration

### nginx.conf
```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for" '
                    'rt=$request_time uct="$upstream_connect_time" '
                    'uht="$upstream_header_time" urt="$upstream_response_time"';

    access_log /var/log/nginx/access.log main;

    # Performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;

    # Upstream API servers
    upstream api_backend {
        least_conn;
        server 127.0.0.1:3001 max_fails=3 fail_timeout=30s;
        keepalive 32;
    }

    # Main server block
    server {
        listen 80;
        server_name api.your-domain.com;
        
        # Redirect to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name api.your-domain.com;

        # SSL Configuration
        ssl_certificate /etc/ssl/certs/your-domain.crt;
        ssl_certificate_key /etc/ssl/private/your-domain.key;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin";

        # API routes
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            
            proxy_pass http://api_backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            proxy_read_timeout 300s;
            proxy_connect_timeout 75s;
        }

        # Auth endpoints with stricter rate limiting
        location /api/auth/ {
            limit_req zone=login burst=5 nodelay;
            
            proxy_pass http://api_backend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # WebSocket support
        location /socket.io/ {
            proxy_pass http://api_backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Health check
        location /health {
            proxy_pass http://api_backend;
            access_log off;
        }
    }
}
```

## SSL/TLS Configuration

### Let's Encrypt Setup
```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d api.your-domain.com

# Setup auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Monitoring and Logging

### Prometheus Configuration
```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "rules/*.yml"

scrape_configs:
  - job_name: 'people-power-api'
    static_configs:
      - targets: ['localhost:3001']
    metrics_path: '/metrics'
    scrape_interval: 5s

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['localhost:9100']

  - job_name: 'postgres-exporter'
    static_configs:
      - targets: ['localhost:9187']

  - job_name: 'redis-exporter'
    static_configs:
      - targets: ['localhost:9121']

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093
```

### Grafana Dashboards
- System Performance (CPU, Memory, Disk)
- Application Metrics (Response Time, Error Rate)
- Database Performance (Connections, Query Time)
- Redis Performance (Memory, Hit Rate)
- Business Metrics (Active Users, Transactions)

## Deployment Process

### 1. Server Preparation
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y nodejs npm postgresql redis-server nginx

# Create application user
sudo useradd -m -s /bin/bash appuser
sudo usermod -aG sudo appuser
```

### 2. Application Deployment
```bash
# Clone repository
git clone https://github.com/your-org/people-power-journey.git
cd people-power-journey

# Install dependencies
cd api && npm ci --production
cd ../mini-app && npm ci --production

# Build application
cd ../mini-app && npm run build

# Setup PM2
npm install -g pm2

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'people-power-api',
      script: './api/dist/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: '/var/log/pm2/api-error.log',
      out_file: '/var/log/pm2/api-out.log',
      log_file: '/var/log/pm2/api-combined.log',
      time: true
    }
  ]
};
EOF

# Start application
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 3. Database Setup
```bash
# Create database user
sudo -u postgres createuser --interactive appuser

# Create database
sudo -u postgres createdb peoplepower

# Run migrations
cd api
npm run migrate

# Create indexes
npm run db:index
```

## Security Hardening

### Firewall Configuration
```bash
# Configure UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### System Security
```bash
# Disable root login
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config

# Configure fail2ban
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Setup automatic security updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

## Backup Strategy

### Database Backup
```bash
#!/bin/bash
# backup-db.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/postgresql"
DB_NAME="peoplepower"

mkdir -p $BACKUP_DIR

# Create backup
pg_dump -h localhost -U appuser -d $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Remove old backups (keep 7 days)
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete

# Upload to cloud storage (optional)
# aws s3 cp $BACKUP_DIR/backup_$DATE.sql.gz s3://your-backup-bucket/
```

### Application Backup
```bash
#!/bin/bash
# backup-app.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/application"

mkdir -p $BACKUP_DIR

# Backup application files
tar -czf $BACKUP_DIR/app_$DATE.tar.gz /home/appuser/people-power-journey

# Backup PM2 configuration
pm2 save > $BACKUP_DIR/pm2_dump_$DATE.pm2

# Remove old backups (keep 7 days)
find $BACKUP_DIR -name "app_*.tar.gz" -mtime +7 -delete
find $BACKUP_DIR -name "pm2_dump_*.pm2" -mtime +7 -delete
```

## Maintenance Procedures

### Log Rotation
```bash
# /etc/logrotate.d/people-power
/var/log/pm2/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 appuser appuser
    postrotate
        pm2 reloadLogs
    endscript
}
```

### Health Monitoring
```bash
#!/bin/bash
# health-check.sh

# Check API health
API_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/health)
if [ $API_HEALTH -ne 200 ]; then
    echo "API health check failed: $API_HEALTH"
    # Send alert
    pm2 restart people-power-api
fi

# Check database connection
if ! pg_isready -h localhost -p 5432; then
    echo "Database connection failed"
    # Send alert
fi

# Check Redis
if ! redis-cli ping; then
    echo "Redis connection failed"
    # Send alert
fi
```

## Scaling Considerations

### Horizontal Scaling
- Load balancer with multiple API instances
- Database read replicas
- Redis clustering
- CDN for static assets

### Performance Optimization
- Database query optimization
- Caching strategies
- Connection pooling
- CDN integration

## Troubleshooting

### Common Issues
1. **High Memory Usage**: Check for memory leaks, increase swap space
2. **Database Slow**: Analyze slow queries, add indexes
3. **High CPU**: Profile application, optimize algorithms
4. **Connection Timeouts**: Adjust pool sizes, check network

### Monitoring Commands
```bash
# System resources
htop
iotop
df -h

# Application logs
pm2 logs people-power-api
tail -f /var/log/nginx/access.log

# Database performance
psql -c "SELECT * FROM pg_stat_activity;"
```

## Emergency Procedures

### Service Recovery
```bash
# Restart services
pm2 restart all
sudo systemctl restart postgresql
sudo systemctl restart redis-server
sudo systemctl restart nginx

# Full system restart
sudo reboot
```

### Data Recovery
```bash
# Restore database
gunzip -c /var/backups/postgresql/backup_YYYYMMDD_HHMMSS.sql.gz | psql -h localhost -U appuser -d peoplepower

# Restore application
tar -xzf /var/backups/application/app_YYYYMMDD_HHMMSS.tar.gz -C /
pm2 resurrect
```

This deployment guide provides a comprehensive foundation for running People Power Journey in production with enterprise-grade security, monitoring, and reliability.
