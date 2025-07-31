/**
 * File: carrierDao.js
 * Author: Akshika Choudhary
 * Date: 31-07-2025
 * Description: Data access object (DAO) for Carrier collection. Provides methods to find or create carriers in MongoDB using Mongoose.
 */

const Carrier = require('../models/Carrier');

/**
 * Finds or creates a Carrier by company_name.
 * @param {string} company_name - Carrier name
 * @returns {Promise<Object>} - Carrier document
 */
async function upsert(company_name) {
  return Carrier.findOneAndUpdate(
    { company_name },
    { company_name },
    { upsert: true, new: true }
  );
}

module.exports = { upsert };
