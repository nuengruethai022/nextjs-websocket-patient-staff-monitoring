"use client";
import { useEffect, useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import { PatientData } from "@/lib/validation";

export default function StaffPage() {
  const socket = useSocket();
  const [data, setData] = useState<Partial<PatientData>>({});
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (socket) {
      setIsOnline(true);

      // รับข้อมูล Real-time ขณะพิมพ์ หรือ เมื่อกด Submit
      socket.on("receive-patient-data", (incomingData: PatientData) => {
        setData(incomingData);
      });

      return () => {
        socket.off("receive-patient-data");
      };
    }
  }, [socket]);

  // ฟังก์ชันช่วยเลือกสีของ Status Badge
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "submitted": return "bg-green-100 text-green-800 border-green-200";
      case "filling": return "bg-blue-100 text-blue-800 border-blue-200 animate-pulse";
      case "inactive": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800">Staff Monitoring System</h1>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-sm font-medium text-slate-500">{isOnline ? 'System Online' : 'Offline'}</span>
          </div>
        </div>

        {/* Status Banner */}
        {data.status && (
          <div className={`mb-6 p-4 rounded-lg border flex items-center justify-between ${getStatusStyle(data.status)}`}>
            <span className="font-bold uppercase tracking-wider text-sm">
              Patient Status:{" "}
              {data.status === "filling" && "Currently Filling..."}
              {data.status === "submitted" && "Information Submitted"}
              {data.status === "inactive" && "Inactive / No Activity"}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card: Personal Info */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-blue-600 mb-4 border-b pb-2">Personal Details</h2>
            <div className="space-y-3">
              <DetailRow label="Full Name" value={`${data.firstName || ''} ${data.middleName || ''} ${data.lastName || ''}`} />
              <DetailRow label="Date of Birth" value={data.dob} />
              <DetailRow label="Gender" value={data.gender} />
              <DetailRow label="Nationality" value={data.nationality} />
            </div>
          </div>

          {/* Card: Contact Info */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-blue-600 mb-4 border-b pb-2">Contact & Emergency</h2>
            <div className="space-y-3">
              <DetailRow label="Phone Number" value={data.phoneNumber} />
              <DetailRow label="Email" value={data.email} />
              <DetailRow label="Emergency Contact" value={data.emergencyContactName} />
              <DetailRow label="Relationship" value={data.emergencyContactRelation} />
            </div>
          </div>

          {/* Card: Address */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 md:col-span-2">
            <h2 className="text-lg font-bold text-blue-600 mb-4 border-b pb-2">Address & Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailRow label="Full Address" value={data.address} />
              <DetailRow label="Language" value={data.preferredLanguage} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// UI Component ย่อยสำหรับแสดงผลแถวข้อมูล
function DetailRow({ label, value }: { label: string, value?: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase">{label}</p>
      <p className="text-slate-700 font-medium">{value || "-"}</p>
    </div>
  );
}