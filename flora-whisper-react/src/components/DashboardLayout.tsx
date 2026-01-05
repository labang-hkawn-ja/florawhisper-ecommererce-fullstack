import { useState } from "react";
import { FaBars } from "react-icons/fa";
import DashboardSidebar from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-emerald-50">
      {/* Mobile Header - Always visible */}
      <header className="lg:hidden bg-white border-b border-emerald-200 p-4 sticky top-0 z-30">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-700"
        >
          <FaBars className="text-lg" />
        </button>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for Desktop */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <div className="w-64 h-full overflow-y-auto">
            <DashboardSidebar />
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 z-50 w-64">
              <DashboardSidebar />
            </div>
          </div>
        )}

        {/* Main Content - Always visible and properly sized */}
        <main className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
