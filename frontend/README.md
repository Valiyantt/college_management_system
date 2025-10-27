# Frontend for college_management_system

This is a minimal React + Vite frontend that consumes the backend API for Permanent Addresses.

Quick start (PowerShell):

1. cd into the frontend folder

   cd "frontend"

2. Install dependencies

   npm install

3. Start dev server (Vite)

   npm run dev

By default the app will call the API at `http://localhost:5000`. To override, create a `.env` file in `frontend/` with:

VITE_API_BASE_URL="http://localhost:5000"

If your backend runs on a different origin, ensure CORS is enabled in the API or use a proxy.

What it includes:
- Address list and address form (create/update/delete)
- Basic styling

Notes:
- This is a small scaffold meant to be extended. It intentionally keeps dependencies minimal.
