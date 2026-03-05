# CLAUDE.md

---

## 🚀 Startup Sequence

> ทำทุก session ห้ามข้าม

1. อ่าน `.claude/sw/RULE.md` — โหลดกฎความปลอดภัย (ถ้าไม่มีให้รัน `sw-init` ก่อน)
2. อ่าน `.claude/sw/SYSTEM.md` — โหลดตัวตนและบุคลิกภาพ
3. เริ่มสนทนา

---

## 🗺️ Routing Table

> อ่านเฉพาะไฟล์ที่เกี่ยวข้องกับงานนั้นๆ เท่านั้น

| เมื่อเกี่ยวกับเรื่อง                    | ให้ไปอ่าน                       |
| --------------------------------------- | ------------------------------- |
| จำ / บันทึก / ความทรงจำ                 | `.claude/sw/MEMORY.md`                     |
| deploy / release / publish / versioning | `.claude/sw/DEPLOY.md`                     |
| install / package / dependency          | `.claude/sw/PACKAGES.md`                   |
| แก้ไข / สร้าง / ลบไฟล์ใดๆ               | `CHANGELOG.md` (บันทึกทุกครั้ง)            |
| ข้อมูลโปรเจกต์ / about / สรุปโปรเจกต์   | `.claude/sw/PROJECT.md`                    |

---

## ⚡ Special Commands

| คำสั่ง               | การทำงาน                                             |
| -------------------- | ---------------------------------------------------- |
| `sw-status`          | แสดง dashboard สถานะโปรเจกต์ (อ่านทุกไฟล์แล้วสรุป)        |
| `sw-deploy`          | อ่านและทำตาม `.claude/sw/DEPLOY.md` ทีละขั้น            |

---

## 📊 Status Format

> ใช้เมื่อได้รับคำสั่ง `status`

📊 Project Status

📌 Version : [จาก package.json หรือ CHANGELOG.md]
👤 System : [ชื่อและบทบาทจาก .claude/sw/SYSTEM.md]
📦 Packages : [X] packages ([X] dep, [X] devDep) — .claude/sw/PACKAGES.md
🧠 Memory : [X] รายการ — อัปเดตล่าสุด [วันที่] — .claude/sw/MEMORY.md
📋 Changelog : อัปเดตล่าสุด [วันที่] — "[entry ล่าสุด]" — CHANGELOG.md
🔒 Rules : โหลดแล้ว — .claude/sw/RULE.md

⚠️ [แสดงเฉพาะเมื่อมีไฟล์ที่ไม่พบ]

---

## 💻 Coding Standard
> ใช้กับทุก function / method / class ที่สร้างหรือแก้ไข

- Comment อธิบาย flow **ภาษาไทย** เสมอ
- Comment หัว function — อธิบายว่าทำอะไร รับอะไร คืนอะไร
- Comment ใน logic ซับซ้อน — อธิบาย step สำคัญ
- แก้ไข code เดิม — ใส่ `# แก้ไข: [เหตุผล]`

---

## 🌐 ภาษาหลัก
- ตอบเป็น **ภาษาไทย** เสมอ ยกเว้น user ขอเป็นภาษาอื่น
- ชื่อเทคนิค / library / function — คงไว้เป็นภาษาอังกฤษ

---

## 🔖 กฎสำคัญ
- ถ้าไม่มีไฟล์ใดๆ เลย → แจ้ง user ให้รัน `sw-init` ก่อน
- ห้ามโหลดไฟล์ที่ไม่เกี่ยวข้องกับงาน (lazy load เท่านั้น)
- `.claude/sw/RULE.md` ต้องโหลดทุก session ยกเว้นไม่ได้
