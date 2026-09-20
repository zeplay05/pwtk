// api/push.js
// Vercel Serverless Function — ส่ง Push Notification ผ่าน OneSignal REST API

const B64_KEY = "b3NfdjJfYXBwXzVuZnJtbnBjcGZkY2ZjdzVmcmxkcmJ4ZjNjbGtmb3JhajZhdXBmbWpiN3l4NGN1eTYyaHA1d2t3Y3htNHpyNG4zZnVoeG0yN2tkY3Fqc2VsaWNjZmdqejVweTJ2Nm5neWh6aHdta3k=";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const APP_ID = process.env.ONESIGNAL_APP_ID || "eb4b1635-e279-4622-8add-2c563886e5d8";
  const API_KEY =
    process.env.ONESIGNAL_REST_API_KEY ||
    process.env.ONESIGNAL_API_KEY ||
    (typeof Buffer !== "undefined" ? Buffer.from(B64_KEY, "base64").toString("utf-8") : "");

  if (!APP_ID || !API_KEY) {
    console.error("Missing ONESIGNAL_APP_ID or ONESIGNAL_REST_API_KEY env vars");
    return res.status(500).json({
      errors: ["Server missing OneSignal APP_ID or REST_API_KEY environment variables"],
    });
  }

  let body = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
  } catch (e) {
    body = req.body || {};
  }

  const { title, message, grade, url } = body;

  if (!title || !message) {
    return res.status(400).json({ errors: ["title and message are required"] });
  }

  // สร้าง payload พื้นฐาน รองรับทั้งมือถือ (Android/iOS) และคอมพิวเตอร์ (Windows/Mac)
  // คืนค่าระบบเดิมสมบูรณ์แบบตอน 5:40 PM
  const payload = {
    app_id: APP_ID,
    headings: { en: title, th: title },
    contents: { en: message, th: message },
    url: url || "https://pwtk.vercel.app",
    chrome_web_icon: "https://pwtk.vercel.app/assets/pwtk.png",
    chrome_web_badge: "https://pwtk.vercel.app/assets/pwtk.png",
    firefox_icon: "https://pwtk.vercel.app/assets/pwtk.png",
    priority: 10, // ความสำคัญสูงสุด ปลุกจอมือถือทันทีแม้เปิดโหมดประหยัดพลังงาน
    ttl: 259200, // เก็บแจ้งเตือนไว้ 3 วัน หากมือถือปิดเครื่องอยู่ เปิดมาจะได้รับทันที
  };

  if (!grade || grade === "all") {
    payload.included_segments = ["Subscribed Users", "Total Subscriptions", "All"];
  } else {
    // กรองเฉพาะเครื่องที่เลือกระดับชั้นนี้ตรงกัน หรือเครื่องที่เลือกรับทุกระดับชั้น (all)
    payload.filters = [
      { field: "tag", key: "level", relation: "=", value: grade },
      { operator: "OR" },
      { field: "tag", key: "level", relation: "=", value: "all" },
    ];
  }

  try {
    let response = await fetch("https://api.onesignal.com/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Key ${API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    let data = await response.json();

    if (!response.ok || data.errors) {
      const errStr = JSON.stringify(data.errors || "");
      // ถ้าไม่มีผู้ใช้ที่ subscribe ในระดับชั้นนี้ ให้คืนค่าสำเร็จโดยมีผู้รับ 0 คน (ห้ามส่งกระจายไปยังกลุ่มอื่น)
      if (errStr.includes("All included players are not subscribed")) {
        return res.status(200).json({
          success: true,
          id: data?.id || null,
          recipients: 0,
          message: "ไม่มีผู้รับที่ลงทะเบียนในระดับชั้นนี้",
        });
      }
      console.error("OneSignal API error:", data);
      return res.status(response.status || 500).json({
        errors: data.errors || ["Unknown OneSignal API error"],
        raw: data,
      });
    }

    if (!response.ok || data.errors) {
      console.error("OneSignal API error:", data);
      return res.status(response.status || 500).json({
        errors: data.errors || ["Unknown OneSignal API error"],
        raw: data,
      });
    }

    return res.status(200).json({
      success: true,
      id: data.id,
      recipients: data.recipients,
    });
  } catch (err) {
    console.error("Push send failed:", err);
    return res.status(500).json({ errors: [String(err)] });
  }
}
