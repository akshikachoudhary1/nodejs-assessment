const cron = require('node-cron');
const ScheduledMessage = require('../models/ScheduledMessage');

// Run every minute
cron.schedule('* * * * *', async () => {
  const now = new Date();
  const dueMessages = await ScheduledMessage.find({
    scheduledFor: { $lte: now },
    status: 'pending'
  });
  for (const msg of dueMessages) {
    // Here, "insert into DB" means mark as sent (or move to another collection if needed)
    console.log(`[Scheduler] Inserting message: ${msg.message} (scheduled for ${msg.scheduledFor})`);
    msg.status = 'sent';
    await msg.save();
    // You could also add logic to actually deliver/send the message elsewhere
  }
});
