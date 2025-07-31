/**
 * File: policy.service.js
 * Author: Akshika Choudhary
 * Date: 29-07-2025
 * Description: Service layer for insurance policy business logic. Wraps DAO calls and
 *              implements additional validation, transformation, and orchestration logic.
 */

const policyDao = require('../dao/policyDao');

/**
 * Service layer for Policy-related business logic.
 */
module.exports = {
  /**
   * Searches for policies by username (firstname or email).
   * @param {string} username - Username to search for
   * @returns {Promise<Array>} - Array of matching policy documents
   */
  async searchPolicy(username) {
    return policyDao.findByUsername(username);
  },
  /**
   * Aggregates policy information grouped by user.
   * @returns {Promise<Array>} - Aggregated policy data
   */
  async aggregatePolicies() {
    return policyDao.aggregateByUser();
  },
};
