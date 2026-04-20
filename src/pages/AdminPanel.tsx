import { useState } from "react";
import Icon from "@/components/ui/icon";

type AdminTab = "substitutions" | "journals" | "staff" | "students";

const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт"];
const weekDates = ["14 апр", "15 апр", "16 апр", "17 апр", "18 апр"];

interface Substitution {
  id: number; day: string; lesson: number; time: string;
  absent: string; subject: string; cls: string;
  substitute: string | null; room: string; status: "open" | "filled";
}

const initialSubstitutions: Substitution[] = [
  { id: 1, day: "Ср", lesson: 2, time: "09:00", absent: "Петров А.С.", subject: "Физика", cls: "10Б", substitute: null, room: "301", status: "open" },
  { id: 2, day: "Ср", lesson: 4, time: "11:00", absent: "Белова О.С.", subject: "Английский", cls: "9А", substitute: "Романова И.К.", room: "320", status: "filled" },
  { id: 3, day: "Чт", lesson: 1, time: "08:00", absent: "Орлов Д.В.", subject: "Химия", cls: "10А", substitute: null, room: "112", status: "open" },
  { id: 4, day: "Пт", lesson: 3, time: "10:00", absent: "Сидорова Н.П.", subject: "История", cls: "9Б", substitute: null, room: "406", status: "open" },
];

const journalStatus = [
  { teacher: "Иванова М.В.", subject: "Математика", classes: ["9А","9Б","10А","11А"], filled: 92, lastUpdate: "Сегодня, 14:20", status: "ok" },
  { teacher: "Петров А.С.",  subject: "Физика",     classes: ["10Б","9А","8В"],        filled: 78, lastUpdate: "Вчера, 16:00",   status: "warn" },
  { teacher: "Орлов Д.В.",   subject: "Химия",      classes: ["9Б","10А","10Б"],       filled: 95, lastUpdate: "Сегодня, 10:00", status: "ok" },
  { teacher: "Козлова Е.В.", subject: "Литература", classes: ["11А","10А","9А"],        filled: 60, lastUpdate: "3 дня назад",    status: "error" },
  { teacher: "Белова О.С.",  subject: "Английский", classes: ["9А","9Б","10Б"],        filled: 88, lastUpdate: "Сегодня, 09:30", status: "ok" },
];

const staff = [
  { id: 1, name: "Иванова Мария Васильевна",    role: "Учитель математики", phone: "+7 921 111-22-33", exp: "15 лет", load: 18 },
  { id: 2, name: "Петров Александр Сергеевич",   role: "Учитель физики",     phone: "+7 921 222-33-44", exp: "8 лет",  load: 16 },
  { id: 3, name: "Орлов Дмитрий Витальевич",     role: "Учитель химии",      phone: "+7 921 333-44-55", exp: "12 лет", load: 14 },
  { id: 4, name: "Козлова Екатерина Владимировна",role: "Учитель литературы", phone: "+7 921 444-55-66", exp: "20 лет", load: 20 },
  { id: 5, name: "Белова Ольга Сергеевна",       role: "Учитель английского",phone: "+7 921 555-66-77", exp: "6 лет",  load: 22 },
];

const allStudents = [
  { id: 1, name: "Андреев Сергей",   cls: "9А", avg: 4.3, parent: "Андреева Т.А.", phone: "+7 921 123-45-67" },
  { id: 2, name: "Борисова Анна",    cls: "9А", avg: 4.7, parent: "Борисов К.В.",  phone: "+7 921 234-56-78" },
  { id: 3, name: "Волков Дмитрий",   cls: "9А", avg: 3.5, parent: "Волкова С.И.",  phone: "+7 921 345-67-89" },
  { id: 4, name: "Григорьева Мария", cls: "9А", avg: 5.0, parent: "Григорьев Н.А.",phone: "+7 921 456-78-90" },
  { id: 5, name: "Дмитриев Иван",    cls: "9А", avg: 2.6, parent: "Дмитриева О.П.",phone: "+7 921 567-89-01" },
  { id: 6, name: "Захарова Кристина",cls: "9Б", avg: 4.8, parent: "Захаров П.В.",  phone: "+7 921 678-90-12" },
  { id: 7, name: "Козлов Роман",     cls: "10А",avg: 3.1, parent: "Козлова А.Н.",  phone: "+7 921 789-01-23" },
  { id: 8, name: "Смирнова Екатерина",cls: "11А",avg: 4.9,parent: "Смирнов В.А.",  phone: "+7 921 890-12-34" },
];

