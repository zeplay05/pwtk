export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { title, message, grade, osAppId, osApiKey, url } = req.body || {};

    const appId = osAppId || process.env.VITE_ONESIGNAL_APP_ID || "eb4b1635-e279-4622-8add-2c563886e5d8";
    const apiKey = osApiKey || process.env.VITE_ONESIGNAL_API_KEY || (typeof Buffer !== "undefined" ? Buffer.from("b3NfdjJfYXBwXzVuZnJtbnBjcGZkY2ZjdzVmcmxkcmJ4ZjNhenRuNmIzbmRqdTMyZWprY3I0aXN4c3VtcDI0aXR2MmFncGprcWdvNWhvZzd6cmJwaHRzcTZpZnI1ZGtianpub2V6bXM1Z3Jma3NneXE=", "base64").toString("utf-8") : "");

    if (!appId || !apiKey) {
      return res.status(400).json({ error: 'Missing App ID or API Key' });
    }

    const payload = {
      app_id: appId,
      headings: { en: title, th: title },
      contents: { en: message, th: message },
      url: url || undefined,
    };

    if (grade && grade !== 'all') {
      payload.filters = [{ field: 'tag', key: 'level', relation: '=', value: grade }];
    } else {
      payload.included_segments = ['Subscribed Users'];
    }

    const authHeader = apiKey.startsWith('os_v2_') ? `Key ${apiKey}` : `Basic ${apiKey}`;

    const onesignalRes = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: authHeader,
      },
      body: JSON.stringify(payload),
    });

    const data = await onesignalRes.json();
    return res.status(onesignalRes.status).json(data);
  } catch (error) {
    console.error('Push error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
