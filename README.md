# ⚡ NervOps

> **Enterprise-grade Cloud Security Posture Management (CSPM) & Azure Infrastructure Monitoring Platform**

[![Docker](https://img.shields.io/badge/Docker-Enabled-blue.svg?logo=docker)](https://www.docker.com/)
[![React](https://img.shields.io/badge/React-18-blue.svg?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg?logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-23-green.svg?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green.svg?logo=mongodb)](https://www.mongodb.com/)
[![Azure](https://img.shields.io/badge/Microsoft_Azure-SDK-0078D4.svg?logo=microsoftazure)](https://azure.microsoft.com/)

---

## 📖 Overview

**NervOps** is a full-stack Cloud Security Posture Management (CSPM) and infrastructure monitoring dashboard designed for Microsoft Azure. It empowers DevOps and Cloud Security engineers to discover resources, evaluate security posture against CIS/compliance checks, analyze Azure billing in real-time, and detect misconfigurations before they become security incidents.

### Key Capabilities

* 🛡️ **Automated Security Assessments**: Deep rule-based security evaluations across Azure resources (Virtual Machines, Storage Accounts, NSGs, Azure Bastion, Function Apps, and Firewalls).
* 📊 **Resource & Subscription Inventory**: Dynamic discovery of all Azure assets under multiple tenant subscriptions.
* 💳 **Real-time Cost & Billing Telemetry**: Instant insight into Azure consumption and billing metrics.
* 🔐 **Client-side Credential Encryption**: Zero plaintext credentials stored in code — Azure Service Principal credentials (`Tenant ID`, `Client ID`, `Client Secret`, `Subscription ID`) are encrypted client-side using AES-256 before transit and persistence.
* 🐳 **Containerized & Production Ready**: Fully Dockerized with blue/green deployment configurations and Docker Compose orchestrations.

---

## 🏗️ Architecture

```mermaid
graph TD
    Client["React Frontend (Vite) <br/> :5173"] -- "REST API / Encrypted Payloads" --> Backend["Express Backend API <br/> :5011"]
    Backend -- "Auth / Stored State" --> DB[("MongoDB <br/> :27017")]
    Backend -- "@azure/identity & Azure SDKs" --> Azure["Microsoft Azure Cloud <br/> (Resource / Security / Billing APIs)"]
```

### Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 5, Tailwind CSS, Lucide Icons, Framer Motion, Recharts |
| **Backend** | Node.js (v23), Express 4, Mongoose, JWT, Mailtrap SDK, CryptoJS |
| **Cloud Integration** | `@azure/identity`, `@azure/arm-resources`, `@azure/arm-security`, `@azure/arm-billing`, `@azure/arm-subscriptions` |
| **Database** | MongoDB (Docker container or MongoDB Atlas Cluster) |
| **Email Service** | Mailtrap (Email verification & password reset) |
| **DevOps & Infra** | Docker, Docker Compose, Blue-Green deployment scripts |

---

## 📁 Repository Structure

```
nervops/
├── frontend/                     # React + Vite admin dashboard
│   ├── src/
│   │   ├── components/           # UI widgets, metrics, tables, and settings
│   │   ├── pages/                # Overview, Analytics, Products, Users, Auth pages
│   │   ├── store/                # Zustand / Axios API auth store
│   │   └── utils/                # Crypto & date utility helpers
│   ├── Dockerfile
│   └── package.json
├── backend/                      # Express REST API
│   ├── controllers/              # Azure metrics, resources, billing & auth logic
│   ├── routes/                   # /api/auth and /api/azure route handlers
│   ├── models/                   # Mongoose schemas (User, AzureAccount)
│   ├── middleware/               # JWT token verification middleware
│   ├── Dockerfile                # Sanitized production container definition
│   ├── .env.example              # Template environment configuration
│   └── package.json
├── docker-compose.yml            # Main Docker Compose orchestration
├── docker-compose.blue.yml       # Blue deployment compose file
├── docker-compose.green.yml      # Green deployment compose file
├── deploy.sh                     # Zero-downtime blue/green deployment script
└── .gitignore                    # Comprehensive secrets & build exclusions
```

---

## 🚀 Quick Start (Docker Compose)

### 1. Clone Repository
```bash
git clone git@github.com:shubhamaggarwal828/nervops_prod_jenkins.git nervops
cd nervops
```

### 2. Launch Services
Run the entire stack with Docker Compose:
```bash
docker compose up -d --build
```

### 3. Access the Applications
* **Dashboard (Web UI)**: [http://localhost:5173](http://localhost:5173)
* **Backend API**: [http://localhost:5011](http://localhost:5011)
* **MongoDB**: `localhost:27017`

To check running container logs:
```bash
docker compose logs -f
```

---

## 📧 Mailtrap Setup (Email Verification & Auth)

NervOps sends 6-digit email verification codes upon signup and password reset links via Mailtrap.

### Getting your Mailtrap Token:
1. Go to **[Mailtrap.io](https://mailtrap.io)** and create a free account.
2. Select your integration mode:
   * **Sandbox (Email Testing — Recommended for Development)**:
     * In the sidebar, go to **Inboxes** ➔ **My Inbox**.
     * Emails sent to any address (including testing or throwaway emails) will appear immediately in this web inbox without sending real emails.
     * Click **Show Credentials** / **API Tokens** to copy your token.
   * **Email Sending (Production)**:
     * In the sidebar, go to **Sending Domains** ➔ Verify your custom domain.
     * Go to **API Tokens** ➔ Copy the token.
3. Configure the token in `backend/.env` (or pass via `docker-compose.yml`):
   ```env
   MAILTRAP_TOKEN=your_mailtrap_token_here
   MAILTRAP_ENDPOINT=https://send.api.mailtrap.io
   ```

---

## 🗄️ Database Setup: Docker vs. MongoDB Atlas

You can run MongoDB either locally via Docker or in the cloud via MongoDB Atlas:

### Option A: Local Docker (Default — Zero Setup)
The included `docker-compose.yml` automatically provisions a containerized MongoDB instance:
```yaml
mongodb:
  image: mongo:latest
  ports:
    - "27017:27017"
  environment:
    MONGO_INITDB_ROOT_USERNAME: admin
    MONGO_INITDB_ROOT_PASSWORD: password
```
* **Connection String**: `mongodb://admin:password@mongodb:27017/mydatabase?authSource=admin`

### Option B: MongoDB Atlas (Cloud Cluster)
If you want data persisted in the cloud and accessible across environments:
1. Create a free M0 cluster on **[MongoDB Atlas](https://www.mongodb.com/atlas)**.
2. Under **Security ➔ Database Access**, create a database user and password.
3. Under **Security ➔ Network Access**, whitelist your IP (or `0.0.0.0/0` for universal access).
4. Click **Connect ➔ Drivers** and copy your URI.
5. Update `MONGO_URI` in `backend/.env`:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/nervops?retryWrites=true&w=majority
   ```

---

## ☁️ Azure Account Setup (Service Principal & App Registration)

To allow NervOps to query Azure resources, inspect security configurations, and fetch billing metrics, create an Azure Service Principal:

### Step 1: Create the App Registration
1. Sign in to the **[Azure Portal](https://portal.azure.com)**.
2. Search for and select **Microsoft Entra ID** (Azure Active Directory).
3. In the left navigation, go to **App registrations** ➔ click **➕ New registration**.
4. Configure:
   * **Name**: `NervOps-CSPM`
   * **Supported account types**: `Accounts in this organizational directory only (Single tenant)`
   * **Redirect URI**: Leave blank.
5. Click **Register**.
6. On the **Overview** page, copy:
   * **Application (client) ID**
   * **Directory (tenant) ID**

### Step 2: Generate a Client Secret
1. In the same App Registration page, click **Certificates & secrets** in the left menu.
2. Click **➕ New client secret**.
3. Add a description (e.g., `nervops-secret`), select an expiration (e.g., `180 days` or `24 months`), and click **Add**.
4. ⚠️ **Immediate action**: Copy the string in the **Value** column (Azure only displays this once).

### Step 3: Retrieve your Subscription ID
1. Search for **Subscriptions** in the top search bar.
2. Click on your active subscription (e.g., *Azure for Students* or *Pay-As-You-Go*).
3. Copy the **Subscription ID** GUID.

### Step 4: Grant IAM Permissions to the Application
1. In your **Subscription** page, click **Access control (IAM)** on the left menu.
2. Click **➕ Add** ➔ **Add role assignment**.
3. Select the **Reader** role (read-only access to resources, security metrics, and billing), then click **Next**.
4. Under **Assign access to**, select **User, group, or service principal**.
5. Click **+ Select members**, search for `NervOps-CSPM`, select it, and click **Select**.
6. Click **Review + assign**.

### Step 5: Connect in the Dashboard
1. Open the NervOps dashboard at [http://localhost:5173](http://localhost:5173).
2. Go to **Settings ➔ Azure Account**.
3. Input your **Tenant ID**, **Client ID**, **Client Secret**, and **Subscription ID**.
4. Save the account. NervOps will encrypt the credentials client-side and immediately begin fetching your Azure telemetry!

---

## 🛠️ Local Development (Without Docker)

### Backend
```bash
cd backend
cp .env.example .env     # Configure your local MongoDB URI & JWT secret
npm install
node index.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Azure Test Infrastructure & Simulation Scripts

To quickly test and demo NervOps' real-time inventory discovery, CIS compliance audit, and telemetry charts, we provide two bash automation scripts located in [`scripts/`](file:///Users/shubham/Downloads/Documents/nervops/scripts/):

### 1. Provision Test Environment
The provisioning script automatically deploys a realistic test resource topology:
* **Resource Group**: `rg-nervops-test`
* **VNet & Subnet**: `vnet-nervops-test` (`10.10.0.0/16`) with subnet `snet-nervops-default`
* **Network Security Group (NSG)**: `nsg-nervops-test` configured with open Port 22 (SSH) to deliberately trigger a CIS security finding
* **Storage Account**: `stnervops<random>` configured with public blob access to test CSPM compliance
* **Linux Virtual Machine**: `vm-nervops-demo` (`Standard_B1s` low-cost tier)

Run the script using the Azure CLI:
```bash
# Make script executable
chmod +x scripts/deploy-test-azure-resources.sh

# Run provisioning (defaults to location 'eastus')
./scripts/deploy-test-azure-resources.sh

# Or specify custom location/resource group:
AZURE_LOCATION=centralus AZURE_RG=rg-nervops-demo ./scripts/deploy-test-azure-resources.sh
```

Once provisioned, refresh your NervOps dashboard at [http://localhost:5173](http://localhost:5173) to see the newly discovered VM, Storage Account, and NSG audit alerts appear immediately.

### 2. Teardown & Clean Up
When testing is complete, destroy all provisioned test resources in a single command with zero lingering charges:
```bash
# Make script executable
chmod +x scripts/cleanup-test-azure-resources.sh

# Run teardown
./scripts/cleanup-test-azure-resources.sh
```

---

## 📸 Screenshots & UI Tour

| Page | Preview | Key Capabilities |
| :--- | :--- | :--- |
| **Authentication Portal** | ![Login Portal](docs/screenshots/01_login_page.png) | Obsidian radial dark theme, responsive email validation, OTP flow. |
| **Azure Overview** | ![Azure Overview](docs/screenshots/02_overview_dashboard.png) | Real-time tenant health, subscription counters, discovered assets, active status pills. |
| **Detailed Metrics & Mapping** | ![Detailed Metrics](docs/screenshots/03_detailed_metrics.png) | Regional & RG bar charts, SKU distribution donuts, expandable JSON property inspector. |
| **Cloud Security & Compliance** | ![Security Audit Report](docs/screenshots/04_security_audit_report.png) | 0-100 radial CIS security posture score gauge, severity distribution, evaluated service coverage. |
| **Tag Governance & Compliance** | ![Tag Compliance](docs/screenshots/05_tag_compliance.png) | Mandatory tag schema enforcer, violation donut, top missing tags, and audit ledger. |
| **Settings & Security Vault** | ![Settings Vault](docs/screenshots/06_settings_vault.png) | Client-side AES-256 encrypted Azure service principal credential vault and admin profile. |

---

## 🔒 Security Best Practices

* **Client-side Encryption**: Azure credentials are encrypted with AES-256 in the browser before being transmitted to the backend or saved to MongoDB.
* **No Plaintext Storage**: Production tokens (`JWT_SECRET`, `MAILTRAP_TOKEN`, `MONGO_URI`) are passed dynamically via environment variables or secret managers.
* **Strict Git Exclusions**: All `.env`, `.secret`, and `azure_credentials.*` files are excluded by `.gitignore`.

---

## 📄 License

This project is licensed under the ISC License.

