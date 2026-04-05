## Blog Frontend (React + Vite + React Router + Material UI)

This UI uses Material UI components for cleaner, consistent styling while keeping the same backend API contracts.

This frontend is connected to the Spring Boot backend in this repository and now includes a cleaner multi-page UI with role-based screens.

## Prerequisites

- Backend running on `http://localhost:9091`
- Node.js 18+ and npm

## Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Backend API Connection

By default, Vite dev server proxy forwards these paths to backend `http://localhost:9091`:

- `/api/*`
- `/v3/*`
- `/swagger-ui/*`

If you want to use a direct API base URL, copy `.env.example` to `.env` and set:

```bash
VITE_API_BASE_URL=http://localhost:9091
```

## Routes

- `/` Home
- `/posts` Posts listing + search + pagination
- `/posts/:postId` Post details + comments + image upload
- `/login` Login
- `/register` Register
- `/user` User dashboard (requires `ROLE_NORMAL` or `ROLE_ADMIN`)
- `/admin` Admin dashboard (requires `ROLE_ADMIN`)

## Role Handling

- Backend roles are read from `UserDto.roles`.
- Route guards enforce role access in frontend.
- Login payload uses `username` = user email (backend requirement).

## Available Features

- Register user
- Login/logout with JWT
- Browse/search posts
- Create/delete posts (auth required)
- Add/delete comments (auth required)
- Upload post image (auth required)
- Admin user/category management
- User dashboard for own posts


## UI Library

- Material UI (`@mui/material`)
- Emotion (`@emotion/react`, `@emotion/styled`)

The backend integration remains unchanged; only the presentation layer was upgraded.
