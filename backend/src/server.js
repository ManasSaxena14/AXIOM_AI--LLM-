import dotenv from 'dotenv';

dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5001;

const startServer = async () => {
    try {
        await connectDB();
    } catch (error) {
        console.error('Server failed to start due to database connection issues');
        process.exit(1);
    }

    const server = app.listen(PORT, () => {
        // Server started silently for production
    });

    process.on('unhandledRejection', (err) => {
        console.error('Unhandled Rejection:', err.message);
        server.close(() => {
            process.exit(1);
        });
    });

    process.on('uncaughtException', (err) => {
        console.error('Uncaught Exception:', err.message);
        process.exit(1);
    });

    process.on('SIGTERM', () => {
        server.close(() => {
            process.exit(0);
        });
    });
};

startServer();
