import { useState } from "react";
import Icon from "@/components/ui/icon";

interface LoginProps {
  onLogin: (role: "teacher" | "student" | "parent", name: string) => void;
}

const roles = [
  {
    id: "teacher" as const,
    label: "Учитель",
    desc: "Выставляю оценки, веду журнал",
    icon: "GraduationCap",
    gradient: "gradient-blue",
    glow: "shadow-glow-blue",
  },
  {
    id: "student" as const,
    label: "Ученик",
    desc: "Смотрю дневник и расписание",
    icon: "BookOpen",
    gradient: "gradient-green",
    glow: "shadow-glow-blue",
  },
  {
    id: "parent" as const,
    label: "Родитель",
    desc: "Слежу за успеваемостью ребёнка",
    icon: "Users",
    gradient: "gradient-orange",
    glow: "shadow-glow-violet",
  },
];

const mockUsers: Record<string, { name: string; role: "teacher" | "student" | "parent"; password: string }> = {
  "ivanova@school.ru": { name: "Иванова Мария Васильевна", role: "teacher", password: "1234" },
  "petrov@school.ru": { name: "Иван Петров", role: "student", password: "1234" },
  "smirnova@school.ru": { name: "Смирнова Ольга Владимировна", role: "parent", password: "1234" },
};

export default function Login({ onLogin }: LoginProps) {
  const [selectedRole, setSelectedRole] = useState<"teacher" | "student" | "parent" | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const user = mockUsers[email.toLowerCase()];
    if (!user) { setError("Пользователь не найден"); return; }
    if (user.password !== password) { setError("Неверный пароль"); return; }
    if (selectedRole && user.role !== selectedRole) {
      setError(`Этот аккаунт зарегистрирован как «${roles.find(r => r.id === user.role)?.label}»`);
      return;
    }
    onLogin(user.role, user.name);
  }

  function quickLogin(role: "teacher" | "student" | "parent") {
    const entry = Object.entries(mockUsers).find(([, v]) => v.role === role);
    if (entry) onLogin(entry[1].role, entry[1].name);
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 gradient-blue rounded-3xl flex items-center justify-center shadow-glow-blue mx-auto mb-4">
            <Icon name="GraduationCap" size={32} className="text-white" />
          </div>
          <h1 className="font-montserrat font-bold text-3xl text-foreground">ЭлЖур</h1>
          <p className="text-muted-foreground mt-1">Электронный журнал школы</p>
        </div>

        <div className="glass rounded-3xl p-6 shadow-card">
          {/* Role select */}
          <p className="text-sm font-medium text-foreground mb-3">Я вхожу как:</p>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {roles.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRole(r.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                  selectedRole === r.id
                    ? "border-elzhur-blue bg-blue-50"
                    : "border-transparent bg-white/60 hover:bg-white"
                }`}
              >
                <div className={`w-10 h-10 ${r.gradient} rounded-xl flex items-center justify-center`}>
                  <Icon name={r.icon} size={18} className="text-white" />
                </div>
                <span className="text-xs font-semibold text-foreground">{r.label}</span>
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="mail@school.ru"
                className="w-full mt-1.5 px-4 py-3 rounded-2xl border border-border bg-white/60 text-sm outline-none focus:border-elzhur-blue transition-all"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Пароль</label>
              <div className="relative mt-1.5">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-2xl border border-border bg-white/60 text-sm outline-none focus:border-elzhur-blue transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-all"
                >
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

            <button
              type="submit"
              className="w-full gradient-blue text-white py-3 rounded-2xl font-semibold text-sm shadow-card hover:shadow-card-hover transition-all"
            >
              Войти
            </button>
          </form>

          {/* Quick login */}
          <div className="mt-5 pt-4 border-t border-border/40">
            <p className="text-xs text-muted-foreground text-center mb-3">Быстрый вход (демо)</p>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((r) => (
                <button
                  key={r.id}
                  onClick={() => quickLogin(r.id)}
                  className="py-2 px-3 rounded-xl bg-white/60 hover:bg-white text-xs font-medium text-foreground transition-all flex items-center justify-center gap-1.5"
                >
                  <Icon name={r.icon} size={13} />
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
