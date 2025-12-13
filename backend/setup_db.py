import sys
from app.core.database import create_tables, SessionLocal
from app.models.user import User
from app.core.security import get_password_hash


def setup_database():
    print("Creating database tables...")
    create_tables()
    print("✓ Database tables created successfully!")


def create_admin_user(email: str, password: str, full_name: str):
    db = SessionLocal()
    try:
        existing_admin = db.query(User).filter(User.email == email).first()
        if existing_admin:
            print(f"⚠ Admin user with email {email} already exists!")
            return
        
        admin = User(
            email=email,
            full_name=full_name,
            hashed_password=get_password_hash(password),
            is_admin=True
        )
        db.add(admin)
        db.commit()
        print(f"✓ Admin user created successfully!")
        print(f"  Email: {email}")
        print(f"  Name: {full_name}")
    except Exception as e:
        print(f"✗ Error creating admin user: {e}")
        db.rollback()
    finally:
        db.close()


def main():
    auto_mode = len(sys.argv) > 1 and sys.argv[1] == '--auto'
    
    print("=" * 50)
    print("Sweets Management API - Database Setup")
    print("=" * 50)
    print()
    
    setup_database()
    print()
    
    if auto_mode:
        print("Auto mode: Creating default admin user...")
        create_admin_user(
            email="admin@example.com",
            password="admin123",
            full_name="Admin User"
        )
    else:
        create_admin = input("Do you want to create an admin user? (y/n): ").lower()
        if create_admin == 'y':
            print()
            print("Enter admin user details:")
            email = input("Email: ")
            password = input("Password: ")
            full_name = input("Full Name: ")
            
            print()
            create_admin_user(email, password, full_name)
    
    print()
    print("=" * 50)
    print("Setup complete! You can now run the application:")
    print("  uvicorn app.main:app --reload")
    print("=" * 50)


if __name__ == "__main__":
    main()