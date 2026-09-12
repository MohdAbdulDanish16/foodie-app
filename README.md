# 🍔 Foodie - Online Food Ordering Application

Foodie is a full-stack online food ordering application where users can browse food items, add them to cart, place orders, and track their orders.

The application also includes authentication and an admin panel for managing orders.

## 🚀 Live Demo

- Frontend: https://foodie-app-lilac-ten.vercel.app/
- Backend: https://foodie-app-isdf.onrender.com

## ✨ Features

### 👤 User Features
- User Signup and Login
- JWT Authentication
- Browse food items
- Search food items
- Filter food by category
- Add food to cart
- Increase/decrease quantity
- Checkout
- Place orders
- View order history
- Track order status

### 👨‍💼 Admin Features
- Admin Login
- Admin Dashboard
- View all orders
- Update order status
- Protected admin routes

## 🛠️ Technologies Used

### Frontend
- React.js
- JavaScript
- CSS
- Vite
- React Router
- LocalStorage

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- CORS

### Deployment
- Vercel - Frontend
- Render - Backend
- MongoDB Atlas - Database

## 📁 Project Structure

```text
foodie-app/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── .env
│
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── README.md