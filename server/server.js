// server/server.js
require('dotenv').config();   // <-- LOAD .env FIRST!!

const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/status', (req, res) => {
  res.json({
    message: 'Server is running, Express is connected!',
    time: new Date(),
    awsRegion: process.env.AWS_REGION || 'NOT LOADED',
    table: process.env.DDB_TABLE || 'NOT LOADED'
  });
});

// TODO: Add routes for lost-items, found-items, matches, etc.

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
