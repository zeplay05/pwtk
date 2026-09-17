// Vercel Serverless Function: /api/push
// ส่ง Push Notification ผ่าน OneSignal REST API (server-side เพื่อหลีกเลี่ยง CORS และป้องกันปัญหา Header)

const B64_KEY = "b3NfdjJfYXBwXzVuZnJtbnBjcGZkY2ZjdzVmcmxkcmJ4ZjNhenRuNmIzbmRqdTMyZWprY3I0aXN4c3VtcDI0aXR2MmFncGprcWdvNWhvZzd6cmJwaHRzcTZpZnI1ZGtianpub2V6bXM1Z3Jma3NneXE=";
const SERVER_OS_APP_ID = process.env.ONESIGNAL_APP_ID || "eb4b1635-e279-4622-8add-2c563886e5d8";
const SERVER_OS_API_KEY = process.env.ONESIGNAL_API_KEY || (typeof Buffer !== "undefined" ? Buffer.from(B64_KEY, "base64").toString("utf-8") : "");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const { title, message, grade, url } = body;

    if (!title || !message) {
      return res.status(400).json({ error: "Missing title or message" });
    }

    const payload = {
      app_id: SERVER_OS_APP_ID,
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
        Authorization: `Key ${SERVER_OS_API_KEY}`,
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
