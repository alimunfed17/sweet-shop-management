# Testing Guide - Test-Driven Development (TDD)

This guide explains the testing approach used in the Sweets Management API and how to write new tests following TDD principles.

## Overview

This project follows **Test-Driven Development (TDD)**, where tests are written before the actual implementation. This ensures:
- ✅ All code is testable
- ✅ High code coverage
- ✅ Clear specifications
- ✅ Fewer bugs
- ✅ Better design

## TDD Workflow

### The Red-Green-Refactor Cycle

1. **🔴 RED**: Write a failing test
2. **🟢 GREEN**: Write minimal code to make it pass
3. **🔵 REFACTOR**: Improve code while keeping tests green

### Example TDD Process

Let's add a new feature: "Get sweet by ID"

#### Step 1: Write the Test (RED)

```python
# tests/test_sweets.py

def test_get_sweet_by_id_success(client, auth_headers, test_sweet_data):
    """Test getting a single sweet by ID."""
    # Create a sweet
    create_response = client.post("/api/v1/sweets", json=test_sweet_data, headers=auth_headers)
    sweet_id = create_response.json()["id"]
    
    # Get sweet by ID
    response = client.get(f"/api/v1/sweets/{sweet_id}", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == sweet_id
    assert data["name"] == test_sweet_data["name"]

def test_get_nonexistent_sweet(client, auth_headers):
    """Test getting non-existent sweet returns 404."""
    response = client.get("/api/v1/sweets/99999", headers=auth_headers)
    assert response.status_code == 404
```

Run the test:
```bash
pytest tests/test_sweets.py::test_get_sweet_by_id_success -v
# Test FAILS (RED) - endpoint doesn't exist yet
```

#### Step 2: Implement the Feature (GREEN)

```python
# app/api/routes/sweets.py

@router.get("/{sweet_id}", response_model=SweetResponse)
def get_sweet_by_id(
    sweet_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a single sweet by ID."""
    sweet = db.query(Sweet).filter(Sweet.id == sweet_id).first()
    if not sweet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sweet not found"
        )
    return sweet
```

Run the test again:
```bash
pytest tests/test_sweets.py::test_get_sweet_by_id_success -v
# Test PASSES (GREEN)
```

#### Step 3: Refactor (if needed)

Improve code quality without breaking tests.

## Test Structure

### Test Files Organization

```
tests/
├── conftest.py          # Shared fixtures and configuration
├── test_auth.py         # Authentication tests
└── test_sweets.py       # Sweets management tests
```

### Test Class Organization

Tests are organized into classes by feature:

```python
class TestUserRegistration:
    """Test cases for user registration endpoint."""
    
    def test_register_user_success(self, ...):
        """Test successful registration."""
        pass
    
    def test_register_duplicate_email(self, ...):
        """Test duplicate email fails."""
        pass

class TestUserLogin:
    """Test cases for user login endpoint."""
    
    def test_login_success(self, ...):
        pass
    
    def test_login_wrong_password(self, ...):
        pass
```

## Writing Tests

### Test Naming Convention

```python
def test_<feature>_<scenario>(self, ...):
    """Test description."""
```

Examples:
- `test_create_sweet_success` - Happy path
- `test_create_sweet_without_auth` - Error case
- `test_create_sweet_invalid_price` - Validation

### Test Structure (AAA Pattern)

```python
def test_example(self, client, auth_headers):
    # ARRANGE - Setup test data
    test_data = {"name": "Test Sweet", "price": 1.99}
    
    # ACT - Perform the action
    response = client.post("/api/v1/sweets", json=test_data, headers=auth_headers)
    
    # ASSERT - Verify the outcome
    assert response.status_code == 201
    assert response.json()["name"] == "Test Sweet"
```

### Using Fixtures

Fixtures provide reusable test data and setup:

