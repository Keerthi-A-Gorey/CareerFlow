# CareerFlow

CareerFlow is a full-stack web application designed to help users manage and track job and internship applications efficiently. It provides a centralized platform to monitor application progress, manage resume versions, and analyze performance.

---

## Features

- Track job and internship applications
- Update application status (Applied, OA, Interview, Offer, Rejected)
- Manage multiple resume versions
- View analytics such as response rate and application funnel
- Automated follow-up reminders using background jobs
- Secure user authentication using JWT

---

## Tech Stack

### Frontend
- React (TypeScript)
- Tailwind CSS
- Recharts
- Axios

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas

### Other
- JWT Authentication
- Node-cron (for scheduled reminders)

---
# Application Preview

## Login / Signup

![Login / Signup](Docs/Login.png)

---

## Dashboard

![Dashboard](Docs/Dashboard.png)

---

## Resume Management

![Resume Management](Docs/Resumes.png)

---

## Analytics

![Analytics](Docs/Analytics.png)

---

# System Architecture

![System Architecture](Docs/archi.png)

---

## API Endpoints

### Auth
- POST /auth/register
- POST /auth/login

### Applications
- GET /applications
- POST /applications
- PATCH /applications/:id/status
- DELETE /applications/:id

### Resumes
- GET /resumes
- POST /resumes
- DELETE /resumes/:id

### Analytics
- GET /analytics/funnel
- GET /analytics/source-performance
- GET /analytics/resume-performance

### Reminders
- GET /reminders
- PATCH /reminders/:id/done

---

## Installation

### 1. Clone the repository
```

git clone https://github.com/Keerthi-A-Gorey/CareerFlow.git
cd careerflow

```

### 2. Install dependencies

Install the backend and frontend dependencies from the repository root:

```sh
cd careerflow-backend
npm install
cd ../careerflow-dashboard-main
npm install
cd ..
```

### 3. Setup environment variables

Create `careerflow-backend/.env` from `careerflow-backend/.env.example` and set
your MongoDB connection string and JWT secrets. Create
`careerflow-dashboard-main/.env.local` from
`careerflow-dashboard-main/.env.example`; set `VITE_API_URL` to the backend URL
(locally, `http://localhost:5000`).

### 4. Run the application

Start the backend in one terminal:
```sh
cd careerflow-backend
npm run dev
```

Start the frontend in another terminal:
```sh
cd careerflow-dashboard-main
npm run dev
```

---

## Usage

1. Register or log in to your account
2. Add job or internship applications
3. Update application status as you progress
4. Manage resume versions
5. View analytics to track performance
6. Check reminders for follow-ups

---

## Future Improvements

- Email and push notifications
- Integration with job platforms
- Mobile application support
- Advanced analytics and recommendations

---

## License

This project is for academic and personal use.
