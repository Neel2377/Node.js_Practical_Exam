# Node.js Practical Exam

Simple role-based authentication demo built with Node.js, Express, EJS and MongoDB.


## Deploy Link

- Link: https://node-js-practical-exam.onrender.com


## Admin Credentials

- Email: admin@gmail.com
- Password: admin12


## What this project is

- An Express app using EJS views and session-based authentication.
- Role-based routes/controllers for admin, manager, employee and users.
- MongoDB (mongoose) as the data store.

## Requirements

- Node.js (v16+ recommended)
- npm
- A running MongoDB instance

## Quick setup (Windows, cmd.exe)

1. Install dependencies

```cmd
npm install
```

2. Create a `.env` file in the project root with these variables (example):

```text
PORT=8081
MONGODB_URL=mongodb://localhost:27017/your-db-name
PRIVATE_KEY=your_jwt_private_key
SECRET_KEY=your_session_secret
```

3. Start the app

```cmd
npm start    # production: node index.js
npm run dev  # development: nodemon index.js (auto-restarts)
```

By default the app listens on the value from `PORT` or falls back to `8081`. When the server starts it logs:

```
Server start at http://localhost:<PORT>
```

## Important files & folders

- `index.js` - app entry point (registers middleware, session and routers).
- `package.json` - scripts and dependencies.
- `configs/` - configuration helpers:
  - `config.env.js` — loads `.env` variables used by the app.
  - `db.js` — mongoose connection helper.
- `routers/` - route definitions (see `index.js` inside `routers/`).
- `controllers/` - controller logic for admin, manager, employee and users.
- `middlewares/` - authentication and role-based middleware.
- `models/` - mongoose models (users, tasks, ...).
- `views/` - EJS templates and partials used to render pages.
- `public/` - static assets (CSS, JS, images, libs).

## Routes overview

Routes are registered from `routers/index.js`. The repository contains grouped route files:

- `user.routes.js` — registration/login and public user endpoints.
- `admin.routes.js`, `manager.routes.js`, `employee.routes.js` — role-specific routes.

See the `controllers/` and `views/pages/` folders for the corresponding pages and logic.

## Environment variables used

- `PORT` — port the Express app listens on (default 8081)
- `MONGODB_URL` — MongoDB connection string
- `PRIVATE_KEY` — used for JWT signing (if applicable in controllers)
- `SECRET_KEY` — express-session secret

## Dependencies (high level)

See `package.json` for the full list. Key libs:

- express, ejs, mongoose, express-session, dotenv, bcrypt, jsonwebtoken

## License

ISC (see `package.json`).

---