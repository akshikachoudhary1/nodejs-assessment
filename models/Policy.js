/**
 * File: Policy.js
 * Author: Akshika Choudhary
 * Date: 29-07-2025
 * Description: Mongoose schema and model for Policy collection. Represents an insurance policy
 *              with references to related entities for normalized data storage.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Mongoose schema for Policy collection.
 * Represents an insurance policy with references to related entities.
 */
const PolicySchema = new Schema({
  policy_number: String,
  policy_start_date: String,
  policy_end_date: String,
  agent: { type: Schema.Types.ObjectId, ref: 'Agent' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  account: { type: Schema.Types.ObjectId, ref: 'Account' },
  category: { type: Schema.Types.ObjectId, ref: 'LOB' },
  carrier: { type: Schema.Types.ObjectId, ref: 'Carrier' },
  premium_amount: String,
  premium_amount_written: String,
  policy_type: String,
  policy_mode: String,
  producer: String,
  csr: String,
  primary: String,
  Applicant_ID: String,
  agency_id: String,
  hasActive_ClientPolicy: String
});

PolicySchema.index({ user: 1 });
PolicySchema.index({ policy_number: 1 }, { unique: true });

/**
 * Exports the Policy model based on PolicySchema.
 */
module.exports = mongoose.model('Policy', PolicySchema);
