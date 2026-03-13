## Agnos Candidate Assignment – Frontend

Real‑time patient form + staff monitoring dashboard built with **Next.js**, **TailwindCSS**, **Socket.io**, **React Hook Form**, and **Zod**.

---

### 1. How to run locally

- **Install dependencies**

```bash
npm install
```

- **Start dev server**

```bash
npm run dev
```

แล้วเปิด `http://localhost:3000` ใน browser  

> Dev server ใช้ `server.js` (Next.js + Socket.io) แทน `next dev`

---

### 2. Screens / Routes

- **Home (`/`)**
  - หน้า landing สั้นๆ อธิบาย assignment และลิงก์ไป `/patient` และ `/staff`

- **Patient Form (`/patient`)**
  - ฟอร์มสำหรับคนไข้ กรอกข้อมูลพื้นฐาน + ข้อมูลติดต่อ + รายละเอียดอื่นๆ
  - ใช้ `react-hook-form` + `zod` สำหรับ validate
  - ระหว่างพิมพ์จะส่งข้อมูลขึ้น server แบบ real‑time ผ่าน Socket.io
  - เมื่อ submit จะอัปเดตสถานะเป็น `submitted`

- **Staff View (`/staff`)**
  - Dashboard สำหรับเจ้าหน้าที่ดูข้อมูลคนไข้แบบ real‑time
  - แสดง status: **filling**, **submitted**, **inactive**
  - โชว์สถานะการเชื่อมต่อ Socket (online / offline)

---

### 3. Form fields & validation (สรุป)

- **Patient Form – Fields**
  - ชื่อ: First Name, Middle Name (optional), Last Name
  - วันเกิด, เพศ (Gender)
  - หมายเลขโทรศัพท์, อีเมล
  - ที่อยู่
  - Preferred Language, Nationality
  - Emergency Contact name + relationship (optional)
  - Religion (optional)

- **Validation (ใช้ `zod`)**
  - Required:
    - first name, last name
    - date of birth, gender
    - phone number, email
    - address
    - preferred language, nationality
  - Phone:
    - ตัวเลขเท่านั้น และยาวอย่างน้อย 10 หลัก
  - Email:
    - ต้องเป็นรูปแบบ email ที่ถูกต้อง

---

### 4. Tech stack

- **Framework**: Next.js (App Router)
- **Styling**: TailwindCSS v4 (ผ่าน `app/globals.css` – ใช้ `@import "tailwindcss"`)
- **Real‑time**: Socket.io (client + server)
- **Forms & Validation**: React Hook Form + Zod

---

### 5. Important files

- `app/page.tsx` – Landing page + navigation  
- `app/patient/page.tsx` – UI ฟอร์มคนไข้ + logic ส่งข้อมูล real‑time  
- `app/staff/page.tsx` – UI dashboard เจ้าหน้าที่ + logic รับข้อมูล real‑time  
- `app/layout.tsx` – Root layout, global fonts, include `globals.css`  
- `app/globals.css` – Tailwind base + custom theme  
- `hooks/useSocket.ts` – hook สำหรับเชื่อมต่อ Socket.io client  
- `lib/validation.ts` – Zod schema + `PatientData` type  
- `server.js` – Custom Node server (Next.js + Socket.io integration)

---

### 6. Real‑time flow (ย่อ)

1. เปิด `/patient` และ `/staff` (เช่น สองหน้าต่าง / สองจอ)  
2. ทั้งสองหน้าจะเชื่อมต่อ WebSocket ผ่าน `useSocket`  
3. **บนหน้า Patient**
   - ทุกครั้งที่ค่าฟอร์มเปลี่ยน `useEffect` จะ emit event:
     - `update-patient-data` พร้อมค่าฟอร์มล่าสุด + status `filling`
   - มี inactivity timer 30 วินาที:
     - ถ้าไม่มีการเปลี่ยนแปลงเลย จะส่ง `update-patient-data` พร้อม status `inactive`
   - ตอน submit:
     - ส่ง `update-patient-data` พร้อม status `submitted`
4. **บน `server.js`**
   - รับ event `update-patient-data`
   - broadcast ต่อให้ client ทุกตัวเป็น event `receive-patient-data`
5. **บนหน้า Staff**
   - listen event `receive-patient-data`
   - update state ทำให้ UI เปลี่ยนทันที (ข้อมูล + status badge)

---

### 7. Deployment (ตัวอย่าง Render)

- **Environment**: Node 18+  
- **Build command**: `npm install && npm run build`  
- **Start command**: `npm start` (รัน `NODE_ENV=production node server.js`)

ขั้นตอน deploy คร่าวๆ บน Render:

