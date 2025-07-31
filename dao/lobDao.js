/**
 * File: lobDao.js
 * Author: Akshika Choudhary
 * Date: 31-07-2025
 * Description: Data access object (DAO) for LOB (Line of Business) collection. Provides methods to find or create LOBs in MongoDB using Mongoose.
 */

const LOB = require('../models/LOB');

/**
 * Finds or creates a LOB (Line of Business) by category_name.
 * @param {string} category_name - Category name
 * @returns {Promise<Object>} - LOB document
 */
async function upsert(category_name) {
  return LOB.findOneAndUpdate(
    { category_name },
    { category_name },
    { upsert: true, new: true }
  );
}

module.exports = { upsert };
