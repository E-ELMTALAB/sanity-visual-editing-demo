#!/bin/bash
# Railway startup script for Medusa
# This runs migrations before starting the server

echo "🚀 Starting Medusa on Railway..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL is not set!"
    exit 1
fi

# Check if REDIS_URL is set
if [ -z "$REDIS_URL" ]; then
    echo "❌ ERROR: REDIS_URL is not set!"
    exit 1
fi

echo "✅ Environment variables validated"

# Run migrations
echo "🔄 Running database migrations..."
npm run migrate

# Check if migrations were successful
if [ $? -eq 0 ]; then
    echo "✅ Migrations completed successfully"
else
    echo "⚠️  Migrations failed, but continuing..."
fi

# Start Medusa server
echo "🚀 Starting Medusa server..."
exec medusa start

