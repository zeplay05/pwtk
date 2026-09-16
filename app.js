/* =========================================================
   School Push Notification & News Portal - JavaScript Engine
   ========================================================= */

// Initial News Dataset
const INITIAL_NEWS = [
  {
    id: 1,
    title: "ประกาศกำหนดการสอบกลางภาค ภาคเรียนที่ 1",
    summary: "ขอให้นักเรียนทุกระดับชั้นตรวจสอบตารางสอบและห้องสอบประจำของตนเอง โดยจะเริ่มสอบตั้งแต่วันจันทร์หน้าเป็นต้นไป",
    tag: "all",
    tagName: "ทุกคน",
    date: "10 ก.ย. 2026",
    badgeClass: "badge-all"
  },
  {
    id: 2,
    title: "กิจกรรมปฐมนิเทศและการใช้ห้องปฏิบัติการ ม.1",
    summary: "นักเรียนชั้น ม.1 ทุกคนเข้าร่วมรับฟังการใช้งานห้องสมุดดิจิทัลและแล็บวิทยาศาสตร์ ณ หอประชุมใหญ่ เวลา 09:00 น.",
    tag: "m1",
    tagName: "มัธยมศึกษาปีที่ 1",
    date: "09 ก.ย. 2026",
    badgeClass: "badge-m1"
  },
  {
    id: 3,
    title: "การเลือกสายการเรียนและแนะแนวการศึกษาต่อ ม.3",
    summary: "ขอเชิญนักเรียนชั้น ม.3 เข้าร่วมกิจกรรมแนะแนวเลือกแผนการเรียน ม.ปลาย (วิทย์-คณิต / ศิลป์-คำนวณ / ภาษา)",
    tag: "m3",
    tagName: "มัธยมศึกษาปีที่ 3",
    date: "08 ก.ย. 2026",
    badgeClass: "badge-m3"
  },
  {
    id: 4,
    title: "ติวเข้ม TGAT/TPAT และเตรียมสอบเข้ามหาวิทยาลัย ม.6",
    summary: "โครงการติวเสริมศักยภาพสำหรับนักเรียน ม.6 ทุกวันเสาร์-อาทิตย์ เริ่มเสาร์นี้เป็นต้นไป พร้อมแจกเอกสารสรุป",
    tag: "m6",
    tagName: "มัธยมศึกษาปีที่ 6",
    date: "07 ก.ย. 2026",
    badgeClass: "badge-m6"
  },
  {
    id: 5,
    title: "การประชุมผู้ปกครองภาคเรียนที่ 1 ประจำปีการศึกษา",
    summary: "ขอเรียนเชิญท่านผู้ปกครองทุกท่านเข้าร่วมการประชุมเพื่อรับฟังผลสัมฤทธิ์ทางการเรียนและแนวทางการพัฒนานักเรียน",
    tag: "parent",
    tagName: "ผู้ปกครอง",
    date: "05 ก.ย. 2026",
    badgeClass: "badge-m4"
  }
];

// App State
let appState = {
  activeTab: 'student-portal',
  currentNewsFilter: 'all',
  userTag: localStorage.getItem('school_user_tag') || null,
  permissionStatus: 'default',
  oneSignalAppId: localStorage.getItem('onesignal_app_id') || '',
  oneSignalApiKey: localStorage.getItem('onesignal_api_key') || '',
  broadcastLogs: JSON.parse(localStorage.getItem('broadcast_logs') || '[]')
};

// Map tag keys to readable Thai names
const TAG_MAP = {
  all: 'ทุกคน (All)',
  m1: 'มัธยมศึกษาปีที่ 1 (ม.1)',
  m2: 'มัธยมศึกษาปีที่ 2 (ม.2)',
  m3: 'มัธยมศึกษาปีที่ 3 (ม.3)',
  m4: 'มัธยมศึกษาปีที่ 4 (ม.4)',
  m5: 'มัธยมศึกษาปีที่ 5 (ม.5)',
  m6: 'มัธยมศึกษาปีที่ 6 (ม.6)',
  parent: 'ผู้ปกครอง (Parents)',
  teacher: 'ครูและบุคลากร (Teachers)'
};

