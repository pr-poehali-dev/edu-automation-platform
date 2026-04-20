import { useState } from "react";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Journal from "@/pages/Journal";
import Diary from "@/pages/Diary";
import Schedule from "@/pages/Schedule";
import Notifications from "@/pages/Notifications";

export default function Index() {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <Dashboard />;
      case "journal": return <Journal />;
      case "diary": return <Diary />;
      case "schedule": return <Schedule />;
      case "notifications": return <Notifications />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout activePage={activePage} onNavigate={setActivePage}>
      {renderPage()}
    </Layout>
  );
}
