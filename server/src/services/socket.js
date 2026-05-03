const { query } = require('./config/database');
const { checkAndSendAttendanceNotices } = require('./services/notices');

function setupSocket(io) {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`Socket ${socket.id} joined user_${userId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  setInterval(() => {
    checkAndSendAttendanceNotices(io);
  }, 3600000);

  setTimeout(() => {
    checkAndSendAttendanceNotices(io);
  }, 5000);

  console.log('Socket service initialized');
}

module.exports = { setupSocket };