```python
@pytest.fixture
def test_sweet_data():
    """Sample sweet data for testing."""
    return {
        "name": "Chocolate Bar",
        "category": "Chocolate",
        "price": 2.99,
        "quantity": 100
    }

def test_example(client, auth_headers, test_sweet_data):
    response = client.post("/api/v1/sweets", json=test_sweet_data, headers=auth_headers)
    assert response.status_code == 201
```

## Available Fixtures

### Built-in Fixtures

| Fixture | Description | Usage |
|---------|-------------|-------|
| `client` | Test client for API requests | Make HTTP calls |
| `db_session` | Database session | Database operations |
| `auth_headers` | Auth headers for regular user | Protected endpoints |
| `admin_headers` | Auth headers for admin user | Admin endpoints |
| `test_user_data` | Sample user data | User tests |
| `test_admin_data` | Sample admin data | Admin tests |
| `test_sweet_data` | Sample sweet data | Sweet tests |

### Creating Custom Fixtures

```python
# tests/conftest.py

@pytest.fixture
def multiple_sweets(client, auth_headers):
    """Create multiple test sweets."""
    sweets = []
    for i in range(3):
        response = client.post("/api/v1/sweets", json={
            "name": f"Sweet {i}",
            "category": "Test",
            "price": i + 1.0,
            "quantity": 10
        }, headers=auth_headers)
        sweets.append(response.json())
    return sweets
```

## Test Categories

### 1. Happy Path Tests

Test the main success scenarios:

```python
def test_create_sweet_success(self, client, auth_headers, test_sweet_data):
    """Test successful sweet creation."""
    response = client.post("/api/v1/sweets", json=test_sweet_data, headers=auth_headers)
    assert response.status_code == 201
```

### 2. Error/Edge Case Tests

Test error conditions and edge cases:

```python
def test_create_sweet_invalid_price(self, client, auth_headers):
    """Test creating sweet with negative price fails."""
    response = client.post("/api/v1/sweets", json={
        "name": "Test",
        "category": "Test",
        "price": -5.0,
        "quantity": 10
    }, headers=auth_headers)
    assert response.status_code == 422
```

### 3. Authentication/Authorization Tests

Test security:

```python
def test_delete_sweet_as_regular_user(self, client, auth_headers):
    """Test regular user cannot delete sweet."""
    response = client.delete("/api/v1/sweets/1", headers=auth_headers)
    assert response.status_code == 403
```

### 4. Integration Tests

Test multiple components together:

```python
def test_purchase_workflow(self, client, auth_headers, test_sweet_data):
    """Test complete purchase workflow."""
    # Create sweet
    create_resp = client.post("/api/v1/sweets", json=test_sweet_data, headers=auth_headers)
    sweet_id = create_resp.json()["id"]
    
    # Purchase some
    purchase_resp = client.post(f"/api/v1/sweets/{sweet_id}/purchase", 
                                json={"quantity": 5}, 
                                headers=auth_headers)
    
    # Verify quantity decreased
    get_resp = client.get("/api/v1/sweets", headers=auth_headers)
    sweets = get_resp.json()
    assert sweets[0]["quantity"] == test_sweet_data["quantity"] - 5
```

## Running Tests

### Basic Commands

```bash
# Run all tests
pytest

# Run specific file
pytest tests/test_auth.py

# Run specific class
pytest tests/test_auth.py::TestUserRegistration

# Run specific test
pytest tests/test_auth.py::TestUserRegistration::test_register_user_success

# Run with verbose output
pytest -v

# Run with print statements
pytest -s
```

### Coverage Reports

```bash
# Run with coverage
pytest --cov=app

# HTML coverage report
pytest --cov=app --cov-report=html

# View report
open htmlcov/index.html
```

### Advanced Options

```bash
# Run tests matching pattern
pytest -k "register"

# Run only failed tests from last run
pytest --lf

# Stop at first failure
pytest -x

# Run in parallel (requires pytest-xdist)
pytest -n 4

# Show slowest tests
pytest --durations=10
```

## Test Coverage Goals

- **Line Coverage**: Aim for 90%+
- **Branch Coverage**: Test all code paths
- **Critical Paths**: 100% coverage for security features

