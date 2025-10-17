// server/server.js
const express = require('express');
const cors = require('cors'); // Needed for the React front-end
const app = express();
const port = 3001; // Use a different port than React (3000)

// Middleware to allow React (running on 3000) to talk to Express (running on 3001)
app.use(cors());
app.use(express.json());

// Test API endpoint
app.get('/api/status', (req, res) => {
  res.json({ message: 'Server is running, Express is connected!', time: new Date() });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});