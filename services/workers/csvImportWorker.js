/**
 * File: csv-import-worker.js
 * Author: Akshika Choudhary
 * Date: 31-07-2025
 * Description: Worker thread entry point for importing CSV/XLSX data. Used by the service layer to run heavy import tasks off the main thread.
 */

const { parentPort, workerData } = require('worker_threads');
const { importCSVData } = require('../csvImport.service');

/**
 * Worker entry point: Imports CSV/XLSX data using the importCSVData service function.
 * This function is only called when this file is executed as a worker thread.
 */
async function runCSVImportWorker() {
  try {
    const result = await importCSVData(workerData.filePath, workerData.mongoUri);
    parentPort.postMessage(result);
  } catch (error) {
    console.error('Error occurred:', error);
    parentPort.postMessage({ error: error.message, stack: error.stack });
  }
}

if (parentPort && workerData) {
  runCSVImportWorker();
}

module.exports = { runCSVImportWorker };
