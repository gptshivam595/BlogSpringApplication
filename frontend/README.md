# Blog Frontend (React + Vite)

This frontend is connected to the Spring Boot backend in this repository.

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

## Available Features

- Register user
- Login (JWT)
- List users (requires login)
- List/create categories
- List/search posts with pagination
- Create/delete posts
- View single post details
- Add/delete comments
- Upload post image

## Notes

- Backend auth expects login payload with `username` as the user email.
- For create post, provide existing `userId` and `categoryId`.
