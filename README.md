## Agnos Candidate Assignment – Frontend

โปรเจกต์ตัวอย่างสำหรับการสมัครงาน ใช้สร้างฟอร์มกรอกข้อมูลคนไข้ และหน้าจอสำหรับเจ้าหน้าที่เพื่อดูข้อมูลแบบ **Real‑time** ด้วย **Next.js**, **TailwindCSS**, **Socket.io**, **React Hook Form** และ **Zod**.

---

### 🔗 Live Demo

- **Live URL**: https://nextjs-websocket-patient-staff-monitoring.onrender.com  
- **หมายเหตุ**: ถ้าไม่ได้ใช้งานมาสักพัก การเปิดครั้งแรกอาจโหลดช้า (cold start ของ Render)
  - แนะนำให้รอประมาณ 20–60 วินาที แล้วค่อย refresh หน้าอีกครั้ง

**วิธีที่แนะนำสำหรับการรีวิว**

1. เปิด `/patient` และ `/staff` พร้อมกัน (เช่น 2 แท็บ หรือ 2 หน้าต่าง)
2. กรอกฟอร์มที่หน้า `/patient`
3. สังเกตว่าข้อมูลและสถานะของคนไข้บนหน้า `/staff` จะเปลี่ยนแบบ **Real‑time**

---

### 1. วิธีรันโปรเจกต์บนเครื่องตัวเอง

1. ติดตั้ง dependencies

```bash
npm install
```

2. รัน development server

```bash
npm run dev
```

3. เปิดเบราว์เซอร์ไปที่ `http://localhost:3000`

> โปรเจกต์นี้ใช้ `server.js` เป็น custom server (Next.js + Socket.io) แทนการรัน `next dev` ตรงๆ

---

### 2. หน้าต่างๆ ในระบบ (Routes)

- **Home (`/`)**
  - หน้า landing สั้นๆ อธิบายโจทย์ และมีปุ่มลิงก์ไปยังหน้า `/patient` และ `/staff`

- **Patient Form (`/patient`)**
  - ฟอร์มให้คนไข้กรอกข้อมูลส่วนตัว / การติดต่อ / รายละเอียดเพิ่มเติม
  - ใช้ `react-hook-form` ร่วมกับ `zod` สำหรับจัดการฟอร์มและ validation
  - ระหว่างที่พิมพ์จะส่งข้อมูลขึ้น server แบบ **Real‑time** ผ่าน Socket.io
  - เมื่อกด submit จะส่งสถานะ `submitted` ไปให้ฝั่งเจ้าหน้าที่

- **Staff View (`/staff`)**
  - Dashboard สำหรับเจ้าหน้าที่ ใช้ดูข้อมูลคนไข้ที่กรอกแบบ Real‑time
  - แสดงสถานะของคนไข้เป็น badge:
    - **filling** – กำลังกรอกฟอร์มอยู่
    - **submitted** – ส่งฟอร์มเรียบร้อย
    - **inactive** – ไม่ได้มีการเปลี่ยนข้อมูลเป็นเวลาหนึ่งช่วง
  - มี indicator แสดงสถานะการเชื่อมต่อ WebSocket (online / offline)

---

### 3. ฟิลด์ต่างๆ ในฟอร์ม และกติกา Validation

- **ฟิลด์ใน Patient Form**
  - First Name, Middle Name (optional), Last Name  
  - Date of Birth, Gender  
  - Phone Number, Email  
  - Address  
  - Preferred Language, Nationality  
  - Emergency Contact name + relationship (optional)  
  - Religion (optional)

- **Validation (ใช้ `zod`)**
  - ช่องที่บังคับต้องกรอก:
    - first name, last name  
    - date of birth, gender  
    - phone number, email  
    - address  
    - preferred language, nationality
  - Phone:
    - ต้องเป็นตัวเลขล้วน และยาวอย่างน้อย 10 หลัก
  - Email:
    - ต้องอยู่ในรูปแบบอีเมลที่ถูกต้อง

---

### 4. เทคโนโลยีที่ใช้ (Tech stack)

- **Framework**: Next.js (App Router)
- **Styling**: TailwindCSS v4 (ผ่าน `app/globals.css` ที่ใช้ `@import "tailwindcss"`)
- **Real‑time**: Socket.io (ทั้งฝั่ง client และ server)
- **Forms & Validation**: React Hook Form + Zod

---

### 5. ไฟล์สำคัญในโปรเจกต์

