<div align="center">

# <img src="./frontend/src/assets/logo.png" width="40" height="40" alt="Feedback Collector Logo" align="absmiddle" />&nbsp;&nbsp;Feedback Collector

### A Full-Stack Feedback Management Platform

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Feedback_Collector-2563eb?style=for-the-badge)](https://himanshu-singh11.github.io/Feedback-Collector)
[![Backend API](https://img.shields.io/badge/⚡_API-Render-16a34a?style=for-the-badge)](https://feedback-collector-qwv3.onrender.com/health)
[![MongoDB](https://img.shields.io/badge/☁️_Database-MongoDB_Atlas-47a248?style=for-the-badge)](https://www.mongodb.com/atlas)

A modern, production-ready web application for collecting, managing, and analyzing user feedback. Built with **React**, **Node.js**, **Express**, and **MongoDB** — featuring role-based access control, dark/light themes, glassmorphism UI, and real-time filtering.

---

</div>

## ✨ Key Features

### 👤 For Users
- **Easy Feedback Submission** — Share your thoughts quickly using a simple 5-emoji rating system and a text box.
- **Personal Dashboard** — Keep track of all the feedback you have ever submitted in one clean, organized place.
- **Search & Filter** — Easily find your past feedback by typing keywords or filtering by dates (Today, Last 7 Days, etc.).
- **Account Security** — Secure login system with an easy option to change your password anytime.
- **Dark & Light Mode** — Switch between dark and light themes for a comfortable reading experience.

### 🛡️ For Admins
- **Analytics Overview** — A clear dashboard showing total feedback received, today's submissions, and a breakdown of user ratings.
- **Full Control** — Admins can view, search, filter, and delete feedback submitted by any user on the platform.
- **Live Activity Feed** — See a timeline of the most recent feedback submissions as they happen.
- **Detailed Insights** — Read the complete details of any feedback, including exactly who sent it and when.

### 🎨 Design & Experience
- **Modern Interface** — A beautiful, colorful background with a very clean and professional design.
- **Smooth Animations** — Loading screens and subtle animations make the app feel fast and alive.
- **Instant Notifications** — Helpful pop-up alerts let you know immediately if an action was successful or if there was an error.
- **Mobile Friendly** — Works perfectly and looks great on all devices, from mobile phones to desktop computers.

---

## 🏗️ Architecture

```mermaid
flowchart TD
    subgraph Frontend ["💻 Client (React + Vite)"]
        direction LR
        UI["Dashboards & Forms"]
        State["Auth & Theme Context"]
        UI <--> State
    end

    subgraph Backend ["⚙️ Server (Node.js + Express)"]
        direction LR
        API["Routes & Middleware"]
        Controllers["Business Logic"]
        API --> Controllers
    end

    subgraph Database ["☁️ MongoDB Atlas"]
        direction LR
        Users[(Users)]
        Feedback[(Feedback)]
    end

    Frontend == "Axios (REST API + JWT)" ==> Backend
    Backend == "Mongoose ODM" ==> Database
```

---

## 🛠️ Tech Stack

| Part of Project | Technology Used | Why we used it |
|:---:|:---|:---|
| **Frontend** | React, Vite, React Router | To build a fast, interactive, and seamless user interface. |
| **Design & Styling**| CSS Modules, CSS Variables| To create a beautiful design with smooth Dark & Light modes. |
| **State Management**| React Context API | To remember user login details and theme choices across all pages. |
| **API Client** | Axios | To securely send and receive data between the frontend and the server. |
| **Backend Server** | Node.js, Express.js | To handle all the core logic, secure routes, and process feedback. |
| **Security** | JWT, bcryptjs | To encrypt passwords and safely keep users logged into their accounts. |
| **Database** | MongoDB Atlas, Mongoose | To safely store all the user accounts and feedback data in the cloud. |
| **Hosting** | GitHub Pages & Render | To host the website and server online so anyone can use it. |

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|:---:|:---|:---|:---:|
| `POST` | `/api/auth/register` | Register new user | ❌ |
| `POST` | `/api/auth/login` | Login & get JWT token | ❌ |
| `GET` | `/api/auth/profile` | Get current user profile | ✅ |
| `PUT` | `/api/auth/change-password` | Update password | ✅ |

### Feedback
| Method | Endpoint | Description | Auth | Roles |
|:---:|:---|:---|:---:|:---:|
| `GET` | `/api/feedback` | Get feedbacks (scoped by role) | ✅ | User, Admin |
| `GET` | `/api/feedback/:id` | Get single feedback | ✅ | Owner, Admin |
| `POST` | `/api/feedback` | Submit new feedback | ✅ | User, Admin |
| `DELETE` | `/api/feedback/:id` | Delete feedback | ✅ | Owner, Admin |

### Health
| Method | Endpoint | Description | Auth |
|:---:|:---|:---|:---:|
| `GET` | `/health` | Server status check | ❌ |

---

## 🔒 Security Implementation

```mermaid
flowchart TD
    Request(["🌐 API Request"])
    
    subgraph Middleware ["🛡️ Authentication Pipeline"]
        direction LR
        T["1️⃣ Extract Token"]
        V["2️⃣ Verify Sig"]
        U["3️⃣ Fetch User"]
        R["4️⃣ Check Role"]
        
        T --> V --> U --> R
    end
    
    Block(["🚫 Blocked (401/403 Error)"])
    Allow(["✅ Allowed (Process Request)"])

    Request -- "Authorization: Bearer Token" --> Middleware
    R -- "Pass" --> Allow
    
    T -. "Fail" .-> Block
    V -. "Fail" .-> Block
    U -. "Fail" .-> Block
    R -. "Fail" .-> Block
```

| Security Feature | Implementation |
|:---|:---|
| **Password Hashing** | bcryptjs with salt rounds (10) |
| **JWT Authentication** | Signed tokens with configurable expiration (30d default) |
| **Role-Based Access Control** | `protect` + `authorizeRoles` middleware chain |
| **Data Isolation** | Users can only access/delete their own feedback |
| **Password Exclusion** | Mongoose `select: false` — passwords never leak in API responses |
| **Input Validation** | Schema-level (Mongoose) + middleware-level (validateRequest) |
| **Payload Limiting** | `express.json({ limit: '10kb' })` prevents DOS attacks |
| **Error Sanitization** | Stack traces hidden in production mode |
| **Auto-Logout** | Axios interceptor catches 401 → fires DOM event → clears session |

---

## 📁 Project Structure

```
Feedback-Collector/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── env.js             # Environment variable validation
│   ├── controllers/
│   │   ├── authController.js  # Register, Login, Profile, Change Password
│   │   └── feedbackController.js
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT verify + Role authorization
│   │   ├── errorHandler.js    # Global error handler
│   │   ├── notFound.js        # 404 handler
│   │   └── validateRequest.js # Input validation
│   ├── models/
│   │   ├── Feedback.js        # Feedback schema (indexed)
│   │   └── User.js            # User schema (hashed passwords)
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── feedbackRoutes.js
│   ├── services/
│   │   └── feedbackService.js # Business logic layer
│   ├── utils/
│   │   ├── ApiError.js        # Custom error class
│   │   └── ApiResponse.js     # Standardized responses
│   ├── app.js                 # Express app configuration
│   └── server.js              # Server entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/        # Reusable UI (Modal, Toast, SearchBar, Skeleton, etc.)
│   │   │   ├── feedback/      # FeedbackForm, FeedbackList, FeedbackItem
│   │   │   └── layout/        # Header, ProfileDropdown
│   │   ├── context/
│   │   │   ├── AuthContext.jsx # JWT + User state management
│   │   │   └── ThemeContext.jsx# Dark/Light mode persistence
│   │   ├── hooks/
│   │   │   └── useFeedbackAPI.js # Custom hook for CRUD operations
│   │   ├── pages/             # Login, Register, Dashboard, AdminDashboard
│   │   ├── services/          # Axios API clients
│   │   ├── styles/
│   │   │   └── global.css     # Design tokens, CSS variables, themes
│   │   └── utils/             # Filtering logic, validation helpers
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ 
- **npm** v9+
- **MongoDB Atlas** account (or local MongoDB)

### 1. Clone the Repository
```bash
git clone https://github.com/Himanshu-Singh11/Feedback-Collector.git
cd Feedback-Collector
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
NODE_ENV=development
PORT=5001
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/feedbackdb?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=30d
CLIENT_ORIGIN=http://localhost:3000
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend/` directory:
```env
VITE_API_BASE_URL=http://localhost:5001/api
```

Start the frontend:
```bash
npm run dev
```

### 4. Open in Browser
Navigate to **http://localhost:3000** 🎉

---

## 🌐 Deployment

| Service | Platform | URL |
|:---|:---|:---|
| **Frontend** | GitHub Pages | [himanshu-singh11.github.io/Feedback-Collector](https://himanshu-singh11.github.io/Feedback-Collector) |
| **Backend API** | Render | [feedback-collector-qwv3.onrender.com](https://feedback-collector-qwv3.onrender.com/health) |
| **Database** | MongoDB Atlas | M0 Free Tier (512 MB) |

### Deploy Frontend to GitHub Pages
```bash
cd frontend
VITE_API_BASE_URL=https://feedback-collector-qwv3.onrender.com/api npm run deploy
```

> **Note:** Free Render instances spin down after 15 minutes of inactivity. The first request after idle may take 30-50 seconds (cold start).

---

## 🧪 Test Accounts

| Role | Email | Password |
|:---:|:---|:---|
| **Admin** | `admin@example.com` | `password123` |
| **User** | `user@example.com` | `password123` |

> ⚠️ These accounts need to be created via the Register page. Any email containing "admin" will automatically be assigned the Admin role.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ by [Himanshu Singh](https://github.com/Himanshu-Singh11)**

⭐ Star this repo if you found it helpful!

</div>
