"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { patientSchema, PatientData } from "@/lib/validation";
import { useSocket } from "@/hooks/useSocket";
import { useEffect, useRef } from "react";

export default function PatientPage() {
  const socket = useSocket();
  const { 
    register, 
    watch, 
    handleSubmit, 
    formState: { errors } 
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

  // Real-time Sync while filling
  useEffect(() => {
    if (!socket) return;

    socket.emit("update-patient-data", { ...allFields, status: "filling" });

    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    inactivityTimerRef.current = setTimeout(() => {
      socket.emit("update-patient-data", { ...allFields, status: "inactive" });
    }, 30000);
  }, [allFields, socket]);

  const onSubmit = (data: PatientData) => {
    console.log("Form Submitted:", data);
    if (socket) {
      socket.emit("update-patient-data", { ...data, status: "submitted" });
    }
    alert("Submitted Successfully!");
  };

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
                <label className="text-sm font-medium text-gray-600">First Name *</label>
                <input {...register("firstName")} className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-black placeholder:text-gray-400" />
                {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">Middle Name (Optional)</label>
                <input {...register("middleName")} className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-black placeholder:text-gray-400"/>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">Last Name *</label>
                <input {...register("lastName")} className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-black placeholder:text-gray-400" />
                {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">Date of Birth *</label>
                <input type="date" {...register("dob")} className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-black placeholder:text-gray-400"/>
                {errors.dob && <p className="text-red-500 text-xs">{errors.dob.message}</p>}
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
                <label className="text-sm font-medium text-gray-600">Phone Number *</label>
                <input {...register("phoneNumber")} placeholder="08xxxxxxxx" className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-black placeholder:text-gray-400" />
                {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">Email *</label>
                <input {...register("email")} placeholder="example@mail.com" className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-black placeholder:text-gray-400" />
                {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Address *</label>
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-md mt-6"
          >
            Submit Information
          </button>
        </form>
      </div>
    </div>
  );
}