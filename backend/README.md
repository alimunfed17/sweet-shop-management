# Sweets Management API

A robust RESTful API built with FastAPI for managing a sweets inventory system with user authentication and role-based access control.

## Features

- **User Authentication**: JWT-based token authentication
- **Role-Based Access**: Admin and regular user roles
- **CRUD Operations**: Full management of sweets inventory
- **Search Functionality**: Search by name, category, and price range
- **Inventory Management**: Purchase and restock operations
- **Test-Driven Development**: Comprehensive test coverage

## Tech Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Authentication**: JWT (python-jose)
- **Password Hashing**: argon2 (passlib)
- **Testing**: pytest, httpx
- **Python Version**: 3.10+

## Project Structure

```
backend/
├── app/
│   ├── main.py
│   ├── api/
│   │   ├── main.py
│   │   └── routes/
│   │       ├── auth.py
│   │       └── sweets.py
│   ├── core/
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── security.py
│   │   └── deps.py
│   ├── models/
│   │   ├── user.py
│   │   └── sweets.py
│   ├── schemas/
│   │   ├── user.py
│   │   └── sweets.py
│   └── tests/
│       ├── conftest.py
│       ├── test_auth.py
│       └── test_sweets.py
├── docs/
│   ├── DOCKER_DEPLOYMENT.md
│   ├── QUICKSTART.md
│   └── TESTING_GUIDE.md
├── .dockerignore
├── docker-compose.yml
├── Dockerfile
├── Makefile
├── setup_db.py
├── .env.example
├── .gitignore
├── .python-version
├── pytest.ini
├── requirements.txt
└── README.md
```

## Setup Instructions

### 1. Prerequisites

- Python 3.10 or higher
- PostgreSQL 12 or higher
- pip (Python package manager)

### 2. Database Setup

Create a PostgreSQL database:

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE sweets_db;

# Create user (optional)
CREATE USER sweets_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE sweets_db TO sweets_user;
```

### 3. Installation

Clone the repository and install dependencies:

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Unix or MacOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 4. Environment Configuration

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/sweets_db
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
APP_NAME=Sweets Management API
DEBUG=False
```

### 5. Running the Application

```bash
# Development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

- **API Documentation**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc

## Running Tests

Run the complete test suite:

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app tests/

# Run specific test file
pytest tests/test_auth.py

# Run with verbose output
pytest -v

# Run specific test
pytest tests/test_auth.py::TestUserRegistration::test_register_user_success
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/register` | Register new user | No |
| POST | `/api/v1/auth/login` | Login user | No |

### Sweets Management

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| POST | `/api/v1/sweets` | Create sweet | Yes | No |
| GET | `/api/v1/sweets` | Get all sweets | Yes | No |
| GET | `/api/v1/sweets/search` | Search sweets | Yes | No |
| PUT | `/api/v1/sweets/:id` | Update sweet | Yes | No |
| DELETE | `/api/v1/sweets/:id` | Delete sweet | Yes | Yes |
| POST | `/api/v1/sweets/:id/purchase` | Purchase sweet | Yes | No |
| POST | `/api/v1/sweets/:id/restock` | Restock sweet | Yes | Yes |

## API Usage Examples

### 1. Register a User

```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123",
    "full_name": "John Doe"
  }'
```

### 2. Login

```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123"
  }'
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### 3. Create a Sweet

```bash
curl -X POST "http://localhost:8000/api/v1/sweets" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Chocolate Bar",
    "category": "Chocolate",
    "price": 2.99,
    "quantity": 100
  }'
```

### 4. Search Sweets

```bash
# Search by name
curl "http://localhost:8000/api/v1/sweets/search?name=chocolate" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Search by category
curl "http://localhost:8000/api/v1/sweets/search?category=Chocolate" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Search by price range
curl "http://localhost:8000/api/v1/sweets/search?min_price=2.0&max_price=5.0" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Combined search
curl "http://localhost:8000/api/v1/sweets/search?category=Chocolate&min_price=2.0&max_price=4.0" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5. Purchase a Sweet

```bash
curl -X POST "http://localhost:8000/api/v1/sweets/1/purchase" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "quantity": 5
  }'
```

### 6. Restock a Sweet (Admin only)

```bash
curl -X POST "http://localhost:8000/api/v1/sweets/1/restock" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "quantity": 50
  }'
```

## Creating an Admin User

To create an admin user, you can either:

1. **Manually in the database**:
```sql
UPDATE users SET is_admin = true WHERE email = 'admin@example.com';
```

2. **Using Python script**:
```python
from app.database import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash

db = SessionLocal()
admin = User(
    email="admin@example.com",
    full_name="Admin User",
    hashed_password=get_password_hash("adminpassword"),
    is_admin=True
)
db.add(admin)
db.commit()
```

## Test Coverage

The project follows Test-Driven Development (TDD) principles with comprehensive test coverage:

- **Authentication Tests**: 10+ tests covering registration, login, and token validation
- **Sweets Management Tests**: 20+ tests covering all CRUD operations
- **Search Tests**: Tests for name, category, and price range filtering
- **Authorization Tests**: Tests for admin-only operations
- **Edge Cases**: Tests for error handling and validation

## Development Guidelines

### Running in Development Mode

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Code Style

The project follows PEP 8 guidelines. Run linting:

```bash
# Install development dependencies
pip install flake8 black

# Format code
black app/ tests/

# Lint code
flake8 app/ tests/
```

### Adding New Features

1. Write tests first (TDD approach)
2. Implement the feature
3. Run tests to ensure they pass
4. Update documentation

## Production Deployment

### Security Considerations

1. **Change SECRET_KEY**: Generate a strong secret key
```python
import secrets
secrets.token_urlsafe(32)
```

2. **Use HTTPS**: Always use HTTPS in production
3. **Environment Variables**: Never commit `.env` file
4. **Database Security**: Use strong passwords and restrict access
5. **CORS**: Configure allowed origins appropriately
6. **Rate Limiting**: Consider adding rate limiting middleware

### Database Migrations

For production, use Alembic for database migrations:

```bash
pip install alembic
alembic init migrations
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check PostgreSQL is running
   - Verify DATABASE_URL in .env
   - Ensure database exists

2. **Import Errors**
   - Activate virtual environment
   - Install all requirements: `pip install -r requirements.txt`

3. **Test Failures**
   - Ensure test database is accessible
   - Check if all migrations are applied

## License

This project is licensed under the MIT License.

