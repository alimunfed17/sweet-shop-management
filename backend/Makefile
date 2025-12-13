.PHONY: help install setup test run clean coverage lint format

help:
	@echo "Available commands:"
	@echo "  make install   - Install dependencies"
	@echo "  make setup     - Setup database and create admin user"
	@echo "  make test      - Run all tests"
	@echo "  make coverage  - Run tests with coverage report"
	@echo "  make run       - Run development server"
	@echo "  make lint      - Run code linting"
	@echo "  make format    - Format code with black"
	@echo "  make clean     - Remove cache files"

install:
	pip install -r requirements.txt

setup:
	python setup_db.py

test:
	pytest -v

coverage:
	pytest --cov=app --cov-report=html --cov-report=term
	@echo "Coverage report generated in htmlcov/index.html"

run:
	uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

lint:
	flake8 app/ tests/ --max-line-length=100

format:
	black app/ tests/

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} +
	rm -rf .pytest_cache
	rm -rf htmlcov
	rm -rf .coverage