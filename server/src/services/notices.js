const { query, run } = require('./config/database');
const { v4: uuidv4 } = require('uuid');

const THRESHOLD = 75;

async function checkAndSendAttendanceNotices(io) {
  try {
    const result = query(
      `SELECT student_id, 
              ROUND(CAST(SUM(CASE WHEN status IN ('present', 'late') THEN 1 ELSE 0 END) AS FLOAT) / NULLIF(COUNT(*), 0) * 100, 2) as percentage
       FROM attendance 
       GROUP BY student_id 
       HAVING CAST(SUM(CASE WHEN status IN ('present', 'late') THEN 1 ELSE 0 END) AS FLOAT) / NULLIF(COUNT(*), 0) * 100 < ?`,
      [THRESHOLD]
    );

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

    for (const row of result) {
      const existing = query(
        "SELECT id FROM notices WHERE student_id = ? AND type = 'attendance' AND created_at > ?",
        [row.student_id, oneDayAgo]
      );
      
      if (existing.length === 0) {
        const id = uuidv4();
        run(
          "INSERT INTO notices (id, student_id, type, message, created_at) VALUES (?, ?, 'attendance', ?, ?)",
          [id, row.student_id, `Your attendance has fallen below ${THRESHOLD}%. Current: ${row.percentage}%`, now.toISOString()]
        );
        
        if (io) {
          io.to(`user_${row.student_id}`).emit('notice', {
            type: 'attendance',
            message: `Your attendance has fallen below ${THRESHOLD}%. Current: ${row.percentage}%`
          });
        }
      }
    }
    console.log(`Checked attendance notices: ${result.length} students below ${THRESHOLD}%`);
  } catch (err) {
    console.error('Attendance notice error:', err.message);
  }
}

module.exports = { checkAndSendAttendanceNotices };