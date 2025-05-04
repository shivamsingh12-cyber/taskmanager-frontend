# Task Management System - Project Summary

## Overview

A full-stack Task Management System with the following tech stack:

* **Frontend**: Next.js (Vercel)
* **Backend**: Node.js + Express (Render)
* **Database**: MongoDB (MongoDB Atlas)

### Features

* User authentication (JWT-based)
* Task CRUD operations
* Analytics dashboard
* Team collaboration features
* Protected routes and session handling

---

## Backend - Node.js + Express

### Setup

* Initialized with `npm init -y`
* Installed dependencies:

  //run below cmd
  npm install express mongoose cors jsonwebtoken bcrypt dotenv


### Database

* MongoDB Atlas with Mongoose
* Models:

  * `User`
  * `Task`

### Authentication

* JWT-based login and register routes
* Middleware for token verification

### API Routes

* **Auth**: `/api/auth/login`, `/api/auth/register`
* **Tasks**:

  * `POST /api/tasks`
  * `GET /api/tasks`
  * `PUT /api/tasks/:id`
  * `DELETE /api/tasks/:id`
  
* **Analytics**:

  * `GET /api/analytics/summary`
  * Data points: completed tasks/user, overdue tasks, task completion rate

### CORS Handling

```js
const corsOptions = {
  origin: ['https://frontend-black-gamma-72.vercel.app'],
  credentials: true,
};
app.use(cors(corsOptions));
```

### Deployment

* Deployed to **Render**
* Configured environment variables:

  * `MONGO_URI`
  * `JWT_SECRET`

---

## Frontend - Next.js

### Setup

* Pages:

  * `/login`, `/register`, `/dashboard`
* Used `axios` with an instance:

```js
const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});
```

### Auth Flow

* Login form sends `POST /auth/login`
* On success, stores token in `localStorage` and redirects
* Axios interceptor adds token to requests automatically

### Dashboard

* Displays tasks, analytics (e.g., completed, overdue)
* Can use Recharts or Chart.js

### Error Handling

* API errors handled with `try/catch`
* UI shows relevant error messages

### Environment Variables

```
.env.local
NEXT_PUBLIC_API_URL=https://taskmanager-backend-xxxxx.onrender.com/api
```

### Deployment

* Deployed on **Vercel**
* Linked GitHub repo for CI/CD
* Set environment variables via Vercel dashboard

---

## Debugging Process

* Used browser console logs
* Investigated `405 Method Not Allowed` and CORS issues
* Solved by correcting base URLs and CORS options

---

## Deployment Best Practices

* Used GitHub integration for automatic deployment
* Pushed latest commits to deploy latest version
* Used Vercel preview branches to avoid affecting production
* Verified backend CORS settings include frontend domain

---

## Credentials to login or create another one

  1. email: alice@example.com,
     password: 123456

  2. email: mahesh@example.com,
     password: 123456

