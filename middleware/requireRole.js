// src/middleware/requireRole.js
import pgclient from '../db.js';

export default function requireRole(expectedRole) {
  return async (req, res, next) => {
    // 1. Must be logged in via Auth0
    const auth0Id = req.oidc?.user?.sub;
    if (!auth0Id) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
      // 2. Look up their role in your users table
      const { rows } = await pgclient.query(
        'SELECT role FROM users WHERE auth0_id = $1',
        [auth0Id]
      );

      if (!rows.length) {
        return res.status(403).json({ error: 'User not found' });
      }

      const { role } = rows[0];
      // 3. Check it matches what we expect
      if (role !== expectedRole) {
        return res.status(403).json({ error: `Requires role: ${expectedRole}` });
      }

      next();
    } catch (err) {
      console.error('ROLE CHECK ERROR:', err);
      res.status(500).json({ error: 'Authorization failure' });
    }
  };
}
