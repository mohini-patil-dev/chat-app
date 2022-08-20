// .env Configs
import dotenv from 'dotenv';
dotenv.config();

// DB IMPORTS
import './db/mongodb/index';
import './db/redis';

// Express Socket and http servers
import express from 'express';
import http, { Server } from 'http';
import SocketInstance from './socket';

// Import Logger
import morgan from './logger/morgan';

// IMPORT CORS
import cors from 'cors';

// IMPORT ROUTES
import allRoutes from './routes';

const app = express();
const server: Server = http.createServer(app);

// Json Config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger
app.use(morgan);

// CORS
app.use(
    cors({
        origin: '*',
    }),
);

// ROUTES
app.use('/api', allRoutes);

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

new SocketInstance(server);
