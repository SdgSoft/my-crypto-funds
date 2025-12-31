
import mysql from 'mysql';
let connection;

export function initializeDatabase() {
    connection = mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user:  process.env.DB_USER || 'hapi-server',
        password: process.env.DB_PASSWORD || 'hapi-pwd',
        database: process.env.DB_DATABASE || 'my-crypto-funds-dev'
    });
}

export const db = {
    connect: () => {
        if (!connection) {
            throw new Error('Database not initialized. Call initializeDatabase() first.');
        }
        connection.connect((err) => {
            if (err) {
                console.error('Database connection failed:', err);
                throw err;
            }
            console.log('Connected to database');
        });
    },
    query: (queryString, escapedValues) =>
        new Promise((resolve, reject) => {
            if (!connection) {
                return reject(new Error('Database not initialized. Call initializeDatabase() first.'));
            }
            connection.query(queryString, escapedValues, (error, results, fields) => {
                if (error) {
                    console.error("Database error: ", error);
                    return reject(new Error(`Database query failed: ${error.message}`));
                }
                resolve({ results, fields });
            })
        }),
    end: () => {
        if (!connection) {
            console.warn('Database connection was never initialized.');
            return;
        }
        connection.end((err) => {
            if (err) {
                console.error('Error closing database connection:', err);
            } else {
                console.log('Database connection closed');
            }
        });
    }
}