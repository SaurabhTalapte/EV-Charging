# ⚡ EV ChargeHub - Smart EV Charging Web Application

EV ChargeHub is a modern, responsive, full-stack electric vehicle (EV) charging session web application built with **React**, **Tailwind CSS v4**, **React Router DOM v7**, **Lucide Icons**, and **Leaflet / OpenStreetMap**. It allows EV drivers to locate nearby charging stations, check connector availability in real-time, reserve slots, simulate live charging sessions, pay securely, and leave community reviews.

![EV ChargeHub](https://img.shields.io/badge/EV_ChargeHub-v1.0.0-cyan?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-v5.4-646CFF?style=for-the-badge&logo=vite)

---

## ✨ Features

- 🔐 **Authentication System**: Sign In & Sign Up with Email/Password & Google OAuth simulation with persistent user state.
- 🚗 **EV Vehicle Management**: Register multiple EVs (Make, Model, Battery Capacity in kWh, Plug Type CCS2/Type 2/CHAdeMO, License Plate) with automatic preset loading for major EV manufacturers (Tesla, Tata, Hyundai, MG, Mahindra, Kia, etc.).
- 🗺️ **Interactive Station Map**: OpenStreetMap Leaflet integration featuring custom status markers (Available, Occupied, Out of Service), real-time search, and filter by charger speed (DC Fast Charging vs AC Regular).
- 🔌 **Station Details & Connector Status**: Real-time free/total connector count, power output (kW), pricing per kWh, amenities (Wi-Fi, Parking, Cafe, Restroom), and community reviews.
- 📅 **Slot Reservation**: Book charging slots by selecting vehicle, connector type, date, arrival time, and duration (15/30/45/60 min).
- ⚡ **Live Charging Session Simulator**: Real-time charging progress monitor with an animated glowing SVG progress ring, energy delivered calculator (kWh), live power rate (kW), live cost tracker (₹), and manual stop controls.
- 💳 **Payments & Receipts**: Itemized billing breakdown (energy delivered, rate, subtotal, 18% GST tax, total amount), payment method options (Credit Card, UPI), and instant digital receipt generation.
- ⭐ **Feedback & Reviews**: Interactive 5-star rating system with tag selection and user reviews.
- 📜 **Charging History**: Complete session log of past charges and receipts stored locally.

---

## 🚀 Quick Start

### 1. Prerequisites
Ensure you have **Node.js** (v20.x or higher) and **npm** installed on your machine.

### 2. Installation
Clone or copy the project repository into your preferred folder and navigate to the project root:

```bash
cd ev-chargehub
npm install --legacy-peer-deps
```

### 3. Running the App locally
Start the Vite development server:

```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:5173/ (or http://localhost:5174/)
```

---

## 🛠️ Tech Stack

- **Frontend**: React 19, React Router DOM 7
- **Styling**: Tailwind CSS v4, Vanilla CSS (Glassmorphism, custom scrollbars & keyframes)
- **Map & Geolocation**: Leaflet.js, React-Leaflet
- **Icons**: Lucide React Icons
- **Build Tool**: Vite 5
- **State & Storage**: React Context API with `localStorage` persistence

---

## 📦 How to Push to GitHub

To push this repository to GitHub:

```bash
# 1. Initialize Git repository
git init

# 2. Add all files to staging
git add .

# 3. Commit changes
git commit -m "feat: Initial commit of EV ChargeHub web application"

# 4. Set main branch name
git branch -M main

# 5. Link your GitHub remote repository (replace with your repository URL)
git remote add origin https://github.com/YOUR_USERNAME/ev-chargehub.git

# 6. Push to GitHub
git push -u origin main
```

---

## 📁 Project Structure

```
ev-chargehub/
├── public/
├── src/
│   ├── components/
│   │   └── Layout.jsx           # Responsive layout with sidebar & navigation
│   ├── context/
│   │   └── AppContext.jsx       # Global application state & localStorage sync
│   ├── data/
│   │   └── mockData.js          # Stations, EV makes/models, reviews dataset
│   ├── pages/
│   │   ├── BookingPage.jsx      # Slot reservation form
│   │   ├── ChargingSessionPage.jsx # Live charging progress & timer
│   │   ├── DashboardPage.jsx    # Overview dashboard & quick actions
│   │   ├── FeedbackPage.jsx     # Post-charge rating & review page
│   │   ├── HistoryPage.jsx      # Past sessions log
│   │   ├── LoginPage.jsx        # Login page
│   │   ├── PaymentPage.jsx      # Checkout & receipt generator
│   │   ├── SignupPage.jsx       # Signup page
│   │   ├── StationDetailPage.jsx# Station details, connectors & amenities
│   │   ├── StationsPage.jsx     # Leaflet map & list view explorer
│   │   └── VehiclePage.jsx      # EV registration & vehicle garage
│   ├── App.jsx                  # React Router routes & protection
│   ├── index.css                # Custom glassmorphism, animations & Tailwind
│   └── main.jsx                 # Entry point
├── index.html
├── package.json
├── README.md
├── vite.config.js
└── .gitignore
```
