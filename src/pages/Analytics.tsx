import { useState } from "react";
import Icon from "@/components/ui/icon";
import type { Role } from "@/types/roles";

interface AnalyticsProps { role: Role }

const classStats = [
  { cls: "9А", avg: 4.2, attendance: 96, students: 28, leader: "Григорьева М.", worst: "Дмитриев И." },
  { cls: "9Б", avg: 3.8, attendance: 91, students: 26, leader: "Захарова К.",   worst: "Баранов С." },
  { cls: "10А", avg: 4.5, attendance: 98, students: 30, leader: "Орлова Н.",     worst: "Козлов Р." },
  { cls: "10Б", avg: 3.6, attendance: 89, students: 27, leader: "Фёдоров А.",    worst: "Никитин В." },
  { cls: "11А", avg: 4.3, attendance: 95, students: 25, leader: "Смирнова Е.",   worst: "Попов Д." },
];

const subjectStats = [
  { subj: "Математика", avg: 4.1, teachers: "Иванова М.В.", difficult: 18 },
  { subj: "Физика",     avg: 3.9, teachers: "Петров А.С.",  difficult: 22 },
  { subj: "Химия",      avg: 4.0, teachers: "Орлов Д.В.",   difficult: 15 },
  { subj: "История",    avg: 4.4, teachers: "Сидорова Н.П.", difficult: 8 },
  { subj: "Литература", avg: 4.6, teachers: "Козлова Е.В.", difficult: 5 },
  { subj: "Английский", avg: 3.7, teachers: "Белова О.С.",  difficult: 28 },
];

const monthlyDynamic = [
  { month: "Янв", avg: 3.9, attendance: 90 },
  { month: "Фев", avg: 4.0, attendance: 92 },
  { month: "Мар", avg: 4.1, attendance: 94 },
  { month: "Апр", avg: 4.2, attendance: 95 },
];

const riskStudents = [
  { name: "Дмитриев Иван",  cls: "9А", avg: 2.4, absences: 12, reason: "Низкая успеваемость" },
  { name: "Баранов Сергей", cls: "9Б", avg: 2.7, absences: 8,  reason: "Много пропусков" },
  { name: "Никитин Виктор", cls: "10Б", avg: 2.9, absences: 15, reason: "Пропуски + успеваемость" },
];

function avgColor(v: number) {
  if (v >= 4.5) return "text-emerald-600";
  if (v >= 4.0) return "text-blue-600";
  if (v >= 3.5) return "text-amber-600";
  return "text-red-600";
}

function attColor(v: number) {
  if (v >= 95) return "text-emerald-600";
  if (v >= 90) return "text-amber-600";
  return "text-red-600";
}

const BAR_MAX = 5;

