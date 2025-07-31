/**
 * File: messageRoutes.js
 * Author: Akshika Choudhary
 * Date: 31-07-2025
 * Description: Express route definitions for scheduled message API endpoints.
 */

const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// POST /api/messages/schedule
router.post('/schedule', messageController.scheduleMessage);

module.exports = router;
