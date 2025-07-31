/**
 * File: LOB.js
 * Author: Akshika Choudhary
 * Date: 29-07-2025
 * Description: Mongoose schema and model for LOB (Line of Business) collection. Represents
 *              a policy category with a category name field for insurance policy normalization.
 */

const mongoose = require('mongoose');

/**
 * Mongoose schema for LOB (Line of Business) collection.
 * Represents a policy category with a category name field.
 */
const LOBSchema = new mongoose.Schema({
  category_name: String
});

LOBSchema.index({ category_name: 1 });

/**
 * Exports the LOB model based on LOBSchema.
 */
module.exports = mongoose.model('LOB', LOBSchema);
