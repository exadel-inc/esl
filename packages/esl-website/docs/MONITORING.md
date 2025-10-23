# ESL Website Monitoring

Automated monitoring system for esl-ui.com infrastructure using GitHub Actions.

## 🔍 What is monitored

### Website Availability
- **Main site**: https://esl-ui.com/
- **CSS Bundle**: https://esl-ui.com/bundles/site.css  
- **JS Bundle**: https://esl-ui.com/bundles/site.js

### Security & Infrastructure
- **SSL Certificate** expiration for `esl-ui.com`
- **Domain** expiration for `esl-ui.com`

## ⏱️ Check frequency

- **Website Availability**: every 10 minutes
- **SSL Certificate**: daily at 09:00 EET (07:00 UTC)
- **Domain Expiration**: daily at 09:00 EET (07:00 UTC)

## 🚨 Alert Logic

### Website Availability
- **First failure** → ⚠️ Warning issue created (might be a deployment or temporary network issue)
- **Second+ failure** → 🚨 Warning escalated to Alert (same issue renamed, escalation comment added, full history preserved)
- **Recovery after warning** → Warning issue is silently closed (reason: "not planned")
- **Recovery after alert** → Alert issue is closed with resolution comment (reason: "completed")

### SSL Certificate
- Alert created when certificate expires in less than **30 days**
- Issue automatically closed when renewed

### Domain Expiration
- Alert created when domain expires in less than **60 days**
- Issue automatically closed when renewed

## ⚙️ Configuration

All monitoring is configured via GitHub Actions workflows in `.github/workflows/`:

### Website Availability (`website-availability-check.yml`)
```yaml
URLS=(
  "https://esl-ui.com/"
  "https://esl-ui.com/bundles/site.js"
  "https://esl-ui.com/bundles/site.css"
)
SITE_NAME="esl-ui.com"
```

### SSL & Domain Check (`website-ssl-domain-check.yml`)
```yaml
DOMAIN="esl-ui.com"
SSL_WARNING_DAYS=30
DOMAIN_WARNING_DAYS=60
```

## 🏷️ Issue Labels

All monitoring issues are tagged with:
- `monitoring` - General monitoring label
- `Monitor: Website` - Website availability issues
- `Monitor: SSL Certificate` - SSL certificate issues
- `Monitor: Domain` - Domain expiration issues

## 📊 How it works

- Workflows run on schedule and can be triggered manually via `workflow_dispatch`
- Issues are automatically created when problems are detected
- Issues are automatically closed when problems are resolved
- All checks include timestamps and detailed information
