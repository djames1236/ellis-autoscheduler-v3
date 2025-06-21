const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const { google } = require('googleapis');

const app = express();
app.use(bodyParser.json());

// Health check
app.get('/', (req, res) => {
  res.send('Ellis v3 backend is live.');
});

// OAuth callback route
app.get('/api/oauth2callback', (req, res) => {
  res.send('OAuth callback received.');
});

// Placeholder scheduling route
app.post('/api/schedule', (req, res) => {
  res.send('Task scheduling request received.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
