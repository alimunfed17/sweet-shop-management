#!/bin/bash

set -e

echo "🍬 Sweet Shop - Quick Start Script"
echo "=================================="
echo ""


if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose not found. Please install Docker Compose."
    exit 1
fi

echo "✅ Docker is running"
echo ""

echo "Choose deployment method:"
echo "1) Docker Compose (Recommended - Full Stack)"
echo "2) Manual Development Setup"
read -p "Enter choice (1 or 2): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Starting with Docker Compose..."
        echo ""
        
        if [ ! -f "docker-compose.fullstack.yml" ]; then
            echo "❌ docker-compose.fullstack.yml not found!"
            exit 1
        fi
        
        docker-compose -f docker-compose.fullstack.yml up -d
        
        echo ""
        echo "⏳ Waiting for services to be ready..."
        sleep 10
        
        echo ""
        echo "🔍 Checking service status..."
        docker-compose -f docker-compose.fullstack.yml ps
        
        echo ""
        echo "✅ Services are starting up!"
        echo ""
        echo "📍 Access your application:"
        echo "   Frontend:  http://localhost:3000"
        echo "   Backend:   http://localhost:8000"
        echo "   API Docs:  http://localhost:8000/docs"
        echo ""
        echo "🔑 Default Admin Credentials:"
        echo "   Email:     admin@example.com"
        echo "   Password:  admin123"
        echo ""
        echo "📋 Useful commands:"
        echo "   View logs:   docker-compose -f docker-compose.fullstack.yml logs -f"
        echo "   Stop:        docker-compose -f docker-compose.fullstack.yml down"
        echo "   Restart:     docker-compose -f docker-compose.fullstack.yml restart"
        echo ""
        ;;
        
    2)
        echo ""
        echo "🔧 Manual Development Setup"
        echo ""
        
        if ! command -v python3 &> /dev/null; then
            echo "❌ Python 3 not found. Please install Python 3.10+"
            exit 1
        fi
        
        if ! command -v node &> /dev/null; then
            echo "❌ Node.js not found. Please install Node.js 18+"
            exit 1
        fi
        
        echo "✅ Python and Node.js found"
        echo ""
        
        echo "📦 Setting up Backend..."
        cd backend
        
        if [ ! -d "venv" ]; then
            echo "Creating virtual environment..."
            python3 -m venv venv
        fi
        
        source venv/bin/activate
        
        if [ ! -f ".env" ]; then
            echo "Creating .env file..."
            cp .env.example .env
        fi
        
        echo "Installing dependencies..."
        pip install -r requirements.txt > /dev/null 2>&1
        
        echo "Initializing database..."
        python setup_db.py --auto
        
        echo ""
        echo "✅ Backend setup complete!"
        echo ""
        
        cd ../frontend
        echo "📦 Setting up Frontend..."
        
        if [ ! -d "node_modules" ]; then
            echo "Installing dependencies..."
            npm install > /dev/null 2>&1
        fi
        
        if [ ! -f ".env.local" ]; then
            echo "Creating .env.local file..."
            cp .env.local.example .env.local
        fi
        
        echo ""
        echo "✅ Frontend setup complete!"
        echo ""
        echo "🚀 To start the application, run these commands in separate terminals:"
        echo ""
        echo "Terminal 1 (Backend):"
        echo "  cd backend"
        echo "  source venv/bin/activate"
        echo "  uvicorn app.main:app --reload"
        echo ""
        echo "Terminal 2 (Frontend):"
        echo "  cd frontend"
        echo "  npm run dev"
        echo ""
        echo "Then visit: http://localhost:3000"
        echo ""
        ;;
        
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo "🎉 Setup complete! Happy coding! 🍬"