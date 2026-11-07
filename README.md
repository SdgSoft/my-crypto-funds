# MyCryptoFunds Repository

This repository contains the Angular frontend and the Node.js/Hapi backend for MyCryptoFunds.

## Project structure

- `frontend/` – Angular frontend app
- `backend/` – backend API and database scripts
- `docker-compose.yml` – MySQL Docker setup
- `backend/backups/` – SQL backup files, including date-based dumps

---

## Prerequisites

- Node.js 18+
- npm
- Docker Desktop running on Windows/macOS/Linux
- Git

---

## 1) Install dependencies

### Frontend
```bash
cd frontend
npm install
```

### Backend
```bash
cd backend
npm install
```

---

## 2) Start the MySQL database in Docker

From the repo root:

```bash
cd c:\Projects\my-crypto-funds
docker compose up -d mysql
```

This starts a MySQL 8 container with the values defined in the local environment file for the backend project:

- database: `my-crypto-funds`
- user: `hapi-server`
- password: set in `backend/.env` as `DB_PASSWORD`
- host port: `3307`

The database data is stored in a Docker volume, so it persists across container restarts.

Check the container:

```bash
docker ps
```

---

## 3) Restore the database from backup

If you want to restore your saved data:

```bash
cd backend
npm run db:restore -- --File .\backups\20261107_backup_my-crypto-funds.sql
```

This restores the database from the date-based SQL dump.

---

## 4) Start the backend

```bash
cd backend
npm run prod
```

The backend runs on:

- http://localhost:8000

It connects to the Docker MySQL database using the values in `.env` / `.env.prod`.

---

## 5) Start the frontend

```bash
cd frontend
npm start
```

The frontend runs on:

- http://localhost:4200

API calls to `/api/*` are proxied to the backend.

---

## 6) Create a database backup

To create a dated dump:

```bash
cd backend
npm run db:backup
```

This creates a file in the `backups` folder with the format:

```text
yyyymmdd_backup_<dbname>.sql
```

Example:

```text
20261107_backup_my-crypto-funds.sql
```

---

## 7) Reset the database

If you want to completely reset the Docker database volume:

```bash
docker compose down -v
```

Then start it again:

```bash
docker compose up -d mysql
```

After that, restore the backup again if needed.

---

## Environment notes

- Never commit `.env` files.
- Docker database is on port `3307`, not the default MySQL port `3306`.
- Use `localhost:3307` if you connect via MySQL Workbench.
- The schema init file is mounted from [backend/backups/create-database.sql](backend/backups/create-database.sql).

---

## Useful commands

```bash
# MySQL container status
docker ps

# Show Docker volumes
docker volume ls

# Restart MySQL container
docker compose restart mysql

# Stop MySQL container
docker compose down

# Remove DB volume completely
docker compose down -v
```

---

## Troubleshooting

- If backend cannot connect to MySQL, check `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_DATABASE` in the backend `.env` files.
- If the database is empty, restore the backup or rerun the init script.
- If the frontend cannot reach the backend, ensure the backend is running on port 8000 and the Angular proxy is active.

---

For frontend app details, see the Angular setup in the `frontend` folder. For backend API details, see the backend docs and scripts in the `backend` folder.
