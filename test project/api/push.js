export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        // ignore
      }
    }

    const { title, message, grade, osAppId, osApiKey, url } = body || {};

    const fallbackKey = Buffer.from("b3NfdjJfYXBwXzVuZnJtbnBjcGZkY2ZjdzVmcmxkcmJ4ZjNhenRuNmIzbmRqdTMyZWprY3I0aXN4c3VtcDI0aXR2MmFncGprcWdvNWhvZzd6cmJwaHRzcTZpZnI1ZGtianpub2V6bXM1Z3Jma3NneXE=", "base64").toString("utf-8");

    const appId = (osAppId && osAppId.trim()) || process.env.VITE_ONESIGNAL_APP_ID || "eb4b1635-e279-4622-8add-2c563886e5d8";
    const apiKey = (osApiKey && osApiKey.trim().startsWith("os_v2_")) ? osApiKey.trim() : (process.env.VITE_ONESIGNAL_API_KEY || fallbackKey);

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

    const onesignalRes = await fetch('https://api.onesignal.com/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': authHeader,
      },
      body: JSON.stringify(payload),
    });

    const data = await onesignalRes.json();
    return res.status(onesignalRes.status).json(data);
  } catch (error) {
    console.error('Push Serverless Error:', error);
    return res.status(500).json({ errors: [error.message || 'Server Error'] });
  }
}
