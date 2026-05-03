const db = require('../config/database');

class Teacher {
  static async create({ userId, employeeId, department }) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO teachers (user_id, employee_id, department)
        VALUES (?, ?, ?)
      `;
      db.run(query, [userId, employeeId, department], function(err) {
        if (err) return reject(err);
        Teacher.findById(this.lastID).then(resolve).catch(reject);
      });
    });
  }

  static async findByUserId(userId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT t.*, u.email, u.first_name, u.last_name, u.role
        FROM teachers t
        JOIN users u ON t.user_id = u.id
        WHERE t.user_id = ?
      `;
      db.get(query, [userId], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }

  static async findById(id) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT t.*, u.email, u.first_name, u.last_name, u.role
        FROM teachers t
        JOIN users u ON t.user_id = u.id
        WHERE t.id = ?
      `;
      db.get(query, [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }
}

module.exports = Teacher;
