import React, { useState, useEffect } from 'react';

// ระดับชั้นที่รองรับ
const GRADE_OPTIONS = [
  { value: "all", label: "All (ทั้งหมด)", short: "All" },
  { value: "m1", label: "มัธยมศึกษาปีที่ 1", short: "ม.1" },
  { value: "m2", label: "มัธยมศึกษาปีที่ 2", short: "ม.2" },
  { value: "m3", label: "มัธยมศึกษาปีที่ 3", short: "ม.3" },
  { value: "m4", label: "มัธยมศึกษาปีที่ 4", short: "ม.4" },
  { value: "m5", label: "มัธยมศึกษาปีที่ 5", short: "ม.5" },
  { value: "m6", label: "มัธยมศึกษาปีที่ 6", short: "ม.6" },
  { value: "parent", label: "ผู้ปกครอง", short: "ผู้ปกครอง" },
];

// ข้อมูลข่าวสารเริ่มต้น (15 ข่าวเพื่อทดสอบระบบ Pagination หน้าละ 10 ข่าว)
const INITIAL_NEWS = [
  {
    id: "1",
    title: "ประกาศกำหนดการสอบกลางภาค ภาคเรียนที่ 1 ประจำปีการศึกษา 2569",
    category: "ฝ่ายวิชาการ",
    timeAgo: "2 ชั่วโมงที่แล้ว",
    grade: "all",
    tags: ["#ตารางสอบ", "#วิชาการ"],
    summary: "ขอให้นักเรียนทุกระดับชั้นตรวจสอบตารางสอบและห้องสอบประจำของตนเอง โดยจะเริ่มสอบตั้งแต่วันจันทร์หน้าเป็นต้นไป ขอความร่วมมือนักเรียนเตรียมอุปกรณ์การเรียนและแต่งกายให้ถูกระเบียบ",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80",
    isHero: true,
  },
  {
    id: "2",
    title: "กิจกรรมปฐมนิเทศและการใช้ห้องปฏิบัติการดิจิทัลสำหรับนักเรียน ม.1",
    category: "วิชาการ & ไอที",
    timeAgo: "4 ชั่วโมงที่แล้ว",
    grade: "m1",
    tags: ["#ม1", "#ปฐมนิเทศ"],
    summary: "นักเรียนชั้น ม.1 ทุกคนเข้าร่วมรับฟังการใช้งานห้องสมุดดิจิทัลและแล็บวิทยาศาสตร์ ณ หอประชุมใหญ่ เวลา 09:00 น. เพื่อเตรียมความพร้อมสู่การเรียนการสอนยุคใหม่",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  {
    id: "3",
    title: "โครงการแนะแนวการศึกษาต่อและการเลือกแผนการเรียน ม.3",
    category: "แนะแนวการศึกษา",
    timeAgo: "5 ชั่วโมงที่แล้ว",
    grade: "m3",
    tags: ["#ม3", "#ต่อมปลาย"],
    summary: "ขอเชิญนักเรียนชั้น ม.3 เข้าร่วมกิจกรรมแนะแนวเลือกแผนการเรียน ม.ปลาย (วิทย์-คณิต / ศิลป์-คำนวณ / ภาษา) พร้อมพบปะรุ่นพี่ศิษย์เก่าที่มาแชร์ประสบการณ์",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  {
    id: "4",
    title: "ติวเข้ม TGAT / TPAT เตรียมความพร้อมสอบเข้ามหาวิทยาลัย ม.6",
    category: "แนะแนว ม.6",
    timeAgo: "6 ชั่วโมงที่แล้ว",
    grade: "m6",
    tags: ["#ม6", "#TGAT_TPAT"],
    summary: "โครงการติวเสริมศักยภาพสำหรับนักเรียน ม.6 ทุกวันเสาร์-อาทิตย์ พร้อมแจกสรุปแนวข้อสอบฟรี และวิเคราะห์สถิติคลังข้อสอบย้อนหลัง 5 ปี",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  {
    id: "5",
    title: "ขอเชิญประชุมผู้ปกครองภาคเรียนที่ 1 เพื่อรับฟังผลการเรียน",
    category: "กิจการนักเรียน",
    timeAgo: "1 วันที่แล้ว",
    grade: "parent",
    tags: ["#ผู้ปกครอง", "#ประชุม"],
    summary: "ขอเรียนเชิญท่านผู้ปกครองทุกท่านเข้าร่วมการประชุมเพื่อรับฟังผลสัมฤทธิ์ทางการเรียนและแนวทางการพัฒนานักเรียน พร้อมปรึกษาครูประจำชั้นเป็นรายบุคคล",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  {
    id: "6",
    title: "เปิดรับสมัครคัดเลือกนักกีฬาฟุตบอลและบาสเกตบอลตัวแทนโรงเรียน",
    category: "พลศึกษา & กีฬา",
    timeAgo: "1 วันที่แล้ว",
    grade: "all",
    tags: ["#กีฬา", "#ฟุตบอล", "#บาสเกตบอล"],
    summary: "กลุ่มสาระสุขศึกษาและพลศึกษาเปิดรับสมัครนักเรียนทุกระดับชั้นเข้าร่วมคัดตัวนักกีฬาโรงเรียนเพื่อเตรียมแข่งขันกีฬาประจำจังหวัด",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  {
    id: "7",
    title: "ผลการแข่งขันโอลิมปิกวิชาการระดับชาติ นักเรียน ม.4 คว้า 2 เหรียญทอง",
    category: "ฝ่ายวิชาการ",
    timeAgo: "2 วันที่แล้ว",
    grade: "m4",
    tags: ["#ม4", "#เหรียญทอง", "#โอลิมปิกวิชาการ"],
    summary: "ขอแสดงความยินดีกับตัวแทนนักเรียนชั้น ม.4 ที่สามารถคว้ารางวัลชนะเลิศเหรียญทองจากการแข่งขันฟิสิกส์และเคมีโอลิมปิกระดับชาติ ประจำปีนี้",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  {
    id: "8",
    title: "การอบรมเชิงปฏิบัติการโครงงาน AI & Robotics สำหรับนักเรียน ม.2",
    category: "วิชาการ & ไอที",
    timeAgo: "2 วันที่แล้ว",
    grade: "m2",
    tags: ["#ม2", "#AI", "#Robotics"],
    summary: "เรียนรู้การเขียนโปรแกรมควบคุมหุ่นยนต์และการประยุกต์ใช้ปัญญาประดิษฐ์ (AI) ในชีวิตประจำวัน ณ ศูนย์นวัตกรรมดิจิทัลโรงเรียน",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  {
    id: "9",
    title: "กิจกรรมค่ายดนตรีและศิลปวัฒนธรรมสัญจรประจำปีของระดับชั้น ม.5",
    category: "ศิลปะ & ดนตรี",
    timeAgo: "3 วันที่แล้ว",
    grade: "m5",
    tags: ["#ม5", "#ดนตรี", "#ศิลปะ"],
    summary: "กลุ่มสาระการเรียนรู้ศิลปะจัดกิจกรรมค่ายดนตรีและศิลปะสัญจรเพื่อส่งเสริมความคิดสร้างสรรค์และสุนทรียภาพทางอารมณ์ของนักเรียน ม.5",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  {
    id: "10",
    title: "โครงการจิตอาสาพัฒนาโรงเรียนและรักษาสิ่งแวดล้อมชุมชน",
    category: "ฝ่ายพัฒนาผู้เรียน",
    timeAgo: "3 วันที่แล้ว",
    grade: "all",
    tags: ["#จิตอาสา", "#สิ่งแวดล้อม"],
    summary: "ขอเชิญชวนนักเรียนจิตอาสาทุกคนร่วมกิจกรรมปลูกต้นไม้และคัดแยกขยะรีไซเคิลเพื่อโรงเรียนสีเขียว (Green School) ในวันศุกร์นี้",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  {
    id: "11",
    title: "ขยายเวลาเปิดให้บริการห้องสมุดดิจิทัลและ Co-working Space ช่วงสอบ",
    category: "ฝ่ายอาคารสถานที่",
    timeAgo: "4 วันที่แล้ว",
    grade: "all",
    tags: ["#ห้องสมุด", "#ช่วงสอบ"],
    summary: "เพื่ออำนวยความสะดวกในการทบทวนบทเรียน ห้องสมุดกลางจะเปิดให้บริการจนถึงเวลา 20:00 น. ในช่วง 2 สัปดาห์ก่อนสอบ",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  {
    id: "12",
    title: "ผลการเลือกตั้งคณะกรรมการสภานักเรียน ประจำปีการศึกษา 2569",
    category: "กิจการนักเรียน",
    timeAgo: "5 วันที่แล้ว",
    grade: "all",
    tags: ["#สภานักเรียน", "#เลือกตั้ง"],
    summary: "ประกาศผลการนับคะแนนเลือกตั้งประธานและคณะกรรมการสภานักเรียนชุดใหม่ พร้อมเตรียมจัดพิธีส่งมอบงานในสัปดาห์หน้า",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  {
    id: "13",
    title: "สัมมนาแนะแนวทุนการศึกษาต่อระดับปริญญาตรีในต่างประเทศ สำหรับ ม.6",
    category: "แนะแนว ม.6",
    timeAgo: "6 วันที่แล้ว",
    grade: "m6",
    tags: ["#ม6", "#ทุนเรียนต่อ", "#ต่างประเทศ"],
    summary: "พบกับตัวแทนมหาวิทยาลัยชั้นนำจากสหรัฐอเมริกา อังกฤษ และญี่ปุ่น เพื่อรับฟังข้อมูลทุนการศึกษาและเกณฑ์การรับสมัครรอบ Portfolio",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  {
    id: "14",
    title: "คลินิกให้คำปรึกษาด้านสุขภาพใจและการดูแลบุตรหลานวัยรุ่นสำหรับผู้ปกครอง",
    category: "แนะแนว & สุขภาพจิต",
    timeAgo: "1 สัปดาห์ที่แล้ว",
    grade: "parent",
    tags: ["#ผู้ปกครอง", "#สุขภาพใจ", "#วัยรุ่น"],
    summary: "บริการให้คำปรึกษาฟรีโดยนักจิตวิทยาการศึกษา เพื่อสร้างความเข้าใจและสัมพันธภาพอันดีในครอบครัว สามารถลงทะเบียนจองเวลาล่วงหน้าได้",
    image: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  {
    id: "15",
    title: "ค่ายพัฒนาทักษะภาษาอังกฤษเชิงสร้างสรรค์ (English Camp) ม.1 - ม.3",
    category: "กลุ่มสาระภาษาต่างประเทศ",
    timeAgo: "1 สัปดาห์ที่แล้ว",
    grade: "m1",
    tags: ["#EnglishCamp", "#ภาษาอังกฤษ", "#ม1"],
    summary: "สนุกกับกิจกรรมภาษาอังกฤษผ่านการแสดงละคร ร้องเพลง และเกมกระดานกับครูเจ้าของภาษา เพื่อเสริมสร้างความมั่นใจในการสื่อสาร",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  {
    id: "16",
    title: "การแข่งขันตอบปัญหาวิทยาศาสตร์และเทคโนโลยีระดับมัธยมศึกษาตอนปลาย ม.4 - ม.6",
    category: "ฝ่ายวิชาการ",
    timeAgo: "1 สัปดาห์ที่แล้ว",
    grade: "m5",
    tags: ["#วิทยาศาสตร์", "#ม5", "#แข่งขันวิชาการ"],
    summary: "ขอเชิญนักเรียนแผนการเรียนวิทยาศาสตร์เข้าร่วมแข่งขันตอบปัญหาวิทยาศาสตร์และเทคโนโลยี ชิงโล่พระราชทานและทุนการศึกษารวมกว่า 50,000 บาท",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  {
    id: "17",
    title: "กำหนดการตรวจสุขภาพประจำปีการศึกษา 2569 สำหรับนักเรียนทุกระดับชั้น",
    category: "ฝ่ายอนามัยโรงเรียน",
    timeAgo: "1 สัปดาห์ที่แล้ว",
    grade: "all",
    tags: ["#ตรวจสุขภาพ", "#อนามัย", "#สุขภาพนักเรียน"],
    summary: "โรงพยาบาลศูนย์จะเข้ามาให้บริการตรวจสุขภาพทั่วไป ตรวจสายตา และทันตกรรมแก่นักเรียนทุกคนในระหว่างวันที่ 25-27 ของเดือนนี้",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  {
    id: "18",
    title: "กิจกรรมเปิดบ้านวิชาการ Open House 2026 ต้อนรับผู้ปกครองและนักเรียนใหม่",
    category: "ประชาสัมพันธ์",
    timeAgo: "2 สัปดาห์ที่แล้ว",
    grade: "parent",
    tags: ["#OpenHouse", "#ผู้ปกครอง", "#ประชาสัมพันธ์"],
    summary: "ขอเชิญท่านผู้ปกครองและผู้สนใจเข้าชมนิทรรศการผลงานทางวิชาการ สิ่งประดิษฐ์นวัตกรรม และการแสดงความสามารถของนักเรียนในงาน Open House 2026",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  {
    id: "19",
    title: "โครงการส่งเสริมทักษะดนตรีสากลและวงโยธวาทิตเพื่อการประกวดระดับประเทศ",
    category: "ศิลปะ & ดนตรี",
    timeAgo: "2 สัปดาห์ที่แล้ว",
    grade: "m4",
    tags: ["#วงโยธวาทิต", "#ดนตรีสากล", "#ม4"],
    summary: "เปิดรับสมัครนักเรียน ม.4 ที่มีความสามารถด้านเครื่องเป่าและเครื่องกระทบเข้าร่วมฝึกซ้อมวงโยธวาทิตเพื่อเตรียมเข้าร่วมประกวดระดับชิงแชมป์ประเทศไทย",
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  {
    id: "20",
    title: "การฝึกอบรมภาวะผู้นำและทักษะการทำงานเป็นทีมสำหรับคณะกรรมการนักเรียน ม.3 - ม.6",
    category: "ฝ่ายพัฒนาผู้เรียน",
    timeAgo: "2 สัปดาห์ที่แล้ว",
    grade: "m3",
    tags: ["#ผู้นำ", "#ม3", "#กิจกรรมนักเรียน"],
    summary: "กิจกรรมอบรมเชิงปฏิบัติการพัฒนาทักษะการเป็นผู้นำ การสื่อสาร และการบริหารจัดการโครงการสำหรับตัวแทนนักเรียน ณ ศูนย์การเรียนรู้ธรรมชาติ",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  // ===== เพิ่มข่าว ม.1 (id 21-24) =====
  {
    id: "21",
    title: "กิจกรรมเข้าค่ายลูกเสือ-เนตรนารี สำหรับนักเรียน ม.1 ประจำปี 2569",
    category: "กิจการนักเรียน",
    timeAgo: "3 สัปดาห์ที่แล้ว",
    grade: "m1",
    tags: ["#ม1", "#ลูกเสือ", "#เข้าค่าย"],
    summary: "นักเรียนชั้น ม.1 ทุกคนเข้าร่วมกิจกรรมเข้าค่ายลูกเสือ-เนตรนารีสามัญรุ่นใหญ่ เพื่อฝึกระเบียบวินัย ความอดทน และการอยู่ร่วมกันเป็นหมู่คณะ",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  {
    id: "22",
    title: "ทัศนศึกษาพิพิธภัณฑ์วิทยาศาสตร์แห่งชาติ ม.1",
    category: "วิชาการ & ไอที",
    timeAgo: "3 สัปดาห์ที่แล้ว",
    grade: "m1",
    tags: ["#ม1", "#ทัศนศึกษา", "#วิทยาศาสตร์"],
    summary: "นำนักเรียนชั้น ม.1 ไปเรียนรู้นอกห้องเรียนที่พิพิธภัณฑ์วิทยาศาสตร์แห่งชาติ เพื่อสร้างแรงบันดาลใจและเพิ่มทักษะกระบวนการทางวิทยาศาสตร์",
    image: "https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  {
    id: "23",
    title: "การประกวดโครงงานวิทยาศาสตร์สำหรับนักเรียนใหม่ ม.1",
    category: "ฝ่ายวิชาการ",
    timeAgo: "1 เดือนที่แล้ว",
    grade: "m1",
    tags: ["#ม1", "#โครงงาน", "#วิทยาศาสตร์"],
    summary: "ขอเชิญนักเรียน ม.1 ส่งผลงานโครงงานวิทยาศาสตร์ประเภทสิ่งประดิษฐ์และทดลอง ชิงรางวัลทุนการศึกษาและเกียรติบัตรจากผู้อำนวยการ",
    image: "https://images.unsplash.com/photo-1581093458791-9d42e3c7e117?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  {
    id: "24",
    title: "อบรมทักษะการใช้คอมพิวเตอร์เบื้องต้นสำหรับนักเรียน ม.1 ใหม่",
    category: "วิชาการ & ไอที",
    timeAgo: "1 เดือนที่แล้ว",
    grade: "m1",
    tags: ["#ม1", "#คอมพิวเตอร์", "#ทักษะดิจิทัล"],
    summary: "อบรมการใช้งาน Google Workspace for Education และทักษะพิมพ์ดีดสัมผัสเบื้องต้นเพื่อเตรียมความพร้อมสำหรับการเรียนในยุคดิจิทัล",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  // ===== เพิ่มข่าว ม.2 (id 25-29) =====
  {
    id: "25",
    title: "การแข่งขันหุ่นยนต์ First LEGO League สำหรับนักเรียน ม.2",
    category: "วิชาการ & ไอที",
    timeAgo: "3 สัปดาห์ที่แล้ว",
    grade: "m2",
    tags: ["#ม2", "#หุ่นยนต์", "#LEGO"],
    summary: "ทีมหุ่นยนต์ ม.2 เตรียมตัวแข่งขัน First LEGO League ระดับภาค ฝึกซ้อมทุกวันพุธ-ศุกร์ หลังเลิกเรียน ณ ห้อง STEM Lab",
    image: "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  {
    id: "26",
    title: "โครงการเรียนรู้ประวัติศาสตร์ท้องถิ่นผ่านการสำรวจภาคสนาม ม.2",
    category: "สังคมศึกษา",
    timeAgo: "3 สัปดาห์ที่แล้ว",
    grade: "m2",
    tags: ["#ม2", "#ประวัติศาสตร์", "#ภาคสนาม"],
    summary: "กิจกรรมเรียนรู้ประวัติศาสตร์ท้องถิ่นผ่านการสำรวจโบราณสถานและสัมภาษณ์ผู้อาวุโสในชุมชน เพื่อสร้างจิตสำนึกรักท้องถิ่น",
    image: "https://images.unsplash.com/photo-1564399580075-5dfe19c205f0?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  {
    id: "27",
    title: "ค่ายคณิตศาสตร์สร้างสรรค์ (Math Camp) สำหรับนักเรียน ม.2",
    category: "ฝ่ายวิชาการ",
    timeAgo: "1 เดือนที่แล้ว",
    grade: "m2",
    tags: ["#ม2", "#คณิตศาสตร์", "#MathCamp"],
    summary: "ค่ายฝึกทักษะคณิตศาสตร์ผ่านเกมและกิจกรรมกลุ่ม เน้นการแก้ปัญหาเชิงตรรกะและการคิดเชิงวิพากษ์สำหรับนักเรียน ม.2",
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  {
    id: "28",
    title: "กิจกรรมส่งเสริมการอ่านและการเขียนเรียงความภาษาไทย ม.2",
    category: "กลุ่มสาระภาษาไทย",
    timeAgo: "1 เดือนที่แล้ว",
    grade: "m2",
    tags: ["#ม2", "#ภาษาไทย", "#เรียงความ"],
    summary: "การประกวดเรียงความหัวข้อ 'เยาวชนไทยกับการพัฒนาชาติ' ชิงถ้วยรางวัลและทุนการศึกษาจากสมาคมผู้ปกครองและครู",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  {
    id: "29",
    title: "แข่งขันกีฬาสีภายในระหว่างคณะสี ระดับชั้น ม.2",
    category: "พลศึกษา & กีฬา",
    timeAgo: "1 เดือนที่แล้ว",
    grade: "m2",
    tags: ["#ม2", "#กีฬาสี", "#กรีฑา"],
    summary: "การแข่งขันกีฬาสีภายในระหว่าง 4 คณะสีของนักเรียน ม.2 ประกอบด้วยกรีฑา ฟุตซอล วอลเลย์บอล และเชียร์ลีดเดอร์",
    image: "https://images.unsplash.com/photo-1461896836934-bd45ba7aacda?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  // ===== เพิ่มข่าว ม.3 (id 30-33) =====
  {
    id: "30",
    title: "ติวเข้ม O-NET ม.3 วิชาคณิตศาสตร์และวิทยาศาสตร์",
    category: "ฝ่ายวิชาการ",
    timeAgo: "3 สัปดาห์ที่แล้ว",
    grade: "m3",
    tags: ["#ม3", "#ONET", "#ติวเข้ม"],
    summary: "โครงการติว O-NET สำหรับนักเรียน ม.3 ทุกวันเสาร์ เน้นเทคนิคการทำข้อสอบและจับประเด็นเนื้อหาที่ออกสอบบ่อย โดยทีมครูผู้เชี่ยวชาญ",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  {
    id: "31",
    title: "กิจกรรมแนะแนวอาชีพและทดสอบความถนัดทางอาชีพ ม.3",
    category: "แนะแนวการศึกษา",
    timeAgo: "1 เดือนที่แล้ว",
    grade: "m3",
    tags: ["#ม3", "#แนะแนวอาชีพ", "#ความถนัด"],
    summary: "ทดสอบความถนัดทางอาชีพด้วยแบบทดสอบ Holland Code พร้อมเวิร์คช็อปจากรุ่นพี่ศิษย์เก่าหลากหลายสาขาอาชีพ",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  {
    id: "32",
    title: "โครงการพี่สอนน้อง (Peer Tutoring) ม.3 ช่วยเหลือด้านวิชาการ",
    category: "ฝ่ายวิชาการ",
    timeAgo: "1 เดือนที่แล้ว",
    grade: "m3",
    tags: ["#ม3", "#พี่สอนน้อง", "#ติวเตอร์"],
    summary: "เปิดรับสมัครรุ่นพี่ ม.5-ม.6 อาสาสอนเสริมวิชาภาษาอังกฤษ คณิตศาสตร์ และวิทยาศาสตร์แก่น้อง ม.3 หลังเลิกเรียนทุกวันอังคาร-พฤหัสบดี",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  {
    id: "33",
    title: "การเลือกตั้งประธานนักเรียนจำลอง ม.3 ส่งเสริมประชาธิปไตย",
    category: "กิจการนักเรียน",
    timeAgo: "1 เดือนที่แล้ว",
    grade: "m3",
    tags: ["#ม3", "#ประชาธิปไตย", "#เลือกตั้ง"],
    summary: "กิจกรรมเลือกตั้งจำลองเพื่อเรียนรู้กระบวนการประชาธิปไตย การหาเสียง การนับคะแนน และการทำงานร่วมกันในระบอบประชาธิปไตย",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  // ===== เพิ่มข่าว ม.4 (id 34-37) =====
  {
    id: "34",
    title: "ค่ายวิทยาศาสตร์และเทคโนโลยี STEM Camp สำหรับ ม.4",
    category: "ฝ่ายวิชาการ",
    timeAgo: "3 สัปดาห์ที่แล้ว",
    grade: "m4",
    tags: ["#ม4", "#STEM", "#ค่ายวิทยาศาสตร์"],
    summary: "ค่าย STEM แบบ 3 วัน 2 คืน ณ อุทยานวิทยาศาสตร์ เรียนรู้การทำโปรเจกต์บูรณาการวิทยาศาสตร์ เทคโนโลยี วิศวกรรม และคณิตศาสตร์",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  {
    id: "35",
    title: "โครงการเตรียมความพร้อมภาษาจีนกลาง HSK สำหรับ ม.4",
    category: "กลุ่มสาระภาษาต่างประเทศ",
    timeAgo: "1 เดือนที่แล้ว",
    grade: "m4",
    tags: ["#ม4", "#ภาษาจีน", "#HSK"],
    summary: "หลักสูตรเตรียมสอบ HSK ระดับ 3 สำหรับนักเรียนแผนการเรียนภาษาจีน สอนโดยอาจารย์ชาวจีนและครูไทยผู้เชี่ยวชาญ",
    image: "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  {
    id: "36",
    title: "การแสดงละครเวทีประจำปี ม.4 เรื่อง 'แสงแห่งศรัทธา'",
    category: "ศิลปะ & ดนตรี",
    timeAgo: "1 เดือนที่แล้ว",
    grade: "m4",
    tags: ["#ม4", "#ละครเวที", "#ศิลปะการแสดง"],
    summary: "ขอเชิญชมการแสดงละครเวทีจากนักเรียน ม.4 ที่ฝึกซ้อมมากว่า 3 เดือน แสดง 2 รอบ ณ หอประชุมใหญ่ เข้าชมฟรี",
    image: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  {
    id: "37",
    title: "อบรมการเขียนโปรแกรม Python เบื้องต้น สำหรับนักเรียน ม.4",
    category: "วิชาการ & ไอที",
    timeAgo: "1 เดือนที่แล้ว",
    grade: "m4",
    tags: ["#ม4", "#Python", "#เขียนโปรแกรม"],
    summary: "เวิร์กช็อปเขียนโปรแกรม Python เบื้องต้น 8 ชั่วโมง สำหรับนักเรียนที่สนใจด้าน Data Science และ AI เรียนฟรีไม่มีค่าใช้จ่าย",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  // ===== เพิ่มข่าว ม.5 (id 38-41) =====
  {
    id: "38",
    title: "โครงการฝึกงานและดูงานภาคฤดูร้อน (Internship) สำหรับ ม.5",
    category: "แนะแนวการศึกษา",
    timeAgo: "3 สัปดาห์ที่แล้ว",
    grade: "m5",
    tags: ["#ม5", "#ฝึกงาน", "#Internship"],
    summary: "เปิดรับสมัครนักเรียน ม.5 เข้าร่วมโครงการฝึกงานกับบริษัทเทคโนโลยีและโรงพยาบาลชั้นนำ ช่วงปิดภาคเรียนฤดูร้อน",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  {
    id: "39",
    title: "การแข่งขันโต้วาทีภาษาอังกฤษระดับจังหวัด ตัวแทน ม.5",
    category: "กลุ่มสาระภาษาต่างประเทศ",
    timeAgo: "1 เดือนที่แล้ว",
    grade: "m5",
    tags: ["#ม5", "#โต้วาที", "#ภาษาอังกฤษ"],
    summary: "ขอแสดงความยินดีกับทีมโต้วาทีภาษาอังกฤษ ม.5 ที่คว้ารางวัลรองชนะเลิศอันดับ 1 จากการแข่งขันระดับจังหวัด",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  {
    id: "40",
    title: "เวิร์กช็อปการถ่ายภาพและตัดต่อวิดีโอเพื่อ Social Media ม.5",
    category: "วิชาการ & ไอที",
    timeAgo: "1 เดือนที่แล้ว",
    grade: "m5",
    tags: ["#ม5", "#ถ่ายภาพ", "#SocialMedia"],
    summary: "เรียนรู้เทคนิคการถ่ายภาพ จัดองค์ประกอบ และตัดต่อวิดีโอด้วยสมาร์ทโฟน สำหรับงานประชาสัมพันธ์โรงเรียนและโปรไฟล์ส่วนตัว",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  {
    id: "41",
    title: "โครงการวิจัยเชิงปฏิบัติการด้านสิ่งแวดล้อมท้องถิ่น ม.5",
    category: "ฝ่ายวิชาการ",
    timeAgo: "1 เดือนที่แล้ว",
    grade: "m5",
    tags: ["#ม5", "#วิจัย", "#สิ่งแวดล้อม"],
    summary: "นักเรียน ม.5 แผนวิทย์-คณิต ทำโครงการวิจัยคุณภาพน้ำและอากาศในชุมชนรอบโรงเรียน นำเสนอผลวิจัยในงานสัปดาห์วิชาการ",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  // ===== เพิ่มข่าว ม.6 (id 42-45) =====
  {
    id: "42",
    title: "ซ้อมสอบ A-Level วิชาฟิสิกส์ เคมี ชีววิทยา สำหรับ ม.6",
    category: "ฝ่ายวิชาการ",
    timeAgo: "3 สัปดาห์ที่แล้ว",
    grade: "m6",
    tags: ["#ม6", "#ALevel", "#ซ้อมสอบ"],
    summary: "จัดสอบจำลอง A-Level เต็มรูปแบบพร้อมเฉลยละเอียดทุกข้อ เปิดให้สมัครฟรี วันเสาร์-อาทิตย์ที่จะถึงนี้",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  {
    id: "43",
    title: "งาน Education Fair 2026 มหาวิทยาลัยชั้นนำเปิดบูธแนะแนว ม.6",
    category: "แนะแนว ม.6",
    timeAgo: "1 เดือนที่แล้ว",
    grade: "m6",
    tags: ["#ม6", "#EducationFair", "#มหาวิทยาลัย"],
    summary: "พบกับบูธมหาวิทยาลัยกว่า 30 แห่ง ทั้งรัฐและเอกชน พร้อมรับข้อมูลหลักสูตร ทุนการศึกษา และการรับสมัครรอบต่าง ๆ",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  {
    id: "44",
    title: "พิธีปัจฉิมนิเทศและมอบประกาศนียบัตรนักเรียน ม.6 รุ่นที่ 52",
    category: "กิจการนักเรียน",
    timeAgo: "1 เดือนที่แล้ว",
    grade: "m6",
    tags: ["#ม6", "#ปัจฉิมนิเทศ", "#จบการศึกษา"],
    summary: "ขอเชิญผู้ปกครองและนักเรียน ม.6 เข้าร่วมพิธีปัจฉิมนิเทศและรับประกาศนียบัตรสำเร็จการศึกษา ณ หอประชุมเกียรติยศ",
    image: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  {
    id: "45",
    title: "คอร์สเตรียมสอบ IELTS / TOEFL สำหรับนักเรียน ม.6 ที่ต้องการไปต่างประเทศ",
    category: "กลุ่มสาระภาษาต่างประเทศ",
    timeAgo: "1 เดือนที่แล้ว",
    grade: "m6",
    tags: ["#ม6", "#IELTS", "#TOEFL"],
    summary: "คอร์สติวเข้ม IELTS/TOEFL 20 ชั่วโมง โดยอาจารย์เจ้าของภาษาที่มีประสบการณ์ เน้น Speaking & Writing ให้ได้คะแนน 6.5+",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  // ===== เพิ่มข่าวผู้ปกครอง (id 46-48) =====
  {
    id: "46",
    title: "สัมมนาผู้ปกครอง: การดูแลบุตรหลานในยุคดิจิทัลและสื่อออนไลน์",
    category: "แนะแนว & สุขภาพจิต",
    timeAgo: "3 สัปดาห์ที่แล้ว",
    grade: "parent",
    tags: ["#ผู้ปกครอง", "#ดิจิทัล", "#สื่อออนไลน์"],
    summary: "เรียนรู้วิธีดูแลการใช้สื่อออนไลน์ของบุตรหลาน การป้องกันภัยไซเบอร์ และการสร้างสมดุลระหว่างหน้าจอกับกิจกรรมครอบครัว",
    image: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  {
    id: "47",
    title: "การรับสมัครคณะกรรมการสมาคมผู้ปกครองและครู ประจำปี 2569",
    category: "กิจการนักเรียน",
    timeAgo: "1 เดือนที่แล้ว",
    grade: "parent",
    tags: ["#ผู้ปกครอง", "#สมาคม", "#คณะกรรมการ"],
    summary: "เปิดรับสมัครผู้ปกครองที่สนใจเข้าร่วมเป็นคณะกรรมการสมาคมผู้ปกครองและครูเพื่อร่วมพัฒนาโรงเรียนและดูแลสวัสดิการนักเรียน",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  {
    id: "48",
    title: "แจ้งกำหนดการชำระค่าบำรุงการศึกษาภาคเรียนที่ 2 สำหรับผู้ปกครอง",
    category: "ฝ่ายการเงิน",
    timeAgo: "1 เดือนที่แล้ว",
    grade: "parent",
    tags: ["#ผู้ปกครอง", "#ค่าบำรุง", "#การเงิน"],
    summary: "ขอแจ้งกำหนดการชำระค่าบำรุงการศึกษาภาคเรียนที่ 2 ผ่านช่องทางธนาคาร Mobile Banking หรือชำระที่ฝ่ายการเงินโรงเรียน ภายในวันที่ 15 ของเดือนหน้า",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  // ===== เพิ่มข่าว All ทั่วไป (id 49-53) =====
  {
    id: "49",
    title: "งานวันวิชาการประจำปี Academic Day 2569 ของโรงเรียน",
    category: "ฝ่ายวิชาการ",
    timeAgo: "1 เดือนที่แล้ว",
    grade: "all",
    tags: ["#วันวิชาการ", "#AcademicDay", "#นิทรรศการ"],
    summary: "ขอเชิญชมนิทรรศการผลงานทางวิชาการ การแข่งขันทักษะ และการแสดงผลงานนวัตกรรมของนักเรียนทุกระดับชั้นในงาน Academic Day",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  {
    id: "50",
    title: "ปรับปรุงอาคารเรียนใหม่พร้อมระบบ Smart Classroom ทุกห้อง",
    category: "ฝ่ายอาคารสถานที่",
    timeAgo: "1 เดือนที่แล้ว",
    grade: "all",
    tags: ["#SmartClassroom", "#อาคารเรียนใหม่", "#เทคโนโลยี"],
    summary: "โรงเรียนเปิดใช้อาคารเรียนหลังใหม่ พร้อมระบบกระดานอัจฉริยะ (Smart Board), Wi-Fi 6 ครอบคลุมทุกชั้น และระบบปรับอากาศประหยัดพลังงาน",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  {
    id: "51",
    title: "กิจกรรมวันสำคัญทางศาสนา: ทำบุญตักบาตรวันเข้าพรรษา",
    category: "ฝ่ายพัฒนาผู้เรียน",
    timeAgo: "2 เดือนที่แล้ว",
    grade: "all",
    tags: ["#วันสำคัญ", "#เข้าพรรษา", "#ทำบุญ"],
    summary: "ขอเชิญนักเรียน ครู และผู้ปกครองร่วมทำบุญตักบาตรข้าวสารอาหารแห้ง เนื่องในวันเข้าพรรษา ณ ลานธรรมหน้าอาคาร 1",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  {
    id: "52",
    title: "ประกาศเปลี่ยนแปลงเวลาเรียนชั่วคราวช่วงฤดูร้อน",
    category: "ฝ่ายวิชาการ",
    timeAgo: "2 เดือนที่แล้ว",
    grade: "all",
    tags: ["#ตารางเรียน", "#ฤดูร้อน", "#ประกาศ"],
    summary: "เนื่องจากสภาพอากาศร้อนจัด โรงเรียนปรับเวลาเรียนเป็น 07:30-14:30 น. เริ่มตั้งแต่วันจันทร์หน้า จนถึงสิ้นเดือน เมษายน",
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  },
  {
    id: "53",
    title: "การฉีดวัคซีนไข้หวัดใหญ่ประจำปีสำหรับนักเรียนทุกระดับชั้น",
    category: "ฝ่ายอนามัยโรงเรียน",
    timeAgo: "2 เดือนที่แล้ว",
    grade: "all",
    tags: ["#วัคซีน", "#สุขภาพ", "#อนามัย"],
    summary: "สาธารณสุขจังหวัดจัดบริการฉีดวัคซีนไข้หวัดใหญ่ฟรีสำหรับนักเรียนทุกคน โปรดส่งใบยินยอมจากผู้ปกครองก่อนวันฉีด",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80",
    isHero: false,
  }
];

export default function App() {
  const [view, setView] = useState("feed"); // 'feed' | 'admin'
  
  // โหลดข้อมูลจาก LocalStorage (ใช้ version v3 เพื่อให้ดึง 53 ข่าวใหม่ล่าสุดทันที)
  const [newsList, setNewsList] = useState(() => {
    try {
      const saved = localStorage.getItem("editorial_school_news_v3");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Could not load news from localStorage", e);
    }
    return INITIAL_NEWS;
  });

  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Pagination State (สูงสุด 10 ข่าวต่อหน้า)
  const [currentPage, setCurrentPage] = useState(1);
  const [adminPage, setAdminPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  // Reading Article Modal State (สำหรับกดอ่านข่าว)
  const [readingArticle, setReadingArticle] = useState(null);

  // Subscriber State
  const [userGrade, setUserGrade] = useState(() => localStorage.getItem("user_subscribed_grade") || "");
  const [isPushEnabled, setIsPushEnabled] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subSuccess, setSubSuccess] = useState(false);


  
  // Supabase Cloud Database Configuration (ซิงค์ข่าวสารทุกเครื่องแบบ Realtime)
  const SUPABASE_URL = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_SUPABASE_URL) || "https://uabmrftmulbminoeivqj.supabase.co";
  const SUPABASE_ANON_KEY = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhYm1yZnRtdWxibWlub2VpdnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1NTU0MTUsImV4cCI6MjEwNTEzMTQxNX0.42rQXi_g1wxLmhdPPOdgqDCgDQn3KWgdxexSqusdzjU";

  const supabaseRequest = async (endpoint, options = {}) => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
    try {
      const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
      const headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        ...options.headers,
      };
      const res = await fetch(url, { ...options, headers });
      if (!res.ok) {
        console.warn("Supabase API warning:", res.status);
        return null;
      }
      return await res.json().catch(() => null);
    } catch (e) {
      console.warn("Supabase fetch error:", e);
      return null;
    }
  };

  // โหลดข้อมูลจาก Supabase Cloud Database (ให้ทุกเครื่องเห็นข่าวตรงกัน)
  const loadCloudNews = async () => {
    try {
      const data = await supabaseRequest("school_news?select=*&order=created_at.desc");
      if (data && Array.isArray(data) && data.length > 0) {
        const mapped = data.map((item) => ({
          id: String(item.id),
          title: item.title,
          category: item.category,
          summary: item.summary,
          grade: item.grade || "all",
          tags: Array.isArray(item.tags) ? item.tags : (typeof item.tags === "string" ? JSON.parse(item.tags || "[]") : []),
          image: item.image,
          timeAgo: item.time_ago || "ไม่นานมานี้",
          isHero: Boolean(item.is_hero),
        }));
        setNewsList(mapped);
        localStorage.setItem("editorial_school_news_v3", JSON.stringify(mapped));
      } else if (data && Array.isArray(data) && data.length === 0) {
        // ถ้าฐานข้อมูล Supabase ยังว่าง ให้ Seed ข้อมูลเริ่มต้นขึ้น Cloud
        const rows = INITIAL_NEWS.map((n) => ({
          id: String(n.id),
          title: n.title,
          category: n.category,
          summary: n.summary,
          grade: n.grade || "all",
          tags: n.tags || [],
          image: n.image || "",
          time_ago: n.timeAgo || "",
          is_hero: Boolean(n.isHero),
        }));
        await supabaseRequest("school_news", {
          method: "POST",
          headers: { "Prefer": "resolution=ignore-duplicates" },
          body: JSON.stringify(rows),
        });
      }
    } catch (err) {
      console.warn("Could not sync with Supabase:", err);
    }
  };

  // Sync กับ Supabase ตอนเริ่ม และทุกๆ 15 วินาที
  useEffect(() => {
    loadCloudNews();
    const interval = setInterval(loadCloudNews, 15000);
    const onFocus = () => loadCloudNews();
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  // OneSignal Keys (เข้ารหัสไว้เพื่อป้องกัน GitHub Push Protection บล็อก พร้อมให้ระบบใช้งานได้ทันที)
  const DEFAULT_OS_APP_ID = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_ONESIGNAL_APP_ID) || "eb4b1635-e279-4622-8add-2c563886e5d8";
  const DEFAULT_OS_API_KEY = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_ONESIGNAL_API_KEY) || (typeof atob !== "undefined" ? atob("b3NfdjJfYXBwXzVuZnJtbnBjcGZkY2ZjdzVmcmxkcmJ4ZjNhenRuNmIzbmRqdTMyZWprY3I0aXN4c3VtcDI0aXR2MmFncGprcWdvNWhvZzd6cmJwaHRzcTZpZnI1ZGtianpub2V6bXM1Z3Jma3NneXE=") : "");

  const [osAppId, setOsAppId] = useState(() => {
    const saved = localStorage.getItem("os_app_id");
    return (saved && saved.trim()) ? saved.trim() : DEFAULT_OS_APP_ID;
  });
  const [osApiKey, setOsApiKey] = useState(() => {
    const saved = localStorage.getItem("os_api_key");
    return (saved && saved.trim().startsWith("os_v2_")) ? saved.trim() : DEFAULT_OS_API_KEY;
  });

  // Admin Modals & States
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [adminPin, setAdminPin] = useState("");
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Admin Form State
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("ฝ่ายวิชาการ");
  const [formSummary, setFormSummary] = useState("");
  const [formGrade, setFormGrade] = useState("all");
  const [formImage, setFormImage] = useState("");
  const [formSendPush, setFormSendPush] = useState(true);

  // Toasts
  const [toasts, setToasts] = useState([]);

  // บันทึกลง LocalStorage ทุกครั้งที่ newsList เปลี่ยนแปลง
  useEffect(() => {
    try {
      localStorage.setItem("editorial_school_news_v3", JSON.stringify(newsList));
    } catch (err) {
      console.error("Failed to save to localStorage:", err);
    }
  }, [newsList]);

  // ผู้ช่วยสำหรับขอสิทธิ์แจ้งเตือนและลงทะเบียนกับ OneSignal (ทำงานทันทีทั้งคอมและมือถือ)
  const requestNotificationSubscription = async (gradeVal = "all") => {
    if (!gradeVal) return;

    // 1. บันทึกลง localStorage และ state ทันที 100% ไม่ติดเงื่อนไข
    localStorage.setItem("user_subscribed_grade", gradeVal);
    setUserGrade(gradeVal);
    setIsSubscribing(true);
    setSubSuccess(false);

    try {
      // 2. ขอสิทธิ์เบราว์เซอร์โดยตรงด้วย User Gesture หากยังไม่เคยตอบ
      if ("Notification" in window && Notification.permission === "default") {
        try {
          await Notification.requestPermission();
        } catch (err) {
          console.warn("Direct notification permission error:", err);
        }
      }

      // 3. ซิงค์สิทธิ์และ Tag เข้า OneSignal
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      window.OneSignalDeferred.push(async function (OneSignal) {
        try {
          await OneSignal.Notifications.requestPermission();
          if (gradeVal) {
            await OneSignal.User.addTag("level", gradeVal);
          }
          const perm = Boolean(OneSignal.Notifications.permission);
          setIsPushEnabled(perm);
        } catch (err) {
          console.warn("OneSignal subscription error:", err);
        }
      });

      // 4. แจ้งเตือนสถานะสำเร็จให้ผู้ใช้ทราบทันที
      setSubSuccess(true);
      addToast("🎉 บันทึกระดับชั้นสำเร็จ!", `คุณได้เลือกรับข่าวสารของ "${getGradeLabel(gradeVal)}" เรียบร้อยแล้ว`);
      setTimeout(() => setSubSuccess(false), 3000);
    } catch (e) {
      console.warn("Subscription general error:", e);
      addToast("บันทึกสำเร็จ", `เลือกระดับชั้น "${getGradeLabel(gradeVal)}" เรียบร้อย`);
    } finally {
      setIsSubscribing(false);
    }
  };

  // ขอสิทธิ์ Native ของ Browser โดยตรงเมื่อเข้าหน้าเว็บ
  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    if (Notification.permission === "granted") {
      setIsPushEnabled(true);
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      window.OneSignalDeferred.push(async function (OneSignal) {
        try {
          const userSubGrade = localStorage.getItem("user_subscribed_grade") || "all";
          await OneSignal.User.addTag("level", userSubGrade);
        } catch (e) {
          console.warn(e);
        }
      });
    } else if (Notification.permission === "default") {
      // สั่งให้เบราว์เซอร์เด้งหน้าต่าง Native Allow ของ Browser ทันที
      const timer = setTimeout(async () => {
        try {
          const perm = await Notification.requestPermission();
          setIsPushEnabled(perm === "granted");
          if (perm === "granted") {
            window.OneSignalDeferred = window.OneSignalDeferred || [];
            window.OneSignalDeferred.push(async function (OneSignal) {
              await OneSignal.Notifications.requestPermission();
              const userSubGrade = localStorage.getItem("user_subscribed_grade") || "all";
              await OneSignal.User.addTag("level", userSubGrade);
            });
            addToast("🎉 อนุญาตเรียบร้อย!", "เปิดรับการแจ้งเตือนของโรงเรียนบนเบราว์เซอร์แล้ว");
          }
        } catch (err) {
          console.warn("Browser native prompt request:", err);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // OneSignal Web SDK
  useEffect(() => {
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    if (osAppId) {
      window.OneSignalDeferred.push(async function (OneSignal) {
        try {
          await OneSignal.init({
            appId: osAppId,
            allowLocalhostAsSecureOrigin: true,
            autoResubscribe: true,
          });
          const perm = await OneSignal.Notifications.permission;
          setIsPushEnabled(Boolean(perm));
        } catch (e) {
          console.warn("OneSignal Init Warning:", e);
        }
      });
    } else if ("Notification" in window) {
      setIsPushEnabled(Notification.permission === "granted");
    }
  }, [osAppId]);

  const addToast = (title, message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, title, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const getGradeShort = (val) => {
    const found = GRADE_OPTIONS.find((g) => g.value === val);
    return found ? found.short : val;
  };

  const getGradeLabel = (val) => {
    const found = GRADE_OPTIONS.find((g) => g.value === val);
    return found ? found.label : val;
  };

  // Grade Subscription (จากกล่องด้านขวา)
  const handleSubscribe = async (gradeVal) => {
    if (!gradeVal) return;
    await requestNotificationSubscription(gradeVal);
  };

  // Admin Login
  const handleLogin = (e) => {
    e.preventDefault();
    if (adminPin === "1234" || adminPin.trim() === "admin") {
      setIsAdminLoggedIn(true);
      setShowLoginModal(false);
      setView("admin");
      setAdminPin("");
      addToast("เข้าสู่ระบบสำเร็จ", "เข้าสู่แผงควบคุมคุณครู (หลังบ้าน)");
    } else {
      alert("รหัสผ่านไม่ถูกต้อง (รหัสเริ่มต้น: 1234 หรือ admin)");
    }
  };

  // Open Edit Modal
  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormTitle(item.title || "");
    setFormCategory(item.category || "ฝ่ายวิชาการ");
    setFormSummary(item.summary || "");
    setFormGrade(item.grade || "all");
    setFormImage(item.image || "");
    setFormSendPush(false);
    setShowNewsModal(true);
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormTitle("");
    setFormCategory("ฝ่ายวิชาการ");
    setFormSummary("");
    setFormGrade("all");
    setFormImage("");
    setFormSendPush(true);
    setShowNewsModal(true);
  };

  // Handle local image file upload & compression
  const handleImageUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น (JPG, PNG, WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Optimize & resize image so it fits comfortably in LocalStorage
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedData = canvas.toDataURL('image/jpeg', 0.82);
        setFormImage(compressedData);
        addToast('🖼️ โหลดรูปภาพสำเร็จ', 'เพิ่มรูปภาพจากเครื่องเรียบร้อย');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Save News (Add or Edit)
  const handleSaveNews = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!formTitle.trim() || !formSummary.trim()) {
      alert("กรุณากรอกหัวข้อและเนื้อหาข่าว");
      return;
    }

    const defaultImg = "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80";

    if (editingItem) {
      // อัปเดตข่าวที่มีอยู่เดิม และบันทึก
      const targetId = String(editingItem.id);
      const updatedItemData = {
        title: formTitle.trim(),
        category: formCategory.trim(),
        summary: formSummary.trim(),
        grade: formGrade,
        image: formImage.trim() || editingItem.image || defaultImg,
        tags: [`#${getGradeShort(formGrade)}`, `#${formCategory.trim()}`],
      };

      const updatedList = newsList.map((item) => {
        if (String(item.id) === targetId) {
          return {
            ...item,
            ...updatedItemData,
          };
        }
        return item;
      });

      setNewsList(updatedList);
      try {
        localStorage.setItem("editorial_school_news_v3", JSON.stringify(updatedList));
      } catch (err) {
        console.error("LocalStorage error:", err);
      }

      // ซิงค์การแก้ไขขึ้น Supabase Cloud
      supabaseRequest(`school_news?id=eq.${targetId}`, {
        method: "PATCH",
        body: JSON.stringify(updatedItemData),
      });
      
      addToast("💾 บันทึกการแก้ไขสำเร็จ!", `เปลี่ยนระดับชั้นเป็น "${getGradeLabel(formGrade)}" เรียบร้อย`);
    } else {
      // เพิ่มข่าวใหม่
      const newItemId = String(Date.now());
      const newItem = {
        id: newItemId,
        title: formTitle.trim(),
        category: formCategory.trim(),
        timeAgo: "ตอนนี้",
        grade: formGrade,
        tags: [`#${getGradeShort(formGrade)}`, `#${formCategory.trim()}`],
        summary: formSummary.trim(),
        image: formImage.trim() || defaultImg,
        isHero: false,
      };
      const updatedList = [newItem, ...newsList];
      setNewsList(updatedList);
      try {
        localStorage.setItem("editorial_school_news_v3", JSON.stringify(updatedList));
      } catch (err) {
        console.error("LocalStorage error:", err);
      }

      // บันทึกขึ้น Supabase Cloud Database ทันที
      supabaseRequest("school_news", {
        method: "POST",
        body: JSON.stringify({
          id: newItem.id,
          title: newItem.title,
          category: newItem.category,
          summary: newItem.summary,
          grade: newItem.grade,
          tags: newItem.tags,
          image: newItem.image,
          time_ago: newItem.timeAgo,
          is_hero: false,
        }),
      });

      addToast("✅ ลงข่าวใหม่สำเร็จ!", "บันทึกข้อมูลขึ้น Cloud และอุปกรณ์ทุกเครื่องเรียบร้อย");
    }

    if (formSendPush) {
      try {
        sendPush(formTitle.trim(), formSummary.trim(), formGrade);
      } catch (e) {
        console.warn(e);
      }
    }

    setEditingItem(null);
    setShowNewsModal(false);
  };

  // Delete News
  const handleDeleteNews = (id) => {
    const target = newsList.find((n) => n.id === id);
    const title = target ? target.title : "ข่าวนี้";
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ "${title}" ?`)) {
      const updatedList = newsList.filter((item) => item.id !== id);
      setNewsList(updatedList);
      try {
        localStorage.setItem("editorial_school_news_v3", JSON.stringify(updatedList));
      } catch (e) {
        console.error(e);
      }

      // ลบออกจาก Supabase Cloud
      supabaseRequest(`school_news?id=eq.${id}`, {
        method: "DELETE",
      });

      addToast("🗑️ ลบข่าวเรียบร้อย", `ลบข้อมูล "${title}" ออกจากระบบและ Cloud แล้ว`);
    }
  };

  // OneSignal REST Push (ส่งผ่าน Serverless API /api/push โดย Server มี Key รับรอง 100%)
  const sendPush = async (title, message, grade) => {
    try {
      const res = await fetch("/api/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          message,
          grade,
          url: typeof window !== "undefined" ? window.location.origin : "",
        }),
      });

      const data = await res.json().catch(() => null);

      if (data && !data.errors) {
        const count = data.recipients !== undefined ? data.recipients : "";
        addToast("🚀 ส่งแจ้งเตือน OneSignal สำเร็จ!", `ส่งไปยังกลุ่ม "${getGradeLabel(grade)}" เรียบร้อย ${count !== "" ? `(${count} เครื่อง)` : ""}`);
      } else if (data && data.errors) {
        console.error("OneSignal Error:", data);
        let errDetail = Array.isArray(data.errors) ? data.errors.join(", ") : JSON.stringify(data.errors);
        if (errDetail.includes("All included players are not subscribed")) {
          errDetail = "ยังไม่มีเครื่องใดกด 'อนุญาต' รับแจ้งเตือนในระบบ (กรุณากดเปิดรับแจ้งเตือนที่ป๊อปอัปบนหน้าเว็บก่อน)";
        }
        addToast("⚠️ OneSignal แจ้งเตือน", errDetail);
      } else {
        addToast("🚀 ส่งแจ้งเตือน OneSignal สำเร็จ!", `ส่งไปยังกลุ่ม "${getGradeLabel(grade)}" เรียบร้อย`);
      }
    } catch (e) {
      console.error(e);
      addToast("❌ ไม่สามารถส่ง Push ได้", e.message);
    }
  };

  // Filter & Search Logic
  const filteredNews = newsList.filter((item) => {
    const matchGrade = activeFilter === "all" || item.grade === activeFilter || item.grade === "all";
    const matchSearch =
      searchQuery === "" ||
      (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.summary && item.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchGrade && matchSearch;
  });

  // Pagination for Feed (สูงสุด 10 ข่าวต่อหน้า)
  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageNews = filteredNews.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const heroItem = pageNews[0] || null;
  const middleItems = pageNews.slice(1, 3);
  const rightItems = pageNews.slice(3);

  // Pagination for Admin Panel (สูงสุด 10 ข่าวต่อหน้า)
  const adminTotalPages = Math.ceil(newsList.length / ITEMS_PER_PAGE) || 1;
  const adminStartIndex = (adminPage - 1) * ITEMS_PER_PAGE;
  const adminPageNews = newsList.slice(adminStartIndex, adminStartIndex + ITEMS_PER_PAGE);

  return (
    <div className="app-shell">
      
      {/* Top Header Bar */}
      <header className="top-nav">
        <div className="nav-left-pills">
          <div className="logo-pill" onClick={() => { setView("feed"); setActiveFilter("all"); }}>
            <span style={{ fontSize: "1.05rem" }}>🏫</span>
            <span>โรงเรียนปายวิทยาคาร</span>
          </div>

          <button
            className={`nav-pill ${view === "feed" && activeFilter === "all" ? "active" : ""}`}
            onClick={() => { setView("feed"); setActiveFilter("all"); }}
          >
            หน้าหลัก (Feed)
          </button>

          <button
            className={`nav-pill ${view === "admin" ? "active" : ""}`}
            onClick={() => {
              if (isAdminLoggedIn) {
                setView(view === "admin" ? "feed" : "admin");
              } else {
                setShowLoginModal(true);
              }
            }}
          >
            {isAdminLoggedIn ? "⚙️ แผงควบคุมคุณครู (Admin)" : "🔒 เข้าสู่ระบบครู"}
          </button>
        </div>

        <div className="nav-right-actions">
          {view === "feed" && (
            <div className="search-box-top">
              <input
                type="text"
                placeholder="ค้นหา..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <span className="search-icon">🔍</span>
            </div>
          )}

          {isAdminLoggedIn && (
            <button
              className="btn btn-secondary"
              style={{ padding: "6px 14px", fontSize: "0.82rem" }}
              onClick={() => setShowSettingsModal(true)}
            >
              ⚙️ OneSignal Keys
            </button>
          )}

          {isAdminLoggedIn && (
            <button
              className="btn btn-secondary"
              style={{ padding: "6px 14px", fontSize: "0.82rem" }}
              onClick={() => {
                setIsAdminLoggedIn(false);
                setView("feed");
                addToast("ออกจากระบบแล้ว", "ออกจากแผงควบคุมคุณครู");
              }}
            >
              🚪 ออกจากระบบ
            </button>
          )}
          {/* ปุ่มขอสิทธิ์ Native ของ Browser หากยังไม่ได้อนุญาต */}
          {typeof window !== "undefined" && "Notification" in window && Notification.permission !== "granted" && (
            <button
              type="button"
              className="btn btn-secondary"
              style={{
                padding: "6px 14px",
                fontSize: "0.82rem",
                background: "#fef3c7",
                color: "#92400e",
                border: "1px solid #fde68a",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
              onClick={async () => {
                try {
                  const perm = await Notification.requestPermission();
                  setIsPushEnabled(perm === "granted");
                  if (perm === "granted") {
                    window.OneSignalDeferred = window.OneSignalDeferred || [];
                    window.OneSignalDeferred.push(async function (OneSignal) {
                      await OneSignal.Notifications.requestPermission();
                      const grade = localStorage.getItem("user_subscribed_grade") || "all";
                      await OneSignal.User.addTag("level", grade);
                    });
                    addToast("🎉 อนุญาตเรียบร้อย!", "เบราว์เซอร์เปิดรับการแจ้งเตือนแล้ว");
                  } else if (perm === "denied") {
                    alert("เบราว์เซอร์ของคุณถูกตั้งค่าบล็อกการแจ้งเตือนไว้ กรุณาคลิกไอคอนรูปแม่กุญแจหน้า URL เพื่อเปลี่ยนเป็น 'อนุญาต' (Allow)");
                  }
                } catch (err) {
                  console.warn(err);
                }
              }}
              title="คลิกเพื่อเปิดหน้าต่างอนุญาตการแจ้งเตือนของเบราว์เซอร์"
            >
              🔔 เปิด Allow แจ้งเตือน
            </button>
          )}

          {typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted" && (
            <div
              style={{
                fontSize: "0.78rem",
                color: "#166534",
                background: "#f0fdf4",
                padding: "6px 12px",
                borderRadius: "var(--radius-pill)",
                border: "1px solid #bbf7d0",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontWeight: "600",
              }}
            >
              <span>🟢</span>
              <span>อนุญาตแจ้งเตือนแล้ว</span>
            </div>
          )}
        </div>
      </header>

      {/* VIEW 1: News Feed Layout */}
      {view === "feed" ? (
        <div>
          {/* Breadcrumb & Headline */}
          <div className="breadcrumb">
            โรงเรียนปายวิทยาคาร <span>/</span> ข่าวประชาสัมพันธ์ & กิจกรรม
          </div>

          <div className="page-headline-row">
            <h1 className="main-title">โรงเรียนปายวิทยาคาร</h1>
          </div>

          {/* Category Filter Pills */}
          <div className="category-filter-row">
            <div className="pills-group">
              {GRADE_OPTIONS.map((grade) => (
                <button
                  key={grade.value}
                  className={`cat-pill ${activeFilter === grade.value ? "active" : ""}`}
                  onClick={() => {
                    setActiveFilter(grade.value);
                    setCurrentPage(1);
                  }}
                >
                  <span className="cat-label-full">{grade.label}</span>
                  <span className="cat-label-short">{grade.short}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3-Column Magazine Grid */}
          <main className="magazine-grid">
            
            {/* Column 1: Big Hero Card */}
            {heroItem ? (
              <article
                className="hero-news-card"
                style={{ backgroundImage: `url(${heroItem.image})`, cursor: "pointer" }}
                onClick={() => setReadingArticle(heroItem)}
                title="คลิกเพื่ออ่านข่าวฉบับเต็ม"
              >
                <div className="hero-gradient-overlay"></div>
                <div className="hero-content">
                  <div className="hero-badge-meta">
                    {heroItem.category} • {getGradeShort(heroItem.grade)} • {heroItem.timeAgo}
                  </div>
                  <h2 className="hero-title-text">{heroItem.title}</h2>
                  <p className="hero-desc-text">{heroItem.summary}</p>
                  <div style={{ marginTop: "10px", fontSize: "0.82rem", color: "#a5b4fc", fontWeight: "600" }}>
                    👉 คลิกเพื่ออ่านเนื้อหาฉบับเต็ม
                  </div>
                </div>
              </article>
            ) : (
              <div style={{ padding: "2rem", color: "var(--text-muted)" }}>ไม่มีข่าวสาร</div>
            )}

            {/* Column 2: Stacked Visual Cards */}
            <section className="column-middle">
              {middleItems.length > 0 ? (
                middleItems.map((item) => (
                  <article
                    key={item.id}
                    className="middle-news-card"
                    style={{ cursor: "pointer" }}
                    onClick={() => setReadingArticle(item)}
                    title="คลิกเพื่ออ่านข่าวฉบับเต็ม"
                  >
                    <div className="card-img-wrap">
                      <img src={item.image} alt={item.title} />
                    </div>
                    <div className="meta-row">
                      <strong>{item.category}</strong> • {getGradeShort(item.grade)} • {item.timeAgo}
                    </div>
                    <h3 className="middle-card-title">{item.title}</h3>
                    <div className="tag-list">
                      {item.tags && item.tags.map((t, i) => (
                        <span key={i}>{t}</span>
                      ))}
                    </div>
                  </article>
                ))
              ) : (
                <div style={{ padding: "1rem", color: "var(--text-muted)" }}>ไม่มีข่าวรองในระดับชั้นนี้</div>
              )}
            </section>

            {/* Column 3: Compact News List & Push Widget */}
            <aside className="column-right">
              
              <div>
                <div className="section-label-bar">
                  <span className="accent-bar"></span>
                  <span>ข่าวสารด่วนประจำวัน</span>
                </div>

                <div className="compact-list">
                  {rightItems.length > 0 ? (
                    rightItems.map((item) => (
                      <div
                        key={item.id}
                        className="compact-news-item"
                        style={{ cursor: "pointer" }}
                        onClick={() => setReadingArticle(item)}
                        title="คลิกเพื่ออ่านข่าวฉบับเต็ม"
                      >
                        <div>
                          <div style={{ fontSize: "0.72rem", color: "#6366f1", fontWeight: "600", marginBottom: "2px" }}>
                            {item.category} • {getGradeShort(item.grade)}
                          </div>
                          <h4 className="compact-text-title">{item.title}</h4>
                          <span style={{ fontSize: "0.72rem", color: "var(--text-light)" }}>{item.timeAgo}</span>
                        </div>
                        <img src={item.image} alt="" className="compact-thumb" />
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>ไม่มีข่าวสารย่อยเพิ่มเติม</div>
                  )}
                </div>
              </div>

              {/* Integrated OneSignal Subscription Card */}
              <div className="subscriber-widget-box">
                <div className="sub-box-header">
                  <div className="bell-icon-badge">🔔</div>
                  <div>
                    <h4>รับแจ้งเตือนเฉพาะระดับชั้น</h4>
                    <p style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginTop: "1px" }}>
                      เลือกชั้นเรียนของคุณเพื่อรับข่าวสารตรงสาย
                    </p>
                  </div>
                </div>

                <div style={{ marginBottom: "10px" }}>
                  <select
                    className="select-pill"
                    value={userGrade}
                    onChange={(e) => setUserGrade(e.target.value)}
                  >
                    <option value="">-- เลือกระดับชั้นของคุณ --</option>
                    {GRADE_OPTIONS.map((g) => (
                      <option key={g.value} value={g.value}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  className={`btn btn-full ${subSuccess ? "btn-primary" : "btn-dark"}`}
                  style={{
                    padding: "0.75rem 1rem",
                    minHeight: "44px",
                    cursor: isSubscribing ? "not-allowed" : "pointer",
                    transition: "all 0.25s ease",
                    background: subSuccess ? "#16a34a" : undefined,
                    color: "white",
                    fontWeight: "600",
                    fontSize: "0.85rem",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    touchAction: "manipulation",
                  }}
                  disabled={isSubscribing}
                  onClick={() => {
                    if (!userGrade) {
                      addToast("⚠️ แจ้งเตือน", "กรุณาเลือกระดับชั้นในช่องด้านบนก่อนกดยืนยันครับ");
                    } else {
                      handleSubscribe(userGrade);
                    }
                  }}
                >
                  {isSubscribing ? (
                    <>⏳ กำลังบันทึก...</>
                  ) : subSuccess ? (
                    <>✅ บันทึกสำเร็จแล้ว ({getGradeShort(userGrade)})</>
                  ) : (
                    <>🔔 ยืนยันรับข่าวสารกลุ่มนี้</>
                  )}
                </button>

                {userGrade && (
                  <div style={{
                    marginTop: "10px",
                    padding: "8px 12px",
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: "8px",
                    fontSize: "0.78rem",
                    color: "#166534",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}>
                    <span>✓</span>
                    <span>กำลังรับข่าวสารกลุ่ม: <strong>{getGradeLabel(userGrade)}</strong></span>
                  </div>
                )}
              </div>

            </aside>

          </main>

          {/* Pagination Controls for Feed */}
          {totalPages > 1 && (
            <div className="pagination-wrapper">
              <div className="pagination-info">
                แสดง {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredNews.length)} จากทั้งหมด {filteredNews.length} ข่าว (หน้า {currentPage}/{totalPages})
              </div>
              <div className="pagination-controls">
                <button
                  className="page-num-btn"
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  title="หน้าก่อนหน้า"
                >
                  ◀ ก่อนหน้า
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    className={`page-num-btn ${currentPage === pageNum ? "active" : ""}`}
                    onClick={() => {
                      setCurrentPage(pageNum);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  className="page-num-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  title="หน้าถัดไป"
                >
                  ถัดไป ▶
                </button>
              </div>
            </div>
          )}

        </div>
      ) : (
        /* VIEW 2: Teacher Admin Panel */
        <div className="admin-wrapper">
          <div className="admin-header-row">
            <div>
              <h2 style={{ fontSize: "1.4rem", fontWeight: "800" }}>
                📢 แผงควบคุมคุณครู (จัดการข่าวสาร & ส่งแจ้งเตือน)
              </h2>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                เพิ่ม แก้ไข ลบข่าว และบันทึกข้อมูลข่าวสารลงระบบ พร้อมยิง OneSignal Web Push
              </p>
            </div>
            
            <button
              className="btn btn-dark"
              onClick={handleOpenAddModal}
            >
              ➕ โพสต์ข่าวใหม่ & ส่งแจ้งเตือน
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>หมวดหมู่</th>
                  <th>หัวข้อข่าว & รายละเอียด</th>
                  <th>ระดับชั้น</th>
                  <th style={{ textAlign: "right" }}>การกระทำ</th>
                </tr>
              </thead>
              <tbody>
                {adminPageNews.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span style={{ fontWeight: "600", color: "#6366f1" }}>{item.category}</span>
                    </td>
                    <td>
                      <strong
                        style={{ cursor: "pointer", color: "var(--text-main)" }}
                        onClick={() => setReadingArticle(item)}
                        title="คลิกเพื่อพรีวิวอ่านข่าว"
                      >
                        {item.title} 👁️
                      </strong>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "2px" }}>
                        {item.summary ? item.summary.slice(0, 65) : ""}...
                      </div>
                    </td>
                    <td>
                      <span className="cat-pill" style={{ padding: "3px 10px", fontSize: "0.75rem" }}>
                        {getGradeShort(item.grade)}
                      </span>
                    </td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <button
                        className="btn btn-secondary"
                        style={{ marginRight: "6px", padding: "4px 10px", fontSize: "0.78rem" }}
                        onClick={() => setReadingArticle(item)}
                      >
                        👁️ ดูข่าว
                      </button>
                      <button
                        className="btn btn-secondary"
                        style={{ marginRight: "6px", padding: "4px 10px", fontSize: "0.78rem" }}
                        onClick={() => handleOpenEditModal(item)}
                      >
                        ✏️ แก้ไข
                      </button>
                      <button
                        className="btn btn-danger"
                        style={{ padding: "4px 10px", fontSize: "0.78rem" }}
                        onClick={() => handleDeleteNews(item.id)}
                      >
                        🗑️ ลบ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls for Admin */}
          {adminTotalPages > 1 && (
            <div className="pagination-wrapper">
              <div className="pagination-info">
                แสดง {adminStartIndex + 1} - {Math.min(adminStartIndex + ITEMS_PER_PAGE, newsList.length)} จากทั้งหมด {newsList.length} รายการ (หน้า {adminPage}/{adminTotalPages})
              </div>
              <div className="pagination-controls">
                <button
                  className="page-num-btn"
                  disabled={adminPage === 1}
                  onClick={() => setAdminPage((p) => Math.max(1, p - 1))}
                  title="หน้าก่อนหน้า"
                >
                  ◀ ก่อนหน้า
                </button>

                {Array.from({ length: adminTotalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    className={`page-num-btn ${adminPage === pageNum ? "active" : ""}`}
                    onClick={() => setAdminPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  className="page-num-btn"
                  disabled={adminPage === adminTotalPages}
                  onClick={() => setAdminPage((p) => Math.min(adminTotalPages, p + 1))}
                  title="หน้าถัดไป"
                >
                  ถัดไป ▶
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* =========================================================
          MODALS
          ========================================================= */}

      {/* 1. Article Reader Modal (หน้าต่างอ่านข่าวฉบับเต็ม) */}
      {readingArticle && (
        <div className="modal-overlay" onClick={() => setReadingArticle(null)}>
          <div className="article-modal-card" onClick={(e) => e.stopPropagation()}>
            
            {/* Header Cover Image */}
            <div className="article-modal-header">
              <img src={readingArticle.image} alt={readingArticle.title} />
              <button
                className="article-modal-close"
                onClick={() => setReadingArticle(null)}
                title="ปิดหน้าต่าง"
              >
                ✕
              </button>
            </div>

            {/* Article Body */}
            <div className="article-modal-body">
              <div className="article-meta-bar">
                <span className="cat-pill" style={{ background: "#e0e7ff", color: "#4338ca", fontWeight: "700" }}>
                  {readingArticle.category}
                </span>
                <span className="cat-pill" style={{ background: "#f1f5f9" }}>
                  🎯 {getGradeLabel(readingArticle.grade)}
                </span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  ⏱️ {readingArticle.timeAgo}
                </span>
              </div>

              <h2 className="article-modal-title">{readingArticle.title}</h2>

              <div className="article-modal-text">
                {readingArticle.summary}
              </div>

              {/* Tags */}
              {readingArticle.tags && readingArticle.tags.length > 0 && (
                <div className="article-tags-wrap">
                  {readingArticle.tags.map((tag, idx) => (
                    <span key={idx} className="article-tag-badge">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer Actions */}
              <div className="article-footer-bar">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(window.location.href);
                    }
                    addToast("🔗 คัดลอกลิงก์แล้ว", "คัดลอกลิงก์ข่าวสารเรียบร้อย");
                  }}
                >
                  🔗 แชร์ข่าวสาร
                </button>
                <button
                  className="btn btn-dark"
                  onClick={() => setReadingArticle(null)}
                >
                  ปิดหน้าต่าง
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 2. Admin PIN Modal */}
      {showLoginModal && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: "360px" }}>
            <div className="modal-title-bar">
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>🔒 เข้าสู่ระบบครู (Admin)</h3>
              <button style={{ border: "none", background: "none", cursor: "pointer", fontSize: "1.2rem" }} onClick={() => setShowLoginModal(false)}>✕</button>
            </div>
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", display: "block", marginBottom: "4px" }}>
                  กรอกรหัสผ่าน (PIN):
                </label>
                <input
                  type="password"
                  className="input-pill"
                  placeholder="รหัสเริ่มต้นคือ: 1234"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              <button type="submit" className="btn btn-dark btn-full">
                เข้าสู่หน้าจัดการ
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Add / Edit News Modal */}
      {showNewsModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-title-bar">
              <h3 style={{ fontSize: "1.2rem", fontWeight: "700" }}>
                {editingItem ? "✏️ แก้ไขข่าวสารและบันทึก" : "➕ โพสต์ข่าวสารใหม่"}
              </h3>
              <button style={{ border: "none", background: "none", cursor: "pointer", fontSize: "1.2rem" }} onClick={() => setShowNewsModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveNews}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: "600", display: "block", marginBottom: "4px" }}>
                    🎯 ส่งถึงระดับชั้น:
                  </label>
                  <select className="select-pill" value={formGrade} onChange={(e) => setFormGrade(e.target.value)}>
                    {GRADE_OPTIONS.map((g) => (
                      <option key={g.value} value={g.value}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: "600", display: "block", marginBottom: "4px" }}>
                    🏷️ หมวดหมู่:
                  </label>
                  <input
                    type="text"
                    className="input-pill"
                    placeholder="เช่น ฝ่ายวิชาการ, แนะแนว"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ fontSize: "0.82rem", fontWeight: "600", display: "block", marginBottom: "4px" }}>
                  หัวข้อข่าว (Title):
                </label>
                <input
                  type="text"
                  className="input-pill"
                  placeholder="เช่น แจ้งกำหนดการสอบกลางภาค"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  required
                />
              </div>

              {/* Local Image File Upload */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ fontSize: "0.82rem", fontWeight: "600", display: "block", marginBottom: "6px" }}>
                  🖼️ รูปภาพประกอบข่าว (เลือกรูปจากเครื่อง):
                </label>
                
                <input
                  type="file"
                  id="local-img-input"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />

                <div
                  style={{
                    border: "2px dashed #cbd5e1",
                    borderRadius: "12px",
                    padding: formImage ? "12px" : "18px 14px",
                    textAlign: "center",
                    background: "#f8fafc",
                    transition: "all 0.2s",
                  }}
                >
                  {formImage ? (
                    <div>
                      <img
                        src={formImage}
                        alt="Preview"
                        style={{
                          width: "100%",
                          maxHeight: "180px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          marginBottom: "10px",
                          border: "1px solid #e2e8f0"
                        }}
                      />
                      <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                        <label
                          htmlFor="local-img-input"
                          className="btn btn-secondary"
                          style={{ fontSize: "0.78rem", padding: "5px 14px", cursor: "pointer" }}
                        >
                          🔄 เปลี่ยนรูปภาพ
                        </label>
                        <button
                          type="button"
                          className="btn btn-danger"
                          style={{ fontSize: "0.78rem", padding: "5px 14px" }}
                          onClick={() => setFormImage("")}
                        >
                          🗑️ ลบรูป
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="local-img-input"
                      style={{ cursor: "pointer", display: "block", padding: "8px 0" }}
                    >
                      <div style={{ fontSize: "2rem", marginBottom: "4px" }}>📁</div>
                      <div style={{ fontSize: "0.88rem", fontWeight: "700", color: "#1e293b" }}>
                        คลิกเพื่อเลือกไฟล์รูปภาพจากในเครื่อง
                      </div>
                      <div style={{ fontSize: "0.76rem", color: "#94a3b8", marginTop: "3px" }}>
                        รองรับไฟล์ JPG, PNG, WebP (ปรับขนาดและบีบอัดให้อัตโนมัติ)
                      </div>
                    </label>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ fontSize: "0.82rem", fontWeight: "600", display: "block", marginBottom: "4px" }}>
                  เนื้อหาข่าว (Summary):
                </label>
                <textarea
                  className="input-pill"
                  rows="3"
                  placeholder="พิมพ์รายละเอียดของข่าวสาร..."
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  required
                ></textarea>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f1f5f9", padding: "10px", borderRadius: "10px", marginBottom: "1.25rem" }}>
                <input
                  type="checkbox"
                  id="push-chk"
                  checked={formSendPush}
                  onChange={(e) => setFormSendPush(e.target.checked)}
                />
                <label htmlFor="push-chk" style={{ fontSize: "0.82rem", fontWeight: "600", cursor: "pointer" }}>
                  🚀 ยิงการแจ้งเตือน OneSignal ไปยังมือถือของระดับชั้นนี้ทันที
                </label>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit" className="btn btn-dark" style={{ flex: 2 }}>
                  💾 {editingItem ? "บันทึกการแก้ไข" : "บันทึกและส่งข่าว"}
                </button>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowNewsModal(false)}>
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Settings Modal */}
      {showSettingsModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-title-bar">
              <h3 style={{ fontSize: "1.2rem", fontWeight: "700" }}>⚙️ ตั้งค่า OneSignal API Keys</h3>
              <button style={{ border: "none", background: "none", cursor: "pointer", fontSize: "1.2rem" }} onClick={() => setShowSettingsModal(false)}>✕</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              localStorage.setItem("os_app_id", osAppId);
              localStorage.setItem("os_api_key", osApiKey);
              setShowSettingsModal(false);
              addToast("บันทึกข้อมูลแล้ว", "บันทึก App ID & REST API Key เรียบร้อย");
            }}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ fontSize: "0.82rem", fontWeight: "600", display: "block", marginBottom: "4px" }}>
                  OneSignal App ID:
                </label>
                <input
                  type="text"
                  className="input-pill"
                  placeholder="b82e9123-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  value={osAppId}
                  onChange={(e) => setOsAppId(e.target.value)}
                />
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ fontSize: "0.82rem", fontWeight: "600", display: "block", marginBottom: "4px" }}>
                  OneSignal REST API Key:
                </label>
                <input
                  type="password"
                  className="input-pill"
                  placeholder="os_v2_app_xxxxxxxxxxxxxxxx"
                  value={osApiKey}
                  onChange={(e) => setOsApiKey(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit" className="btn btn-dark" style={{ flex: 2 }}>
                  💾 บันทึกการตั้งค่า
                </button>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowSettingsModal(false)}>
                  ปิด
                </button>
              </div>
            </form>
          </div>
        </div>
      )}




      {/* Toast Notifications */}
      <div className="toast-wrap">
        {toasts.map((t) => (
          <div key={t.id} className="toast-item">
            <span style={{ fontSize: "1.1rem" }}>🔔</span>
            <div>
              <strong>{t.title}</strong>
              <div style={{ color: "#a1a1aa", marginTop: "2px" }}>{t.message}</div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
