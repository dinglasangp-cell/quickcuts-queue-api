const express = require('express');
const router = express.Router();
const { db } = require('../db');
const requireApiKey = require('../middleware/apiKey');

const VALID_SERVICE_TYPES = ['Haircut', 'Shave', 'Haircut + Shave'];
const VALID_STATUSES = ['Waiting', 'In Chair', 'Done'];

// Task 3 — GET /queue (public)
router.get('/', (req, res, next) => {
  try {
    const entries = db.prepare('SELECT * FROM queue').all();
    res.json(entries);
  } catch (err) {
    next(err);
  }
});

// Task 4 — GET /queue/:id (public)
router.get('/:id', (req, res, next) => {
  try {
    const entry = db.prepare('SELECT * FROM queue WHERE id = ?').get(req.params.id);
    if (!entry) {
      return res.status(404).json({ error: `No queue entry found with id ${req.params.id}` });
    }
    res.json(entry);
  } catch (err) {
    next(err);
  }
});

// Task 5 — POST /queue (requires API key)
router.post('/', requireApiKey, (req, res, next) => {
  try {
    const { customerName, serviceType } = req.body;

    if (!customerName || typeof customerName !== 'string' || !customerName.trim()) {
      return res.status(400).json({ error: 'customerName is required' });
    }
    if (!VALID_SERVICE_TYPES.includes(serviceType)) {
      return res.status(400).json({ error: `serviceType must be one of: ${VALID_SERVICE_TYPES.join(', ')}` });
    }

    const status = 'Waiting';                 // server sets this, not the client
    const timeIn = new Date().toISOString();   // server sets this too

    const result = db.prepare(
      'INSERT INTO queue (customerName, serviceType, status, timeIn) VALUES (?, ?, ?, ?)'
    ).run(customerName.trim(), serviceType, status, timeIn);

    const newEntry = db.prepare('SELECT * FROM queue WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newEntry);
  } catch (err) {
    next(err);
  }
});

// Task 6 — PUT /queue/:id (requires API key, status only)
router.put('/:id', requireApiKey, (req, res, next) => {
  try {
    const { status } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    const existing = db.prepare('SELECT * FROM queue WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: `No queue entry found with id ${req.params.id}` });
    }

    db.prepare('UPDATE queue SET status = ? WHERE id = ?').run(status, req.params.id);
    const updated = db.prepare('SELECT * FROM queue WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Task 7 — DELETE /queue/:id (requires API key)
router.delete('/:id', requireApiKey, (req, res, next) => {
  try {
    const existing = db.prepare('SELECT * FROM queue WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: `No queue entry found with id ${req.params.id}` });
    }

    db.prepare('DELETE FROM queue WHERE id = ?').run(req.params.id);
    res.json({ message: 'Entry removed', entry: existing });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
