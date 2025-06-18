import express from 'express';
import pgclient from '../db.js';

const router = express.Router();

/**
 * List active blood requests
 * GET /api/donor/requests
 */
router.get('/requests', async (_req, res) => {
  try {
    const { rows } = await pgclient.query(`
      SELECT id, blood_type, units_needed, units_fulfilled, status, location, deadline, notes
        FROM requests
       WHERE status = 'Active'
       ORDER BY created_at DESC;
    `);
    res.json(rows);
  } catch (err) {
    console.error('DONOR LIST ERROR:', err);
    res.status(500).json({ error: 'Failed to fetch available requests' });
  }
});

/**
 * Donate to a request (1 unit)
 * POST /api/donor/requests/:id/donate
 * Body: { donor_id? (integer, default 1) }
 */
router.post('/requests/:id/donate', async (req, res) => {
  const { id } = req.params;
  const donor_id = req.body.donor_id || 1;  // default for testing
  try {
    const { rows:[donation] } = await pgclient.query(`
      INSERT INTO donations (donor_id, request_id, units)
      VALUES ($1, $2, 1)
      RETURNING *;
    `, [donor_id, id]);

    await pgclient.query(`
      UPDATE requests
         SET units_fulfilled = units_fulfilled + 1,
             status = CASE WHEN units_fulfilled + 1 >= units_needed THEN 'Fulfilled' ELSE status END
       WHERE id = $1;
    `, [id]);

    res.status(201).json(donation);
  } catch (err) {
    console.error('DONATE ERROR:', err);
    res.status(500).json({ error: 'Failed to donate' });
  }
});

/**
 * List donations by this donor
 * GET /api/donor/donations
 */
router.get('/donations', async (_req, res) => {
  try {
    const { rows } = await pgclient.query(`
      SELECT d.id, d.request_id, d.units, d.status, d.donated_at,
             r.blood_type, r.location
        FROM donations d
        JOIN requests r ON r.id = d.request_id
       ORDER BY d.donated_at DESC;
    `);
    res.json(rows);
  } catch (err) {
    console.error('DONATIONS LIST ERROR:', err);
    res.status(500).json({ error: 'Failed to fetch donations' });
  }
});

export default router;
