
# 📊 Analytical Dashboard (Full Stack)

A powerful data analytics dashboard designed to visualize global insights with charts, filters, and a clean UI.
This repository contains **both frontend dashboard & backend API** inside the same project.

---

## 📁 Project Structure

```
root/
│── backend/       → Node + Express + MongoDB REST API
│── dashboard/     → React + TailwindCSS + Chart.js Analytics UI
└── README.md
```

---

## 🚀 Features

### 🖥 Dashboard (React)
✔ Responsive grid layout (Mobile → 1 column | Desktop → 2 columns)  
✔ Interactive charts using Chart.js  
✔ Filter drawer with multi‑criteria selection  
✔ Smooth UI + animations + Tailwind design  

### 🔌 Backend API (Node)
✔ Aggregated analytical insights  
✔ Filter‑based data response  
✔ Fast & scalable MongoDB pipeline  
✔ Endpoints for PESTLE, Sector, Risk, Correlation, Time‑Series & Geography  

---

## 🛠 Tech Stack

| Layer | Technology |
|------|-------------|
| Backend | Node, Express, MongoDB |
| Frontend | React, TailwindCSS, Axios |
| Visualization | Chart.js + react-chartjs-2 |

---

## ⚙ Setup Guide

### Install & Run Backend
```bash
cd backend
npm install
npm run dev        # server at http://localhost:5000
```

### Install & Run Dashboard
```bash
cd dashboard
npm install
npm run dev      # UI at http://localhost:5173
```

## Deploy to Netlify

The repository is configured as one Netlify site:

- Build command: `npm run build`
- Publish directory: `dashboard/dist`
- Functions directory: `netlify/functions`
- API URL: `/api/...` (proxied to the Express function)

Set these environment variables in Netlify before deploying:

```text
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
CORS_ORIGIN=https://your-site.netlify.app
```

The MongoDB Atlas network access rules must allow Netlify function traffic. The API function is available at `/api/records/...`; local development continues to use `npm run dev` from `backend`.

---

## 📌 Highlights

📍 Clean UI • Responsive Layout • Sleek Filters  
📍 Ideal for business insight analysis  
📍 Easy to extend & customize  

---

### 🤝 Contribute

Pull requests & suggestions are welcome!

---

### 📄 License
MIT — Free to use, modify & distribute.

---

✨ Built for Analytics & Insight‑Driven Decisions
