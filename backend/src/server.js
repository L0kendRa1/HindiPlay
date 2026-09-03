const dotenv = require('dotenv');

// Load environment variables before anything else
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Initialize Server & Database
const startServer = async () => {
  try {
    // 1. Connect to Database
    await connectDB();
  } catch (err) {
    console.error('Database initialization failed:', err.message);
    console.error('Server will start with limited database functionality.');
  }

  // 2. Start HTTP Server
  const server = app.listen(PORT, () => {
    console.log(`HindiPlay backend running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });

  // Handle process signals
  process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection: ${err.message}`);
  });

  return server;
};

// Start the server if executed directly
if (require.main === module) {
  startServer();
}

module.exports = { startServer, app };
