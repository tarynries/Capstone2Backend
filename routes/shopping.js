const express = require("express");
const router = express.Router();
const db = require("../db");


// POST request to add a new item to the grocery list
router.post('/', async (req, res) => {
    try {
        const newItem = req.body;

        // Insert the new item into the database
        const query = 'INSERT INTO items (name) VALUES ($1) RETURNING *';
        const values = [newItem.name];

        const result = await db.query(query, values);

        // Send the newly created item as the response
        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error("Error adding item to shopping list:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET request to fetch the grocery list
router.get('/', async (req, res) => {
    try {
        // Retrieve the grocery list from the database
        const query = 'SELECT * FROM items';
        const result = await db.query(query);

        // Send the grocery list as the response
        res.json(result.rows);

    } catch (error) {
        console.error("Error retrieving shopping list:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE request to remove an item from the grocery list
router.delete('/:id', async (req, res) => {
    try {
        const itemId = req.params.id;

        // Delete the item from the database
        const query = 'DELETE FROM items WHERE id = $1';
        const values = [itemId];
        await db.query(query, values);

        // Send a success response
        res.status(200).json({ message: 'Item removed successfully' });

    } catch (error) {
        console.error("Error removing item from shopping list:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;
