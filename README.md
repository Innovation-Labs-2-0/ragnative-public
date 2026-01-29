
# RagNative

## Overview

**RAGNative** is a plug-and-play, embeddable AI chatbot platform that enables organizations to create context-aware assistants using their own documents. It simplifies building intelligent chat experiences with minimal setup, delivering accurate and relevant responses tailored to your data.




# RAG Platform – Server Setup Guide

This guide explains **how to run the application on your server**.
No internal or development knowledge is required.

---

## 📋 Prerequisites

Make sure the server/system has:

* **Docker** (v20+ recommended)
* **Docker Compose** (v2+)
* **Git**
* Internet access (to pull Docker images)

Check installation:

```bash
docker --version
docker compose version
git --version
```

---

## 📦 Step 1: Clone the Repository

Clone the repository provided to you:

```bash
git clone https://github.com/Innovation-Labs-2-0/ragnative-public.git
cd ragnative-public
```
---

## 🔐 Step 2: Generate Machine Fingerprint

Before running the application, a **license must be generated specifically for your machine/server**.

### Run the fingerprint script

From the repository root:

```bash
python machine_fingerprint.py
```

(or)

```bash
python3 machine_fingerprint.py
```
### ⚠️ Linux (Non-Root Users)

If you are running on **Linux** and are **not a root user**, run the command with `sudo`:

```bash
sudo python machine_fingerprint.py
```

or

```bash
sudo python3 machine_fingerprint.py
```

This ensures the script can correctly read required system information.

---

### Output

This command generates a **JSON file** containing a **hashed machine fingerprint**, for example:

```json
{
  "fingerprint": "9c8b3f4d7a1e...."
}
```

📌 **Important**

* This fingerprint uniquely identifies your server.
* The application **will not run without a valid license**.

---

## 📤 Step 3: Send Fingerprint to Us

Send the generated **JSON fingerprint file** to the product/support team.

➡️ We will use this fingerprint to generate a **license file** for your system.

---

## 📄 Step 4: Add the License File

After you receive the license:

1. Locate the `licenses/` directory in the repo
2. Replace the existing dummy license file:

```text
licenses/license.txt
```

with the **license file provided to you**.

📌 File name must remain:

```
license.txt
```

---

## 🔧 Step 5: Update Configuration (IMPORTANT)

Before starting the application, **you must update configuration values to match your server IP or domain**.

### 1️⃣ Backend Configuration (docker-compose.yml)

Open `docker-compose.yml` and update the following environment variables **with your server IP or domain**:

```yaml
BASE_URL=http://<YOUR_SERVER_IP>:3000
CORS_ORIGINS=http://<YOUR_SERVER_IP>:3000
```

📌 Notes:

* Replace `<YOUR_SERVER_IP>` with the actual IP or domain of your server
* `CORS_ORIGINS` **must not be a JSON array** — use a comma-separated value if multiple origins are required

Example:

```yaml
CORS_ORIGINS=http://localhost:3000,http://xx.xx.xx.xx:3000
```

---

### 2️⃣ Frontend Environment File (.env)

Open `frontend/.env` and update:

```env
REACT_APP_API_BASE_URL=http://<YOUR_SERVER_IP>:9000
```

📌 This value **must point to the backend server** and match the backend port.

---

## 🐳 Step 6: Start the Application Using Docker

Once the license is in place, start the application:

```bash
docker compose up
```

This command will:

* Start the **backend**
* Start the **frontend**
* Start **MongoDB**, **Redis**, **LibreOffice (PDF conversion)** and all required services

⏳ First run may take a few minutes (Docker images will be downloaded).

---

### Access the application

* **Frontend**:

  ```
  http://<SERVER_IP>:3000
  ```

---