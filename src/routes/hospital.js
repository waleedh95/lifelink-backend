// src/routes/hospital.js

import express from 'express';
import pgclient from '../db.js';

const router = express.Router();

// Stubbed Auth0 middleware (no-op) — remove once Auth0 is re-enabled
const requiresAuth = () => (_req, _res, next) => next();

/**
 * Create a new blood request
 * POST /api/requests
 * Body: {
 *   hospital_id? (integer, defaults to 1 for testing),
 *   blood_type (string),
 *   units_needed (integer),
 *   location (string),
 *   deadline (string, YYYY-MM-DD),
 *   notes? (string)
 * }
 */
router.post(
  '/', 
  requiresAuth(),
  async (req, res) => {
    const {
      hospital_id = 1,
      blood_type,
      units_needed,
      location,
      deadline,
      notes = ''
    } = req.body;

    try {
      const result = await pgclient.query(
        `INSERT INTO requests
           (hospital_id, blood_type, units_needed, location, deadline, notes)
         VALUES
           ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [hospital_id, blood_type, units_needed, location, deadline, notes]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('CREATE ERROR:', err);
      res.status(500).json({ error: 'Failed to create request' });
    }
  }
);

/**
 * List all requests for this hospital
 * GET /api/requests
 */
router.get(
  '/',
  requiresAuth(),
  async (_req, res) => {
    try {
      const result = await pgclient.query(
        `SELECT * FROM requests
           ORDER BY created_at DESC`
      );
      res.json(result.rows);
    } catch (err) {
      console.error('LIST ERROR:', err);
      res.status(500).json({ error: 'Failed to fetch requests' });
    }
  }
);

/**
 * Get a single request by ID
 * GET /api/requests/:id
 */
router.get(
  '/:id',
  requiresAuth(),
  async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pgclient.query(
        `SELECT * FROM requests WHERE id = $1`,
        [id]
      );
      if (!result.rows.length) {
        return res.status(404).json({ error: 'Request not found' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error('FETCH ERROR:', err);
      res.status(500).json({ error: 'Failed to fetch request' });
    }
  }
);

/**
 * Update a request
 * PUT /api/requests/:id
 * Body may include any of: blood_type, units_needed, location, deadline, notes, status
 */
router.put(
  '/:id',
  requiresAuth(),
  async (req, res) => {
    const { id } = req.params;
    const updates = [];
    const values = [];
    let idx = 1;

    for (const field of ['blood_type','units_needed','location','deadline','notes','status']) {
      if (req.body[field] != null) {
        updates.push(`${field} = $${idx}`);
        values.push(req.body[field]);
        idx++;
      }
    }

    if (!updates.length) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    values.push(id);

    try {
      const result = await pgclient.query(
        `UPDATE requests
           SET ${updates.join(', ')}
         WHERE id = $${idx}
         RETURNING *`,
        values
      );
      if (!result.rows.length) {
        return res.status(404).json({ error: 'Request not found' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error('UPDATE ERROR:', err);
      res.status(500).json({ error: 'Failed to update request' });
    }
  }
);

/**
 * Delete a request
 * DELETE /api/requests/:id
 */
router.delete(
  '/:id',
  requiresAuth(),
  async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pgclient.query(
        `DELETE FROM requests
           WHERE id = $1
         RETURNING id`,
        [id]
      );
      if (!result.rows.length) {
        return res.status(404).json({ error: 'Request not found' });
      }
      res.json({ id: result.rows[0].id });
    } catch (err) {
      console.error('DELETE ERROR:', err);
      res.status(500).json({ error: 'Failed to delete request' });
    }
  }
);

export default router;
