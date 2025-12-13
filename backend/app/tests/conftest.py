import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.database import Base, get_db
from app.main import app

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def test_user_data():
    return {
        "email": "test@example.com",
        "password": "testpassword123",
        "full_name": "Test User"
    }


@pytest.fixture
def test_admin_data():
    return {
        "email": "admin@example.com",
        "password": "adminpassword123",
        "full_name": "Admin User",
        "is_admin": True
    }


@pytest.fixture
def test_sweet_data():
    return {
        "name": "Chocolate Bar",
        "category": "Chocolate",
        "price": 2.99,
        "quantity": 100
    }


@pytest.fixture
def auth_headers(client, test_user_data):
    client.post("/api/v1/auth/register", json=test_user_data)
    response = client.post("/api/v1/auth/login", json={
        "email": test_user_data["email"],
        "password": test_user_data["password"]
    })
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def admin_headers(client, test_admin_data):
    from app.core.database import get_db
    from app.models.user import User
    from app.core.security import get_password_hash
    
    db = next(override_get_db())
    admin_user = User(
        email=test_admin_data["email"],
        hashed_password=get_password_hash(test_admin_data["password"]),
        full_name=test_admin_data["full_name"],
        is_admin=True
    )
    db.add(admin_user)
    db.commit()
    
    response = client.post("/api/v1/auth/login", json={
        "email": test_admin_data["email"],
        "password": test_admin_data["password"]
    })
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()