/* =========================================================
   Initialization
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  initOneSignal();
  renderNews();
  renderLogs();
  updateClock();
  setInterval(updateClock, 1000);
  restoreSettings();
  updateUserStatusUI();
  updateLivePreview();
});

// Initialize OneSignal SDK if configured
function initOneSignal() {
  window.OneSignalDeferred = window.OneSignalDeferred || [];
  
  if (appState.oneSignalAppId) {
    window.OneSignalDeferred.push(async function(OneSignal) {
      await OneSignal.init({
        appId: appState.oneSignalAppId,
        notifyButton: { enable: true }
      });
      
      const permission = await OneSignal.Notifications.permission;
      appState.permissionStatus = permission ? 'granted' : 'default';
      updateUserStatusUI();
    });
  } else if ('Notification' in window) {
    appState.permissionStatus = Notification.permission;
    updateUserStatusUI();
  }
}

/* =========================================================
   Navigation Tabs
   ========================================================= */
function switchTab(tabId) {
  appState.activeTab = tabId;
  
  document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  
  const targetPane = document.getElementById(tabId);
  if (targetPane) targetPane.classList.add('active');
  
  if (tabId === 'student-portal') document.getElementById('tab-student').classList.add('active');
  if (tabId === 'admin-portal') document.getElementById('tab-admin').classList.add('active');
  if (tabId === 'guide-portal') document.getElementById('tab-guide').classList.add('active');
}

/* =========================================================
   News Rendering & Filtering
   ========================================================= */
function renderNews() {
  const container = document.getElementById('news-container');
  if (!container) return;

  const filtered = appState.currentNewsFilter === 'all' 
    ? INITIAL_NEWS 
    : INITIAL_NEWS.filter(item => item.tag === appState.currentNewsFilter || item.tag === 'all');

  document.getElementById('news-count').textContent = `แสดงทั้งหมด ${filtered.length} รายการ`;

  container.innerHTML = filtered.map(item => `
    <article class="news-card">
      <div class="card-top">
        <span class="badge-tag ${item.badgeClass}">🏷️ ${item.tagName}</span>
        <span class="news-date">📅 ${item.date}</span>
      </div>
      <h3 class="news-title">${item.title}</h3>
      <p class="news-body">${item.summary}</p>
      <div class="news-footer">
        <span>🏫 ฝ่ายวิชาการและประชาสัมพันธ์</span>
        <a href="#" onclick="showInAppToast('เปิดอ่านข่าว', '${item.title}'); return false;" style="color: var(--primary); font-weight: 600; text-decoration: none;">อ่านเพิ่มเติม →</a>
      </div>
    </article>
  `).join('');
}

function filterNews(tag) {
  appState.currentNewsFilter = tag;
  
  document.querySelectorAll('#filter-pills .pill-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('onclick').includes(`'${tag}'`));
  });
  
  renderNews();
}

/* =========================================================
   Student/Parent Subscription & Tag Handler
   ========================================================= */
async function handleSubscribe() {
  const selectEl = document.getElementById('user-grade-select');
  const selectedGrade = selectEl.value;
  const gradeLabel = TAG_MAP[selectedGrade] || selectedGrade;

  // 1. If OneSignal App ID is initialized, use OneSignal Web SDK
  if (appState.oneSignalAppId && window.OneSignal) {
    try {
      await window.OneSignal.Slidedown.promptPush();
      await window.OneSignal.User.addTag("level", selectedGrade);
      appState.permissionStatus = 'granted';
    } catch (e) {
      console.warn("OneSignal Web SDK prompt fallback:", e);
    }
  } else if ('Notification' in window) {
    // 2. Native browser Notification permission request simulation
    try {
      const permission = await Notification.requestPermission();
      appState.permissionStatus = permission;
    } catch (e) {
      console.warn("Notification request permission error:", e);
    }
  }

  // Save to state and LocalStorage
  appState.userTag = selectedGrade;
  localStorage.setItem('school_user_tag', selectedGrade);

  updateUserStatusUI();

  // Show success toast
  showInAppToast(
    "🎉 ลงทะเบียนระดับชั้นสำเร็จ!",
    `ระบบบันทึกกลุ่มของคุณเป็น "${gradeLabel}" เรียบร้อยแล้ว คุณจะได้รับการแจ้งเตือนเมื่อมีข่าวสารของระดับชั้นนี้`
  );
}

