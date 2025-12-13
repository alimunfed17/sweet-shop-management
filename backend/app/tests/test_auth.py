class TestUserRegistration:
    """Test cases for user registration endpoint."""
    
    def test_register_user_success(self, client, test_user_data):
        response = client.post("/api/v1/auth/register", json=test_user_data)

        assert response.status_code == 201
        data = response.json()

        assert data["email"] == test_user_data["email"]
        assert data["full_name"] == test_user_data["full_name"]
        assert "id" in data
        assert "hashed_password" not in data
        assert data["is_admin"] is False
    
    def test_register_user_duplicate_email(self, client, test_user_data):
        client.post("/api/v1/auth/register", json=test_user_data)

        response = client.post("/api/v1/auth/register", json=test_user_data)

        assert response.status_code == 400
        assert "already registered" in response.json()["detail"].lower()
    
    def test_register_user_invalid_email(self, client):
        response = client.post("/api/v1/auth/register", json={
            "email": "invalid-email",
            "password": "password123",
            "full_name": "Test User"
        })

        assert response.status_code == 422
    
    def test_register_user_missing_fields(self, client):
        response = client.post("/api/v1/auth/register", json={
            "email": "test@example.com"
        })

        assert response.status_code == 422


class TestUserLogin:
    """Test cases for user login endpoint."""
    
    def test_login_success(self, client, test_user_data):
        client.post("/api/v1/auth/register", json=test_user_data)
        
        response = client.post("/api/v1/auth/login", json={
            "email": test_user_data["email"],
            "password": test_user_data["password"]
        })

        assert response.status_code == 200
        data = response.json()

        assert "access_token" in data
        assert data["token_type"] == "bearer"
    
    def test_login_wrong_password(self, client, test_user_data):
        client.post("/api/v1/auth/register", json=test_user_data)
        
        response = client.post("/api/v1/auth/login", json={
            "email": test_user_data["email"],
            "password": "wrongpassword"
        })

        assert response.status_code == 401
        assert "incorrect" in response.json()["detail"].lower()
    
    def test_login_nonexistent_user(self, client):
        response = client.post("/api/v1/auth/login", json={
            "email": "nonexistent@example.com",
            "password": "password123"
        })

        assert response.status_code == 401
    
    def test_login_missing_credentials(self, client):
        response = client.post("/api/v1/auth/login", json={
            "email": "test@example.com"
        })

        assert response.status_code == 422
