const mongoose = require('mongoose');

const scheduledMessageSchema = new mongoose.Schema({
  message: { type: String, required: true },
  scheduledFor: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'sent'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ScheduledMessage', scheduledMessageSchema);
