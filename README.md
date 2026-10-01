# Feedback Collector

An elegant, production-ready internal dashboard for collecting and managing user feedback. Designed with a minimal, modern aesthetic and engineered with robust, scalable architecture.

![Screenshots Placeholder](https://via.placeholder.com/1200x600.png?text=Feedback+Collector+Dashboard+Screenshot)

## 📖 Project Overview

Feedback Collector is a full-stack web application designed for teams to easily gather, view, and manage customer feedback. The application provides a sleek single-page interface with a responsive two-column grid. Users can submit feedback via a highly resilient, validated form on the left, and immediately view, search, filter, and delete entries in the real-time feed on the right. 

This project was built focusing on pure React foundations, enterprise Express patterns, and stringent user experience (UX) guidelines—avoiding bloated UI libraries in favour of handcrafted, performant CSS Modules.

## ✨ Features

- **Real-Time Interface:** View and manage feedback submissions instantly without page reloads.
- **Robust Form Validation:** Custom, framework-agnostic validation utility providing real-time inline errors.
- **Advanced Filtering:** Instantly filter feedback by text (name, email, message) or by dynamic date ranges (Today, Last 7 Days, Last 30 Days).
- **Graceful Loading & Empty States:** Features layout-preserving skeleton loaders and responsive empty states.
- **Global Error Handling:** Unified API interceptors and Express error sinkholes guarantee the app never crashes silently, displaying smooth Toast notifications instead.
- **Accessible & Responsive:** Fully responsive CSS Grid architecture, semantic HTML, keyboard focus rings (`:focus-visible`), and ARIA tags.
- **Safe Deletion Flow:** Features an animated, portal-based modal to prevent accidental data loss.

## 🛠️ Technology Stack

**Frontend**
- React 18 (Vite)
- Axios
- Vanilla CSS Modules (Custom Design Token System)

**Backend**
- Node.js & Express
- MongoDB & Mongoose
- Morgan (Logging)
- CORS & dotenv

## 📂 Folder Structure

```text
Feedback Collector/
├── backend/
│   ├── config/          # Environment & Database configuration
│   ├── controllers/     # Express route handlers
│   ├── middleware/      # Error, 404, and Validation middleware
│   ├── models/          # Mongoose schemas (Feedback)
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic & DB queries
│   ├── utils/           # Shared backend utilities (ApiError, ApiResponse)
│   ├── app.js           # Express app instance setup
│   └── server.js        # Server entry point
│
└── frontend/
    ├── src/
    │   ├── assets/      # Static assets and icons
    │   ├── components/  # React Components
    │   │   ├── common/  # Reusable UI (Modal, Toast, SearchBar, etc.)
    │   │   ├── feedback/# Feature-specific UI (Form, List, Item)
    │   │   └── layout/  # Structural UI (Header)
    │   ├── hooks/       # Custom React Hooks (useFeedbackAPI)
    │   ├── services/    # Axios API client setup
    │   ├── styles/      # Global CSS tokens and resets
    │   ├── utils/       # Pure functions (validation, filtering)
    │   ├── App.jsx      # Main application orchestrator
    │   └── main.jsx     # React DOM entry point
    ├── .env             # Frontend environment variables
    └── package.json
```

## 🚀 Installation Steps

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (running locally or via MongoDB Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/feedback-collector.git
cd "feedback-collector"
```

### 2. Setup the Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env to match your MongoDB URI (see Environment Variables below)
npm run dev
```
The backend server will start on `http://localhost:5000`.

### 3. Setup the Frontend
Open a new terminal window:
```bash
cd frontend
npm install
# Create the frontend .env file (see Environment Variables below)
npm run dev
```
The frontend will be available at `http://localhost:5173`.

## 🔐 Environment Variables

### Backend (`backend/.env`)
Create a `.env` file in the `backend` directory:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/feedback_collector
CLIENT_ORIGIN=http://localhost:5173
```

### Frontend (`frontend/.env`)
Create a `.env` file in the `frontend` directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 🌐 API Endpoints

The backend exposes a clean REST API. All endpoints are prefixed with `/api/feedback`.

| Method | Endpoint | Description | Payload |
|--------|----------|-------------|---------|
| `GET`  | `/`      | Retrieve all feedback, sorted newest-first | - |
| `GET`  | `/:id`   | Retrieve a specific feedback entry by ID | - |
| `POST` | `/`      | Submit a new feedback entry | `{ name, email, message }` |
| `DELETE`| `/:id`  | Delete a specific feedback entry by ID | - |

*All responses adhere to a strict standard format:*
```json
{
  "success": true,
  "message": "Action completed successfully.",
  "data": {}
}
```

## 🔮 Future Improvements

While this application is production-ready, potential future enhancements include:
- **Authentication & Authorization:** Securing the dashboard behind an admin login (e.g., using JWTs or Firebase Auth).
- **Pagination / Infinite Scroll:** Implementing cursor-based pagination for the feedback list if data sets grow massively.
- **Database Query Optimizations:** Adding `.lean()` to Mongoose queries to further improve backend memory efficiency for read-only routes.
- **Rate Limiting & Security:** Adding `helmet` and `express-rate-limit` to the backend to protect against brute-force attacks.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
