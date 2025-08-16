#!/bin/sh
set -e

echo "🚀 Starting Rivy Backend..."

# Wait for database to be ready
echo "⏳ Waiting for database connection..."
until pg_isready -h db -p 5432 -U rivy; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "✅ Database is ready!"

# Build the application
echo "🔨 Building application..."
npm run build

# Start the application (database sync happens in app startup)
echo "🚀 Starting server..."
exec npm run start
