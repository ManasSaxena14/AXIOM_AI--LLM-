import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Axiom AI Server is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

router.get('/ping', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'pong'
    });
});

export default router;
