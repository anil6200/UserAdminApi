# AuthManager API (Admin + User Authentication System)
A role-based authentication and authorization system built with Node.js, Express, MongoDB, and JWT.
# Features
User signup/login
Admin signup/login
Role-based access control
JWT authentication
# Tools Used (Tech Stack)
Backend me Node, Express
Database me MongoDB
Auth ke liye JWT + bcrypt
# Project Structure (In a folder)
controllers/
┣ admincontroller.js
┗ usercontroller.js
# Installation (How to set up)
clone repo
npm install
.env file banana (PORT, MONGO_URI, JWT_SECRET)
npm start run karna
# Api Endpoints 
POST /api/users/signup → User signup
POST /api/admins/login → Admin login
# Middleware
VerifuUser
VerifyAdmin 