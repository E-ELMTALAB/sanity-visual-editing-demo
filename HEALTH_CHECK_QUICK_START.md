# 🏥 Health Check Quick Start

## ✅ Your New Health Endpoints

After Railway deploys (2-3 minutes), you'll have two health check endpoints:

### 🔍 **Detailed Health Check**
```
https://your-medusa.railway.app/health
```

**Shows:**
- ✅ All service statuses (Database, Redis, MinIO, Stripe, Email, Search)
- 📊 System info (memory, uptime, Node version)
- ⚙️ Configuration details (CORS, worker mode)

**Use for:**
- Debugging issues
- Verifying configuration
- Monitoring all services

---

### ⚡ **Simple Health Check**
```
https://your-medusa.railway.app/health/simple
```

**Shows:**
- ✅ Basic status: `{"status": "ok"}`
- 📅 Timestamp and uptime

**Use for:**
- Uptime monitoring (UptimeRobot, Pingdom)
- Quick status checks
- Load balancer health checks

---

## 🚀 Test Now (After Deployment)

### **Option 1: Browser**
Just paste in your browser:
```
https://your-medusa.railway.app/health
```

### **Option 2: cURL**
```bash
curl https://your-medusa.railway.app/health
```

### **Option 3: PowerShell**
```powershell
Invoke-RestMethod https://your-medusa.railway.app/health | ConvertTo-Json -Depth 10
```

---

## 📋 Example Response

```json
{
  "status": "healthy",
  "uptime": 3600,
  "services": {
    "database": { "status": "healthy", "type": "PostgreSQL" },
    "redis": { "status": "configured" },
    "minio": { "status": "configured", "endpoint": "..." },
    "email": { "status": "configured", "provider": "Resend" },
    "stripe": { "status": "configured", "mode": "test" }
  },
  "system": {
    "nodeVersion": "v22.0.0",
    "memory": { "used": "256 MB" }
  }
}
```

---

## 🎯 What to Check

### ✅ All Good:
```json
{
  "status": "healthy",
  "services": {
    "database": { "status": "healthy" }
  }
}
```

### ⚠️ Issues:
```json
{
  "status": "degraded",
  "services": {
    "database": { "status": "unhealthy", "error": "..." }
  }
}
```

---

## 🔗 Quick Links

**Full Documentation**: See `medusa-backend/HEALTH_ENDPOINTS.md` in your repo

**Your Endpoints** (replace with your actual URL):
- Detailed: `https://backend-production-xxxx.up.railway.app/health`
- Simple: `https://backend-production-xxxx.up.railway.app/health/simple`
- Medusa Health: `https://backend-production-xxxx.up.railway.app/health` (built-in)

---

## 📊 Set Up Monitoring

### **UptimeRobot** (Free):
1. Go to https://uptimerobot.com
2. Add Monitor → HTTP(s)
3. URL: Your `/health/simple` endpoint
4. Interval: 5 minutes
5. Get alerts via email when it's down!

### **Railway Built-in**:
1. Your Medusa service in Railway
2. Settings → Health Check
3. Path: `/health/simple`
4. Save

---

## 🐛 Troubleshooting

### Database shows unhealthy?
- Check PostgreSQL service is running
- Verify DATABASE_URL is set

### Redis not configured?
- This is OK! It falls back to in-memory
- Add Redis service for production

### MinIO not configured?
- This is OK! Uses local file storage
- Add MinIO for persistent uploads

### Email not configured?
- Add RESEND_API_KEY to send emails
- Get free key: https://resend.com

---

## ⏱️ Next Steps

1. ⏳ **Wait** for Railway to deploy (check logs)
2. ✅ **Test** `/health` endpoint
3. 📊 **Set up monitoring** (UptimeRobot recommended)
4. 🎉 **Done!** You can now monitor your backend 24/7

---

**Status**: Pushed to repo → Railway will deploy automatically! 🚀

