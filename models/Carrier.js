/**
 * File: Carrier.js
 * Author: Akshika Choudhary
 * Date: 29-07-2025
 * Description: Mongoose schema and model for Carrier collection. Represents an insurance carrier
 *              with a company name field for policy normalization.
 */

const mongoose = require('mongoose');

/**
 * Mongoose schema for Carrier collection.
 * Represents an insurance carrier with a company name field.
 */
const CarrierSchema = new mongoose.Schema({
  company_name: String
});

CarrierSchema.index({ company_name: 1 });

/**
 * Exports the Carrier model based on CarrierSchema.
 */
module.exports = mongoose.model('Carrier', CarrierSchema);
