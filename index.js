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
app.get('/api/oauth2callback', async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send('Missing authorization code.');
  }

  try {
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const { tokens } = await oAuth2Client.getToken(code);
    // In a full version: securely store tokens (e.g., database, secret store)
    console.log('Access Token:', tokens.access_token);
    console.log('Refresh Token:', tokens.refresh_token);

    res.send('OAuth authorization successful. Tokens received.');
  } catch (err) {
    console.error('Error exchanging code for tokens:', err);
    res.status(500).send('Failed to exchange code for tokens.');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});