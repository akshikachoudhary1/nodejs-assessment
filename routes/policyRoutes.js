/**
 * File: policyRoutes.js
 * Author: Akshika Choudhary
 * Date: 31-07-2025
 * Description: Express route definitions for insurance policy-related API endpoints.
 */

const express = require('express');
const router = express.Router();
const policyController = require('../controllers/policyController');

// for Import (CSV/XLSX upload)
const upload = require('../middleware/upload');
router.post('/import', upload.single('file'), policyController.uploadAndImportFile);
// for Search policy by username
router.get('/search', policyController.searchPolicy);
// for Aggregate policies by user
router.get('/aggregate', policyController.aggregatePolicies);

module.exports = router;
