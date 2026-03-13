"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { patientSchema, PatientData } from "@/lib/validation";
import { useSocket } from "@/hooks/useSocket";
import { useEffect, useRef, useState } from "react";

export default function PatientPage() {
  const socket = useSocket();
  const [isSubmitted, setIsSubmitted] = useState(false); 
  const { 
    register, 
    watch, 
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting } 
  } = useForm<PatientData>({
    resolver: zodResolver(patientSchema),
    defaultValues: { 
      status: "filling",
      gender: "male", 
      preferredLanguage: "Thai",
      nationality: "Thai"
    }
  });

  const allFields = watch();
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Real-time Sync Logic
  useEffect(() => {
    if (!socket || isSubmitted) return; // ถ้าส่งแล้ว หยุดส่ง sync ชั่วคราว

    // อัปเดตสถานะเป็น filling ระหว่างพิมพ์
    socket.emit("update-patient-data", { ...allFields, status: "filling" });

    // Inactivity Detection (30 วินาที)
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(() => {
      socket.emit("update-patient-data", { ...allFields, status: "inactive" });
    }, 30000);

    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [allFields, socket, isSubmitted]);

  const onSubmit = (data: PatientData) => {
    if (socket) {
      socket.emit("update-patient-data", { ...data, status: "submitted" });
      setIsSubmitted(true); // เปลี่ยนไปแสดงหน้า Success
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    }
  };

  // ฟังก์ชันกรณีคนไข้อยากกลับมาแก้ไข
  const handleEdit = () => {
    setIsSubmitted(false);
    // แจ้ง Staff ทันทีว่ากลับมาแก้แล้ว
    socket?.emit("update-patient-data", { ...allFields, status: "filling" });
  };

  // --- UI หน้า Success หลังจากส่งข้อมูล ---
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Submission Successful!</h2>
          <p className="text-gray-600">Your information has been sent to our staff. Please wait for further instructions.</p>
          <button 
            onClick={handleEdit}
            className="text-blue-600 hover:text-blue-700 font-medium underline transition-colors"
          >
            Need to edit something?
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 p-6">
          <h1 className="text-2xl font-bold text-white text-center">Patient Information Form</h1>
          <p className="text-blue-100 text-center text-sm mt-1">Please fill in your details accurately</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          
          {/* Section 1: Personal Details */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2 text-gray-700">Personal Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">First Name <span className="text-red-500">*</span></label>
                <input {...register("firstName")} className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-black placeholder:text-gray-400" />
                {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">Middle Name (Optional)</label>
                <input {...register("middleName")} className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-black placeholder:text-gray-400"/>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">Last Name <span className="text-red-500">*</span></label>
                <input {...register("lastName")} className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-black placeholder:text-gray-400" />
                {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input 
                  type="date" 
                  {...register("dob")} 
                  className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-black placeholder:text-gray-400"
                />
                {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">Gender </label>
                <select {...register("gender")} className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-black placeholder:text-gray-400">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Contact Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2 text-gray-700">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">Phone Number <span className="text-red-500">*</span></label>
                <input {...register("phoneNumber")} placeholder="08xxxxxxxx" className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-black placeholder:text-gray-400" />
                {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">Email <span className="text-red-500">*</span></label>
                <input {...register("email")} placeholder="example@mail.com" className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-black placeholder:text-gray-400" />
                {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Address <span className="text-red-500">*</span></label>
              <textarea {...register("address")} rows={3} className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-black placeholder:text-gray-400"></textarea>
              {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
            </div>
          </div>

          {/* Section 3: Additional Details */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2 text-gray-700">Additional Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">Preferred Language</label>
                <input {...register("preferredLanguage")} className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-black placeholder:text-gray-400"/>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">Nationality</label>
                <input {...register("nationality")} className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-black placeholder:text-gray-400" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">Emergency Contact Name</label>
                <input {...register("emergencyContactName")} className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-black placeholder:text-gray-400" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">Emergency Relationship</label>
                <input {...register("emergencyContactRelation")} className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-black placeholder:text-gray-400" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Religion (Optional)</label>
              <input {...register("religion")} className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-black placeholder:text-gray-400"  />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg mt-6 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending..." : "Submit Information"}
          </button>
        </form>
      </div>
    </div>
  );
}