/**
 * File: accountDao.js
 * Author: Akshika Choudhary
 * Date: 31-07-2025
 * Description: Data access object (DAO) for Account collection. Provides methods to find or create accounts in MongoDB using Mongoose.
 */

const Account = require('../models/Account');

/**
 * Finds or creates an Account by account_name.
 * @param {string} account_name - Account name
 * @param {string} account_type - Account type
 * @returns {Promise<Object>} - Account document
 */
async function upsert(account_name, account_type) {
  return Account.findOneAndUpdate(
    { account_name },
    { account_name, account_type },
    { upsert: true, new: true }
  );
}

module.exports = { upsert };
