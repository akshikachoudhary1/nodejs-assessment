/**
 * File: csv-import.service.js
 * Author: Akshika Choudhary
 * Date: 29-07-2025
 * Description: Service layer for importing CSV and XLSX data into MongoDB collections. Handles
 *              business logic for upserting related entities, batching, and processing
 *              insurance policy data from uploaded files.
 */

const mongoose = require('mongoose');
const path = require('path');
const { parseCSV, parseXLSX } = require('../utils/csvUtils');
const agentDao = require('../dao/agentDao');
const userDao = require('../dao/userDao');
const accountDao = require('../dao/accountDao');
const carrierDao = require('../dao/carrierDao');
const lobDao = require('../dao/lobDao');
const Policy = require('../models/Policy');

/**
 * Upserts (finds or creates) an entity in the database and caches its ObjectId.
 * @param {mongoose.Model} Model - The Mongoose model to operate on.
 * @param {Object} query - The query to find the entity.
 * @param {Object} cache - The in-memory cache for this entity type.
 * @param {string} cacheKey - The key for caching (usually a unique field value).
 * @param {Object} doc - The document to insert/update if not found.
 * @returns {Promise<ObjectId>} - The ObjectId of the upserted/found entity.
 */
async function upsertEntity(Model, query, cache, cacheKey, doc) {
  if (cache[cacheKey]) return cache[cacheKey];
  const entity = await Model.findOneAndUpdate(query, doc, { upsert: true, new: true });
  cache[cacheKey] = entity._id;
  return entity._id;
}

/**
 * Processes a single CSV row: upserts all related entities and inserts a Policy referencing their ObjectIds.
 * @param {Object} row - The parsed CSV row object.
 * @param {Object} caches - An object containing all in-memory caches for entities.
 * @returns {Promise<void>}
 */
async function processRow(row, caches) {
  const agent = await agentDao.upsert(row.agent);
  const user = await userDao.upsert({
    firstname: row.firstname,
    dob: row.dob,
    address: row.address,
    phone: row.phone,
    state: row.state,
    zip: row.zip,
    email: row.email,
    gender: row.gender,
    userType: row.userType
  });
  const account = await accountDao.upsert(row.account_name, row.account_type);
  const carrier = await carrierDao.upsert(row.company_name);
  const category = await lobDao.upsert(row.category_name);
  const policy = new Policy({
    policy_number: row.policy_number,
    policy_start_date: row.policy_start_date,
    policy_end_date: row.policy_end_date,
    agent: agent._id,
    user: user._id,
    account: account._id,
    category: category._id,
    carrier: carrier._id,
    premium_amount: row.premium_amount,
    premium_amount_written: row.premium_amount_written,
    policy_type: row.policy_type,
    policy_mode: row.policy_mode,
    producer: row.producer,
    csr: row.csr,
    primary: row.primary,
    Applicant_ID: row.Applicant_ID,
    agency_id: row.agency_id,
    hasActive_ClientPolicy: row.hasActive_ClientPolicy
  });
  try {
    await policy.save();
    return { inserted: 1, duplicate: 0 };
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key error: skip
      return { inserted: 0, duplicate: 1 };
    } else {
      throw err;
    }
  }
}

/**
 * Main import function: parses the CSV/XLSX, batches and processes all rows asynchronously, and disconnects from MongoDB.
 * This function is called by the worker thread, not directly by the controller.
 * @param {string} filePath - The path to the CSV/XLSX file.
 * @param {string} mongoUri - MongoDB connection URI.
 * @returns {Promise<Object>} - Status and count of processed rows.
 */
async function importCSVData(filePath, mongoUri) {
  console.log('importCSVData called with:', filePath);
  const ext = path.extname(filePath).toLowerCase();
  console.log('File extension in importCSVData:', ext);

  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  let rows;
  if (ext === '.csv') {
    rows = await parseCSV(filePath);
  } else {
    rows = await parseXLSX(filePath);
  }
  const caches = {
    agentCache: {},
    userCache: {},
    accountCache: {},
    carrierCache: {},
    lobCache: {}
  };
  const BATCH_SIZE = 10;
  let inserted = 0;
  let duplicates = 0;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const results = await Promise.all(rows.slice(i, i + BATCH_SIZE).map(row => processRow(row, caches)));
    for (const res of results) {
      inserted += res.inserted;
      duplicates += res.duplicate;
    }
  }
  await mongoose.disconnect();
  return { status: 'done', total: rows.length, inserted, duplicates };

}

/**
 * Spawns a worker thread to import CSV/XLSX data in the background.
 * This function is called by the controller and handles all worker thread logic.
 * The worker runs the import logic and posts the result back to the main thread.
 * @param {string} filePath - Path to the file to import.
 * @param {string} mongoUri - MongoDB connection string.
 * @returns {Promise<Object>} - Resolves with import result.
 */
function runCSVImportWorkerService(filePath, mongoUri) {
  return new Promise((resolve, reject) => {
    const { Worker } = require('worker_threads');
    const path = require('path');
    const worker = new Worker(path.resolve(__dirname, './workers/csvImportWorker.js'), {
      workerData: { filePath, mongoUri }
    });
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', code => {
      if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

module.exports = { importCSVData, runCSVImportWorkerService };
