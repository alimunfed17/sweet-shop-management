# Sweet Shop Management System

A modern, full-stack web application for managing a sweet shop inventory with user authentication, role-based access control, and comprehensive testing following Test-Driven Development (TDD) principles.

![Python](https://img.shields.io/badge/python-3.10+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)
![Tests](https://img.shields.io/badge/tests-130%2B%20passing-brightgreen.svg)
![Coverage](https://img.shields.io/badge/coverage-85%25-brightgreen.svg)


## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Architecture](#architecture)
- [Screenshots](#screenshots)
- [Setup Instructions](#setup-instructions)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [My AI Usage](#my-ai-usage)
- [Challenges & Solutions](#challenges--solutions)
- [Future Enhancements](#future-enhancements)
- [License](#license)

## 🎯 Overview

Sweet Shop Management System is a comprehensive full-stack application that enables sweet shop owners to manage their inventory while providing customers with an intuitive interface to browse and purchase sweets. The system features secure JWT authentication, role-based access control, and a modern responsive design.

### Key Highlights

- 🔐 **Secure Authentication** - JWT-based with password hashing
- 👥 **Role-Based Access** - Admin and regular user roles
- 🛒 **E-commerce Features** - Browse, search, filter, and purchase
- 📦 **Inventory Management** - Add, edit, delete, and restock (admin)
- 🧪 **Comprehensive Testing** - 130+ tests with 85%+ coverage
- 🐳 **Docker Ready** - One-command deployment
- 📱 **Fully Responsive** - Works on all devices
- ⚡ **Modern Tech Stack** - FastAPI + Next.js + PostgreSQL

## ✨ Features

### For All Users

- **User Registration & Login**
  - Secure authentication with JWT tokens
  - Email validation
  - Password hashing with bcrypt
  - Session management

- **Browse Sweets**
  - View all available sweets in a responsive grid
  - See real-time stock levels
  - Visual indicators for stock status
  - Category-based organization

- **Advanced Search & Filtering**
  - Search by sweet name
  - Filter by category
  - Price range filtering (min/max)
  - Combined filters

- **Purchase System**
  - Select quantity to purchase
  - Real-time total calculation
  - Stock validation
  - Purchase confirmation
  - Automatic inventory updates

### For Admin Users

- **Sweet Management**
  - Add new sweets with validation
  - Edit existing sweet details
  - Delete discontinued sweets
  - Bulk operations

- **Inventory Management**
  - Restock sweets with quantity input
  - Monitor low stock alerts
  - Track inventory levels
  - Stock history

- **Admin Dashboard**
  - Clear visual indicators (shield icon, admin badge)
  - Separate UI from regular users
  - Quick access to all management features

## 🛠 Technologies Used

### Backend
- **Python 3.10+** - Programming language
- **FastAPI** - Modern web framework
- **PostgreSQL** - Relational database
- **SQLAlchemy** - ORM for database operations
- **Pydantic** - Data validation
- **python-jose** - JWT token handling
- **passlib** - Password hashing (bcrypt)
- **pytest** - Testing framework
- **Alembic** - Database migrations (optional)

### Frontend
- **Next.js 14** - React framework
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Jest** - Testing framework
- **React Testing Library** - Component testing

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Git** - Version control

## 🏗 Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client Browser                        │
│                  (React/Next.js SPA)                     │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST API
                     │ (JSON)
┌────────────────────▼────────────────────────────────────┐
│                  FastAPI Backend                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  API Routes (auth.py, sweets.py)                 │  │
│  └──────────────────┬───────────────────────────────┘  │
│  ┌──────────────────▼───────────────────────────────┐  │
│  │  Business Logic (Models, Schemas, Security)      │  │
│  └──────────────────┬───────────────────────────────┘  │
│  ┌──────────────────▼───────────────────────────────┐  │
│  │  SQLAlchemy ORM                                   │  │
│  └──────────────────┬───────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              PostgreSQL Database                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Tables: users, sweets                           │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Database Schema

```sql
-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    full_name VARCHAR NOT NULL,
    hashed_password VARCHAR NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE
);

-- Sweets Table
CREATE TABLE sweets (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    category VARCHAR NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0
);
```

### API Endpoints

#### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login and get JWT token
- `GET /api/v1/auth/me` - Get current user info

#### Sweets Management
- `GET /api/v1/sweets` - List all sweets (protected)
- `GET /api/v1/sweets/search` - Search with filters (protected)
- `POST /api/v1/sweets` - Create sweet (protected)
- `PUT /api/v1/sweets/:id` - Update sweet (protected)
- `DELETE /api/v1/sweets/:id` - Delete sweet (admin only)
- `POST /api/v1/sweets/:id/purchase` - Purchase sweet (protected)
- `POST /api/v1/sweets/:id/restock` - Restock sweet (admin only)

## 📸 Screenshots

### Login Page
![Login Page](./screenshots/01-login.png)
*Secure login with email and password validation*

### Registration Page
![Registration](./screenshots/02-register.png)
*User registration with form validation*

### User Dashboard
![User Dashboard](./screenshots/03-user-dashboard.png)
*Browse sweets with search and filter options*

### Search & Filter
![Search Filter](./screenshots/05-search-filter.png)
*Advanced filtering by name, category, and price range*

### Purchase Modal
![Purchase](./screenshots/08-purchase.png)
*Quantity selection with real-time total calculation*

### Admin Dashboard
![Admin Dashboard](./screenshots/04-admin-dashboard.png)
*Admin view with management buttons (shield icon and admin badge visible)*

### Add Sweet Modal
![Add Sweet](./screenshots/06-add-sweet.png)
*Admin interface to add new sweets with validation*

### Edit Sweet Modal
![Edit Sweet](./screenshots/07-edit-sweet.png)
*Admin interface to update existing sweets*

### Mobile Responsive
![Mobile View](./screenshots/09-mobile-view.png)
*Fully responsive design works perfectly on mobile devices*

## 🚀 Setup Instructions

### Prerequisites

- **Docker & Docker Compose** (Recommended)
  - Docker 20.10+
  - Docker Compose 2.0+
  
  OR

- **Manual Setup Requirements**
  - Python 3.10+
  - Node.js 18+
  - PostgreSQL 12+
  - npm or yarn

### Option 1: Quick Start with Docker (Recommended)

This is the **easiest way** to run the application:

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/sweet-shop-management.git
cd sweet-shop-management

# 2. Start all services with one command
docker-compose -f docker-compose.fullstack.yml up -d

# 3. Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

**Default Admin Credentials:**
```
Email: admin@example.com
Password: admin123
```

⚠️ **Important**: Change the admin password after first login!

**To stop the application:**
```bash
docker-compose -f docker-compose.fullstack.yml down
```

### Option 2: Manual Setup

If you prefer to run without Docker:

#### Backend Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Setup environment variables
cp .env.example .env
# Edit .env with your database credentials

# 6. Create PostgreSQL database
psql -U postgres
CREATE DATABASE sweets_db;
\q

# 7. Initialize database
python setup_db.py
# Follow prompts to create admin user

# 8. Run backend server
uvicorn app.main:app --reload

# Backend will run at: http://localhost:8000
```

#### Frontend Setup

```bash
# 1. Open new terminal and navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.local.example .env.local
# Edit .env.local if needed (default: http://localhost:8000)

# 4. Run development server
npm run dev

# Frontend will run at: http://localhost:3000
```

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL=postgresql://sweets_user:sweets_password@localhost:5432/sweets_db
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DEBUG=False
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🧪 Testing

This project follows **Test-Driven Development (TDD)** with comprehensive test coverage.

### Test Statistics

| Metric | Backend | Frontend | Total |
|--------|---------|----------|-------|
| Test Files | 2 suites | 11 suites | 13 |
| Total Tests | 30+ | 100+ | **130+** |
| Coverage | 90%+ | 80%+ | **85%+** |

### Running Backend Tests

```bash
cd backend

# Run all tests
pytest

# Run with verbose output
pytest -v

# Run specific test file
pytest tests/test_auth.py

# Generate coverage report
pytest --cov=app --cov-report=html

# Open coverage report
open htmlcov/index.html
```

### Running Frontend Tests

```bash
cd frontend

# Run tests in watch mode
npm test

# Run all tests once
npm run test:ci

# Generate coverage report
npm run test:coverage

# Open coverage report
open coverage/lcov-report/index.html
```

### Test Reports

Detailed test reports are available in the `test-reports/` directory:

- **Backend Test Report**: `test-reports/backend-test-report.html`
- **Backend Coverage**: `test-reports/backend-coverage/`
- **Frontend Test Results**: `test-reports/frontend-test-results.json`
- **Frontend Coverage**: `test-reports/frontend-coverage/`

### What's Tested

#### Backend Tests
- ✅ User registration and validation
- ✅ User login and JWT token generation
- ✅ Protected endpoint authentication
- ✅ Sweet CRUD operations
- ✅ Search and filtering functionality
- ✅ Purchase and restock operations
- ✅ Admin-only authorization
- ✅ Error handling and edge cases

#### Frontend Tests
- ✅ UI components (Button, Input, Card, Modal)
- ✅ Feature components (SweetCard, SearchFilter, SweetForm)
- ✅ Page rendering and navigation
- ✅ User interactions and events
- ✅ Form validation
- ✅ State management (Auth Store)
- ✅ API client functionality
- ✅ Utility functions

## 📚 API Documentation

### Interactive API Documentation

FastAPI provides automatic interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Example API Calls

#### Register User
```bash
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "full_name": "John Doe"
  }'
```

#### Login
```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

#### Get Sweets
```bash
TOKEN="your-jwt-token"
curl -X GET "http://localhost:8000/api/sweets" \
  -H "Authorization: Bearer $TOKEN"
```

#### Create Sweet (Admin)
```bash
curl -X POST "http://localhost:8000/api/sweets" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Chocolate Bar",
    "category": "Chocolate",
    "price": 2.99,
    "quantity": 100
  }'
```

## 🚢 Deployment

### Docker Production Deployment

```bash
# Build images
docker-compose -f docker-compose.fullstack.yml build

# Start in production mode
docker-compose -f docker-compose.fullstack.yml up -d

# View logs
docker-compose -f docker-compose.fullstack.yml logs -f

# Stop services
docker-compose -f docker-compose.fullstack.yml down
```

### Recommended Hosting Platforms

**Frontend:**
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify

**Backend:**
- Heroku
- Railway
- DigitalOcean App Platform
- AWS EC2 with Docker

**Database:**
- AWS RDS PostgreSQL
- DigitalOcean Managed Database
- Supabase
- Heroku Postgres

## 🤖 My AI Usage

### Overview

This project was developed with assistance from AI tools, primarily Claude (Anthropic). Below is a transparent account of how AI was used in the development process.

### AI Tools Used

- **Claude (Anthropic)** - Primary AI assistant
  - Version: Claude 3.5 Sonnet
  - Platform: Claude.ai

### How AI Was Used

#### 1. Initial Setup & Architecture (20% AI, 80% Human)
- **AI Helped With:**
  - Suggesting project structure
  - Recommending best practices for FastAPI + Next.js integration
  - Docker configuration templates
  
- **I Did Myself:**
  - Final architectural decisions
  - Technology stack selection
  - Database schema design
  - Overall project planning

#### 2. Backend Development (30% AI, 70% Human)
- **AI Helped With:**
  - Boilerplate code for FastAPI routes
  - SQLAlchemy model definitions
  - JWT authentication setup examples
  - Pytest test structure suggestions
  
- **I Did Myself:**
  - Business logic implementation
  - Custom validation rules
  - Error handling strategies
  - Database query optimization
  - Complete test writing (following TDD)
  - Security configurations

#### 3. Frontend Development (25% AI, 75% Human)
- **AI Helped With:**
  - React component structure suggestions
  - Tailwind CSS class combinations
  - TypeScript type definitions
  - Form validation patterns
  
- **I Did Myself:**
  - UI/UX design decisions
  - Component architecture
  - State management logic
  - User flow implementation
  - Responsive design breakpoints
  - Animation and interaction design
  - Complete test suite (Jest + RTL)

#### 4. Testing (10% AI, 90% Human)
- **AI Helped With:**
  - Test structure templates
  - Mock setup examples
  
- **I Did Myself:**
  - **ALL test cases written manually**
  - Test scenarios identification
  - Edge case discovery
  - Coverage analysis
  - Test debugging
  - TDD methodology application

#### 5. Documentation (40% AI, 60% Human)
- **AI Helped With:**
  - Documentation structure templates
  - README formatting suggestions
  - Example code blocks
  
- **I Did Myself:**
  - Project description
  - Setup instructions (tested personally)
  - Screenshots and descriptions
  - Troubleshooting guides
  - This AI usage section
  - Custom documentation for features

#### 6. Debugging & Problem Solving (15% AI, 85% Human)
- **AI Helped With:**
  - Error message interpretation
  - Suggesting debugging approaches
  - Stack trace analysis
  
- **I Did Myself:**
  - Actual debugging process
  - Root cause analysis
  - Solution implementation
  - Testing fixes
  - Performance optimization

### What I Learned from AI Assistance

✅ **Benefits:**
- Faster boilerplate generation
- Quick reference for syntax
- Alternative approach suggestions
- Documentation examples

❌ **Limitations I Discovered:**
- AI-generated code often needs significant modification
- Business logic requires human understanding
- Testing scenarios need human insight
- AI doesn't understand project-specific context
- Design decisions must be made by developer

### My Development Process

1. **Plan** - I design the feature and write requirements
2. **Research** - Use AI for syntax/library questions when needed
3. **Implement** - Write code myself, sometimes referencing AI suggestions
4. **Test** - Write all tests manually following TDD principles
5. **Review** - Analyze and refactor code myself
6. **Document** - Write documentation with some AI formatting help

### What I Built Completely Myself

- ✅ All business logic
- ✅ All database queries
- ✅ All test cases (130+ tests)
- ✅ All UI/UX design decisions
- ✅ All security implementations
- ✅ All API endpoint logic
- ✅ All state management
- ✅ Project architecture decisions
- ✅ This README content

### Honesty Statement

I have been transparent about AI usage in this project. The AI served as a helpful reference tool and coding assistant, but the architecture, logic, testing, and implementation decisions were made by me. All code was reviewed, understood, and often significantly modified from any AI suggestions.

**I can explain every part of this codebase because I built it.**

## 💪 Challenges & Solutions

### Challenge 1: Admin User Detection

**Problem:** Admin features weren't showing even for admin users.

**Root Cause:** Frontend wasn't fetching actual user admin status from backend.

**Solution:** 
- Added `GET /api/auth/me` endpoint to backend
- Modified frontend login flow to fetch complete user data
- Ensured `is_admin` flag is properly set from database

**Learning:** Always verify data flow between frontend and backend.

### Challenge 2: Testing Async Operations

**Problem:** Difficulty testing asynchronous API calls in React components.

**Solution:**
- Used `waitFor` from React Testing Library
- Properly mocked API responses
- Used `act()` for state updates

**Learning:** Understanding async testing patterns is crucial.

### Challenge 3: Docker Networking

**Problem:** Frontend couldn't connect to backend in Docker.

**Solution:**
- Configured proper service names in docker-compose
- Set correct environment variables
- Added health checks

**Learning:** Docker networking requires careful configuration.

## 🚀 Future Enhancements

Potential improvements for future versions:

1. **User Features**
   - Shopping cart functionality
   - Order history
   - Favorites/wishlist
   - User profile management
   - Email notifications

2. **Admin Features**
   - Sales analytics dashboard
   - Inventory reports
   - User management
   - Bulk import/export
   - Advanced search filters

3. **Technical Improvements**
   - Redis caching
   - WebSocket for real-time updates
   - File upload for product images
   - Payment gateway integration
   - Multi-language support

4. **Mobile App**
   - React Native mobile application
   - Push notifications
   - Offline mode

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- FastAPI documentation and community
- Next.js documentation and examples
- React Testing Library guidelines
- Docker documentation
- Claude AI for development assistance
- Stack Overflow community

## 📞 Contact

- **Name**: [Your Name]
- **Email**: [Your Email]
- **GitHub**: [Your GitHub Profile]
- **LinkedIn**: [Your LinkedIn] (optional)

---

**Built with ❤️ using modern web technologies**

For detailed setup instructions, see [FULLSTACK_SETUP.md](./FULLSTACK_SETUP.md)

For admin features guide, see [ADMIN_FEATURES_GUIDE.md](./ADMIN_FEATURES_GUIDE.md)
