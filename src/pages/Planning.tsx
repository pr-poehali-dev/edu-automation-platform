import { useState } from "react";
import Icon from "@/components/ui/icon";
import type { Role } from "@/types/roles";

interface PlanningProps { role: Role }

type PlanTab = "thematic" | "extracurricular";

const thematicPlan = [
  { week: 1,  topic: "Введение в тему. Основные понятия.",         hours: 2, type: "Теория",    status: "done",     date: "1–5 апр" },
  { week: 2,  topic: "Базовые алгоритмы и их применение.",          hours: 2, type: "Теория",    status: "done",     date: "8–12 апр" },
  { week: 3,  topic: "Практическая работа №1.",                      hours: 1, type: "Практика",  status: "current",  date: "15–19 апр" },
  { week: 4,  topic: "Углублённое изучение. Задачи повышенного уровня.", hours: 2, type: "Теория", status: "upcoming", date: "22–26 апр" },
  { week: 5,  topic: "Контрольная работа.",                          hours: 1, type: "Контроль",  status: "upcoming", date: "29 апр–3 мая" },
  { week: 6,  topic: "Анализ ошибок. Повторение.",                   hours: 1, type: "Теория",    status: "upcoming", date: "6–10 мая" },
  { week: 7,  topic: "Итоговое обобщение темы.",                     hours: 2, type: "Практика",  status: "upcoming", date: "13–17 мая" },
];

const extracurricular = [
  { id: 1, name: "Математический кружок",  day: "Пн", time: "15:00", room: "205", teacher: "Иванова М.В.",  students: 12, type: "Кружок" },
  { id: 2, name: "Олимпиада по физике",    day: "Ср", time: "10:00", room: "301", teacher: "Петров А.С.",   students: 8,  type: "Олимпиада" },
  { id: 3, name: "Шахматный клуб",         day: "Вт", time: "16:00", room: "Акт.зал", teacher: "Волков С.А.", students: 20, type: "Кружок" },
  { id: 4, name: "Театральная студия",     day: "Чт", time: "15:30", room: "Акт.зал", teacher: "Козлова Е.В.", students: 15, type: "Студия" },
  { id: 5, name: "Спортивная секция",      day: "Пт", time: "16:00", room: "Спортзал", teacher: "Громов П.В.", students: 25, type: "Спорт" },
  { id: 6, name: "Олимпиада по математике", day: "Сб", time: "10:00", room: "205", teacher: "Иванова М.В.", students: 10, type: "Олимпиада" },
];

const typeColors: Record<string, string> = {
  "Теория":    "bg-blue-100 text-blue-700",
  "Практика":  "bg-emerald-100 text-emerald-700",
  "Контроль":  "bg-red-100 text-red-700",
  "Кружок":    "bg-violet-100 text-violet-700",
  "Олимпиада": "bg-amber-100 text-amber-700",
  "Студия":    "bg-pink-100 text-pink-700",
  "Спорт":     "bg-teal-100 text-teal-700",
};

