# Use official Python 3.10 image as base
FROM python:3.10-slim

# Set working directory inside the container
WORKDIR /

# # Prevent Python from writing .pyc files and enable unbuffered logs
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libreoffice \
    libreoffice-writer \
    libreoffice-calc \
    libreoffice-impress \
    fonts-dejavu \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/*


COPY app_exe /app_exe
RUN chmod +x /app_exe


EXPOSE 9000

CMD ["./app_exe"]