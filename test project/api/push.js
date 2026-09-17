// Vercel Serverless Function: /api/push
// ส่ง Push Notification ผ่าน OneSignal REST API (server-side เพื่อหลีกเลี่ยง CORS)

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { title, message, grade, osAppId, osApiKey, url } = req.body;

    if (!osAppId || !osApiKey) {
      return res.status(400).json({ error: "Missing OneSignal credentials" });
    }

    if (!title || !message) {
      return res.status(400).json({ error: "Missing title or message" });
    }

    const payload = {
      app_id: osAppId,
      headings: { en: title },
      contents: { en: message },
      ...(url ? { url } : {}),
    };

    if (grade && grade !== "all") {
      payload.filters = [
        { field: "tag", key: "level", relation: "=", value: grade },
        { operator: "OR" },
        { field: "tag", key: "level", relation: "=", value: "all" },
      ];
    } else {
      payload.included_segments = ["Subscribed Users"];
    }

    const response = await fetch("https://api.onesignal.com/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Key ${osApiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
