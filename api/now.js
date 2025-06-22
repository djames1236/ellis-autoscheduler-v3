export default async function handler(req, res) {
  try {
    const now = new Date();
    const isoNow = now.toISOString();
    res.status(200).json({ now: isoNow });
  } catch (err) {
    console.error('Clock Sync Error:', err);
    res.status(500).json({ error: 'Clock Sync Failed' });
  }
}