const teachers = staff.map(s => s.name.split(" ").slice(0, 2).join(" ") + " " + s.name.split(" ")[2][0] + ".");

export default function AdminPanel() {
  const [tab, setTab]           = useState<AdminTab>("substitutions");
  const [subs, setSubs]         = useState(initialSubstitutions);
  const [editSub, setEditSub]   = useState<Substitution | null>(null);
  const [chosenTeacher, setChosenTeacher] = useState("");
  const [activeDay, setActiveDay] = useState("Ср");
  const [searchStaff, setSearchStaff]   = useState("");
  const [searchStudent, setSearchStudent] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<typeof staff[0] | null>(null);

  function assignSubstitute() {
    if (!editSub || !chosenTeacher) return;
    setSubs(prev => prev.map(s => s.id === editSub.id ? { ...s, substitute: chosenTeacher, status: "filled" as const } : s));
    setEditSub(null);
    setChosenTeacher("");
  }

  const filteredSubs = subs.filter(s => s.day === activeDay);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-montserrat font-bold text-2xl text-foreground">Панель завуча</h1>
          <p className="text-muted-foreground mt-1">Управление учебным процессом</p>
        </div>
        <span className="text-xs px-3 py-1.5 rounded-full font-semibold bg-violet-100 text-violet-700 flex items-center gap-1.5">
          <Icon name="Shield" size={13} />
          Завуч
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {([
          { id: "substitutions", label: "Замены",          icon: "RefreshCw" },
          { id: "journals",      label: "Журналы",          icon: "BookOpen" },
          { id: "staff",         label: "Сотрудники",       icon: "UserCog" },
          { id: "students",      label: "Ученики",          icon: "Users" },
        ] as const).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all flex items-center gap-2 ${tab === t.id ? "gradient-blue text-white shadow-card" : "glass text-foreground hover:bg-white/80"}`}>
            <Icon name={t.icon} size={15} />
            {t.label}
            {t.id === "substitutions" && subs.filter(s => s.status === "open").length > 0 && (
              <span className="ml-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {subs.filter(s => s.status === "open").length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Substitutions */}
      {tab === "substitutions" && (
        <>
          {/* Day selector */}
          <div className="glass rounded-3xl p-4">
            <div className="flex gap-2">
              {weekDays.map((d, i) => {
                const cnt = subs.filter(s => s.day === d && s.status === "open").length;
                return (
                  <button key={d} onClick={() => setActiveDay(d)}
                    className={`flex-1 flex flex-col items-center py-3 rounded-2xl transition-all ${activeDay === d ? "gradient-blue text-white shadow-card" : "bg-white/60 text-foreground hover:bg-white"}`}>
                    <span className={`text-xs font-medium ${activeDay === d ? "text-white/80" : "text-muted-foreground"}`}>{d}</span>
                    <span className={`text-sm font-bold mt-0.5 ${activeDay === d ? "text-white" : "text-foreground"}`}>{weekDates[i]}</span>
                    {cnt > 0 && <span className="mt-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{cnt}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            {filteredSubs.length === 0 ? (
              <div className="glass rounded-3xl p-10 text-center">
                <Icon name="CheckCircle" size={36} className="text-emerald-500 mx-auto mb-3" />
                <p className="font-montserrat font-bold text-lg text-foreground">Все замены оформлены</p>
                <p className="text-muted-foreground text-sm mt-1">На этот день замен нет</p>
              </div>
            ) : filteredSubs.map(s => (
              <div key={s.id} className={`glass rounded-3xl p-5 card-hover border-l-4 ${s.status === "open" ? "border-red-400" : "border-emerald-400"}`}>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="w-11 h-11 gradient-orange rounded-2xl flex items-center justify-center text-white font-bold flex-shrink-0">
                    {s.lesson}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground">{s.subject} · {s.cls}</span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${s.status === "open" ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-700"}`}>
                        {s.status === "open" ? "Нужна замена" : "Оформлено"}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 flex flex-wrap gap-3">
                      <span className="flex items-center gap-1"><Icon name="Clock" size={11} />{s.time}</span>
                      <span className="flex items-center gap-1"><Icon name="User" size={11} />Отсутствует: {s.absent}</span>
                      {s.substitute && <span className="flex items-center gap-1 text-emerald-600"><Icon name="UserCheck" size={11} />Замена: {s.substitute}</span>}
                      <span className="flex items-center gap-1"><Icon name="MapPin" size={11} />Каб. {s.room}</span>
                    </div>
                  </div>
                  {s.status === "open" && (
                    <button onClick={() => { setEditSub(s); setChosenTeacher(""); }}
                      className="gradient-blue text-white px-4 py-2 rounded-2xl text-sm font-semibold shadow-card hover:shadow-card-hover transition-all">
                      Назначить
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Journals */}
      {tab === "journals" && (
        <div className="glass rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[580px]">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left p-4 text-sm font-semibold text-foreground">Учитель</th>
                  <th className="text-left p-4 text-sm font-semibold text-foreground">Предмет</th>
                  <th className="p-4 text-center text-sm font-semibold text-foreground">Классы</th>
                  <th className="p-4 text-center text-sm font-semibold text-foreground">Заполнено</th>
                  <th className="p-4 text-left text-sm font-semibold text-foreground">Последнее обновление</th>
                  <th className="p-4 text-center text-sm font-semibold text-foreground">Статус</th>
                </tr>
              </thead>
              <tbody>
                {journalStatus.map((j, i) => (
                  <tr key={i} className="border-b border-border/20 hover:bg-white/40 transition-all">
                    <td className="p-4 font-medium text-foreground text-sm">{j.teacher}</td>
                    <td className="p-4 text-sm text-muted-foreground">{j.subject}</td>
                    <td className="p-4 text-center">
                      <div className="flex gap-1 justify-center flex-wrap">
                        {j.classes.map(c => <span key={c} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-lg font-medium">{c}</span>)}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`font-bold text-sm ${j.filled >= 90 ? "text-emerald-600" : j.filled >= 70 ? "text-amber-600" : "text-red-500"}`}>{j.filled}%</span>
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all"
                            style={{ width: `${j.filled}%`, background: j.filled >= 90 ? "#10b981" : j.filled >= 70 ? "#f59e0b" : "#ef4444" }} />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{j.lastUpdate}</td>
                    <td className="p-4 text-center">
                      {j.status === "ok"    && <span className="text-xs text-emerald-600 font-semibold flex items-center justify-center gap-1"><Icon name="CheckCircle" size={13} />В норме</span>}
                      {j.status === "warn"  && <span className="text-xs text-amber-600 font-semibold flex items-center justify-center gap-1"><Icon name="AlertTriangle" size={13} />Внимание</span>}
                      {j.status === "error" && <span className="text-xs text-red-500 font-semibold flex items-center justify-center gap-1"><Icon name="XCircle" size={13} />Нарушение</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Staff */}
      {tab === "staff" && (
        <>
          <div className="glass rounded-2xl px-4 py-3 flex items-center gap-3">
            <Icon name="Search" size={16} className="text-muted-foreground" />
            <input value={searchStaff} onChange={e => setSearchStaff(e.target.value)}
              placeholder="Поиск сотрудника..."
              className="flex-1 bg-transparent text-sm outline-none text-foreground" />
          </div>
          <div className="grid lg:grid-cols-2 gap-3">
            {staff.filter(s => s.name.toLowerCase().includes(searchStaff.toLowerCase())).map(s => (
              <div key={s.id} onClick={() => setSelectedStaff(s)}
                className="glass rounded-3xl p-4 card-hover cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 gradient-blue rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {s.name.split(" ").map(n => n[0]).join("").slice(0,2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-foreground text-sm truncate">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.role}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold text-elzhur-blue">{s.load} ч/н</div>
                    <div className="text-xs text-muted-foreground">нагрузка</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Students */}
      {tab === "students" && (
        <>
          <div className="glass rounded-2xl px-4 py-3 flex items-center gap-3">
            <Icon name="Search" size={16} className="text-muted-foreground" />
            <input value={searchStudent} onChange={e => setSearchStudent(e.target.value)}
              placeholder="Поиск ученика..."
              className="flex-1 bg-transparent text-sm outline-none text-foreground" />
          </div>
          <div className="glass rounded-3xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left p-4 text-sm font-semibold text-foreground">Ученик</th>
                  <th className="p-4 text-center text-sm font-semibold text-foreground">Класс</th>
                  <th className="p-4 text-center text-sm font-semibold text-foreground">Средний балл</th>
                  <th className="text-left p-4 text-sm font-semibold text-foreground">Родитель / Телефон</th>
                </tr>
              </thead>
              <tbody>
                {allStudents.filter(s =>
                  s.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
                  s.cls.toLowerCase().includes(searchStudent.toLowerCase())
                ).map(s => (
                  <tr key={s.id} className="border-b border-border/20 hover:bg-white/40 transition-all">
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 gradient-blue rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {s.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span className="text-sm font-medium text-foreground">{s.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-sm font-semibold text-elzhur-blue">{s.cls}</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`text-sm font-bold ${s.avg >= 4.5 ? "text-emerald-600" : s.avg >= 3.5 ? "text-blue-600" : s.avg >= 2.5 ? "text-amber-600" : "text-red-600"}`}>{s.avg}</span>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-foreground">{s.parent}</div>
                      <div className="text-xs text-muted-foreground">{s.phone}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Substitution assign modal */}
      {editSub && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setEditSub(null)}>
          <div className="glass rounded-3xl p-6 w-full max-w-sm shadow-card-hover" onClick={e => e.stopPropagation()}>
            <h3 className="font-montserrat font-bold text-lg text-foreground mb-1">Назначить замену</h3>
            <p className="text-sm text-muted-foreground mb-5">
              {editSub.subject} · {editSub.cls} · {editSub.day}, {editSub.lesson} урок ({editSub.time})
            </p>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Учитель на замену</label>
              <select value={chosenTeacher} onChange={e => setChosenTeacher(e.target.value)}
                className="w-full mt-1.5 px-4 py-3 rounded-2xl border border-border bg-white/60 text-sm outline-none focus:border-elzhur-blue transition-all">
                <option value="">Выберите учителя...</option>
                {teachers.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setEditSub(null)} className="flex-1 py-3 rounded-2xl bg-white/60 text-sm font-semibold text-foreground hover:bg-white transition-all">Отмена</button>
              <button onClick={assignSubstitute} className="flex-1 py-3 rounded-2xl gradient-blue text-white text-sm font-semibold shadow-card hover:shadow-card-hover transition-all">Оформить</button>
            </div>
          </div>
        </div>
      )}

      {/* Staff card modal */}
      {selectedStaff && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setSelectedStaff(null)}>
          <div className="glass rounded-3xl p-6 w-full max-w-sm shadow-card-hover" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-14 h-14 gradient-blue rounded-full flex items-center justify-center text-white font-bold text-lg">
                {selectedStaff.name.split(" ").map(n => n[0]).join("").slice(0,2)}
              </div>
              <div>
                <div className="font-montserrat font-bold text-base text-foreground leading-tight">{selectedStaff.name}</div>
                <div className="text-sm text-muted-foreground">{selectedStaff.role}</div>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { label: "Телефон",    value: selectedStaff.phone, icon: "Phone" },
                { label: "Стаж",      value: selectedStaff.exp,   icon: "Clock" },
                { label: "Нагрузка",  value: `${selectedStaff.load} ч/нед.`, icon: "BookOpen" },
              ].map(f => (
                <div key={f.label} className="flex items-center gap-3 p-3 rounded-2xl bg-white/50">
                  <Icon name={f.icon} size={16} className="text-elzhur-blue" />
                  <div>
                    <div className="text-xs text-muted-foreground">{f.label}</div>
                    <div className="text-sm font-medium text-foreground">{f.value}</div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setSelectedStaff(null)}
              className="w-full mt-5 py-3 rounded-2xl bg-white/60 text-sm font-semibold text-foreground hover:bg-white transition-all">
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
