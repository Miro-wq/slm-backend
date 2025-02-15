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