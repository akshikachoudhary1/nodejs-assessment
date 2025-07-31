/**
 * File: Account.js
 * Author: Akshika Choudhary
 * Date: 29-07-2025
 * Description: Mongoose schema and model for Account collection. Represents an account entity
 *              with account name and type fields for insurance policy normalization.
 */

const mongoose = require('mongoose');

/**
 * Mongoose schema for Account collection.
 * Represents an account entity with name and type fields.
 */
const AccountSchema = new mongoose.Schema({
  account_name: String,
  account_type: String
});

AccountSchema.index({ account_name: 1, account_type: 1 });

/**
 * Exports the Account model based on AccountSchema.
 */
module.exports = mongoose.model('Account', AccountSchema);
