import { useState } from "react";
import Icon from "@/components/ui/icon";

type CMTab = "students" | "events" | "olympiads";

const students = [
  { id: 1, name: "Андреев Сергей",   dob: "12.03.2008", parent: "Андреева Т.А.", phone: "+7 921 123-45-67", avg: 4.3, absences: 2,  note: "" },
  { id: 2, name: "Борисова Анна",    dob: "05.07.2008", parent: "Борисов К.В.",  phone: "+7 921 234-56-78", avg: 4.7, absences: 0,  note: "" },
  { id: 3, name: "Волков Дмитрий",   dob: "22.11.2008", parent: "Волкова С.И.",  phone: "+7 921 345-67-89", avg: 3.5, absences: 6,  note: "Требуется беседа с родителями" },
  { id: 4, name: "Григорьева Мария", dob: "14.02.2008", parent: "Григорьев Н.А.", phone: "+7 921 456-78-90", avg: 5.0, absences: 0, note: "Победитель олимпиады" },
  { id: 5, name: "Дмитриев Иван",    dob: "30.09.2008", parent: "Дмитриева О.П.", phone: "+7 921 567-89-01", avg: 2.6, absences: 14, note: "Группа риска" },
  { id: 6, name: "Ефимова Ольга",    dob: "18.04.2008", parent: "Ефимов В.А.",   phone: "+7 921 678-90-12", avg: 4.1, absences: 1,  note: "" },
];

const events = [
  { id: 1, title: "Классный час: «Безопасность в интернете»", date: "15 апр", type: "Классный час", participants: 28, status: "done" },
  { id: 2, title: "Поход в театр «Современник»",              date: "20 апр", type: "Культурное",  participants: 22, status: "upcoming" },
  { id: 3, title: "Субботник на территории школы",             date: "26 апр", type: "Социальное", participants: 28, status: "upcoming" },
  { id: 4, title: "День самоуправления",                       date: "5 мая",  type: "Школьное",   participants: 28, status: "upcoming" },
  { id: 5, title: "Классный час: «Профориентация»",            date: "12 мая", type: "Классный час", participants: 28, status: "upcoming" },
];

const olympiads = [
  { id: 1, student: "Григорьева Мария", subject: "Математика", level: "Региональный", place: 1,    date: "10 апр", result: "Победитель" },
  { id: 2, student: "Андреев Сергей",   subject: "Физика",     level: "Школьный",     place: 2,    date: "3 апр",  result: "Призёр" },
  { id: 3, student: "Борисова Анна",    subject: "Химия",      level: "Муниципальный", place: 3,   date: "25 мар", result: "Призёр" },
  { id: 4, student: "Зайцев Алексей",   subject: "Информатика", level: "Школьный",    place: 1,    date: "18 мар", result: "Победитель" },
];

const eventTypeColors: Record<string, string> = {
  "Классный час": "bg-blue-100 text-blue-700",
  "Культурное":   "bg-pink-100 text-pink-700",
  "Социальное":   "bg-emerald-100 text-emerald-700",
  "Школьное":     "bg-amber-100 text-amber-700",
};

