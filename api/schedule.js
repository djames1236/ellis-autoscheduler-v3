const { google } = require('googleapis');

module.exports = async (req, res) => {
  try {
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oAuth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    });

    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    const calendarList = await calendar.calendarList.list();
    calendarList.data.items.forEach(cal => {
      console.log(`Found calendar: ${cal.summary} - ID: ${cal.id}`);
    });

    const primaryCalendar = calendarList.data.items.find(cal => cal.primary) || calendarList.data.items[0];
    if (!primaryCalendar) {
      console.error('No calendars found.');
      return res.status(500).send('No calendars found.');
    }
    console.log('Using calendar:', primaryCalendar.summary, primaryCalendar.id);

    const event = {
      summary: 'Ellis Test Event',
      start: { dateTime: new Date(Date.now() + 2 * 60 * 1000).toISOString() },
      end: { dateTime: new Date(Date.now() + 17 * 60 * 1000).toISOString() }
    };

    await calendar.events.insert({
      calendarId: primaryCalendar.id,
      requestBody: event
    });

    console.log('Event inserted successfully');
    res.status(200).send('Schedule function ran successfully.');
  } catch (err) {
    console.error('Schedule error:', err);
    res.status(500).send('Schedule function failed.');
  }
};