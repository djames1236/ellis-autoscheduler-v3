const { google } = require('googleapis');

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }

    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    const auth = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/calendar']
    });

    const calendar = google.calendar({ version: 'v3', auth });
    const calendarId = '9c36ef51822c9b42d7191ea417a504606bc2de69bd1e2864282b3942771bdf80@group.calendar.google.com';

    const { summary, start, end, description } = req.body;

    if (!summary || !start || !end) {
      return res.status(400).send('Missing required fields.');
    }

    const event = {
      summary,
      description: description || '',
      start: { dateTime: start, timeZone: 'America/Los_Angeles' },
      end: { dateTime: end, timeZone: 'America/Los_Angeles' }
    };

    await calendar.events.insert({
      calendarId,
      requestBody: event
    });

    console.log('Event inserted successfully:', summary);
    res.status(200).send('Event scheduled successfully.');
  } catch (err) {
    console.error('Schedule error:', {
      message: err?.message,
      name: err?.name,
      stack: err?.stack,
      cause: err?.cause
    });
    res.status(500).send('Schedule function failed.');
  }
};
