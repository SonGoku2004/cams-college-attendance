const db = require('../config/database');
const bcrypt = require('bcrypt');

class User {
  static async create({ email, password, role, firstName, lastName }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO users (email, password, role, first_name, last_name)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.run(query, [email, hashedPassword, role, firstName, lastName], function(err) {
        if (err) return reject(err);
        db.get('SELECT id, email, role, first_name, last_name, created_at FROM users WHERE id = ?', 
          [this.lastID], (err, row) => {
            if (err) return reject(err);
            resolve(row);
          });
      });
    });
  }

  static async findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }

  static async findById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT id, email, role, first_name, last_name FROM users WHERE id = ?', 
        [id], (err, row) => {
          if (err) return reject(err);
          resolve(row);
        });
    });
  }

  static async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
}

module.exports = User;
