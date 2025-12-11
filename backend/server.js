const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./src/config/db');
const { initializeWebSocket } = require('./src/services/webSocketServer');
const { notFound, errorHandler } = require('./src/middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// --- Production Optimizations ---
app.use(helmet()); // Set security-related HTTP headers

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173', // Allow only your frontend
  credentials: true, // For cookies
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter); // Apply to all API routes
// --- End Optimizations ---


app.use(express.json()); // Body parser for JSON format

// API Routes
app.get('/', (req, res) => {
  res.send('Smart Queue Management API is running...');
});

app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/queues', require('./src/routes/queueRoutes'));
app.use('/api/tokens', require('./src/routes/tokenRoutes'));
app.use('/api/analytics', require('./src/routes/analyticsRoutes'));


// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket Server
initializeWebSocket(server);

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
