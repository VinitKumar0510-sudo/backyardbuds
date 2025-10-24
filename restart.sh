#!/bin/bash

echo "🔄 Restarting Backyard Bud Application..."

# Kill existing processes
echo "Stopping existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

# Wait a moment
sleep 2

# Start the application
echo "Starting application..."
npm run dev

echo "✅ Application should be running at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"