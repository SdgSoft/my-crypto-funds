# MyCryptoFunds Backend

This is the backend API for MyCryptoFundsClassic, built with Node.js, Hapi, and MySQL.

## Setup

### Prerequisites

#### CoinMarketCap API Key

To fetch cryptocurrency data, you need a free API key from CoinMarketCap:

1. Go to [https://coinmarketcap.com/api/](https://coinmarketcap.com/api/)
2. Click "Get Your API Key Now" and sign up for a free account.
3. After verifying your email, log in and go to the API dashboard.
4. Copy your API key from the dashboard.
5. Set the key in your `.env` file as `CMC_API_KEY` (see example above).

This key is required for backend price and market data requests to CoinMarketCap.

#### MySQL setup

1. **Install MySQL**

   - Download and install MySQL Community Server from [https://dev.mysql.com/downloads/mysql/](https://dev.mysql.com/downloads/mysql/).
   - Optionally, install MySQL Workbench for easier database management.

2. **Create Database User**

   - Open MySQL Workbench or connect to your MySQL server.
   - Create a user named `hapi-server` with a password (e.g., `hapi-pwd`).
   - Example SQL:
     ```sql
     CREATE USER 'hapi-server'@'localhost' IDENTIFIED BY 'hapi-pwd';
     ```

3. **Create Database Schema**

   - In MySQL Workbench, open and execute the SQL script found in the `my-sql/` folder of this project to create the required schema and tables.

4. **Grant Permissions**

   - Grant the following permissions to the `hapi-server` user on the `my-crypto-funds` database:
     ```sql
     GRANT DELETE, INSERT, UPDATE, SELECT ON my-crypto-funds.* TO 'hapi-server'@'localhost';
     FLUSH PRIVILEGES;
     ```

5. **Configure Environment**

   - Set the database credentials in your `.env` file as shown below.

6. Install dependencies:
   ```bash
   npm install
   ```
7. Create a `.env` file in the backend directory with your database and CMS API credentials:

   ```env
   # Database settings
   DB_HOST=localhost
   DB_USER=hapi-server
   DB_PASSWORD=hapi-pwd
   DB_DATABASE=my-crypto-funds

   # CoinMarketCap API settings
   CMC_URL=https://pro-api.coinmarketcap.com/v1
   CMC_API_KEY=your-coinmarketcap-api-key
   ```

8. Build the backend:
   ```bash
   npm run build
   ```
9. Start the backend server:
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
