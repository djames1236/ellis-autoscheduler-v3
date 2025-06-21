const { google } = require('googleapis');

module.exports = async (req, res) => {
  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);

    const auth = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/calendar']
    });

    const calendar = google.calendar({ version: 'v3', auth });

    // DIRECTLY USE THE EXACT CALENDAR ID
    const calendarId = '9c36ef51822c9b42d7191ea417a504606bc2de69bd1e2864282b3942771bdf80@group.calendar.google.com';

    // Insert event
    const now = new Date();
    const event = {
      summary: 'Ellis Test Event',
      start: { dateTime: new Date(now.getTime() + 2 * 60 * 1000).toISOString(), timeZone: 'America/Los_Angeles' },
      end: { dateTime: new Date(now.getTime() + 17 * 60 * 1000).toISOString(), timeZone: 'America/Los_Angeles' }
    };

    await calendar.events.insert({
      calendarId: calendarId,
      requestBody: event
    });

    console.log('Event inserted successfully into calendar:', calendarId);
    res.status(200).send('Schedule function ran successfully.');
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
