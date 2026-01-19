# Axiom AI

Full-stack AI-powered application with Node.js backend and modern frontend.

## Project Structure

```
AXIOM AI/
├── backend/          # Node.js + Express API
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
│
└── frontend/         # Frontend application (coming soon)
```

## Backend Setup

```bash
cd backend
cp .env.example .env
# Update .env with your MongoDB URI
npm install
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user (requires auth)
- `GET /api/auth/me` - Get current user (requires auth)

### Health Check
- `GET /api/health` - Server status
- `GET /api/health/ping` - Ping endpoint

## Tech Stack

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication (HTTP-only cookies)
- bcryptjs for password hashing

## License

ISC
