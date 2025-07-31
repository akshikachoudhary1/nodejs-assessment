
/**
 * File: policyController.js
 * Author: Akshika Choudhary
 * Date: 29-07-2025
 * Description: Controller for handling insurance policy API requests. Delegates
 *              business logic to policyService and handles HTTP request/response flow.
 */

const { runCSVImportWorkerService } = require('../services/csvImport.service');
const policyService = require('../services/policy.service');

/**
 * Handles upload of CSV/XLSX file and triggers import via worker thread.
 * @route POST /api/policies/import
 * @param {Request} req - Express request object (with file)
 * @param {Response} res - Express response object
 */
exports.uploadAndImportFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }
    console.log('Reached route handler, req.file:', req.file);
    // Call the worker service for import
    const result = await runCSVImportWorkerService(req.file.path, process.env.MONGODB_URI);
    res.status(200).json({ message: 'File imported successfully', result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 

/**
 * Handles searching for policies by username.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
exports.searchPolicy = async (req, res) => {
  try {
    const { username } = req.query;
    const policies = await policyService.searchPolicy(username);
    res.json(policies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Handles aggregation of policy information by user.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
exports.aggregatePolicies = async (req, res) => {
  try {
    const result = await policyService.aggregatePolicies();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