function updateUserStatusUI() {
  const permissionEl = document.getElementById('permission-status');
  const tagBadgeEl = document.getElementById('current-tag-badge');
  const gradeSelectEl = document.getElementById('user-grade-select');

  if (permissionEl) {
    if (appState.permissionStatus === 'granted') {
      permissionEl.textContent = '✅ อนุญาตแล้ว';
      permissionEl.className = 'status-badge active';
    } else {
      permissionEl.textContent = '⚠️ ยังไม่อนุญาต';
      permissionEl.className = 'status-badge inactive';
    }
  }

  if (tagBadgeEl) {
    if (appState.userTag) {
      tagBadgeEl.textContent = TAG_MAP[appState.userTag] || appState.userTag;
      tagBadgeEl.className = 'status-badge active';
      if (gradeSelectEl) gradeSelectEl.value = appState.userTag;
    } else {
      tagBadgeEl.textContent = 'ยังไม่ได้เลือก';
      tagBadgeEl.className = 'status-badge inactive';
    }
  }
}

/* =========================================================
   Teacher Admin Broadcast & Real-Time Preview
   ========================================================= */
function updateLivePreview() {
  const audience = document.getElementById('target-audience').value;
  const title = document.getElementById('push-title').value.trim() || 'หัวข้อการแจ้งเตือน';
  const message = document.getElementById('push-message').value.trim() || 'เนื้อหาข้อความแจ้งเตือนจะแสดงที่นี่...';

  const previewTitle = document.getElementById('preview-text-title');
  const previewBody = document.getElementById('preview-text-body');
  const previewTag = document.getElementById('preview-text-tag');

  if (previewTitle) previewTitle.textContent = title;
  if (previewBody) previewBody.textContent = message;
  if (previewTag) previewTag.textContent = `กลุ่มเป้าหมาย: ${TAG_MAP[audience] || audience}`;
}

