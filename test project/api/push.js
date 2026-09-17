// Vercel Serverless Function: /api/push
// ส่ง Push Notification ผ่าน OneSignal REST API (server-side เพื่อหลีกเลี่ยง CORS)

export default async function handler(req, res) {
  // อนุญาตเฉพาะ POST
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

    // สร้าง payload สำหรับ OneSignal
    const payload = {
      app_id: osAppId,
      headings: { en: title },
      contents: { en: message },
      // Web push URL เมื่อคลิก notification
      ...(url ? { url } : {}),
    };

    // กรองตามระดับชั้น (grade)
    if (grade && grade !== "all") {
      // ส่งเฉพาะคนที่มี tag "level" ตรงกับ grade ที่เลือก
      // หรือคนที่ตั้ง tag "level" = "all" (รับทุกระดับชั้น)
      payload.filters = [
        { field: "tag", key: "level", relation: "=", value: grade },
        { operator: "OR" },
        { field: "tag", key: "level", relation: "=", value: "all" },
      ];
    } else {
      // ส่งถึงทุกคนที่ subscribe แล้ว
      payload.included_segments = ["Subscribed Users"];
    }

    // เรียก OneSignal REST API
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
      console.error("OneSignal API Error:", data);
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Push API Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