export default function ClassManagement() {
  const [tab, setTab]             = useState<CMTab>("students");
  const [selectedStudent, setSelectedStudent] = useState<typeof students[0] | null>(null);
  const [showAdd, setShowAdd]     = useState(false);
  const [evtList, setEvtList]     = useState(events);
  const [newEvt, setNewEvt]       = useState({ title: "", date: "", type: "Классный час" });

  function addEvent() {
    if (!newEvt.title || !newEvt.date) return;
    setEvtList(prev => [...prev, { id: Date.now(), ...newEvt, participants: 0, status: "upcoming" }]);
    setNewEvt({ title: "", date: "", type: "Классный час" });
    setShowAdd(false);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-montserrat font-bold text-2xl text-foreground">Классное руководство</h1>
          <p className="text-muted-foreground mt-1">9А класс · Личные дела, мероприятия и олимпиады</p>
        </div>
        {tab === "events" && (
          <button onClick={() => setShowAdd(true)}
            className="gradient-blue text-white px-5 py-2.5 rounded-2xl text-sm font-semibold shadow-card flex items-center gap-2 hover:shadow-card-hover transition-all">
            <Icon name="Plus" size={16} />
            Добавить мероприятие
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {([
          { id: "students",  label: "Личные дела",  icon: "Users" },
          { id: "events",    label: "Мероприятия",  icon: "CalendarDays" },
          { id: "olympiads", label: "Олимпиады",    icon: "Trophy" },
        ] as const).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all flex items-center gap-2 ${tab === t.id ? "gradient-blue text-white shadow-card" : "glass text-foreground hover:bg-white/80"}`}>
            <Icon name={t.icon} size={15} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Students */}
      {tab === "students" && (
        <div className="grid lg:grid-cols-2 gap-3">
          {students.map(s => (
            <div key={s.id}
              onClick={() => setSelectedStudent(s)}
              className="glass rounded-3xl p-4 card-hover cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 gradient-blue rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {s.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground truncate">{s.name}</div>
                  <div className="text-xs text-muted-foreground">Дата рождения: {s.dob}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`font-bold text-lg ${s.avg >= 4.5 ? "text-emerald-600" : s.avg >= 3.5 ? "text-blue-600" : s.avg >= 2.5 ? "text-amber-600" : "text-red-600"}`}>
                    {s.avg}
                  </div>
                  <div className="text-xs text-muted-foreground">ср. балл</div>
                </div>
              </div>
              {s.note && (
                <div className={`mt-2 text-xs px-3 py-1.5 rounded-xl font-medium ${s.note.includes("риска") ? "bg-red-50 text-red-600" : s.note.includes("Победитель") ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                  {s.note}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Events */}
      {tab === "events" && (
        <div className="space-y-3">
          {evtList.map(e => (
            <div key={e.id} className={`glass rounded-3xl p-5 transition-all ${e.status === "done" ? "opacity-70" : "card-hover"}`}>
              <div className="flex items-center gap-4 flex-wrap">
                <div className={`w-2 self-stretch rounded-full gradient-blue flex-shrink-0`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-foreground">{e.title}</span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${eventTypeColors[e.type] ?? "bg-gray-100 text-gray-600"}`}>{e.type}</span>
                    {e.status === "done" && <span className="text-xs text-emerald-600 font-semibold">✓ Проведено</span>}
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Icon name="CalendarDays" size={12} />{e.date}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Icon name="Users" size={12} />{e.participants} чел.</span>
                  </div>
                </div>
                <button onClick={() => setEvtList(p => p.filter(x => x.id !== e.id))} className="p-2 rounded-xl bg-red-50 hover:bg-red-100 transition-all">
                  <Icon name="Trash2" size={14} className="text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Olympiads */}
      {tab === "olympiads" && (
        <div className="space-y-3">
          {olympiads.map(o => (
            <div key={o.id} className="glass rounded-3xl p-5 card-hover">
              <div className="flex items-center gap-4 flex-wrap">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0
                  ${o.place === 1 ? "bg-amber-400" : o.place === 2 ? "bg-gray-400" : "bg-amber-700"}`}>
                  {o.place}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-foreground">{o.student}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{o.subject} · {o.level} · {o.date}</div>
                </div>
                <span className={`text-sm font-bold px-3 py-1.5 rounded-xl ${o.place === 1 ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>
                  {o.result}
                </span>
              </div>
            </div>
          ))}
          <div className="glass rounded-2xl px-5 py-4 flex items-center gap-3">
            <Icon name="Trophy" size={18} className="text-amber-500" />
            <span className="text-sm text-foreground">Итого: <strong>{olympiads.filter(o => o.place === 1).length} победы</strong> и <strong>{olympiads.filter(o => o.place > 1).length} призовых места</strong> за период</span>
          </div>
        </div>
      )}

      {/* Student card modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setSelectedStudent(null)}>
          <div className="glass rounded-3xl p-6 w-full max-w-sm shadow-card-hover" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-14 h-14 gradient-blue rounded-full flex items-center justify-center text-white font-bold text-lg">
                {selectedStudent.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <div className="font-montserrat font-bold text-lg text-foreground">{selectedStudent.name}</div>
                <div className="text-sm text-muted-foreground">9А класс</div>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: "Дата рождения",   value: selectedStudent.dob,    icon: "CalendarDays" },
                { label: "Родитель",        value: selectedStudent.parent,  icon: "User" },
                { label: "Телефон",         value: selectedStudent.phone,   icon: "Phone" },
                { label: "Средний балл",    value: String(selectedStudent.avg), icon: "Star" },
                { label: "Пропущено уроков", value: String(selectedStudent.absences), icon: "AlertCircle" },
              ].map(f => (
                <div key={f.label} className="flex items-center gap-3 p-3 rounded-2xl bg-white/50">
                  <Icon name={f.icon} size={16} className="text-elzhur-blue flex-shrink-0" />
                  <div>
                    <div className="text-xs text-muted-foreground">{f.label}</div>
                    <div className="text-sm font-medium text-foreground">{f.value}</div>
                  </div>
                </div>
              ))}
              {selectedStudent.note && (
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-sm text-amber-700">
                  {selectedStudent.note}
                </div>
              )}
            </div>
            <button onClick={() => setSelectedStudent(null)}
              className="w-full mt-5 py-3 rounded-2xl bg-white/60 text-sm font-semibold text-foreground hover:bg-white transition-all">
              Закрыть
            </button>
          </div>
        </div>
      )}

      {/* Add event modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="glass rounded-3xl p-6 w-full max-w-sm shadow-card-hover" onClick={e => e.stopPropagation()}>
            <h3 className="font-montserrat font-bold text-lg text-foreground mb-5">Добавить мероприятие</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Название</label>
                <input value={newEvt.title} onChange={e => setNewEvt(p => ({ ...p, title: e.target.value }))}
                  placeholder="Классный час"
                  className="w-full mt-1 px-4 py-2.5 rounded-2xl border border-border bg-white/60 text-sm outline-none focus:border-elzhur-blue transition-all" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Дата</label>
                <input value={newEvt.date} onChange={e => setNewEvt(p => ({ ...p, date: e.target.value }))}
                  placeholder="25 апр"
                  className="w-full mt-1 px-4 py-2.5 rounded-2xl border border-border bg-white/60 text-sm outline-none focus:border-elzhur-blue transition-all" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Тип</label>
                <select value={newEvt.type} onChange={e => setNewEvt(p => ({ ...p, type: e.target.value }))}
                  className="w-full mt-1 px-4 py-2.5 rounded-2xl border border-border bg-white/60 text-sm outline-none focus:border-elzhur-blue transition-all">
                  {["Классный час","Культурное","Социальное","Школьное"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-3 rounded-2xl bg-white/60 text-sm font-semibold text-foreground hover:bg-white transition-all">Отмена</button>
              <button onClick={addEvent} className="flex-1 py-3 rounded-2xl gradient-blue text-white text-sm font-semibold shadow-card hover:shadow-card-hover transition-all">Добавить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
