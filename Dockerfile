# Use official Python 3.10 image as base
FROM python:3.10-slim

# Set working directory inside the container
WORKDIR /

# # Prevent Python from writing .pyc files and enable unbuffered logs
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir unoserver==3.0.1

COPY <BACKEND_EXECUTABLE_NAME> /<BACKEND_EXECUTABLE_NAME>
RUN chmod +x /<BACKEND_EXECUTABLE_NAME> 


EXPOSE 9000

CMD ["./<BACKEND_EXECUTABLE_NAME>"]