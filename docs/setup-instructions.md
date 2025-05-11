## Backend Setup (TypeScript)

1. `cd backend`
2. `npm install`
3. Add `.env`:

## Run with Docker

1. Add `.env` file inside `backend/`
2. From root folder:

#Frontend Scaffold

- React app created using Vite + TypeScript
- Tailwind CSS installed and configured (via postcss)
- Fixed ES module vs CommonJS compatibility by renaming config files to `.cjs`
- Axios installed and base API client created
- Folder structure organized into:
  - `src/pages/` for views
  - `src/components/` for UI parts
  - `src/context/` for shared state
  - `src/api/` for backend calls
- Development server runs at `http://localhost:5173`

## 🔐 Frontend Auth Flow

- JWT is stored in localStorage
- React Context handles auth state
- Login form POSTs to `/api/auth/login`
- Protected routes use token to show/hide pages
