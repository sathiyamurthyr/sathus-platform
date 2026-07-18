.PHONY: install dev test lint format clean

install:
	pip install --no-cache-dir --upgrade pip && \
	pip install --no-cache-dir -e ".[dev]"

dev:
	uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

test:
	pytest --cov=app --cov-report=term-missing

lint:
	ruff check app tests

format:
	ruff format app tests

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type d -name ".pytest_cache" -exec rm -rf {} +