/**
 * File: User.js
 * Author: Akshika Choudhary
 * Date: 29-07-2025
 * Description: Mongoose schema and model for User collection. Represents a user entity
 *              with personal and contact details for insurance policies.
 */

const mongoose = require('mongoose');

/**
 * Mongoose schema for User collection.
 * Represents a user entity with personal and contact details.
 */
const UserSchema = new mongoose.Schema({
  firstname: String,
  dob: String,
  address: String,
  phone: String,
  state: String,
  zip: String,
  email: String,
  gender: String,
  userType: String
});

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ firstname: 1 });

/**
 * Exports the User model based on UserSchema.
 */
module.exports = mongoose.model('User', UserSchema);
