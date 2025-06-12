#!/bin/bash

# FlowBooks Associate Railway Deployment Script

echo "🚀 Starting FlowBooks Associate deployment to Railway..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  DATABASE_URL not set - running in fallback mode"
else
    echo "✅ Database connection configured"
    
    # Run migrations
    echo "📦 Running database migrations..."
    node scripts/migrate.js
    
    if [ $? -eq 0 ]; then
        echo "✅ Migrations completed successfully"
    else
        echo "❌ Migration failed"
        exit 1
    fi
fi

# Start the application
echo "🚀 Starting FlowBooks Associate..."
npm start