### Checking Coverage

```bash
pytest --cov=app --cov-report=term-missing
```

This shows which lines are not covered.

## Best Practices

### ✅ DO

1. **Write tests first** (TDD approach)
2. **Test one thing per test**
3. **Use descriptive test names**
4. **Keep tests independent**
5. **Use fixtures for common setup**
6. **Test both success and failure cases**
7. **Mock external dependencies**
8. **Keep tests fast**

### ❌ DON'T

1. **Don't test implementation details**
2. **Don't skip edge cases**
3. **Don't write dependent tests**
4. **Don't test external libraries**
5. **Don't use sleep() in tests**
6. **Don't ignore test failures**

## Common Testing Patterns

### Testing API Responses

```python
def test_api_response_structure(self, client, auth_headers):
    response = client.get("/api/v1/sweets", headers=auth_headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    
    if len(response.json()) > 0:
        sweet = response.json()[0]
        assert "id" in sweet
        assert "name" in sweet
        assert "price" in sweet
```

### Testing Validation

```python
@pytest.mark.parametrize("invalid_price", [-1, 0, "abc", None])
def test_invalid_price_values(self, client, auth_headers, invalid_price):
    response = client.post("/api/v1/sweets", json={
        "name": "Test",
        "category": "Test",
        "price": invalid_price,
        "quantity": 10
    }, headers=auth_headers)
    assert response.status_code == 422
```

### Testing Authentication

```python
def test_endpoint_requires_auth(self, client):
    """Test endpoint requires authentication."""
    response = client.get("/api/v1/sweets")
    assert response.status_code == 401
    
def test_endpoint_with_invalid_token(self, client):
    """Test endpoint with invalid token."""
    headers = {"Authorization": "Bearer invalid_token"}
    response = client.get("/api/v1/sweets", headers=headers)
    assert response.status_code == 401
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
        with:
          python-version: '3.11'
      - run: pip install -r requirements.txt
      - run: pytest --cov=app --cov-report=xml
      - uses: codecov/codecov-action@v2
```

## Debugging Tests

### Using pytest debugging

```bash
# Drop into debugger on failure
pytest --pdb

# Drop into debugger at start of test
pytest --trace
```

### Adding debug output

```python
def test_example(self, client, auth_headers):
    response = client.post("/api/v1/sweets", json=data, headers=auth_headers)
    print(f"Response: {response.json()}")  # Use -s flag to see output
    assert response.status_code == 201
```

## Performance Testing

### Testing Response Times

```python
import time

def test_api_performance(self, client, auth_headers):
    start = time.time()
    response = client.get("/api/v1/sweets", headers=auth_headers)
    duration = time.time() - start
    
    assert response.status_code == 200
    assert duration < 0.5  # Should respond in less than 500ms
```

## Adding New Tests

### Checklist for New Features

When adding a new feature, write tests for:

- [ ] Happy path (success case)
- [ ] Authentication required
- [ ] Authorization (if admin-only)
- [ ] Invalid input validation
- [ ] Missing required fields
- [ ] Edge cases (empty, null, boundary values)
- [ ] Error messages are clear
- [ ] Database changes persist
- [ ] Related features still work

### Example: Adding "Favorites" Feature

```python
# 1. Write tests first
class TestFavorites:
    def test_add_favorite_success(self, ...):
        pass
    
    def test_get_user_favorites(self, ...):
        pass
    
    def test_remove_favorite(self, ...):
        pass
    
    def test_add_duplicate_favorite(self, ...):
        pass

# 2. Run tests (they fail - RED)
# 3. Implement feature (tests pass - GREEN)
# 4. Refactor if needed (tests still pass)
```

## Resources

- [pytest Documentation](https://docs.pytest.org/)
- [FastAPI Testing](https://fastapi.tiangolo.com/tutorial/testing/)
- [Test-Driven Development by Example](https://www.oreilly.com/library/view/test-driven-development/0321146530/)

