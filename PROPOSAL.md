# Mini Project Proposal — Service-Oriented Computing

## 1. Group Information

- ITBNM-2211-0171  M.K.K.P.Priyankara  — itbnm-2211-0171@horizoncampus.edu.lk
- ITBNM-2211-0172  K.Y.N.M.Priyantha  — itbnm-2211-0172@horizoncampus.edu.lk
- ITBNM-2211-0174  R.D.S.N.Rajapaksha  — itbnm-2211-0174@horizoncampus.edu.lk
- ITBNM-2211-0155  Y.D.Mayadunne      — itbnm-2211-0155@horizoncampus.edu.lk
- ITBNM-2211-0147  T.P.G.C.Lilantha   — itbnm-2211-0147@horizoncampus.edu.lk

---

## 2. Project Title

Travel Risk & Wellness Monitor

---

## 3. Project Description

Travel Risk & Wellness Monitor is a web-based dashboard that aggregates real-time information from multiple public APIs to help travellers assess destination health and safety levels quickly.

The system combines:
- Travel advisory scores (Travel Advisory API)
- COVID-19 statistics (disease.sh)
- Current weather (OpenWeatherMap)
- Country info (RestCountries)

Users can search destinations, view an integrated safety/health/weather dashboard, and securely save preferences using OAuth 2.0. The backend (Node.js + Express + MongoDB) stores user preferences and cached API responses, demonstrating Service-Oriented Architecture by composing and normalizing multiple external services.

This project satisfies the course requirements: consumption of external APIs, OAuth authentication, and database management.

---

## 4. Selected Public APIs

| API NAME | PURPOSE IN THE PROJECT |
|---|---|
| Travel Advisory API | Fetch country-specific safety scores and risk levels |
| COVID-19 API (disease.sh) | Retrieve active cases, vaccinations, and deaths |
| OpenWeatherMap API | Provide current/predicted weather conditions |
| RESTCountries API | Country flags, currencies, and basic regional info |

---

## 5. Client-Side Plan

- Technologies: HTML, CSS, JavaScript (AJAX / Fetch API)

Workflow:
1. User searches for a destination (country / city).
2. Client fetches data from all required APIs asynchronously.
3. Combine and normalize the responses into a single JSON object.
4. Display results in an interactive dashboard (risk score, weather, COVID stats, flag, etc.).
5. Optionally submit the combined JSON to backend via POST /api/data (requires API key).

---

## 6. Server-Side Plan

- Technologies: Node.js, Express, MongoDB (Mongoose)

Key Functions:
- API Endpoints:
  - POST /api/data — receive and validate combined JSON from client (store/caching)
  - GET /api/records — return stored user data (OAuth-protected)
- Database: MongoDB stores user queries, favorites, and cached API responses
- Security Middleware: API key validation and OAuth token verification

---

## 7. Security Plan

- OAuth 2.0
  - Google (and optionally Facebook) Login for users to save preferences
  - Implemented via Passport.js

- API Key
  - Unique API keys for clients; requests without valid key are rejected
  - Keys transmitted in request headers (HTTPS required)

---

## 8. Expected Challenges & Solutions

| Challenge | Solution |
|---|---|
| API rate limits | Cache responses and limit call frequency; batch requests when possible |
| Data format inconsistencies | Normalize JSON schema in the backend before storing or returning to clients |
| CORS errors | Configure Express CORS middleware and whitelist allowed origins |

---

## 9. Minimal Deliverables (MVP)

- Working frontend that searches a country and shows aggregated data
- Backend endpoints for storing/retrieving user-saved queries
- Google OAuth login
- README and documentation (setup + usage)

---

## 10. Optional Extensions (if time allows)

- Offline caching and expiration policy
- Rate-limit-aware client with exponential backoff
- Unit/integration tests for backend endpoints
- CI workflow to lint and run tests automatically

---

*Prepared by the TravelSafe project team.*