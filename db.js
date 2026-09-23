const Database = require('better-sqlite3');

const db = new Database('queue.db');

// Task 2: create the queue table if it doesn't already exist
function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customerName TEXT NOT NULL,
      serviceType TEXT NOT NULL CHECK(serviceType IN ('Haircut', 'Shave', 'Haircut + Shave')),
      status TEXT NOT NULL CHECK(status IN ('Waiting', 'In Chair', 'Done')),
      timeIn TEXT NOT NULL
    )
  `);
}

module.exports = { db, initDB };
