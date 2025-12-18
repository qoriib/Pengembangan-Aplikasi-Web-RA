#!/bin/bash

# Production Startup Script for Pyramid Backend
# Jalankan dengan: ./start_production.sh

echo "Starting Pyramid Backend Server in Production Mode..."
echo ""

# Buat folder log jika belum ada
mkdir -p logs

# Jalankan dengan uWSGI untuk production
echo "Starting server with uWSGI..."
echo ""
echo "Backend will be available at: http://0.0.0.0:8000"
echo "Press Ctrl+C to stop the server"
echo ""

uwsgi --paste config:production.ini --http 0.0.0.0:8000 --master --processes 4 --logto logs/uwsgi.log