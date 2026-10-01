FROM python:3.11-slim

WORKDIR /app

# Install system dependencies needed for compiling some packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Generate demo data, seed database, and train initial models if not already present
ENV PYTHONPATH=/app
ENV ENVIRONMENT=production
ENV PORT=8000
ENV HOST=0.0.0.0

EXPOSE 8000

CMD ["sh", "-c", "python scripts/train_models.py && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