1. Push repo นี้ขึ้น GitHub  
2. ไปที่ [Render](https://render.com) แล้วสร้าง **Web Service** ใหม่จาก repo นี้  
3. เลือก environment: Node  
4. ตั้งค่า:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. กด **Create Web Service** แล้วรอ deploy เสร็จ  
6. เอา URL ที่ Render ให้มาไปใช้เป็น live URL ของ assignment
## Agnos Candidate Assignment – Frontend

Responsive, real‑time patient input form and staff monitoring view built with **Next.js**, **TailwindCSS**, **Socket.io**, **React Hook Form**, and **Zod**.

### 1. Getting started

- **Install dependencies**

```bash
npm install
```

- **Run development server**

```bash
npm run dev
```

Then open `http://localhost:3000` in your browser.

### 2. Application overview

- **Home (`/`)**
  - Landing page explaining the assignment and providing navigation to the two main views.
- **Patient Form (`/patient`)**
  - Responsive form for patients to fill in personal, contact, and additional details.
  - Uses `react-hook-form` + `zod` for validation.
  - Emits real‑time updates via WebSocket while the patient is typing and on submit.
- **Staff View (`/staff`)**
  - Real‑time dashboard for staff to monitor the current patient data.
  - Shows patient status badges: **filling**, **submitted**, and **inactive**.
  - Indicates WebSocket connection status (online / offline).

### 3. Requirements mapping

- **Patient Form**
  - Fields:
    - First Name, Middle Name (optional), Last Name
    - Date of Birth, Gender
    - Phone Number, Email
    - Address
    - Preferred Language, Nationality
    - Emergency Contact (name and relationship – optional)
    - Religion (optional)
  - Validation with `zod`:
    - Required: first name, last name, date of birth, gender, phone number, email, address, preferred language, nationality.
    - Phone number: at least 10 digits and numeric only.
    - Email: must be a valid email format.
- **Staff View**
  - Displays all patient fields in structured cards.
  - Status banner at the top:
    - **filling** – patient is currently filling the form.
    - **submitted** – patient has submitted the form.
    - **inactive** – patient has been idle for a period of time.
- **Real‑Time Synchronization**
  - Implemented with **Socket.io**.
  - Patient page emits `update-patient-data` events.
  - Node server (`server.js`) broadcasts data as `receive-patient-data`.
  - Staff page listens to `receive-patient-data` and updates instantly.
  - Inactivity is detected on the patient side (no changes for 30 seconds) and updates status to `inactive`.

### 4. Tech stack

- **Framework**: Next.js (App Router)
- **Styling**: TailwindCSS v4 (via `app/globals.css`)
- **Real‑time communication**: Socket.io (client + server)
- **Forms & validation**: React Hook Form + Zod

### 5. Project structure (high level)

- `app/page.tsx` – Landing page and navigation.
- `app/patient/page.tsx` – Patient form UI and real‑time emitting logic.
- `app/staff/page.tsx` – Staff monitoring dashboard UI and real‑time receiving logic.
- `app/layout.tsx` – Root layout, fonts, and global styles.
- `app/globals.css` – Tailwind and base styling.
- `hooks/useSocket.ts` – Reusable Socket.io client hook.
- `lib/validation.ts` – Zod schema and `PatientData` type.
- `server.js` – Custom Node server wrapping Next.js with Socket.io integration.

### 6. Real‑time synchronization flow

1. Browser opens `/patient` and `/staff` (typically in two windows).
2. Both pages establish a WebSocket connection using `useSocket`.
3. On the patient page:
   - Every change in the form triggers a `useEffect` that:
     - Emits `update-patient-data` with the current form values and status `filling`.
     - Starts a 30‑second inactivity timer; if there is no new activity, it emits data with status `inactive`.
   - When the form is submitted, it emits `update-patient-data` with status `submitted`.
4. On the server (`server.js`):
   - Listens for `update-patient-data` and broadcasts the payload to all clients as `receive-patient-data`.
5. On the staff page:
   - Listens for `receive-patient-data` and updates local state to reflect the latest patient data and status.

### 7. Deployment

This project is deployed as a free Node web service on Render.

- **Live URL**: https://your-app.onrender.com
- **Environment**: Node 18+
- **Build command**: `npm install && npm run build`
- **Start command**: `npm start` (which runs `NODE_ENV=production node server.js`)

To deploy your own instance on Render:

1. Push this repository to GitHub.
2. Go to [Render](https://render.com) and create a new **Web Service** from this GitHub repo.
3. Choose **Environment: Node**, then set:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Click **Create Web Service** and wait for the deployment to complete.
5. Use the generated Render URL as the public link for this assignment and update the **Live URL** above accordingly.
