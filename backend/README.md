# MyCryptoFunds Backend

This is the backend API for MyCryptoFundsClassic, built with Node.js, Hapi, and MySQL.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the backend directory with your database credentials:
   ```env
   DB_HOST=localhost
   DB_USER=hapi-server
   DB_PASSWORD=hapi-pwd
   DB_DATABASE=my-crypto-funds
   ```
3. Build the backend:
   ```bash
   npm run build
   ```
4. Start the backend server:
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

The server will run on `http://localhost:8000`.

## Project Structure

- `src/` - Source code
- `dist/` - Compiled code
- `routes/` - API route definitions
- `utils/` - Utility functions

## API

All endpoints are prefixed with `/api/` and are proxied from the Angular frontend via `proxy.config.json`.

## License

MIT
