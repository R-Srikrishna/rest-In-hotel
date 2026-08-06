# Hotel Management System

A full-stack hotel booking system built with Node.js, Express, Sequelize, MySQL, Next.js, and React. This project is designed to demonstrate how a real-world web application works from frontend to backend, including authentication, booking flows, admin management, and database-driven CRUD operations.

## What this project teaches

This project helps you learn and practice:

- Full-stack web development
- Frontend development with Next.js and React
- Backend development with Express.js
- REST API design and integration
- Authentication and role-based access
- Database design using Sequelize and MySQL
- CRUD operations for rooms, guests, and bookings
- State handling and form validation in the UI
- Building a practical admin dashboard for business operations

## Project Overview

The system allows users to:

- Browse available rooms
- Create guest accounts
- Book rooms for selected dates
- View and manage personal bookings
- Admins can manage rooms, guests, and bookings from a dashboard

## Features

### Guest Features

- Sign up and login
- View available rooms
- Make room bookings
- View booking history

### Admin Features

- Secure admin login
- Manage rooms
- Manage guests
- Manage bookings
- View overall booking data from a dashboard

## Tech Stack

### Frontend

- Next.js
- React
- CSS
- Axios

### Backend

- Node.js
- Express.js
- Sequelize
- MySQL
- JWT authentication

## Project Structure

- backend/ - server, API routes, models, controllers
- frontend/ - Next.js pages, components, services
- public/ - static assets

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/R-Srikrishna/Hotel.git
cd Hotel
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder and configure your database and server settings.

Run the backend:

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
npm run dev
```

Open your browser and visit:

- Frontend: http://localhost:3000
- Backend API: http://localhost:3000 or your configured port

## Learning Goals

By working on this project, you will understand:

- How frontend and backend connect together
- How to structure a real project using separate folders for routes, models, and controllers
- How authentication works in a web app
- How admin and guest roles differ in a business application
- How to design and use a database-backed booking system

## License

This project is licensed under the ISC License.

## Author

R. Srikrishna
