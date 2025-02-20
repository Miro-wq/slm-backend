const express = require('express');
const router = express.Router();
const DiaryEntry = require('../models/DiaryEntry');
const jwt = require('jsonwebtoken');

// middleware token JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

/**
 * @swagger
 * /api/diary:
 *   post:
 *     summary: Create a new diary entry
 *     tags: [Diary]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - entry_date
 *               - product_name
 *               - grams
 *             properties:
 *               entry_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-02-16"
 *               product_name:
 *                 type: string
 *                 example: "Eggs"
 *               grams:
 *                 type: number
 *                 example: 100
 *     responses:
 *       201:
 *         description: Diary entry created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DiaryEntry'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

// POST /diary
router.post('/', authenticateToken, async (req, res) => {
    const { entry_date, product_name, grams } = req.body;
    try {
        const newEntry = new DiaryEntry({
            user_id: req.user.userId,
            entry_date,
            product_name,
            grams,
        });
        await newEntry.save();
        res.status(201).json(newEntry);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @swagger
 * /api/diary:
 *   get:
 *     summary: Get diary entries for a specific date
 *     tags: [Diary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: entry_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Date of diary entries (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: A list of diary entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DiaryEntry'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

// GET /diary
router.get('/', authenticateToken, async (req, res) => {
    const { entry_date } = req.query;
    try {
        const entries = await DiaryEntry.find({
            user_id: req.user.userId,
            entry_date: entry_date
        });
        res.json(entries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @swagger
 * /api/diary/{id}:
 *   delete:
 *     summary: Delete a diary entry by its ID
 *     tags: [Diary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The diary entry ID
 *     responses:
 *       200:
 *         description: Diary entry deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Diary entry not found
 *       500:
 *         description: Server error
 */

// DELETE /diary/:id
router.delete('/:id', authenticateToken, async (req, res) => {
    const entryId = req.params.id;
    try {
        const deleted = await DiaryEntry.findOneAndDelete({
            _id: entryId,
            user_id: req.user.userId
        });
        if (!deleted) {
            return res.status(404).json({ message: 'Entry not found' });
        }
        res.json({ message: 'Entry deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;