# Alzikrayat — MERN Edition

## Description
Alzikrayat is a full-stack photo sharing application. Users can register, log in, upload photos, browse a gallery in grid or list view, open a photo's detail page, comment on photos, and delete their own photos.

This project rebuilds the Alzikrayat application from Project 1 using the MERN stack.

## Technologies
- **Frontend:** React (Vite), React Router, Bootstrap 5
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas with Mongoose
- **Libraries:** bcrypt, Joi, multer, cors, dotenv

## Project Structure
```
alzikrayat-mern/
├── client/
│   ├── src/
│   │   ├── components/   Navbar, PhotoCard, UploadForm, CommentForm, LoginForm, RegisterForm
│   │   ├── pages/        Home, Gallery, PhotoDetail, LoginRegister
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
└── server/
    ├── models/           User.js, Photo.js, Comment.js
    ├── routes/           authRoutes.js, photoRoutes.js, commentRoutes.js
    ├── controllers/      authController.js, photoController.js, commentController.js
    ├── middleware/       validation.js, errorHandler.js
    ├── uploads/
    ├── .env
    └── server.js
```

## Requirements
- Node.js (LTS version)
- A MongoDB Atlas account (or a local MongoDB server)

## Environment Variables
Create a file named `.env` inside the `server` folder:

```
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-address>/alzikrayat
```

| Variable | Description |
|----------|-------------|
| `PORT` | Port the Express server runs on (the client proxy expects `3000`) |
| `MONGODB_URI` | MongoDB connection string. `alzikrayat` is the database name |

The `.env` file is listed in `.gitignore` and is never committed.

## How to Run

### 1. Start the server
```
cd server
npm install
npm run dev
```
The terminal shows `Connected to MongoDB` and `Server running on port 3000`.

### 2. Start the client (in a second terminal)
```
cd client
npm install
npm run dev
```

### 3. Open the application
Go to `http://localhost:5173` in the browser.

The Vite development server forwards every `/api` and `/uploads` request to the Express server on port 3000.

## API Endpoints

| Method | Endpoint | Description | Success Status |
|--------|----------|-------------|----------------|
| POST | `/api/auth/register` | Register a new user | 201 |
| POST | `/api/auth/login` | Log in and return the user's public profile | 200 |
| GET | `/api/photos` | Get all photos | 200 |
| GET | `/api/photos/:id` | Get one photo | 200 |
| POST | `/api/photos` | Upload a photo (logged-in users) | 201 |
| DELETE | `/api/photos/:id` | Delete a photo (owner only) | 204 |
| GET | `/api/photos/:id/comments` | Get the comments of a photo | 200 |
| POST | `/api/photos/:id/comments` | Add a comment (logged-in users) | 201 |

Error responses use the format `{ "error": "message" }` with status codes 400, 401, 403, 404, 409 or 500.

## Student Name
Samar Abdalla Alsheikh Suliman
