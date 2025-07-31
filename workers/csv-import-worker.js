/**
 * File: csv-import-worker.js
 * Author: Akshika Choudhary
 * Date: 29-07-2025
 * Description: Worker thread entry point for CSV import. Receives file path and MongoDB URI
 *              from parent thread, calls importCSVData service, and posts the result back.
 *              Should be invoked only by worker_threads.
 */
const { parentPort, workerData } = require('worker_threads');
const { importCSVData } = require('../services/csv-import.service');

(async () => {
  const result = await importCSVData(workerData.filePath, workerData.mongoUri);
  parentPort.postMessage(result);
})();
