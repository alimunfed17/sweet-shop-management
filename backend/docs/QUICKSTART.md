# Quick Start Guide

This guide will help you get the Sweets Management API up and running quickly.

## Prerequisites Check

Before starting, ensure you have:
- ✅ Python 3.10 or higher
- ✅ PostgreSQL installed and running
- ✅ pip package manager

## Step-by-Step Setup (5 minutes)

### 1. Install Dependencies (1 minute)

```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install requirements
pip install -r requirements.txt
```

### 2. Setup Database (2 minutes)

```bash
# Create PostgreSQL database
psql -U postgres -c "CREATE DATABASE sweets_db;"

# Or use the PostgreSQL GUI tools
```

### 3. Configure Environment (1 minute)

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your database credentials
# Minimal required changes:
# DATABASE_URL=postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/sweets_db
```

### 4. Initialize Database (1 minute)

```bash
# Run setup script
python setup_db.py

# When prompted, create an admin user:
# Email: admin@example.com
# Password: admin123 (change this!)
# Full Name: Admin User
```

### 5. Run the Application

```bash
# Start the server
uvicorn app.main:app --reload

# Server will start at: http://localhost:8000
# API Documentation: http://localhost:8000/docs
```

## Quick Test Drive

### 1. Test with curl

```bash
# Register a user
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456",
    "full_name": "Test User"
  }'

# Login and get token
TOKEN=$(curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }' | jq -r '.access_token')

# Create a sweet
curl -X POST "http://localhost:8000/api/v1/sweets" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Chocolate Bar",
    "category": "Chocolate",
    "price": 2.99,
    "quantity": 100
  }'

# Get all sweets
curl "http://localhost:8000/api/v1/sweets" \
  -H "Authorization: Bearer $TOKEN"
```

### 2. Test with Browser

1. Open http://localhost:8000/docs
2. Click "Authorize" button
3. Register and login to get token
4. Use token to test all endpoints interactively

## Running Tests

```bash
# Run all tests
pytest

# Run with coverage report
pytest --cov=app --cov-report=html

# Open coverage report
# open htmlcov/index.html  # On Mac
# start htmlcov/index.html  # On Windows
```

## Common Commands

```bash
# Start development server
uvicorn app.main:app --reload

# Run tests
pytest

# Run specific test file
pytest tests/test_auth.py

# Run with verbose output
pytest -v

# Check code coverage
pytest --cov=app tests/
```

## Troubleshooting

### "ModuleNotFoundError: No module named 'app'"
```bash
# Make sure you're in the project root directory
# and virtual environment is activated
source venv/bin/activate
```

### "Database connection error"
```bash
# Check PostgreSQL is running
sudo service postgresql status  # Linux
brew services list  # Mac

# Verify DATABASE_URL in .env file
# Ensure database exists
psql -U postgres -l | grep sweets_db
```

### "Tests failing"
```bash
# Tests use in-memory SQLite, no PostgreSQL needed
# Ensure all dependencies are installed
pip install -r requirements.txt

# Run tests with verbose output
pytest -v
```

## Next Steps

1. **Read the API Documentation**: http://localhost:8000/docs
2. **Explore Test Files**: Check `tests/` directory for examples
3. **Review README.md**: For detailed information
4. **Try API Endpoints**: Use Postman or curl to interact with API

## Project Structure Overview

```
project/
├── app/                    # Main application code
│   ├── api/               # API endpoints
│   ├── core/              # Security & dependencies
│   ├── models/            # Database models
│   ├── schemas/           # Pydantic schemas
│   └── tests/             # Test files
│   └── main.py            
├── requirements.txt       # Python dependencies
└── .env                   # Configuration (create from .env.example)
```

## Development Workflow

1. **Write Tests First** (TDD approach)
   ```bash
   # Add test in tests/test_*.py
   pytest tests/test_*.py  # Watch it fail
   ```

2. **Implement Feature**
   ```bash
   # Add code in app/
   ```

3. **Run Tests**
   ```bash
   pytest  # Watch it pass
   ```

4. **Test Manually**
   ```bash
   # Test via http://localhost:8000/docs
   ```

## Getting Help

- Check the main [README.md](README.md) for detailed documentation
- Look at test files in `tests/` directory for usage examples
- Explore the interactive API docs at `/docs` endpoint
- Review code comments for implementation details
