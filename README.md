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

### 6. ภาพรวมการทำงานแบบ Real‑time

1. ผู้ใช้เปิด `/patient` และ `/staff` (เช่น บน 2 หน้าต่างหรือ 2 หน้าจอ)  
2. ทั้งสองหน้าเชื่อมต่อ WebSocket ผ่าน hook `useSocket`  
3. **ฝั่ง Patient (`/patient`)**
   - ทุกครั้งที่มีการเปลี่ยนค่าในฟอร์ม `useEffect` จะส่ง event:
     - `update-patient-data` พร้อมข้อมูลฟอร์มล่าสุด และสถานะ `filling`
   - มี inactivity timer 30 วินาที:
     - ถ้าไม่มีการเปลี่ยนข้อมูลเลย จะส่ง `update-patient-data` พร้อมสถานะ `inactive`
   - ตอนกด submit:
     - ส่ง `update-patient-data` พร้อมสถานะ `submitted`
4. **ฝั่ง Server (`server.js`)**
   - รอรับ event `update-patient-data`
   - broadcast ต่อไปยังทุก client เป็น event `receive-patient-data`
5. **ฝั่ง Staff (`/staff`)**
   - listen event `receive-patient-data`
   - อัปเดต state ภายใน ทำให้ UI แสดงข้อมูลและสถานะล่าสุดทันที

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
