# Red Hat Partner Learning Platform

เว็บแอปพลิเคชันสำหรับอบรมความรู้ผลิตภัณฑ์ Red Hat แก่พาร์ตเนอร์ (ทีมขายและ Pre-Sales) รองรับการเรียนรู้ผ่านบทเรียน แบบทดสอบวัดระดับ และกรณีศึกษาเชิงตอบโต้

---

## คุณสมบัติหลัก (Key Features)

- **Interactive Modules:** บทเรียน RHEL และ OpenShift พร้อมระบบบันทึกความคืบหน้าแบบออฟไลน์
- **State Persistence:** บันทึกสถานะการเรียนและแบบทดสอบลงใน `localStorage` รองรับการทำงานแบบข้ามแท็บ (Cross-tab Sync)
- **Accessible UI:** ผ่านมาตรฐาน WCAG ARIA เบื้องต้น รองรับการสั่งงานด้วยคีย์บอร์ด และแสดงผลกล่องโต้ตอบการยืนยันพร้อมระบบ Focus Trap
- **Resilient Framework:** ป้องกันการขัดข้องทางเทคนิคด้วย Error Boundaries และควบคุมทิศทางอย่างอิสระผ่าน Client-side Routing ด้วย React Router

---

## ขั้นตอนการติดตั้งและรันโปรเจกต์ (Installation & Execution)

### ความต้องการของระบบ (Prerequisites)
- [Node.js](https://nodejs.org/) (แนะนำเวอร์ชัน 18 ขึ้นไป)
- npm (มาพร้อมการติดตั้ง Node.js)

### 1. ติดตั้ง dependencies
ดาวน์โหลดไลบรารีที่จำเป็นทั้งหมดที่กำหนดไว้ในโปรเจกต์:
```bash
npm install --legacy-peer-deps
```

### 2. รันแอปพลิเคชันในโหมดพัฒนา (Development Mode)
เริ่มต้นเซิร์ฟเวอร์สำหรับทดสอบในเครื่องคอมพิวเตอร์ของคุณ:
```bash
npm run dev
```
หลังรันสำเร็จ ตัวเว็บแอปพลิเคชันจะเปิดขึ้นโดยอัตโนมัติที่ลิงก์ [http://localhost:5173/](http://localhost:5173/) (หรือระบุที่ Terminal)

### 3. รันการทดสอบระบบ (Running Tests)
เรียกใช้ชุดการทดสอบ unit tests สำหรับการคำนวณและ hooks ทั้งหมด:
```bash
npm run test
```

### 4. สร้างไฟล์สำหรับจำหน่ายจริง (Production Build)
บีบอัดและสร้างไฟล์ชุดเว็บสำหรับนำไปใช้บนโฮสต์จำหน่ายจริง:
```bash
npm run build
```
ผลลัพธ์จะถูกจัดเก็บไว้ในโฟลเดอร์ `dist/` ซึ่งคุณสามารถนำไปวางในบริการคลาวด์ เช่น Vercel หรือ Netlify
