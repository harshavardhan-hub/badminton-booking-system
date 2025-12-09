# Badminton Booking System 🏸

Badminton Booking System is a full-stack court reservation platform with pricing intelligence.  
It is built using a **React + Vite + Tailwind CSS** frontend and a **Node.js + Express + MongoDB** backend.

The system allows users to browse courts, book time slots with optional coaches and equipment, while admins can manage courts, pricing rules, coaches, equipment, and view analytics dashboards.

---

## ✨ Features

### User Features
- Browse available courts with pricing & type (indoor/outdoor)
- View real-time slot availability
- Book courts with:
  - Optional coach
  - Optional equipment rental
- View booking history with pricing breakdown

### Admin Features
- Manage courts, coaches, equipment
- Configure dynamic pricing rules
- View analytics dashboard with charts (Recharts)
- Track revenue, occupancy, peak usage trends

---

## 🛠 Tech Stack

### Frontend
- React  
- Vite  
- Tailwind CSS  
- Recharts  

### Backend
- Node.js  
- Express  
- MongoDB + Mongoose  
- JWT Authentication  

---

## 📁 Repository Structure

```bash
.
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── utils
│   ├── seed
│   └── server.js
└── frontend
    ├── src
    │   ├── components
    │   ├── pages
    │   ├── context
    │   ├── hooks
    │   ├── services
    │   ├── utils
    │   └── App.jsx
    └── index.html
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (LTS)
- MongoDB (local or Atlas)
- Git

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/badminton-booking-system.git
cd badminton-booking-system
```

---

## 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/badminton-booking
JWT_SECRET=super-secret-key
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-app-password
```

---

### Start Backend Server

```bash
npm run dev
```

Backend runs at:

```
http://localhost:5000
```

---

## 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:3000
```

---

## ⚡ Quick Start Summary

```bash
# Start MongoDB
cd backend
npm install
npm run dev

cd ../frontend
npm install
npm run dev
```

Then open:

**http://localhost:3000**

---

## 🧱 Database Design (350 Words)

The application uses MongoDB with Mongoose schemas optimized for bookings, pricing flexibility, and analytics. The important collections include User, Court, Coach, Equipment, Booking, Waitlist, and PricingRule.

The User model stores profile information and a role (admin/user) for role-based access. Courts contain the court name, type (indoor/outdoor), basePrice, and activity status, allowing the system to handle pricing and availability. The Coach model includes specialization, hourlyRate, and experience years, enabling optional additions during booking. Equipment tracks rental items with total and available quantities, ensuring real-time availability validation when users add equipment to their bookings.

The Booking model binds everything together. It references the user, court, optional coach, and equipment list with quantities. It stores date, startTime, endTime, and booking status. Crucially, it includes a pricingBreakdown object that stores courtBasePrice, courtFinalPrice, coachFee, equipmentFee, appliedRules, and totalPrice. This design ensures that revenue analytics and historical audits are efficient and consistent, even if pricing rules change later.

The Waitlist model captures pending users for fully booked slots, enabling notifications when cancellations occur. The PricingRule model is intentionally generic and powerful. Each rule stores a ruleType (time_based, day_based, court_type), a conditions object, a modifier, a modifierType (fixed or percentage), and a status flag. The pricing engine loads active rules, checks if conditions match the booking context (court type, day, time), and then sequentially applies modifications starting from the base price. Fixed rules add/subtract a currency value, while percentage rules adjust prices proportionally.

This modular design ensures that pricing logic remains fully database-driven. Adding new promotions or pricing logic requires no backend changes—only new rule documents. Embedding the final pricing breakdown inside each booking guarantees data consistency and makes revenue analytics extremely efficient using MongoDB aggregations.

---

## 👤 Assignment Submitted By

**Name:** Harsha Vardhan Yanakandla  
**Email:** yanakandlaharshavardhan@gmail.com  
**Phone:** 9441591443  