export default function Planning({ role }: PlanningProps) {
  const [tab, setTab]           = useState<PlanTab>("thematic");
  const [activeClass, setActiveClass] = useState("9А");
  const [activeSubject, setActiveSubject] = useState("Математика");
  const [showAddExtra, setShowAddExtra] = useState(false);
  const [extras, setExtras]     = useState(extracurricular);
  const [newExtra, setNewExtra] = useState({ name: "", day: "Пн", time: "", room: "", teacher: "", type: "Кружок" });

  const isTeacher = role === "teacher";
  const isAdmin   = role === "admin";
  const canEdit   = isTeacher || isAdmin;

  const done    = thematicPlan.filter(t => t.status === "done").length;
  const total   = thematicPlan.length;
  const progress = Math.round((done / total) * 100);

  function addExtra() {
    if (!newExtra.name || !newExtra.time) return;
    setExtras(prev => [...prev, { ...newExtra, id: Date.now(), students: 0 }]);
    setNewExtra({ name: "", day: "Пн", time: "", room: "", teacher: "", type: "Кружок" });
    setShowAddExtra(false);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-montserrat font-bold text-2xl text-foreground">Планирование</h1>
          <p className="text-muted-foreground mt-1">Тематическое планирование и внеурочная деятельность</p>
        </div>
        {canEdit && (
          <button onClick={() => setShowAddExtra(true)}
            className="gradient-blue text-white px-5 py-2.5 rounded-2xl text-sm font-semibold shadow-card flex items-center gap-2 hover:shadow-card-hover transition-all">
            <Icon name="Plus" size={16} />
            Добавить мероприятие
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {([
          { id: "thematic",       label: "Тематическое планирование", icon: "BookMarked" },
          { id: "extracurricular", label: "Внеурочная деятельность",   icon: "Star" },
        ] as const).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all flex items-center gap-2 ${tab === t.id ? "gradient-blue text-white shadow-card" : "glass text-foreground hover:bg-white/80"}`}>
            <Icon name={t.icon} size={15} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "thematic" && (
        <>
          {/* Filters */}
          <div className="glass rounded-3xl p-4 flex flex-wrap gap-4">
            <div className="flex gap-2 flex-wrap items-center">
              <span className="text-xs text-muted-foreground font-medium">Класс:</span>
              {["9А", "9Б", "10А", "10Б", "11А"].map(c => (
                <button key={c} onClick={() => setActiveClass(c)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${activeClass === c ? "gradient-blue text-white" : "bg-white/60 text-foreground hover:bg-white"}`}>
                  {c}
                </button>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap items-center">
              <span className="text-xs text-muted-foreground font-medium">Предмет:</span>
              {["Математика", "Физика", "Алгебра"].map(s => (
                <button key={s} onClick={() => setActiveSubject(s)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${activeSubject === s ? "gradient-blue text-white" : "bg-white/60 text-foreground hover:bg-white"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div className="glass rounded-2xl px-5 py-4 flex items-center gap-5">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-foreground">Выполнение программы: {activeClass} · {activeSubject}</span>
                <span className="text-muted-foreground">{done}/{total} тем · {progress}%</span>
              </div>
              <div className="h-3 bg-white/60 rounded-full overflow-hidden">
                <div className="h-full gradient-green rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>

          {/* Plan table */}
          <div className="glass rounded-3xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left p-4 text-sm font-semibold text-foreground w-12">№</th>
                  <th className="text-left p-4 text-sm font-semibold text-foreground">Тема</th>
                  <th className="p-4 text-center text-sm font-semibold text-foreground w-16">Часы</th>
                  <th className="p-4 text-center text-sm font-semibold text-foreground w-24">Тип</th>
                  <th className="p-4 text-center text-sm font-semibold text-foreground w-28">Дата</th>
                  <th className="p-4 text-center text-sm font-semibold text-foreground w-24">Статус</th>
                </tr>
              </thead>
              <tbody>
                {thematicPlan.map((row) => (
                  <tr key={row.week} className={`border-b border-border/20 transition-all ${row.status === "current" ? "bg-blue-50" : "hover:bg-white/40"}`}>
                    <td className="p-4 text-sm text-muted-foreground font-medium">{row.week}</td>
                    <td className="p-4">
                      <span className={`text-sm ${row.status === "current" ? "font-semibold text-elzhur-blue" : "text-foreground"}`}>
                        {row.topic}
                      </span>
                      {row.status === "current" && (
                        <span className="ml-2 text-xs gradient-blue text-white px-2 py-0.5 rounded-full">Текущая</span>
                      )}
                    </td>
                    <td className="p-4 text-center text-sm text-muted-foreground">{row.hours}</td>
                    <td className="p-4 text-center">
                      <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${typeColors[row.type] ?? ""}`}>{row.type}</span>
                    </td>
                    <td className="p-4 text-center text-xs text-muted-foreground">{row.date}</td>
                    <td className="p-4 text-center">
                      {row.status === "done"    && <span className="text-xs text-emerald-600 font-semibold flex items-center justify-center gap-1"><Icon name="CheckCircle" size={13} />Пройдено</span>}
                      {row.status === "current" && <span className="text-xs text-blue-600 font-semibold flex items-center justify-center gap-1"><Icon name="Clock" size={13} />Сейчас</span>}
                      {row.status === "upcoming" && <span className="text-xs text-muted-foreground font-semibold flex items-center justify-center gap-1"><Icon name="Circle" size={13} />Впереди</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "extracurricular" && (
        <div className="space-y-3">
          {extras.map((e) => (
            <div key={e.id} className="glass rounded-3xl p-5 card-hover">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="w-11 h-11 gradient-blue rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {e.day}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-foreground">{e.name}</span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${typeColors[e.type] ?? "bg-gray-100 text-gray-600"}`}>{e.type}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 flex-wrap">
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Icon name="Clock" size={12} />{e.time}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Icon name="MapPin" size={12} />{e.room}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Icon name="User" size={12} />{e.teacher}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Icon name="Users" size={12} />{e.students} чел.</span>
                  </div>
                </div>
                {canEdit && (
                  <div className="flex gap-2">
                    <button className="p-2 rounded-xl bg-white/60 hover:bg-white transition-all"><Icon name="Pencil" size={15} className="text-muted-foreground" /></button>
                    <button onClick={() => setExtras(prev => prev.filter(x => x.id !== e.id))} className="p-2 rounded-xl bg-red-50 hover:bg-red-100 transition-all"><Icon name="Trash2" size={15} className="text-red-500" /></button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add extra modal */}
      {showAddExtra && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowAddExtra(false)}>
          <div className="glass rounded-3xl p-6 w-full max-w-md shadow-card-hover" onClick={e => e.stopPropagation()}>
            <h3 className="font-montserrat font-bold text-lg text-foreground mb-5">Добавить мероприятие</h3>
            <div className="space-y-3">
              {[
                { label: "Название", key: "name", placeholder: "Математический кружок" },
                { label: "Время", key: "time", placeholder: "15:00" },
                { label: "Кабинет", key: "room", placeholder: "205" },
                { label: "Учитель", key: "teacher", placeholder: "Иванова М.В." },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-medium text-muted-foreground">{f.label}</label>
                  <input value={(newExtra as Record<string, string>)[f.key]} onChange={e => setNewExtra(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full mt-1 px-4 py-2.5 rounded-2xl border border-border bg-white/60 text-sm outline-none focus:border-elzhur-blue transition-all" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">День</label>
                  <select value={newExtra.day} onChange={e => setNewExtra(p => ({ ...p, day: e.target.value }))}
                    className="w-full mt-1 px-4 py-2.5 rounded-2xl border border-border bg-white/60 text-sm outline-none focus:border-elzhur-blue transition-all">
                    {["Пн","Вт","Ср","Чт","Пт","Сб"].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Тип</label>
                  <select value={newExtra.type} onChange={e => setNewExtra(p => ({ ...p, type: e.target.value }))}
                    className="w-full mt-1 px-4 py-2.5 rounded-2xl border border-border bg-white/60 text-sm outline-none focus:border-elzhur-blue transition-all">
                    {["Кружок","Олимпиада","Студия","Спорт"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAddExtra(false)} className="flex-1 py-3 rounded-2xl bg-white/60 text-sm font-semibold text-foreground hover:bg-white transition-all">Отмена</button>
              <button onClick={addExtra} className="flex-1 py-3 rounded-2xl gradient-blue text-white text-sm font-semibold shadow-card hover:shadow-card-hover transition-all">Добавить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
