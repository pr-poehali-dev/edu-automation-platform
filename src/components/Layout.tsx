import { useState } from "react";
import Icon from "@/components/ui/icon";
import type { Role } from "@/types/roles";

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
  role: Role;
  userName: string;
  onLogout: () => void;
}

type NavItem = { id: string; label: string; icon: string; roles?: Role[] };

const allNavItems: NavItem[] = [
  { id: "dashboard",       label: "Главная",          icon: "LayoutDashboard" },
  { id: "admin",           label: "Панель завуча",     icon: "Shield",           roles: ["admin"] },
  { id: "journal",         label: "Журнал",            icon: "BookOpen",         roles: ["admin","teacher","student","parent"] },
  { id: "diary",           label: "Дневник",           icon: "NotebookPen",      roles: ["admin","teacher","student","parent"] },
  { id: "schedule",        label: "Расписание",        icon: "CalendarDays" },
  { id: "planning",        label: "Планирование",      icon: "BookMarked",       roles: ["admin","teacher"] },
  { id: "analytics",       label: "Аналитика",         icon: "TrendingUp",       roles: ["admin","teacher"] },
  { id: "classmgmt",       label: "Классное рук.",     icon: "Users",            roles: ["admin","teacher"] },
  { id: "notifications",   label: "Уведомления",       icon: "Bell" },
];

const roleGradients: Record<string, string> = {
  admin:   "gradient-violet",
  teacher: "gradient-blue",
  student: "gradient-green",
  parent:  "gradient-orange",
};

const roleLabels: Record<string, string> = {
  admin:   "Завуч",
  teacher: "Учитель",
  student: "Ученик",
  parent:  "Родитель",
};

function initials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function Layout({ children, activePage, onNavigate, role, userName, onLogout }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const gradient = roleGradients[role];
  const navItems = allNavItems.filter(item => !item.roles || item.roles.includes(role));

  return (
    <div className="min-h-screen gradient-bg flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 glass z-30 flex flex-col transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}
      >
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
          <div className={`${gradient} rounded-2xl p-4 text-white`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm flex-shrink-0">
                {initials(userName)}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-sm truncate">{userName}</div>
                <div className="text-xs text-white/70">{roleLabels[role]}</div>
              </div>
            </div>
          </div>
        </div>

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

        <div className="p-4 border-t border-border/50 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-muted-foreground hover:bg-white/60 transition-all text-sm font-medium">
            <Icon name="Settings" size={18} />
            Настройки
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all text-sm font-medium"
          >
            <Icon name="LogOut" size={18} />
            Выйти
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen lg:pl-0">
        <header className="glass sticky top-0 z-10 px-6 py-4 flex items-center justify-between border-b border-border/40">
          <button className="lg:hidden p-2 rounded-xl hover:bg-white/60 transition-all" onClick={() => setSidebarOpen(true)}>
            <Icon name="Menu" size={20} />
          </button>

          <div className="hidden sm:block text-sm text-muted-foreground">
            Сегодня,{" "}
            <span className="font-medium text-foreground">
              {new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl hover:bg-white/60 transition-all" onClick={() => onNavigate("notifications")}>
              <Icon name="Bell" size={20} className="text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full notification-badge" />
            </button>
            <div className={`w-9 h-9 ${gradient} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
              {initials(userName)}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}