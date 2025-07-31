const { scheduleMessageService } = require('../services/messageScheduler.service');

/**
 * File: messageController.js
 * Author: Akshika Choudhary
 * Date: 31-07-2025
 * Description: Controller for handling scheduled message API requests. Receives the request from the user and calls the service to schedule a message.
 */
// POST /api/messages/schedule
exports.scheduleMessage = async (req, res) => {
  try {
    const { message, day, time } = req.body;
    const scheduledMessage = await scheduleMessageService({ message, day, time });
    res.status(201).json({ message: 'Message scheduled', scheduledMessage });
  } catch (err) {
    if (err.message.includes('required') || err.message.includes('Invalid day or time')) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};
