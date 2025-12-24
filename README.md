# MyCryptoFunds Repository

This repository contains both the Angular frontend and Node.js/Hapi backend for MyCryptoFunds.

## Structure

- `src/` – Angular frontend application
- `backend/` – Node.js/Hapi backend API

---

## Troubleshooting & Environment Notes

- **Node.js Version**: Use Node.js v18 or newer for both frontend and backend.
- **SQL Schema File**: The backend database schema is located at `backend/src/my-sql/create-database.sql`. Execute this file in MySQL Workbench or via command line to set up tables.
- **.env Security**: Never commit your `.env` files to version control. They contain sensitive credentials and API keys.
- **Common Issues**:
  - _Database connection errors_: Check your `.env` settings and ensure MySQL is running.
  - _Missing tables_: Make sure you executed the SQL schema file.
  - _API key errors_: Verify your CoinMarketCap API key is correct and active.
  - _Port conflicts_: Ensure nothing else is running on port 8000 (backend) or 4200 (frontend).

---

## Frontend (Angular)

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.3.

### Development server

To start the Angular frontend:

```bash
npm start
```

The app will be available at [http://localhost:4200](http://localhost:4200).
API requests to `/api/*` are proxied to the backend server.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Backend (Node.js/Hapi)

See [backend/README.md](backend/README.md) for backend setup and usage instructions.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

---

## Monorepo Tips

- Use separate terminals for frontend and backend development.
- Keep dependencies isolated in their respective `package.json` files.
- See each subproject's README for more details.

- For backend setup, see [backend/README.md](backend/README.md).

---

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
