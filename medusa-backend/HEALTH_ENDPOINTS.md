# Health Check Endpoints

## Overview

Your Medusa v2 backend has comprehensive health check endpoints to monitor system status and service availability.

## Endpoints

### 1. Detailed Health Check

**URL**: `/health`  
**Method**: GET  
**Auth**: None required  
**Response**: Comprehensive system and service status

#### Example Request:

```bash
curl https://your-medusa.railway.app/health
```

#### Example Response:

```json
{
  "status": "healthy",
  "timestamp": "2025-10-14T14:30:00.000Z",
  "uptime": 3600,
  "environment": "production",
  "services": {
    "database": {
      "status": "healthy",
      "type": "PostgreSQL",
      "message": "Connection successful"
    },
    "redis": {
      "status": "configured",
      "message": "Redis URL is set (used for event bus & workflows)"
    },
    "minio": {
      "status": "configured",
      "endpoint": "bucket-production.railway.app",
      "message": "MinIO file storage is configured"
    },
    "meilisearch": {
      "status": "configured",
      "host": "meilisearch-production.railway.app:7700",
      "message": "Search engine is configured"
    },
    "email": {
      "status": "configured",
      "provider": "Resend",
      "from": "noreply@yourdomain.com"
    },
    "stripe": {
      "status": "configured",
      "message": "Payment processing is configured",
      "mode": "test"
    }
  },
  "configuration": {
    "cors": {
      "store": "https://your-frontend.railway.app",
      "admin": "https://your-frontend.railway.app"
    },
    "workerMode": "shared",
    "adminDisabled": false
  },
  "system": {
    "nodeVersion": "v22.0.0",
    "platform": "linux",
    "memory": {
      "total": "512 MB",
      "used": "256 MB"
    }
  }
}
```

#### Status Codes:

- **200**: All services healthy
- **503**: One or more services degraded (status will be "degraded")

---

### 2. Simple Health Check

**URL**: `/health/simple`  
**Method**: GET  
**Auth**: None required  
**Response**: Quick status check (ideal for uptime monitoring)

#### Example Request:

```bash
curl https://your-medusa.railway.app/health/simple
```

#### Example Response (Success):

```json
{
  "status": "ok",
  "timestamp": "2025-10-14T14:30:00.000Z",
  "uptime": 3600
}
```

#### Example Response (Error):

```json
{
  "status": "error",
  "timestamp": "2025-10-14T14:30:00.000Z",
  "error": "Connection to database failed"
}
```

#### Status Codes:

- **200**: Service is up and database is accessible
- **503**: Service is down or database unavailable

---

## Use Cases

### 1. Uptime Monitoring (UptimeRobot, Pingdom, etc.)

Use the **simple endpoint** for uptime monitoring services:

```
Monitor URL: https://your-medusa.railway.app/health/simple
Expected Response: "ok"
```

### 2. Detailed System Status

Use the **detailed endpoint** when you need to:
- Debug configuration issues
- Check which services are available
- Monitor system resources
- Verify integrations are working

### 3. Deployment Verification

After deploying, check the health endpoint to ensure:
- Database migrations completed
- Redis is connected
- All integrations are configured
- CORS settings are correct

---

## Service Status Values

### Possible Status Values:

- **`healthy`**: Service is working correctly
- **`configured`**: Service is configured and should be working
- **`not_configured`**: Service is not configured (using fallback if available)
- **`unhealthy`**: Service is configured but not responding
- **`error`**: An error occurred checking the service

### Overall Status:

- **`healthy`**: All critical services are operational
- **`degraded`**: Some services are unavailable but system is operational
- **`error`**: Critical services are down

---

## Testing in Development

### Using cURL:

```bash
# Detailed health check
curl https://your-medusa.railway.app/health | jq

# Simple health check
curl https://your-medusa.railway.app/health/simple
```

### Using Browser:

Simply visit:
- `https://your-medusa.railway.app/health`
- `https://your-medusa.railway.app/health/simple`

### Using HTTPie:

```bash
http GET https://your-medusa.railway.app/health
```

### Using Postman:

1. Create new GET request
2. URL: `https://your-medusa.railway.app/health`
3. Send request
4. View formatted JSON response

---

## Monitoring Setup

### Railway Dashboard

1. Go to your Medusa service in Railway
2. Add a health check:
   - Path: `/health/simple`
   - Timeout: 30s
   - Interval: 60s

### UptimeRobot

1. Add new monitor
2. Monitor Type: HTTP(s)
3. URL: `https://your-medusa.railway.app/health/simple`
4. Alert Contacts: Your email
5. Check interval: 5 minutes

### Custom Monitoring Script

```javascript
// monitor.js
const fetch = require('node-fetch');

async function checkHealth() {
  try {
    const response = await fetch('https://your-medusa.railway.app/health');
    const data = await response.json();
    
    console.log(`Status: ${data.status}`);
    console.log(`Uptime: ${data.uptime} seconds`);
    
    // Alert if any service is unhealthy
    for (const [service, status] of Object.entries(data.services)) {
      if (status.status === 'unhealthy' || status.status === 'error') {
        console.error(`⚠️ ${service} is ${status.status}`);
        // Send alert (email, Slack, etc.)
      }
    }
  } catch (error) {
    console.error('Health check failed:', error.message);
    // Send critical alert
  }
}

// Run every 5 minutes
setInterval(checkHealth, 5 * 60 * 1000);
checkHealth(); // Run immediately
```

---

## Troubleshooting

### Database Shows Unhealthy

**Check:**
- PostgreSQL service is running in Railway
- DATABASE_URL environment variable is correct
- Database hasn't reached connection limit

### Redis Shows Not Configured

**Expected if:**
- You haven't added a Redis service
- System will use in-memory fallback (works but not scalable)

**To fix:**
- Add Redis service in Railway
- Set REDIS_URL environment variable

### MinIO Shows Not Configured

**Expected if:**
- MinIO service not added
- System will use local file storage (works but files stored in container)

**To fix:**
- Add MinIO service or use external S3-compatible storage
- Set MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY

### Email Shows Not Configured

**Expected if:**
- No email service configured
- Email notifications won't be sent

**To fix:**
- Get Resend API key from https://resend.com
- Set RESEND_API_KEY and RESEND_FROM_EMAIL

---

## API Response Fields Explained

### `uptime`
Number of seconds the server has been running since last restart

### `environment`
Current Node environment (development/production)

### `memory.used`
Current memory usage of the Node.js process

### `workerMode`
- `shared`: Single instance handles both API and background jobs
- `server`: This instance only handles API requests
- `worker`: This instance only handles background jobs

### `adminDisabled`
Whether the Medusa admin dashboard is disabled

---

## Security Notes

1. **No Sensitive Data**: Health endpoints don't expose passwords or API keys
2. **Safe to Expose**: Can be safely monitored by external services
3. **Configuration Info**: Shows which services are configured but not credentials
4. **Rate Limiting**: Consider adding rate limiting if publicly exposed

---

## Next Steps

1. ✅ Deploy these health endpoints to Railway
2. ✅ Test both `/health` and `/health/simple`
3. ✅ Set up monitoring with your preferred service
4. ✅ Add health checks to your CI/CD pipeline
5. ✅ Monitor logs for any degraded services

---

**Status**: Ready to use after deployment! 🚀

