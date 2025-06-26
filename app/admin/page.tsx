// page.tsx

"use client"; 

import React, { useState } from "react";
import Sidebar from "../admin/components/shared/sidebar";
import Topbar from "../admin/components/shared/topbar";
import clsx from "clsx";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={clsx(
          "fixed z-40 md:static transition-transform",
          showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <Sidebar onToggleSidebar={() => setShowSidebar((prev) => !prev)} />
      </div>

      {/* Nội dung chính */}
      <div className="flex-1 min-h-screen flex flex-col">
        <Topbar onToggleSidebar={() => setShowSidebar((prev) => !prev)} />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
