/**
 * File: Agent.js
 * Author: Akshika Choudhary
 * Date: 29-07-2025
 * Description: Mongoose schema and model for Agent collection. Represents an agent entity
 *              with a unique name field for insurance policy normalization.
 */

const mongoose = require('mongoose');

/**
 * Mongoose schema for Agent collection.
 * Represents an agent entity with a unique name field.
 */
const AgentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
});

AgentSchema.index({ name: 1 });

/**
 * Exports the Agent model based on AgentSchema.
 */
module.exports = mongoose.model('Agent', AgentSchema);
