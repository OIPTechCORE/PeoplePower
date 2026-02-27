# GitHub Secrets Configuration Guide

## 🔐 **Required GitHub Secrets for People Power Journey**

### **Current Issues**
The IDE warnings show these missing secrets in `.github/workflows/ci-cd.yml`:
- `SNYK_TOKEN` (line 36) - For security scanning
- `DATABASE_URL` (line 156) - For database migrations  
- `LHCI_GITHUB_APP_TOKEN` (line 183) - For Lighthouse CI
- `GRAFANA_API_KEY` (line 190) - For monitoring dashboards

---

## 🔧 **Step-by-Step Secret Setup**

### **Step 1: Navigate to GitHub Secrets**
1. Go to: https://github.com/OIPTechCORE/PeoplePower
2. Click **Settings** tab
3. Click **Secrets and variables** in left sidebar
4. Click **Actions** tab

### **Step 2: Add Required Secrets**

#### **1. SNYK_TOKEN** (Security Scanning)
```
Name: SNYK_TOKEN
Description: Snyk security scanning token
Value: [Your Snyk API token]
```

**How to get Snyk token:**
1. Sign up at https://snyk.io/
2. Go to Account Settings → API Token
3. Generate new token
4. Copy and paste as secret value

#### **2. DATABASE_URL** (Database Migrations)
```
Name: DATABASE_URL
Description: PostgreSQL connection string
Value: postgresql://username:password@host:5432/database_name
```

#### **3. LHCI_GITHUB_APP_TOKEN** (Lighthouse CI)
```
Name: LHCI_GITHUB_APP_TOKEN
Description: Lighthouse CI GitHub App token
Value: [Your LHCI GitHub App token]
```

**How to get LHCI token:**
1. Go to GitHub → Settings → Developer settings → GitHub Apps
2. Search for "Lighthouse CI"
3. Install and configure
4. Generate token from app settings

#### **4. GRAFANA_API_KEY** (Monitoring)
```
Name: GRAFANA_API_KEY
Description: Grafana API key for dashboard updates
Value: [Your Grafana API key]
```

---

## 🎯 **Repository vs Environment Selection**

### **For Production Deployment**
- **Repository**: `OIPTechCORE/PeoplePower`
- **Branch**: `main`
- **Environment**: Production

### **For Staging Deployment**
- **Repository**: `OIPTechCORE/PeoplePower`
- **Branch**: `develop` 
- **Environment**: Staging

---

## 🔄 **Environment-Specific Variables**

### **Production Environment**
```env
NODE_ENV=production
DATABASE_URL=postgresql://prod-user:prod-pass@prod-host:5432/people_power_prod
NEXT_PUBLIC_API_URL=https://api.people-power-journey.com
REDIS_URL=redis://prod-redis:6379
JWT_SECRET=your-production-jwt-secret
```

### **Staging Environment**
```env
NODE_ENV=staging
DATABASE_URL=postgresql://staging-user:staging-pass@staging-host:5432/people_power_staging
NEXT_PUBLIC_API_URL=https://staging-api.people-power-journey.com
REDIS_URL=redis://staging-redis:6379
JWT_SECRET=your-staging-jwt-secret
```

---

## 🚀 **After Secret Configuration**

### **Immediate Benefits**
1. **Automated Security Scanning** - Every push will scan for vulnerabilities
2. **Automated Testing** - Unit, integration, and performance tests
3. **Automated Deployment** - Docker builds and deployments
4. **Database Migrations** - Automatic schema updates
5. **Performance Monitoring** - Lighthouse and Grafana integration

### **CI/CD Pipeline Flow**
```
Push → Security Scan → Code Quality → Tests → Build → Deploy → Monitor
```

---

## 📋 **Checklist**

### **Before Next Push**
- [ ] Configure SNYK_TOKEN
- [ ] Configure DATABASE_URL  
- [ ] Configure LHCI_GITHUB_APP_TOKEN
- [ ] Configure GRAFANA_API_KEY
- [ ] Test CI/CD pipeline with sample commit

### **After Configuration**
- [ ] Verify GitHub Actions run successfully
- [ ] Check automated deployments
- [ ] Monitor security scan results
- [ ] Validate performance metrics

---

## 🎉 **Expected Results**

Once secrets are configured:

1. **✅ GitHub Actions** will automatically trigger on pushes
2. **✅ Security scanning** via Snyk on every commit
3. **✅ Automated testing** with comprehensive coverage
4. **✅ Docker builds** with multi-stage optimization
5. **✅ Deployments** to staging and production environments
6. **✅ Monitoring** with real-time dashboards

**Your People Power Journey will have enterprise-grade CI/CD automation!** 🚀

---

## 🔗 **Helpful Links**

- **GitHub Secrets Docs**: https://docs.github.com/en/actions/security-guides/using-secrets
- **Snyk Integration**: https://docs.snyk.io/integrations/github-actions/
- **Lighthouse CI**: https://github.com/GoogleChromeLabs/lighthouse-ci
- **Grafana Cloud**: https://grafana.com/docs/grafana-cloud/

---

**Created**: February 26, 2026  
**Project**: People Power Journey  
**Purpose**: GitHub Secrets Configuration Guide
