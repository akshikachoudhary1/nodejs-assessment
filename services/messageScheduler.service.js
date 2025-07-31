const cron = require('node-cron');
const messageDao = require('../dao/messageDao');

/**
 * File: messageScheduler.service.js
 * Author: Akshika Choudhary
 * Date: 31-07-2025
 * Description: Service for processing scheduled messages. Runs in the background and checks every minute for messages that should be sent.
 */

// function to process due scheduled messages
async function processDueMessages() {
  let processed = 0;
  while (true) {
    // Atomically fetch and mark a due message as sent
    const msg = await messageDao.fetchAndMarkDueMessage();
    if (!msg) break;
    // Here, you could add logic to deliver/send the message elsewhere
    console.log(`[Scheduler] Processed scheduled message: ${msg.message} (scheduled for ${msg.scheduledFor})`);
    processed++;
  }
  if (processed > 0) {
    console.log(`[Scheduler] Total messages processed in this run: ${processed}`);
  }
}

// Run every minute
cron.schedule('* * * * *', processDueMessages);

// Schedules a message for a specific day and time
async function scheduleMessageService({ message, day, time }) {
  if (!message || !day || !time) {
    throw new Error('message, day, and time are required');
  }
  // Compute next date/time for the requested day and time
  const daysOfWeek = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  const targetDay = daysOfWeek.indexOf(day.toLowerCase());
  if (targetDay === -1) throw new Error('Invalid day');
  const [hour, minute] = time.split(':').map(Number);
  if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) throw new Error('Invalid time');
  const now = new Date();
  let scheduledFor = new Date(now);
  scheduledFor.setHours(hour, minute, 0, 0);
  let diff = (targetDay + 7 - now.getDay()) % 7;
  if (diff === 0 && scheduledFor <= now) diff = 7; // if today but earlier, schedule for next week
  scheduledFor.setDate(now.getDate() + diff);
  // Save to DB
  const scheduledMessage = await messageDao.createScheduledMessage({ message, scheduledFor });
  return scheduledMessage;
}

module.exports = { processDueMessages, scheduleMessageService };

