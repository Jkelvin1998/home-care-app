import cors from 'cors';
import express from 'express';

import authRoutes from './routes/authRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import recordRoutes from './routes/recordRoutes.js';

const app = express();

app.use(
   cors({
      origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
      credentials: true,
   }),
);

app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (_req, res) => {
   res.json({ ok: true });
});

app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/records', recordRoutes);

app.use((err, _req, res, _next) => {
   console.error(err);
   res.status(500).json({ message: 'Internal server error' });
});

export default app;
