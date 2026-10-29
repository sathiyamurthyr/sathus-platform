FROM python:3.13-slim

WORKDIR /app

# Install dependencies
COPY pyproject.toml ./
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir .

# Copy application
COPY app ./app

# Run as non-root (UID/GID 10001)
RUN groupadd -g 10001 appuser && \
    useradd -m -u 10001 -g 10001 appuser && \
    chown -R appuser:appuser /app
USER 10001:10001

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]