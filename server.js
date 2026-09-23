require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const { initDB } = require('./db');
const queueRoutes = require('./routes/queue');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Task 9: rate limit the whole app
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,             // 30 requests per minute per IP
  message: { error: 'Too many requests, please slow down.' }
});
app.use(limiter);

// Task 2: create the table on startup
initDB();

app.use('/queue', queueRoutes);

// Fallback for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Task 8: single centralized error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`QuickCuts queue API running on http://localhost:${PORT}`);
});
