
# **TravelSafe – Travel Risk & Wellness Monitor**

A web-based dashboard that integrates multiple public APIs to provide real-time **travel safety**, **health**, and **weather** information for any destination.
This system follows **Service-Oriented Computing principles**, combining external APIs with a secure backend and OAuth authentication.

---

## 🚀 **Overview**

TravelSafe helps users quickly understand the risk level of a country before traveling.
It aggregates data from:

* **Travel Advisory API** – country safety scores
* **COVID-19 API (disease.sh)** – active cases, deaths, vaccinations
* **OpenWeatherMap** – current weather conditions
* **RestCountries API** – flags, currency, regional details

Users can search for destinations, view an interactive dashboard, and securely store preferences after logging in via **Google OAuth 2.0**.

---

## 💡 **Key Features**

* 🌍 Destination search
* ⚠️ Travel risk and advisory score
* 🦠 COVID-19 stats
* 🌦 Current weather overview
* 🚩 Country flag + basic info
* 🔐 Google OAuth 2.0 Login
* 🗄 MongoDB storage for user preferences
* 🔑 Secure API key middleware
* 📡 Multi-API integration with real-time fetch

---

## 🛠 **Technologies Used**

### **Frontend**

* HTML
* CSS
* JavaScript (Fetch API)

### **Backend**

* Node.js
* Express.js
* MongoDB (Mongoose)
* Passport.js (Google OAuth 2.0)
* CORS middleware

---

## 🌐 **Public APIs Used**

| API                 | Purpose                     |
| ------------------- | --------------------------- |
| Travel Advisory API | Country risk level          |
| COVID-19 API        | Cases, deaths, vaccinations |
| OpenWeatherMap      | Weather conditions          |
| RestCountries API   | Country details & flag      |

---

## 🏗 **System Architecture**

### **Client (Frontend)**

* User searches a destination
* Frontend fetches data from all APIs
* Combines data into one JSON
* Displays dashboard
* Sends combined JSON to backend (`POST /api/data`)

### **Server (Backend)**

* Validates API key
* OAuth-protected routes
* Stores user preferences in MongoDB
* Provides saved data via `/api/records`

---

## 🔐 **Security**

* **OAuth 2.0 (Google Login)** for user authentication
* **API key validation** for secure requests
* **CORS** configuration
* Request sanitization and error handling

---

## 📁 **Project Structure**

```
travel-risk-monitor/
│── frontend/
│
│── backend/
│   ├── server.js
│   ├── routes/
│   │   └── dataRoutes.js
│   ├── models/
│   │   └── Record.js
│   ├── config/
│   │   └── passport.js
│   └── .env
│
└── README.md
```
## 🌳 Branching Strategy
- `main` → Stable Production

- `frontend` → Web & Mobile Development

- `backend` → Backend API Development

- `feature/*` → New Features

- `bugfix/*` → Bug Fixes

- `hotfix/*` → Emergency Fixes

## **Create Development Branch**
```bash
git checkout -b dev-frontend && git push origin frontend
git checkout -b dev-backend && git push origin backend
```
## **Issue & Feature Tracking**
### **Enable GitHub Projects**
1. Go to your repository.
2. Click on **Projects** → Create a new **Board**.
3. Add **Columns**:
   - 🟢 **Backlog** (New Features / Bugs)
   - 🔵 **To-Do** (Selected for development)
   - 🟡 **In Progress** (Currently being worked on)
   - 🟣 **Testing** (Under QA testing)
   - 🟢 **Done** (Completed)

---

## **Contribution Workflow**
### **New Feature Development**
1. Create a new feature branch:
   ```bash
   git checkout -b feature/live-location
   ```
2. Work on your code, then commit and push:
   ```bash
   git add .
   git commit -m "Added live location with .."
   git push origin feature/live-location
   ```
3. Open a **Pull Request** from `feature/live-location` → `dev-backend`. (for frontend and backend seppratatelly)
    ```bash
   git push --set-upstream origin feature/live-location
   gh pr create --base dev-backend --head feature/live-location --title "Your PR title" --body "Detailed description of the changes"
   ```

### **Bug Fixes**
1. Create a bugfix branch:
   ```bash
   git checkout -b bugfix/fix-location
   ```
2. Apply fixes and commit:
   ```bash
   git add .
   git commit -m "Fixed location issue"
   git push origin bugfix/fix-location
   ```
3. Open a PR → Merge to `dev` branch.

---

---

## 🧪 **Testing**

* Test API routes using Postman
* Verify OAuth login
* Check MongoDB records
* Validate API key headers

---

## ⚙️ **Challenges & Solutions**

| Issue                 | Solution                          |
| --------------------- | --------------------------------- |
| API rate limits       | Use cached responses              |
| Inconsistent API data | Normalize JSON structure          |
| CORS issues           | Configure Express CORS middleware |
| Fetch errors          | Add try/catch + fallback messages |

---

## 📌 **Conclusion**

TravelSafe is a modern, secure, API-driven system that showcases **Service-Oriented Computing** through multi-API integration, authentication, and real-time data processing.

---

## 📄 Project Proposal

The formal mini project proposal (group information, project description, selected APIs, client/server/security plans, and expected challenges) has been added as `PROPOSAL.md` in the repository root. See `PROPOSAL.md` for the full submission.