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

    // List calendars (for debugging, can be removed after stable)
    const calendarList = await calendar.calendarList.list();
    calendarList.data.items.forEach(cal => {
      console.log(`Found calendar: ${cal.summary} - ID: ${cal.id}`);
    });

    // Use first calendar found (you'll select correct calendar ID once verified)
    const primaryCalendar = calendarList.data.items[0];
    console.log('Using calendar:', primaryCalendar.summary, primaryCalendar.id);

    // Insert event
    const now = new Date();
    const event = {
      summary: 'Ellis Test Event',
      start: { dateTime: new Date(now.getTime() + 2 * 60 * 1000).toISOString(), timeZone: 'America/Los_Angeles' },
      end: { dateTime: new Date(now.getTime() + 17 * 60 * 1000).toISOString(), timeZone: 'America/Los_Angeles' }
    };

    await calendar.events.insert({
      calendarId: primaryCalendar.id,
      requestBody: event
    });

    console.log('Event inserted successfully');
    res.status(200).send('Schedule function ran successfully.');
  } catch (err) {
    console.error('Schedule error:', JSON.stringify(err, null, 2));
    res.status(500).send('Schedule function failed.');
  }
};