<h1 align="center" style="font-weight: bold; font-size: 4em;">AXIOM AI</h1>

<div align="center">

### **Enterprise Neural Interface with Multi-Model Intelligence**

**Axiom AI** is a secure, production-hardened AI workspace that unifies ultra-fast inference (Groq) and deep reasoning capabilities (Cerebras) into a single, premium interface.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Axiom%20AI-00bcd4?style=for-the-badge&logo=vercel)](https://axiomai-two.vercel.app/)

</div>

---

## Problem Statement & Solution

**The Problem:** Enterprise teams need access to diverse AI capabilities—ranging from sub-second answers to complex architectural reasoning—without switching between fragmented tools or compromising on security/privacy.

**The Solution:**
Axiom AI provides a unified "Glassmorphic" neural interface that:
- Router automatically delegates tasks to the optimal engine (**Groq** for speed, **Cerebras** for reasoning).
- Enforces strict JWT-based session security with HTTP-only cookies.
- Delivers a premium, zero-latency user experience with optimistic UI updates.

---

## Tech Stack & Decisions

### **Frontend (The Neural Interface)**
- **Framework:** React 18 + Vite (for lightning-fast HMR and build performance).
- **State Management:** TanStack Query (React Query) for server-state synchronization and optimistic updates.
- **Styling:** TailwindCSS with custom "Axiom" design tokens + manual glassmorphism.
- **Motion:** Framer Motion (only for essential micro-interactions).
- **Icons:** Lucide React (feather-light, consistent iconography).

### **Backend (The Core)**
- **Runtime:** Node.js + Express.
- **Database:** MongoDB (Mongoose ODM) with rigorous schema validation.
- **Security:** Helmet (Headers), CORS (Strict Origin), Bcrypt (Hashing), JWT (HttpOnly Cookies).
- **AI Integration:** Custom `ProviderRouter` service that normalizes responses from Groq and Cerebras SDKs.

---

## Features List

- [x] **Multi-Model Intelligence**: Seamless switching between "Standard Chat", "Code Mode", and "Deep Thinking" (Reasoning).
- [x] **Premium Glassmorphic UI**: High-end aesthetic with blur effects, smooth gradients, and micro-interactions.
- [x] **Secure Authentication**: Enterprise-grade registration and login flow with JWT and session persistence.
- [x] **Global Toast System**: Centralized, non-blocking notification system for all user actions.
- [x] **Smart Chat Management**: Pin, Delete, and Share chat sessions instantly.
- [x] **Optimistic UX**: Instant feedback for all state-changing actions (no spinners unless necessary).
- [x] **Zero-Console Policy**: Production-hardened code with zero stray logs or errors.

---

## Getting Started

### **Prerequisites**
- Node.js v18+
- MongoDB Atlas URI
- Groq API Key
- Cerebras API Key

### **Setup & Installation**

1. **Clone the Repository**
   ```bash
   git clone https://github.com/ManasSaxena14/AXIOM_AI--LLM-.git
   cd AXIOM_AI--LLM-
   ```

2. **Install Dependencies**
   ```bash
   # Install Backend
   cd backend
   npm install

   # Install Frontend
   cd ../frontend
   npm install
   ```

3. **Configure Environment Variables**
   Create `.env` files in both `backend` and `frontend` directories based on the `.env.example` files.

   **Backend (`backend/.env`):**
   ```env
   NODE_ENV=development
   PORT=5001
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key
   JWT_EXPIRE=7d
   GROQ_API_KEY=your_groq_key
   CEREBRAS_API_KEY=your_cerebras_key
   CLIENT_URL=http://localhost:5173
   ```

   **Frontend (`frontend/.env`):**
   ```env
   VITE_API_URL=http://localhost:5001/api
   ```

### **Run Scripts**

**Development Mode (Run both concurrently):**
```bash
# Terminal 1 (Backend)
cd backend
npm run dev

# Terminal 2 (Frontend)
cd frontend
npm run dev
```

---

## Project Structure

```bash
AXIOM_AI/
├── backend/
│   ├── src/
│   │   ├── config/         # DB & Env Config
│   │   ├── controllers/    # Request Logic (Auth, Chat)
│   │   ├── middleware/     # Security & Error Handling
│   │   ├── models/         # Mongoose Schemas (User, Chat, Message)
│   │   ├── routes/         # API Endpoint Definitions
│   │   ├── services/       # AI Provider Logic (Groq/Cerebras)
│   │   └── utils/          # Async Wrappers & Custom Errors
│   └── app.js              # Express App Entry
│
└── frontend/
    ├── src/
    │   ├── api/            # Axios Client Interceptors
    │   ├── components/     # UI Components (Sidebar, ChatMessage, etc.)
    │   ├── contexts/       # Global State (Auth, Toast)
    │   ├── hooks/          # Custom Hooks (useChats, useMessages)
    │   ├── layouts/        # Route Layouts
    │   └── pages/          # Full Page Views (Login, Chat, Profile)
```

---

## Roadmap & Contribution

We welcome contributions to the Axiom Core.

- [ ] **Voice Mode:** Real-time STT/TTS integration.
- [ ] **File Analysis:** RAG pipeline for document uploads.
- [ ] **Team Workspaces:** Shared chat sessions for organizations.

**Contributing:**
1. Fork the repo
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---
