const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cams.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    db.run('PRAGMA foreign_keys = ON');
  }
});

module.exports = db;