async function handleSendBroadcast(event) {
  event.preventDefault();

  const audience = document.getElementById('target-audience').value;
  const title = document.getElementById('push-title').value.trim();
  const message = document.getElementById('push-message').value.trim();
  const url = document.getElementById('push-url').value.trim();

  const sendBtn = document.getElementById('btn-send-push');
  sendBtn.disabled = true;
  sendBtn.textContent = '⏳ กำลังส่งการแจ้งเตือน...';

  let sendStatus = 'สำเร็จ (Simulation)';

  // If real OneSignal REST API Key & App ID are set
  if (appState.oneSignalAppId && appState.oneSignalApiKey) {
    try {
      const payload = {
        app_id: appState.oneSignalAppId,
        headings: { "en": title, "th": title },
        contents: { "en": message, "th": message },
        url: url || undefined
      };

      if (audience !== 'all') {
        payload.filters = [
          { field: "tag", key: "level", relation: "=", value: audience }
        ];
      } else {
        payload.included_segments = ["Subscribed Users"];
      }

      const response = await fetch("/api/onesignal/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Authorization": appState.oneSignalApiKey && appState.oneSignalApiKey.startsWith("os_v2_") ? `Key ${appState.oneSignalApiKey}` : `Basic ${appState.oneSignalApiKey}`
        },
        body: JSON.stringify(payload)
      });

      const resData = await response.json();
      if (resData.id) {
        sendStatus = `สำเร็จ (OneSignal ID: ${resData.id.slice(0, 8)}...)`;
      } else {
        sendStatus = `ผิดพลาด: ${resData.errors ? JSON.stringify(resData.errors) : 'Unknown'}`;
      }
    } catch (err) {
      console.error("API Call error:", err);
      sendStatus = `ผิดพลาด (Network Error)`;
    }
  }

  // Create Log entry
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} น.`;
  
  const newLog = {
    id: Date.now(),
    time: timeStr,
    title: title,
    audience: TAG_MAP[audience] || audience,
    audienceTag: audience,
    status: sendStatus
  };

  appState.broadcastLogs.unshift(newLog);
  if (appState.broadcastLogs.length > 15) appState.broadcastLogs.pop();
  localStorage.setItem('broadcast_logs', JSON.stringify(appState.broadcastLogs));

  renderLogs();

  // Trigger in-app toast if user matches the audience or is in 'all'
  const isTargeted = audience === 'all' || audience === appState.userTag;
  if (isTargeted) {
    showInAppToast(title, message, url);
  } else {
    showInAppToast(
      "📢 ส่งการแจ้งเตือนเรียบร้อยแล้ว",
      `ส่งไปยังกลุ่ม ${TAG_MAP[audience]} เรียบร้อยแล้ว (คุณเลือกกลุ่ม: ${TAG_MAP[appState.userTag] || 'ยังไม่ได้เลือก'})`
    );
  }

  sendBtn.disabled = false;
  sendBtn.textContent = '🚀 ส่งการแจ้งเตือนทันที (Broadcast)';
}

function renderLogs() {
  const tbody = document.getElementById('logs-table-body');
  if (!tbody) return;

  if (appState.broadcastLogs.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">
          ยังไม่มีประวัติการส่งแจ้งเตือน
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = appState.broadcastLogs.map(log => `
    <tr>
      <td><span style="font-weight: 600;">${log.time}</span></td>
      <td><strong>${log.title}</strong></td>
      <td><span class="badge-tag badge-m1">${log.audience}</span></td>
      <td><span style="color: ${log.status.includes('สำเร็จ') ? 'var(--success)' : 'var(--danger)'}; font-weight: 600;">● ${log.status}</span></td>
    </tr>
  `).join('');
}

function resetForm() {
  document.getElementById('broadcast-form').reset();
  updateLivePreview();
}

/* =========================================================
   In-App Toast Notification
   ========================================================= */
function showInAppToast(title, message, link = null) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-box';
  toast.innerHTML = `
    <div class="toast-icon">🔔</div>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${message}</div>
      ${link ? `<a href="${link}" target="_blank" style="color: #67e8f9; font-size: 0.78rem; text-decoration: underline; margin-top: 4px; display: inline-block;">เปิดดูรายละเอียดลิงก์ →</a>` : ''}
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }
  }, 6000);
}

/* =========================================================
   Settings & Utilities
   ========================================================= */
function saveApiKeys() {
  const appId = document.getElementById('cfg-app-id').value.trim();
  const apiKey = document.getElementById('cfg-api-key').value.trim();

  appState.oneSignalAppId = appId;
  appState.oneSignalApiKey = apiKey;

  localStorage.setItem('onesignal_app_id', appId);
  localStorage.setItem('onesignal_api_key', apiKey);

  showInAppToast("💾 บันทึกข้อมูลสำเร็จ", "บันทึก App ID และ REST API Key เข้าเครื่องเรียบร้อยแล้ว");
  if (appId) initOneSignal();
}

function restoreSettings() {
  const appIdEl = document.getElementById('cfg-app-id');
  const apiKeyEl = document.getElementById('cfg-api-key');

  if (appIdEl && appState.oneSignalAppId) appIdEl.value = appState.oneSignalAppId;
  if (apiKeyEl && appState.oneSignalApiKey) apiKeyEl.value = appState.oneSignalApiKey;
}

function copyCode(elementId) {
  const codeEl = document.getElementById(elementId);
  if (!codeEl) return;
  
  navigator.clipboard.writeText(codeEl.innerText).then(() => {
    showInAppToast("📋 คัดลอกแล้ว", "คัดลอกโค้ดไปยังคลิปบอร์ดเรียบร้อยแล้ว");
  }).catch(() => {
    showInAppToast("คัดลอกไม่สำเร็จ", "กรุณาลองลากครอบข้อความเพื่อคัดลอก");
  });
}

function updateClock() {
  const clockEl = document.getElementById('preview-clock');
  const dateEl = document.getElementById('preview-date');
  if (!clockEl || !dateEl) return;

  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const mins = now.getMinutes().toString().padStart(2, '0');
  clockEl.textContent = `${hours}:${mins}`;
}
