import express from 'express';
import { nanoid } from 'nanoid';

/**
 * Creates an Express router exposing CRUD for each top-level array in db.data
 * @param {LowSync} db
 */
export function createRouter(db) {
  const router = express.Router();

  const collections = Object.keys(db.data).filter((k) => Array.isArray(db.data[k]));

  for (const collection of collections) {
    // GET all
    router.get(`/${collection}`, (req, res) => {
      res.json(db.data[collection]);
    });

    // GET by id
    router.get(`/${collection}/:id`, (req, res) => {
      const item = db.data[collection].find((i) => String(i.id) === req.params.id);
      if (!item) return res.status(404).json({ error: 'Not found' });
      res.json(item);
    });

    // POST create
    router.post(`/${collection}`, (req, res) => {
      const body = req.body || {};
      const items = db.data[collection];

      let newId;

      if (body.id !== undefined) {
        // ✅ Use provided ID if available
        newId = body.id;
      } else if (items.length > 0 && typeof items[0].id === 'number') {
        // ✅ Auto-increment numeric IDs
        const maxId = Math.max(...items.map((i) => (typeof i.id === 'number' ? i.id : 0)));
        newId = maxId + 1;
      } else {
        // ✅ Fallback: generate random string ID
        newId = nanoid(6);
      }

      const newItem = { id: newId, ...body };
      items.push(newItem);
      db.write();
      res.status(201).json(newItem);
    });

    // PATCH update
    router.patch(`/${collection}/:id`, (req, res) => {
      const idx = db.data[collection].findIndex((i) => String(i.id) === req.params.id);
      if (idx === -1) return res.status(404).json({ error: 'Not found' });

      db.data[collection][idx] = { ...db.data[collection][idx], ...req.body };
      db.write();
      res.json(db.data[collection][idx]);
    });

    // DELETE
    router.delete(`/${collection}/:id`, (req, res) => {
      const before = db.data[collection].length;
      db.data[collection] = db.data[collection].filter((i) => String(i.id) !== req.params.id);

      if (db.data[collection].length === before) {
        return res.status(404).json({ error: 'Not found' });
      }

      db.write();
      res.status(204).end();
    });
  }

  // Helpful 404 for missing collections
  router.use((req, res) => {
    res.status(404).json({ error: 'Route not found. Check your collection names and IDs.' });
  });

  return router;
}
