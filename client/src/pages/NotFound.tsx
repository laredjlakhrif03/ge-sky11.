import { AlertCircle, Home } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();
  return (
    <div dir="rtl" className="flex min-h-screen w-full items-center justify-center bg-[#f6f9fb] px-4">
      <div className="w-full max-w-lg rounded-3xl border border-[#e2eaf0] bg-white p-8 text-center shadow-[0_14px_40px_rgba(30,67,96,.08)]">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#fff0f0] text-[#ff6b6b]"><AlertCircle size={38} /></div>
        <p className="text-sm font-bold uppercase tracking-[.2em] text-[#1b9bc0]">GE_Sky</p>
        <h1 className="mt-3 text-5xl font-bold text-[#102b4a]">404</h1>
        <h2 className="mt-3 text-xl font-bold text-[#193957]">الصفحة غير موجودة</h2>
        <p className="mt-3 leading-7 text-[#718096]">يبدو أن الرابط الذي تبحث عنه غير متاح أو تم نقله.<br />يمكنك العودة إلى مركز القيادة للمتابعة.</p>
        <button onClick={() => setLocation("/")} className="primary-button mt-7"><Home size={16} /> العودة إلى مركز القيادة</button>
      </div>
    </div>
  );
}
