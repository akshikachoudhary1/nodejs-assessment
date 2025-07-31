/**
 * File: csvUtils.js
 * Author: Akshika Choudhary
 * Date: 29-07-2025
 * Description: Utility module for parsing CSV and XLSX files into JavaScript objects.
 *              Provides reusable parseCSV and parseXLSX functions for use across the project.
 */

const csvParser = require('csv-parser');
const fs = require('fs');
const xlsx = require('xlsx');

async function parseCSV(filePath) {
  console.log('parseCSV called with:', filePath);
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => rows.push(row))
      .on('end', () => resolve(rows))
      .on('error', reject);
  });
}

async function parseXLSX(filePath) {
  console.log('parseXLSX called with:', filePath);
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(worksheet);
}

module.exports = { parseCSV, parseXLSX };
