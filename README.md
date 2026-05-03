# College Attendance Management System (CAMS)

A full-stack web application for digitizing and automating attendance tracking in colleges with role-based portals for Students, Teachers, and HODs.

## Features

- **Multi-role login system** (Student, Teacher, HOD)
- **Attendance tracking** per subject
- **Automated alerts** for low attendance (<75%)
- **Assignment tracking**
- **Excel report export**
- **Admin management system**

## Tech Stack

### Backend
- Node.js with Express
- PostgreSQL
- JWT Authentication
- bcrypt for password hashing

### Frontend
- React with Vite
- Tailwind CSS
- React Router DOM

## Project Structure

```
project 2/
├── cams-backend/
│   ├── config/          # Database config, schema
│   ├── controllers/     # Route controllers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & role middleware
│   ├── server.js        # Entry point
│   └── .env             # Environment variables
├── cams-frontend/
│   ├── src/             # React source code
│   ├── public/          # Static assets
│   └── vite.config.js   # Vite configuration
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js installed
- PostgreSQL installed and running
- npm or yarn

### Backend Setup
1. Navigate to `cams-backend`
2. Copy `.env.example` to `.env` and update with your database credentials
3. Create PostgreSQL database: `cams_db`
4. Run the schema: `psql -U postgres -d cams_db -f config/schema.sql`
5. Install dependencies: `npm install`
6. Start server: `npm run dev`

### Frontend Setup
1. Navigate to `cams-frontend`
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

## Environment Variables

### Backend (.env)
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cams_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
```

## MVP Timeline

- Phase 1: Auth + Roles (1-2 weeks)
- Phase 2: Attendance system (2 weeks)
- Phase 3: HOD panel (1 week)
- Phase 4: Alerts + Assignments (1 week)
- Phase 5: Reports + Excel (1 week)
