
---

## 🛡️ Security Considerations

- **Password Storage:** Passwords hashed with `bcrypt` (never stored in plaintext).
- **Token Delivery:** JWTs stored in **HTTP-only, Secure cookies** — inaccessible to client-side JavaScript, mitigating XSS token theft.
- **CSRF Awareness:** `SameSite` cookie attributes configured to reduce cross-site request risk.
- **Route Protection:** Both client (React Router guards) and server (Express middleware) independently enforce authentication — never trusting the client alone.
- **Input Validation:** Request payloads and AI-generated content validated with Zod before persistence.
- **File Upload Safety:** Multer configured with file-type/size restrictions for uploads.
- **Environment Isolation:** Secrets and API keys loaded exclusively from environment variables, never hardcoded.

---

## 🔌 API Endpoint Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Authenticate & issue cookie | ❌ |
| `POST` | `/api/auth/logout` | Invalidate session/cookie | ✅ |
| `GET` | `/api/auth/me` | Get current authenticated user | ✅ |
| `POST` | `/api/interview/start` | Generate a new AI interview session | ✅ |
| `POST` | `/api/interview/answer` | Submit answer for AI evaluation | ✅ |
| `POST` | `/api/interview/finish` | Finalize interview & generate report | ✅ |
| `GET` | `/api/interview/history` | Fetch user's past interview sessions | ✅ |
| `GET` | `/api/report/:id` | Fetch a specific structured report | ✅ |
| `POST` | `/api/resume/generate` | Generate resume PDF | ✅ |

> Exact route names may vary slightly by implementation — see `server/routes/` for the source of truth.

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (local instance or Atlas cluster)
- An LLM API key (e.g., OpenAI-compatible provider)

### 1. Clone the repository
```bash
git clone https://github.com/man-singh-dev/prepverse-ai.git
cd prepverse-ai
```

### 2. Install dependencies
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Configure environment variables
Create a `.env` file inside `server/` (see [Environment Variables](#-environment-variables) below).

### 4. Run the application
```bash
# Start backend (from /server)
npm run dev

# Start frontend (from /client)
npm run dev
```

The client will typically run on `http://localhost:5173` and the server on `http://localhost:5000` (adjust per your config).

---

## 🔑 Environment Variables

Create a `.env` file in the `server/` directory using the template below. **Never commit real secrets.**

```env
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/prepverse-ai

# Authentication
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
COOKIE_SECRET=your_cookie_secret_here

# LLM Provider
LLM_API_KEY=your_llm_api_key_here
LLM_API_BASE_URL=https://api.your-llm-provider.com/v1
LLM_MODEL=your-model-name

# File Uploads
MAX_UPLOAD_SIZE_MB=5
```

---

## ▶️ Usage

1. **Register / Login** — create an account or sign in.
2. **Start an Interview** — select a role/topic; the system generates a tailored question set via the LLM.
3. **Answer Questions** — submit responses, receive AI-evaluated feedback per question.
4. **Review Report** — view a structured, scored breakdown after completing the session.
5. **Check History** — revisit past interviews and reports from your dashboard.
6. **Generate Resume** — fill in resume details and download a generated PDF.

---

## 🗺️ Future Improvements

- [ ] Adaptive Interview Engine (dynamic difficulty & follow-up question selection)
- [ ] Longitudinal Performance Analytics dashboard
- [ ] Personalized Weakness Detection & targeted practice generation
- [ ] Refresh-token rotation for extended sessions
- [ ] Rate limiting on AI-invoking endpoints
- [ ] Unit/integration test coverage (Jest/Supertest)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Dockerized deployment setup

---

## 👤 Author

**Man Singh**

- GitHub: [@man-singh-dev](https://github.com/man-singh-dev)
- Project Repository: [prepverse-ai](https://github.com/man-singh-dev/prepverse-ai)

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

⭐ If you find this project interesting from an engineering perspective, consider starring the repo.

</div>
