import Hapi from '@hapi/hapi';
import dotenv from 'dotenv';
import { db } from './database.js';
import routes from './routes';

dotenv.config();

let server;

const start = async () => {
    server = Hapi.server({
        port: 8000,
        host: 'localhost'
    })

    routes.forEach(route => server.route(route));

    db.connect();
    await server.start();
    console.log('Server running on %s', server.info.uri);
}

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

process.on('SIGINT', async () => {
    console.log('Stopping server...');
    await server.stop({ timeout: 10000 });
    db.end();
    console.log('Server stopped');
    process.exit(0);
});

start();