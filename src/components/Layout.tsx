import { useState } from "react";
import Icon from "@/components/ui/icon";

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Главная", icon: "LayoutDashboard" },
  { id: "journal", label: "Журнал", icon: "BookOpen" },
  { id: "diary", label: "Дневник", icon: "NotebookPen" },
  { id: "schedule", label: "Расписание", icon: "CalendarDays" },
  { id: "notifications", label: "Уведомления", icon: "Bell" },
];

const roleColors: Record<string, string> = {
  teacher: "gradient-blue",
  student: "gradient-green",
  parent: "gradient-orange",
};

export default function Layout({ children, activePage, onNavigate }: LayoutProps) {
  const [role] = useState<"teacher" | "student" | "parent">("teacher");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const roleLabels = { teacher: "Учитель", student: "Ученик", parent: "Родитель" };

  return (
    <div className="min-h-screen gradient-bg flex">
      {/* Sidebar overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 glass z-30 flex flex-col transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Logo */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 gradient-blue rounded-2xl flex items-center justify-center shadow-glow-blue">
              <Icon name="GraduationCap" size={22} className="text-white" />
            </div>
            <div>
              <div className="font-montserrat font-bold text-lg text-foreground leading-tight">ЭлЖур</div>
              <div className="text-xs text-muted-foreground">Электронный журнал</div>
            </div>
          </div>

          {/* User card */}
          <div className="gradient-blue rounded-2xl p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                АИ
              </div>
              <div>
                <div className="font-semibold text-sm">Алексей Иванов</div>
                <div className="text-xs text-white/70">{roleLabels[role]}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all duration-200 font-medium text-sm
                ${activePage === item.id
                  ? "gradient-blue text-white shadow-card-hover"
                  : "text-muted-foreground hover:bg-white/60 hover:text-foreground"
                }`}
            >
              <Icon name={item.icon} size={18} />
              {item.label}
              {item.id === "notifications" && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center notification-badge">
                  3
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-border/50">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-muted-foreground hover:bg-white/60 transition-all text-sm font-medium">
            <Icon name="Settings" size={18} />
            Настройки
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen lg:pl-0">
        {/* Top bar */}
        <header className="glass sticky top-0 z-10 px-6 py-4 flex items-center justify-between border-b border-border/40">
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-white/60 transition-all"
            onClick={() => setSidebarOpen(true)}
          >
            <Icon name="Menu" size={20} />
          </button>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block text-sm text-muted-foreground">
              Сегодня,{" "}
              <span className="font-medium text-foreground">
                {new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl hover:bg-white/60 transition-all">
              <Icon name="Bell" size={20} className="text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full notification-badge" />
            </button>
            <div className="w-9 h-9 gradient-blue rounded-full flex items-center justify-center text-white text-sm font-bold">
              АИ
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}