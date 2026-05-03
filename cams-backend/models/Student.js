const db = require('../config/database');

class Student {
  static async create({ userId, rollNumber, className, semester, feeStatus }) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO students (user_id, roll_number, class, semester, fee_status)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.run(query, [userId, rollNumber, className, semester, feeStatus || 'pending'], function(err) {
        if (err) return reject(err);
        Student.findById(this.lastID).then(resolve).catch(reject);
      });
    });
  }

  static async findByUserId(userId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT s.*, u.email, u.first_name, u.last_name, u.role
        FROM students s
        JOIN users u ON s.user_id = u.id
        WHERE s.user_id = ?
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
        SELECT s.*, u.email, u.first_name, u.last_name, u.role
        FROM students s
        JOIN users u ON s.user_id = u.id
        WHERE s.id = ?
      `;
      db.get(query, [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }
}

module.exports = Student;
