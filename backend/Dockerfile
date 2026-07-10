# ─── Stage 1: dependency builder ───────────────────────────────────────────────
FROM python:3.11-slim AS builder

WORKDIR /build

# Install build-time tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies into a local directory
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --prefix=/install --no-warn-script-location -r requirements.txt


# ─── Stage 2: lean runtime image ────────────────────────────────────────────────
FROM python:3.11-slim AS runtime

# Create a non-root user for security
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /install /usr/local

# Copy application source
COPY ./app ./app

# Switch to non-root user
USER appuser

# Expose the API port
EXPOSE 8000

# Health-check so Docker / Cloud Run knows when the service is ready
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/api/v1/health')" || exit 1

# Use shell form so $PORT is expanded at runtime (Cloud Run sends PORT=8080)
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
