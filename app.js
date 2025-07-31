require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');

const app = express();

// --- CPU Monitoring Logic ---
const os = require('os-utils');
setInterval(() => {
  os.cpuUsage(function(v) {
    const percent = (v * 100).toFixed(2);
    console.log(`[CPU Monitor] Usage: ${percent}%`);
    if (v > 0.7) {
      console.error(`[CPU Monitor] High CPU detected (${percent}%). Restarting server...`);
      process.exit(1);
    }
  });
}, 10000); // every 10 seconds
// --- End CPU Monitoring ---

app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
const policyRoutes = require('./routes/policyRoutes');
const messageRoutes = require('./routes/messageRoutes');
// Use RESTful plural endpoint for policies
app.use('/api/policies', policyRoutes);
app.use('/api/messages', messageRoutes);

// Start scheduled message background job
require('./services/messageScheduler.service');

// Health check
app.get('/', (req, res) => {
  res.send('Insurance API is running');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
