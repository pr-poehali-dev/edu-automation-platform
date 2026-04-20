import { useState } from "react";
import Login from "@/pages/Login";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Journal from "@/pages/Journal";
import Diary from "@/pages/Diary";
import Schedule from "@/pages/Schedule";
import Notifications from "@/pages/Notifications";
import Analytics from "@/pages/Analytics";
import Planning from "@/pages/Planning";
import ClassManagement from "@/pages/ClassManagement";
import AdminPanel from "@/pages/AdminPanel";
import type { Role } from "@/types/roles";

export default function Index() {
  const [user, setUser] = useState<{ role: Role; name: string } | null>(null);
  const [activePage, setActivePage] = useState("dashboard");

  if (!user) {
    return <Login onLogin={(role, name) => setUser({ role, name })} />;
  }

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":     return <Dashboard />;
      case "admin":         return <AdminPanel />;
      case "journal":       return <Journal role={user.role} studentName={user.role === "student" ? user.name : undefined} />;
      case "diary":         return <Diary role={user.role} />;
      case "schedule":      return <Schedule />;
      case "planning":      return <Planning role={user.role} />;
      case "analytics":     return <Analytics role={user.role} />;
      case "classmgmt":     return <ClassManagement />;
      case "notifications": return <Notifications />;
      default:              return <Dashboard />;
    }
  };

  return (
    <Layout
      activePage={activePage}
      onNavigate={setActivePage}
      role={user.role}
      userName={user.name}
      onLogout={() => { setUser(null); setActivePage("dashboard"); }}
    >
      {renderPage()}
    </Layout>
  );
}
