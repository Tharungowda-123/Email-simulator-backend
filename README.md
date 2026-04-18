# 📧 Email Simulator Backend

## 🚀 Overview
This project is a backend system that simulates automated email activity between users.  
Instead of sending real emails, it logs interactions between users while enforcing daily sending limits.

---

## 🛠️ Tech Stack
- Node.js
- Express.js
- MongoDB
- Mongoose

---

## ✨ Features
- Create users with email accounts
- Simulate email sending between users
- Daily sending limit per user
- Dynamic increase in sending limit over time
- Store email logs (sender, receiver, timestamp)
- REST API endpoints for all operations

---

## 📡 API Endpoints

### 🔹 Create User
POST /api/users

Body:
{
  "email": "user1@gmail.com"
}

---

### 🔹 Start Simulation
POST /api/simulate

(No body required)

---

### 🔹 Get Logs
GET /api/logs

---

### 🔹 Get User Stats
GET /api/users/:id

---

## 🔄 How It Works
1. Users are created with a default daily limit
2. Simulation assigns sender and receiver
3. Emails are simulated and stored as logs
4. Users cannot exceed daily limit
5. Limits reset and increase over time

---

## ▶️ How to Run

```bash
npm install
node src/app.js
