import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-[#0a0a0a] via-[#0d0018] to-[#0a000a] p-8">
        {children}
      </main>
    </div>
  );
}
