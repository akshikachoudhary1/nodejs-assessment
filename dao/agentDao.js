/**
 * File: agentDao.js
 * Author: Akshika Choudhary
 * Date: 31-07-2025
 * Description: Data access object (DAO) for Agent collection. Provides methods to find or create agents in MongoDB using Mongoose.
 */

const Agent = require('../models/Agent');

/**
 * Finds or creates an Agent by name.
 * @param {string} name - Agent name
 * @returns {Promise<Object>} - Agent document
 */
async function upsert(name) {
  return Agent.findOneAndUpdate({ name }, { name }, { upsert: true, new: true });
}

module.exports = { upsert };