- `app/page.tsx` – หน้า Landing และปุ่มนำทางไปหน้าอื่น  
- `app/patient/page.tsx` – UI ฟอร์มคนไข้ + logic ส่งข้อมูลแบบ Real‑time  
- `app/staff/page.tsx` – UI สำหรับเจ้าหน้าที่ + logic รับข้อมูลแบบ Real‑time  
- `app/layout.tsx` – Root layout, ตั้งค่า font และ import `globals.css`  
- `app/globals.css` – ตั้งค่า Tailwind และธีมสีพื้นฐาน  
- `hooks/useSocket.ts` – React hook สำหรับเชื่อมต่อ Socket.io client  
- `lib/validation.ts` – กำหนด Zod schema และ type `PatientData`  
- `server.js` – Custom Node server ที่ครอบ Next.js และเชื่อม Socket.io

---

### 6. กลไกการทำงานของระบบ Real‑time (Real‑time Logic Flow)

ระบบใช้แนวคิด **Event‑Driven** ผ่าน WebSocket ทำให้ข้อมูลระหว่างคนไข้และเจ้าหน้าที่อัปเดตตรงกันตลอดเวลาโดยไม่ต้องกด Refresh:

**การเชื่อมต่อ (Establishing Connection)**

1. เมื่อเปิดหน้า `/patient` และ `/staff` ระบบจะเรียกใช้ hook `useSocket`
2. ทั้งสองหน้าจะเชื่อมต่อไปยัง Socket server เดียวกัน เพื่อเตรียมรับ–ส่ง event แบบ Real‑time

**วงจรชีวิตของสถานะคนไข้ (Patient State Lifecycle)**

- 🔵 **Filling (กำลังกรอก)**  
  - ทุกครั้งที่มีการพิมพ์/เปลี่ยนค่าฟอร์ม (ตรวจจับผ่าน `watch`)  
  - ระบบจะส่ง event `update-patient-data` พร้อมข้อมูลล่าสุด และสถานะ `filling` ไปที่หน้า Staff ทันที

- 🟡 **Inactive (ขาดการเคลื่อนไหว)**  
  - หากไม่มีการเปลี่ยนข้อมูลในฟอร์มเกิน 30 วินาที  
  - timer จะส่ง event `update-patient-data` พร้อมสถานะ `inactive` เพื่อแจ้งว่าไม่มี activity จากฝั่งคนไข้

- 🟢 **Submitted (ส่งข้อมูลแล้ว)**  
  - เมื่อกดปุ่ม Submit ระบบจะส่ง event `update-patient-data` พร้อมข้อมูลฟอร์มสุดท้าย และสถานะ `submitted`  
  - ยืนยันกับเจ้าหน้าที่ว่าคนไข้กรอกข้อมูลและส่งเสร็จสมบูรณ์แล้ว

**การจัดการเมื่อมีการแก้ไข (Edit Tracking)**  

- หากคนไข้กลับมาแก้ไขข้อมูลหลังจากส่งไปแล้ว (เช่น ผ่านปุ่ม “Need to edit?”)  
  - ระบบจะรีเซ็ตสถานะกลับมาเป็น `filling` ทันที  
  - ทำให้ฝั่งเจ้าหน้าที่เห็นว่าข้อมูลกำลังถูกแก้ไขอยู่ในขณะนั้น

**การสื่อสารผ่าน Server (`server.js`)**

- Server ทำหน้าที่เป็นตัวกลาง (Broadcaster)  
- รับ event `update-patient-data` จากฝั่ง `/patient`  
- กระจาย (broadcast) event เดิมนี้ต่อไปยัง client ทุกตัวที่เชื่อมต่ออยู่ (เช่น ทุกแท็บของ `/staff`) เป็น event `receive-patient-data`  
- ฝั่ง `/staff` จะ listen event `receive-patient-data` และนำ payload ที่ได้รับไปอัปเดต state ทำให้ UI เปลี่ยนตามสถานะล่าสุดแบบ Real‑time

---

### 7. Deployment บน Render (สรุป)

- **Environment**: Node 18+  
- **Build command**: `npm install && npm run build`  
- **Start command**: `npm start` (สั่งรัน `NODE_ENV=production node server.js`)

ขั้นตอนการ deploy โดยย่อ:

1. Push โปรเจกต์นี้ขึ้น GitHub  
2. เข้าเว็บไซต์ [Render](https://render.com) แล้วสร้าง **Web Service** ใหม่จาก GitHub repo นี้  
3. เลือกประเภท Environment เป็น Node  
4. ตั้งค่า:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. กด **Create Web Service** แล้วรอให้ Render build + deploy ให้เสร็จ  
6. นำ URL ที่ได้จาก Render ไปใช้เป็น Live URL สำหรับการส่งงาน