export default function Analytics({ role }: AnalyticsProps) {
  const [tab, setTab] = useState<"classes" | "subjects" | "risk" | "dynamic">("classes");
  const [reportType, setReportType] = useState("quarter");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-montserrat font-bold text-2xl text-foreground">Аналитика и отчётность</h1>
          <p className="text-muted-foreground mt-1">Мониторинг успеваемости и посещаемости</p>
        </div>
        {(role === "admin" || role === "teacher") && (
          <div className="flex gap-2">
            <select
              value={reportType}
              onChange={e => setReportType(e.target.value)}
              className="px-4 py-2.5 rounded-2xl border border-border bg-white/60 text-sm outline-none focus:border-elzhur-blue transition-all"
            >
              <option value="quarter">Отчёт за четверть</option>
              <option value="month">Отчёт за месяц</option>
              <option value="year">Отчёт за год</option>
            </select>
            <button className="gradient-blue text-white px-5 py-2.5 rounded-2xl text-sm font-semibold shadow-card flex items-center gap-2 hover:shadow-card-hover transition-all">
              <Icon name="FileDown" size={16} />
              Скачать PDF
            </button>
          </div>
        )}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Средний балл по школе", value: "4.1", icon: "TrendingUp", gradient: "gradient-blue", sub: "+0.2 за четверть" },
          { label: "Посещаемость", value: "94%", icon: "UserCheck", gradient: "gradient-green", sub: "норма: >90%" },
          { label: "Учеников в группе риска", value: "3", icon: "AlertTriangle", gradient: "gradient-orange", sub: "требуют внимания" },
          { label: "Выполнение программы", value: "87%", icon: "ClipboardCheck", gradient: "gradient-cyan", sub: "10 классов" },
        ].map((kpi, i) => (
          <div key={i} className="glass rounded-3xl p-5 card-hover">
            <div className={`w-11 h-11 ${kpi.gradient} rounded-2xl flex items-center justify-center mb-3`}>
              <Icon name={kpi.icon} size={20} className="text-white" />
            </div>
            <div className="font-montserrat font-bold text-2xl text-foreground">{kpi.value}</div>
            <div className="text-sm text-foreground/80 mt-0.5 leading-tight">{kpi.label}</div>
            <div className="text-xs text-muted-foreground mt-1">{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {([
          { id: "classes",  label: "По классам",    icon: "Users" },
          { id: "subjects", label: "По предметам",  icon: "BookOpen" },
          { id: "risk",     label: "Группа риска",  icon: "AlertTriangle" },
          { id: "dynamic",  label: "Динамика",      icon: "TrendingUp" },
        ] as const).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all flex items-center gap-2 ${tab === t.id ? "gradient-blue text-white shadow-card" : "glass text-foreground hover:bg-white/80"}`}>
            <Icon name={t.icon} size={15} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: classes */}
      {tab === "classes" && (
        <div className="glass rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left p-4 text-sm font-semibold text-foreground">Класс</th>
                  <th className="p-4 text-center text-sm font-semibold text-foreground">Средний балл</th>
                  <th className="p-4 text-center text-sm font-semibold text-foreground">Посещаемость</th>
                  <th className="p-4 text-center text-sm font-semibold text-foreground">Учеников</th>
                  <th className="p-4 text-left text-sm font-semibold text-foreground">Лидер / Требует внимания</th>
                </tr>
              </thead>
              <tbody>
                {classStats.map((c, i) => (
                  <tr key={i} className="border-b border-border/20 hover:bg-white/40 transition-all">
                    <td className="p-4">
                      <span className="font-montserrat font-bold text-base text-foreground">{c.cls}</span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <span className={`font-bold text-lg ${avgColor(c.avg)}`}>{c.avg}</span>
                        <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full gradient-blue rounded-full" style={{ width: `${(c.avg / BAR_MAX) * 100}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`font-bold ${attColor(c.attendance)}`}>{c.attendance}%</span>
                    </td>
                    <td className="p-4 text-center text-sm text-muted-foreground">{c.students}</td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-emerald-600 font-medium">↑ {c.leader}</span>
                        <span className="text-xs text-red-500 font-medium">↓ {c.worst}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: subjects */}
      {tab === "subjects" && (
        <div className="glass rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left p-4 text-sm font-semibold text-foreground">Предмет</th>
                  <th className="p-4 text-center text-sm font-semibold text-foreground">Средний балл</th>
                  <th className="p-4 text-left text-sm font-semibold text-foreground">Учитель</th>
                  <th className="p-4 text-center text-sm font-semibold text-foreground">Испытывают трудности</th>
                </tr>
              </thead>
              <tbody>
                {subjectStats.map((s, i) => (
                  <tr key={i} className="border-b border-border/20 hover:bg-white/40 transition-all">
                    <td className="p-4 font-semibold text-foreground">{s.subj}</td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <span className={`font-bold text-lg ${avgColor(s.avg)}`}>{s.avg}</span>
                        <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full gradient-blue rounded-full" style={{ width: `${(s.avg / BAR_MAX) * 100}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{s.teachers}</td>
                    <td className="p-4 text-center">
                      <span className={`text-sm font-bold ${s.difficult > 20 ? "text-red-500" : s.difficult > 10 ? "text-amber-500" : "text-emerald-600"}`}>
                        {s.difficult}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: risk */}
      {tab === "risk" && (
        <div className="space-y-3">
          {riskStudents.map((s, i) => (
            <div key={i} className="glass rounded-3xl p-5 border-l-4 border-red-400">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 gradient-orange rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {s.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.cls} · {s.reason}</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-500">{s.avg}</div>
                    <div className="text-xs text-muted-foreground">Средний балл</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-amber-500">{s.absences}</div>
                    <div className="text-xs text-muted-foreground">Пропусков</div>
                  </div>
                </div>
                {role === "admin" && (
                  <button className="gradient-blue text-white px-4 py-2 rounded-2xl text-sm font-semibold shadow-card hover:shadow-card-hover transition-all">
                    Вызвать родителей
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: dynamic */}
      {tab === "dynamic" && (
        <div className="glass rounded-3xl p-6">
          <h3 className="font-montserrat font-bold text-lg text-foreground mb-5">Динамика по месяцам</h3>
          <div className="space-y-6">
            {monthlyDynamic.map((m, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-foreground">{m.month}</span>
                  <span className="text-muted-foreground">Средний: <strong className={avgColor(m.avg)}>{m.avg}</strong> · Посещ.: <strong className={attColor(m.attendance)}>{m.attendance}%</strong></span>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">Успеваемость</div>
                    <div className="h-3 bg-white/60 rounded-full overflow-hidden">
                      <div className="h-full gradient-blue rounded-full transition-all duration-700" style={{ width: `${(m.avg / 5) * 100}%` }} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">Посещаемость</div>
                    <div className="h-3 bg-white/60 rounded-full overflow-hidden">
                      <div className="h-full gradient-green rounded-full transition-all duration-700" style={{ width: `${m.attendance}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 rounded-2xl bg-blue-50 border border-blue-200">
            <div className="flex items-start gap-3">
              <Icon name="TrendingUp" size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-blue-800">Положительная динамика</div>
                <div className="text-xs text-blue-600 mt-0.5">Средний балл вырос на 0.3 балла за 4 месяца. Посещаемость улучшилась на 5%.</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
