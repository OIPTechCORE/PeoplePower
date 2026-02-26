# Deployment Guide

## Overview

This guide covers the deployment of the People Power Journey Telegram game across all components:

- **Telegram Bot** (Node.js)
- **Game API** (Node.js + PostgreSQL)
- **Mini App** (Next.js)
- **Database** (PostgreSQL)

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Telegram Bot   │    │   Game API      │    │   Mini App      │
│   (Node.js)      │◄──►│   (Node.js)     │◄──►│   (Next.js)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   PostgreSQL    │
                       │   Database      │
                       └─────────────────┘
```

## Environment Setup

### 1. Environment Variables

Create `.env` files for each service:

#### Telegram Bot (`.env`)
```bash
BOT_TOKEN=your_telegram_bot_token
BOT_USERNAME=your_bot_username
API_URL=https://your-api-domain.com
MINI_APP_URL=https://your-mini-app-domain.com
NODE_ENV=production
LOG_LEVEL=info
```

#### Game API (`.env`)
```bash
NODE_ENV=production
PORT=3001
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=people_power
DB_USER=your-db-user
DB_PASSWORD=your-db-password
JWT_SECRET=your-jwt-secret
ALLOWED_ORIGINS=https://your-mini-app-domain.com
```

#### Mini App (`.env.local`)
```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_BOT_USERNAME=your_bot_username
```

### 2. Database Setup

```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE DATABASE people_power;
CREATE USER people_power_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE people_power TO people_power_user;
\q

# Run migrations
cd database
npm install
npm run migrate
```

## Deployment Options

### Option 1: Docker (Recommended)

#### Docker Compose Setup

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: people_power
      POSTGRES_USER: people_power_user
      POSTGRES_PASSWORD: your_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/migrations:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"

  api:
    build:
      context: ./api
      dockerfile: Dockerfile
    environment:
      NODE_ENV: production
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: people_power
      DB_USER: people_power_user
      DB_PASSWORD: your_password
    ports:
      - "3001:3001"
    depends_on:
      - postgres

  bot:
    build:
      context: ./bot
      dockerfile: Dockerfile
    environment:
      BOT_TOKEN: your_bot_token
      BOT_USERNAME: your_bot_username
      API_URL: http://api:3001
    depends_on:
      - api

  mini-app:
    build:
      context: ./mini-app
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://api:3001

volumes:
  postgres_data:
```

#### Dockerfiles

**API Dockerfile** (`api/Dockerfile`):
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

**Bot Dockerfile** (`bot/Dockerfile`):
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

CMD ["npm", "start"]
```

**Mini App Dockerfile** (`mini-app/Dockerfile`):
```dockerfile
FROM node:18-alpine AS base

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=base /app/public ./public
COPY --from=base --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=base --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Deploy with Docker Compose

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Scale services if needed
docker-compose up -d --scale api=3 --scale bot=2
```

### Option 2: Manual Deployment

#### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx for reverse proxy
sudo apt install nginx -y

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y
```

#### 2. Database Setup

```bash
# Follow database setup from Environment Setup section
cd /path/to/people-power-journey/database
npm install
npm run migrate
```

#### 3. Deploy API

```bash
cd /path/to/people-power-journey/api

# Install dependencies
npm install

# Build the project
npm run build

# Start with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save
pm2 startup
```

**PM2 Ecosystem Config** (`api/ecosystem.config.js`):
```javascript
module.exports = {
  apps: [{
    name: 'people-power-api',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

#### 4. Deploy Bot

```bash
cd /path/to/people-power-journey/bot

# Install dependencies
npm install

# Build the project
npm run build

# Start with PM2
pm2 start ecosystem.config.js --env production
```

**Bot PM2 Config** (`bot/ecosystem.config.js`):
```javascript
module.exports = {
  apps: [{
    name: 'people-power-bot',
    script: 'dist/index.js',
    instances: 1,
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

#### 5. Deploy Mini App

```bash
cd /path/to/people-power-journey/mini-app

# Install dependencies
npm install

# Build the project
npm run build

# Start with PM2
pm2 start ecosystem.config.js --env production
```

**Mini App PM2 Config** (`mini-app/ecosystem.config.js`):
```javascript
module.exports = {
  apps: [{
    name: 'people-power-mini-app',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

#### 6. Nginx Configuration

Create `/etc/nginx/sites-available/people-power`:

```nginx
# API server
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Mini App
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/people-power /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 7. SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d api.your-domain.com

# Set up auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Monitoring and Maintenance

### 1. Health Checks

Add health check endpoints and monitor them:

```bash
# API Health
curl https://api.your-domain.com/health

# Mini App Health
curl https://your-domain.com/api/health
```

### 2. Log Management

```bash
# View PM2 logs
pm2 logs

# View specific app logs
pm2 logs people-power-api

# Rotate logs
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

### 3. Database Backups

```bash
# Create backup script
cat > /home/user/backup-db.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/user/backups"
DB_NAME="people_power"

mkdir -p $BACKUP_DIR

pg_dump -h localhost -U people_power_user $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
EOF

chmod +x /home/user/backup-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /home/user/backup-db.sh
```

### 4. Performance Monitoring

Install monitoring tools:

```bash
# Install Node.js monitoring
npm install -g pm2-logrotate pm2-server-monit

# Monitor system resources
sudo apt install htop iotop -y

# Monitor database
sudo apt install pgtop -y
```

## Scaling

### Horizontal Scaling

1. **API Scaling**: Use PM2 cluster mode or load balancer
2. **Database Scaling**: Read replicas, connection pooling
3. **CDN**: Use CloudFlare for static assets
4. **Redis**: Add caching layer for frequent queries

### Auto-scaling with Cloud Providers

#### AWS ECS/Docker

```yaml
# task-definition.json
{
  "family": "people-power-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "api",
      "image": "your-account.dkr.ecr.region.amazonaws.com/people-power-api:latest",
      "portMappings": [
        {
          "containerPort": 3001,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ]
    }
  ]
}
```

## Security

### 1. Firewall Setup

```bash
# Configure UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 2. Security Headers

Ensure Nginx has security headers:

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

### 3. Database Security

```sql
-- Create read-only user for analytics
CREATE USER analytics_user WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE people_power TO analytics_user;
GRANT USAGE ON SCHEMA public TO analytics_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO analytics_user;
```

## Troubleshooting

### Common Issues

1. **Bot not responding**: Check bot token and webhook setup
2. **API connection refused**: Check if API is running and ports are open
3. **Database connection failed**: Verify credentials and network connectivity
4. **Mini App not loading**: Check CORS settings and API URL

### Debug Commands

```bash
# Check PM2 status
pm2 status

# Restart services
pm2 restart all

# Check logs
pm2 logs --lines 100

# Check database connection
psql -h localhost -U people_power_user -d people_power -c "SELECT 1;"

# Test API endpoints
curl -X GET https://api.your-domain.com/health
```

## Rollback Plan

1. **Database**: Keep backups of migrations
2. **Code**: Use Git tags for releases
3. **Configuration**: Version control environment files
4. **Monitoring**: Set up alerts for failures

```bash
# Rollback to previous version
git checkout v1.0.1
npm run build
pm2 reload all
```

This deployment guide provides a comprehensive setup for production deployment of the People Power Journey game with scalability, security, and monitoring considerations.
