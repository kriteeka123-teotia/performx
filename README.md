# PerformX – Goal Setting & Tracking Portal
PerformX is a full-stack Goal Setting & Tracking Portal developed for **AtomQuest Hackathon 2026**. The platform helps organizations digitally manage employee goals, quarterly performance tracking, approvals, and progress visibility through a centralized web application.

---
# Features
## Employee Module
* Create and manage goals
* Add targets and weightage
* Submit quarterly achievements
* Track goal progress and status
* View manager feedback

## Manager Module
* Review and approve employee goals
* Edit targets and weightage during approval
* Lock approved goals
* Conduct quarterly check-ins
* Monitor team performance

## Admin Module
* Monitor organization-wide progress
* Access reporting dashboard
* Export achievement reports
* Manage system visibility

---
# Validation Rules Implemented
* Total goal weightage must equal 100%
* Minimum weightage per goal = 10%
* Maximum 8 goals per employee
* Locked goals cannot be edited after approval

---
# Tech Stack
| Layer              | Technology           |
| ------------------ | -------------------- |
| Frontend           | React.js + Vite      |
| Backend            | Node.js + Express.js |
| Database           | MongoDB Atlas        |
| Authentication     | JWT + bcryptjs       |
| Hosting (Frontend) | Vercel               |
| Hosting (Backend)  | Render               |
| Version Control    | GitHub               |

---
# Live Demo
## Frontend
https://performxweb.vercel.app/

## Backend API
https://performx-api.onrender.com/

---
# GitHub Repository
https://github.com/kriteeka123-teotia/performx

---
# Demo Credentials
## Admin
Email: [admin@performx.com](mailto:admin@performx.com)
Password: demo123

## Manager
Email: [manager1@performx.com](mailto:manager@performx.com)
Password: demo123

## Employee
Email: [employee1@performx.com](mailto:employee@performx.com)
Password: demo123

---
# Project Structure
```bash
PerformX/
│
├── frontend/          # React Frontend
├── backend/           # Express Backend
├── README.md
└── package.json
```
---
# Installation & Setup
## 1. Clone Repository
```bash
git clone <your-repository-link>
cd performx
```
---
## 2. Backend Setup
```bash
cd backend
npm install
```
Create `.env` file inside backend folder:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```
Run backend:
```bash
npm start
```
---
## 3. Frontend Setup
```bash
cd frontend
npm install
```
Create `.env` file inside frontend folder:
```env
VITE_API_URL=http://localhost:5000
```
Run frontend:
```bash
npm run dev
```
---
# Architecture Overview
```text
User Browser
      │
      ▼
Frontend (React + Vite)
      │
REST API Calls
      ▼
Backend (Node.js + Express)
      │
MongoDB Queries
      ▼
MongoDB Atlas
```
---
# Core Functionalities
## Goal Lifecycle
1. Employee creates goals
2. Manager reviews and approves
3. Goals get locked after approval
4. Employee submits quarterly updates
5. Manager conducts check-ins and feedback
6. Admin monitors completion status

---
# Security Features
* JWT-based Authentication
* Password Hashing using bcryptjs
* Role-Based Access Control
* Protected API Routes

---
# Future Enhancements
* Microsoft Entra ID Integration
* Microsoft Teams Notifications
* Email Reminder System
* Escalation Workflow Engine
* Analytics Dashboard
* AI-based Performance Insights

---
# Hackathon Submission
This project was developed as part of:

**AtomQuest Hackathon 2026**
Problem Statement: *In-House Goal Setting & Tracking Portal*

---
# Team
**Kriteeka Teotia**
B.Tech CSE (AI & ML)

---
# License
This project is developed for educational and hackathon purposes.
