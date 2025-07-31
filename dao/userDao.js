/**
 * File: userDao.js
 * Author: Akshika Choudhary
 * Date: 31-07-2025
 * Description: Data access object (DAO) for User collection. Provides methods to find or create users in MongoDB using Mongoose.
 */

const User = require('../models/User');

/**
 * Finds or creates a User by email.
 * @param {Object} userObj - User details
 * @returns {Promise<Object>} - User document
 */
async function upsert(userObj) {
  return User.findOneAndUpdate(
    { email: userObj.email },
    userObj,
    { upsert: true, new: true }
  );
}

module.exports = { upsert };
