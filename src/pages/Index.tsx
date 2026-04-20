import { useState } from "react";
import Login from "@/pages/Login";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Journal from "@/pages/Journal";
import Diary from "@/pages/Diary";
import Schedule from "@/pages/Schedule";
import Notifications from "@/pages/Notifications";

type Role = "teacher" | "student" | "parent";

export default function Index() {
  const [user, setUser] = useState<{ role: Role; name: string } | null>(null);
  const [activePage, setActivePage] = useState("dashboard");

  if (!user) {
    return <Login onLogin={(role, name) => setUser({ role, name })} />;
  }

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <Dashboard />;
      case "journal": return <Journal role={user.role} />;
      case "diary": return <Diary />;
      case "schedule": return <Schedule />;
      case "notifications": return <Notifications />;
      default: return <Dashboard />;
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
