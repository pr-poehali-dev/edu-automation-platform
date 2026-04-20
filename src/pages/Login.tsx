import { useState } from "react";
import Icon from "@/components/ui/icon";
import type { Role } from "@/types/roles";

interface LoginProps {
  onLogin: (role: Role, name: string) => void;
}

const roles: { id: Role; label: string; desc: string; icon: string; gradient: string }[] = [
  { id: "admin",   label: "Завуч",    desc: "Расписание, замены, отчёты", icon: "Shield",        gradient: "gradient-violet" },
  { id: "teacher", label: "Учитель",  desc: "Журнал, оценки, ДЗ",         icon: "GraduationCap", gradient: "gradient-blue" },
  { id: "student", label: "Ученик",   desc: "Дневник, расписание",         icon: "BookOpen",      gradient: "gradient-green" },
  { id: "parent",  label: "Родитель", desc: "Успеваемость ребёнка",        icon: "Users",         gradient: "gradient-orange" },
];

const mockUsers: Record<string, { name: string; role: Role; password: string }> = {
  "zavuch@school.ru":   { name: "Кузнецова Елена Ивановна",  role: "admin",   password: "1234" },
  "ivanova@school.ru":  { name: "Иванова Мария Васильевна",  role: "teacher", password: "1234" },
  "petrov@school.ru":   { name: "Иван Петров",               role: "student", password: "1234" },
  "smirnova@school.ru": { name: "Смирнова Ольга Владимировна", role: "parent", password: "1234" },
};

export default function Login({ onLogin }: LoginProps) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [showPass, setShowPass] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const user = mockUsers[email.toLowerCase()];
    if (!user) { setError("Пользователь не найден"); return; }
    if (user.password !== password) { setError("Неверный пароль"); return; }
    if (selectedRole && user.role !== selectedRole) {
      const label = roles.find(r => r.id === user.role)?.label ?? user.role;
      setError(`Этот аккаунт зарегистрирован как «${label}»`);
      return;
    }
    onLogin(user.role, user.name);
  }

  function quickLogin(role: Role) {
    const entry = Object.values(mockUsers).find(v => v.role === role);
    if (entry) onLogin(entry.role, entry.name);
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 gradient-blue rounded-3xl flex items-center justify-center shadow-glow-blue mx-auto mb-4">
            <Icon name="GraduationCap" size={32} className="text-white" />
          </div>
          <h1 className="font-montserrat font-bold text-3xl text-foreground">ЭлЖур</h1>
          <p className="text-muted-foreground mt-1">Электронный журнал школы</p>
        </div>

        <div className="glass rounded-3xl p-6 shadow-card">
          <p className="text-sm font-medium text-foreground mb-3">Я вхожу как:</p>
          <div className="grid grid-cols-4 gap-2 mb-6">
            {roles.map((r) => (
              <button key={r.id} type="button" onClick={() => setSelectedRole(r.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                  selectedRole === r.id ? "border-elzhur-blue bg-blue-50" : "border-transparent bg-white/60 hover:bg-white"
                }`}
              >
                <div className={`w-10 h-10 ${r.gradient} rounded-xl flex items-center justify-center`}>
                  <Icon name={r.icon} size={18} className="text-white" />
                </div>
                <span className="text-xs font-semibold text-foreground text-center leading-tight">{r.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="mail@school.ru"
                className="w-full mt-1.5 px-4 py-3 rounded-2xl border border-border bg-white/60 text-sm outline-none focus:border-elzhur-blue transition-all"
                required />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Пароль</label>
              <div className="relative mt-1.5">
                <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-2xl border border-border bg-white/60 text-sm outline-none focus:border-elzhur-blue transition-all"
                  required />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground">
                  <Icon name={showPass ? "EyeOff" : "Eye"} size={16} />
                </button>
              </div>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                <Icon name="AlertCircle" size={14} />
                <span className="text-xs">{error}</span>
              </div>
            )}
            <button type="submit"
              className="w-full gradient-blue text-white py-3 rounded-2xl font-semibold text-sm shadow-card hover:shadow-card-hover transition-all">
              Войти
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-border/40">
            <p className="text-xs text-muted-foreground text-center mb-3">Быстрый вход (демо)</p>
            <div className="grid grid-cols-4 gap-2">
              {roles.map((r) => (
                <button key={r.id} onClick={() => quickLogin(r.id)}
                  className="py-2 px-2 rounded-xl bg-white/60 hover:bg-white text-xs font-medium text-foreground transition-all flex items-center justify-center gap-1">
                  <Icon name={r.icon} size={12} />
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
