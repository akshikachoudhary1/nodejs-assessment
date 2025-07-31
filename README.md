# Node Assessment

A modular Node.js/Express API for insurance data management, supporting:
- Bulk import of insurance data from CSV/XLSX files into MongoDB (with worker threads for performance)
- Search and aggregation endpoints for policy and user data
- Message scheduling: schedule messages for specific days/times (with background processing)
- Robust error handling, duplicate detection, and CPU monitoring (auto-restarts on high load)

**Tech stack:** Node.js, Express, MongoDB (Mongoose), worker_threads, node-cron, Multer, csv-parser, xlsx

## Environment Setup

- **Node.js version:** 18.x or higher (see `package.json`)
- **Install dependencies:**
  ```sh
  npm install
  ```
- **Run the project:**
  ```sh
  npm start
  ```
- **Recommended:** Use [nvm](https://github.com/nvm-sh/nvm) to manage Node.js versions per project:
  ```sh
  nvm install 18
  nvm use 18
  ```
- Project dependencies are managed with `package.json` and installed locally in `node_modules` (no global installs needed).
- Environment variables are set in `.env` (see sample in repo). Make sure `.env` and `node_modules/` are in `.gitignore`.


## Overview
This project is a technical assessment for building a Node.js API to:
- Upload and process insurance data from CSV/XLSX into MongoDB using worker threads
- Provide search and aggregation APIs
- Monitor CPU usage and restart on high load
- Schedule DB inserts based on user-specified time

## Features
- **Upload API:** Uploads insurance data and splits it into Agent, User, Account, LOB, Carrier, and Policy collections
- **Search API:** Find policy info by username
- **Aggregation API:** Get aggregated policy info per user
- **CPU Monitoring:** Restarts server if CPU > 70%
- **Scheduled Post-Service:** Schedules DB inserts for messages at specified day and time

## Setup
1. `npm install`
2. Configure your MongoDB URI in `.env`
3. `npm start`

## Endpoints
- `POST /api/policies/import` — Upload CSV/XLSX file for insurance data import
- `GET /api/policies/search?username=...` — Search policy info by username (firstname or email)
- `GET /api/policies/aggregate` — Aggregated policy info per user
- `POST /api/messages/schedule` — Schedule a message for a specific day and time

## Message Scheduling Example
To schedule a message:
```json
POST /api/messages/schedule
Content-Type: application/json
{
  "message": "Test scheduled message",
  "day": "Thursday",
  "time": "23:10" // 24-hour format
}
```

## CSV/XLSX Import Logic
- Uploads are processed in a worker thread for performance.
- Duplicate `policy_number` entries are skipped (not imported), and the import summary includes counts for inserted and duplicate/skipped rows.
- Import accepts `.csv` and `.xlsx` files only.
- Error details from import are returned in the API response for debugging.

## Error Handling
- Duplicate key errors during import do **not** cause the import to fail; they are reported in the summary.
- Invalid file types or missing fields return 400 errors.
- CPU usage is monitored; the server restarts automatically if CPU > 70% for 10 seconds.

## Project Structure
- `controllers/` — Express route handlers (e.g., `policyController.js`, `messageController.js`)
- `services/` — Business logic and worker threads (e.g., `csvImport.service.js`, `messageScheduler.service.js`)
- `dao/` — Database access objects (e.g., `policyDao.js`, `messageDao.js`)
- `models/` — Mongoose schemas (e.g., `Policy.js`, `ScheduledMessage.js`)
- `utils/` — Utility functions (e.g., `csvUtils.js`, `dateUtils.js`)
- `uploads/` — Uploaded files (gitignored)

## Environment Variables
- Copy `.env.example` to `.env` and set your `MONGODB_URI`.
- Example:
  ```
  MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
  ```

## Usage
1. `npm install`
2. Set up `.env` with your MongoDB URI
3. `npm start`
4. Use the endpoints above to import data, search, aggregate, and schedule messages

## Troubleshooting
- **Duplicate Policy:** Duplicates are skipped and counted in the import summary.
- **High CPU:** If CPU usage is high, the server will auto-restart and log a warning.
- **Import Errors:** API returns detailed error messages and stack traces for debugging.

## Design Philosophy

This project follows the functional, modular approach that is standard in the Node.js and Express ecosystem. Controllers, services, and DAOs are implemented as exported functions and objects, not as ES6 classes. This style is:
- Idiomatic and widely adopted in the Node.js community
- Simple, maintainable, and easy to test
- Well-suited for stateless REST APIs

If a team or project prefers object-oriented programming (OOP) with ES6 classes for controllers, services, or DAOs, I am comfortable adapting to that style as well. The codebase is structured for clarity, separation of concerns, and easy extensibility.

## Author
Akshika
