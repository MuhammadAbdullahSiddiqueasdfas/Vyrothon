const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middleware/errorHandler');

// Route files
const ingestRoutes = require('./src/routes/ingestRoutes');
const authRoutes = require('./src/routes/authRoutes');
const retrieveRoutes = require('./src/routes/retrieveRoutes');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Mount routers
app.use('/ingest', ingestRoutes);
app.use('/auth', authRoutes);
app.use('/my-images', retrieveRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Grabpic API is running...');
});

// Use central error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
