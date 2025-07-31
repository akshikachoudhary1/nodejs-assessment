/**
 * File: messageDao.js
 * Author: Akshika Choudhary
 * Date: 31-07-2025
 * Description: Data access object (DAO) for ScheduledMessage collection. Provides methods to save and update scheduled messages in MongoDB using Mongoose.
 */

const ScheduledMessage = require('../models/ScheduledMessage');

/**
 * Save a new scheduled message to the database.
 * @param {Object} params - The message details.
 * @param {string} params.message - The message text.
 * @param {Date} params.scheduledFor - The date and time when the message should be sent.
 * @returns {Promise<Object>} The saved message document.
 */
async function createScheduledMessage({ message, scheduledFor }) {
  const scheduledMessage = new ScheduledMessage({ message, scheduledFor });
  return scheduledMessage.save();
}

/**
 * Find the next message that is due to be sent (scheduled time is now or earlier) and mark it as sent.
 * This function makes sure only one process can mark a message as sent at a time.
 * @returns {Promise<Object|null>} The updated message document, or null if none are due.
 */
async function fetchAndMarkDueMessage() {
  const now = new Date();
  return ScheduledMessage.findOneAndUpdate(
    { scheduledFor: { $lte: now }, status: 'pending' },
    { $set: { status: 'sent' } },
    { new: true }
  );
}

module.exports = {
  createScheduledMessage,
  fetchAndMarkDueMessage,
};
