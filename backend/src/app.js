import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import errorHandler from './middleware/errorHandler.js';

import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import chatRoutes from './routes/chat.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app = express();

app.use(helmet());

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        const allowedOrigin = process.env.CLIENT_URL;

        if (process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }

        if (allowedOrigin === origin ||
            allowedOrigin === origin + '/' ||
            allowedOrigin + '/' === origin) {
            callback(null, true);
        } else {
            console.log(`[CORS BLOCKED] Request from origin: '${origin}' does not match allowed: '${allowedOrigin}'`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token']
};
app.use(cors(corsOptions));

app.use(cookieParser());

app.use(express.json({ limit: '10mb' }));

app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/health', healthRoutes);

app.use('/api/auth', authRoutes);


app.use('/api/chats', chatRoutes);
app.use('/api/admin', adminRoutes);

app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

app.use(errorHandler);

export default app;
