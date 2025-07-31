/**
 * File: policyDao.js
 * Author: Akshika Choudhary
 * Date: 29-07-2025
 * Description: Data access object (DAO) for Policy collection. Provides CRUD and aggregation
 *              operations for insurance policy data in MongoDB using Mongoose.
 */


const Policy = require('../models/Policy');

/**
 * Data Access Object for Policy collection.
 */
module.exports = {
  /**
   * Finds policies by username (firstname or email).
   * @param {string} username - Username to search for
   * @returns {Promise<Array>} - Array of matching policy documents
   */
  async findByUsername(username) {
    // Ensure all referenced models are registered
    require('../models/Agent');
    require('../models/User');
    require('../models/Account');
    require('../models/Carrier');
    require('../models/LOB');
    // Validate username
    if (!username || typeof username !== 'string' || username.trim().length < 3) {
      throw new Error('username query param is required and must be at least 3 characters');
    }
    username = username.trim();
    // Find user by firstname or email
    const User = require('../models/User');
    const user = await User.findOne({
      $or: [
        { firstname: { $regex: username, $options: 'i' } },
        { email: { $regex: username, $options: 'i' } }
      ]
    });
    if (!user) return [];
    // Find policies for this user and populate references
    return Policy.find({ user: user._id })
      .populate('agent user account category carrier');
  },
  /**
   * Aggregates policy information grouped by user.
   * @returns {Promise<Array>} - Aggregated policy data
   */
  async aggregateByUser() {
    // Aggregate policies grouped by user and join user details directly in the pipeline
    const results = await Policy.aggregate([
      {
        $group: {
          _id: '$user',
          totalPolicies: { $sum: 1 },
          totalPremium: { $sum: { $toDouble: '$premium_amount' } }
        }
      },
      {
        $lookup: {
          from: 'users', // MongoDB collection name for users
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' } // Flatten user array to object
    ]);
    return results;
  },
  // Add more DAO methods as needed
};
