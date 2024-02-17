# Use a smaller base image for the builder stage
ARG PYTHON_VERSION=3.11-slim-bullseye
FROM python:${PYTHON_VERSION} AS builder

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Create a working directory
WORKDIR /code

# Install dependencies
COPY requirements.txt /tmp/requirements.txt
RUN set -ex \
    && pip install --upgrade pip \
    && pip install -r /tmp/requirements.txt \
    && rm -rf /root/.cache/

# Copy your FastAPI application code
COPY . /code

# Install Uvicorn
RUN pip install uvicorn

# Final image
FROM python:${PYTHON_VERSION}

# Copy only the necessary files from the builder stage
COPY --from=builder /code /code

# Expose the port
EXPOSE 8000

# Define the command to run your FastAPI application with Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
