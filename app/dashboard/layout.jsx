import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-dvh flex ">
      <Sidebar />
      <div className="grow md:ml-60 p-2 md:p-6">{children}</div>
    </div>
  );
}
