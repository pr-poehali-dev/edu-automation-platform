import { useState } from "react";
import Icon from "@/components/ui/icon";

interface JournalProps {
  role: "teacher" | "student" | "parent";
}

const classes = ["9А", "9Б", "10А", "10Б", "11А"];
const subjects = ["Математика", "Физика", "Алгебра", "Геометрия", "Информатика"];

const dates = ["1 апр", "3 апр", "5 апр", "8 апр", "10 апр", "12 апр", "15 апр", "17 апр"];

type GradeEntry = { value: number | null; comment: string };

interface Student {
  id: number;
  name: string;
  grades: GradeEntry[];
  attendance: boolean[];
}

const initialStudents: Student[] = [
  { id: 1, name: "Андреев Сергей",   grades: [{value:5,comment:""},{value:4,comment:""},{value:null,comment:""},{value:5,comment:"Отличная работа!"},{value:4,comment:""},{value:null,comment:""},{value:3,comment:"Нужно повторить тему"},{value:5,comment:""}], attendance: [true,true,false,true,true,true,true,true] },
  { id: 2, name: "Борисова Анна",    grades: [{value:4,comment:""},{value:5,comment:""},{value:5,comment:""},{value:null,comment:""},{value:4,comment:""},{value:5,comment:""},{value:null,comment:""},{value:4,comment:""}], attendance: [true,true,true,false,true,true,true,true] },
  { id: 3, name: "Волков Дмитрий",   grades: [{value:3,comment:"Не доделал работу"},{value:null,comment:""},{value:4,comment:""},{value:3,comment:""},{value:null,comment:""},{value:4,comment:""},{value:3,comment:""},{value:null,comment:""}], attendance: [true,false,true,true,true,false,true,true] },
  { id: 4, name: "Григорьева Мария", grades: [{value:5,comment:""},{value:5,comment:""},{value:null,comment:""},{value:5,comment:""},{value:5,comment:""},{value:null,comment:""},{value:5,comment:""},{value:5,comment:""}], attendance: [true,true,true,true,true,true,true,true] },
  { id: 5, name: "Дмитриев Иван",    grades: [{value:2,comment:"Не готов к уроку"},{value:3,comment:""},{value:null,comment:""},{value:3,comment:""},{value:2,comment:""},{value:null,comment:""},{value:3,comment:""},{value:2,comment:"Нужна помощь"}], attendance: [true,true,true,true,false,true,true,true] },
  { id: 6, name: "Ефимова Ольга",    grades: [{value:4,comment:""},{value:4,comment:""},{value:4,comment:""},{value:null,comment:""},{value:5,comment:""},{value:4,comment:""},{value:null,comment:""},{value:4,comment:""}], attendance: [true,true,true,true,true,true,false,true] },
  { id: 7, name: "Зайцев Алексей",   grades: [{value:5,comment:""},{value:null,comment:""},{value:5,comment:""},{value:5,comment:""},{value:null,comment:""},{value:5,comment:""},{value:5,comment:""},{value:null,comment:""}], attendance: [true,true,true,true,true,true,true,true] },
  { id: 8, name: "Иванова Кристина", grades: [{value:3,comment:""},{value:4,comment:""},{value:null,comment:""},{value:3,comment:""},{value:4,comment:""},{value:null,comment:""},{value:3,comment:""},{value:4,comment:""}], attendance: [false,true,true,true,true,true,true,true] },
];

const gradeStyle: Record<number, string> = {
  5: "bg-emerald-100 text-emerald-700",
  4: "bg-blue-100 text-blue-700",
  3: "bg-amber-100 text-amber-700",
  2: "bg-red-100 text-red-700",
};

function calcQuarter(grades: GradeEntry[]): string {
  const valid = grades.map(g => g.value).filter((v): v is number => v !== null);
  if (valid.length < 3) return "Н/А";
  const avg = valid.reduce((a, b) => a + b, 0) / valid.length;
  return String(Math.round(avg));
}

function quarterStyle(q: string) {
  if (q === "Н/А") return "bg-gray-100 text-gray-500 italic";
  const n = parseInt(q);
  if (n >= 5) return "bg-emerald-100 text-emerald-700";
  if (n >= 4) return "bg-blue-100 text-blue-700";
  if (n >= 3) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}

export default function Journal({ role }: JournalProps) {
  const [activeClass, setActiveClass] = useState("9А");
  const [activeSubject, setActiveSubject] = useState("Математика");
  const [tableData, setTableData] = useState(initialStudents);
  const [activeTab, setActiveTab] = useState<"grades" | "attendance">("grades");

  const [editCell, setEditCell] = useState<{ row: number; col: number } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editComment, setEditComment] = useState("");

  const isTeacher = role === "teacher";

  function openEdit(si: number, gi: number) {
    if (!isTeacher) return;
    const g = tableData[si].grades[gi];
    setEditCell({ row: si, col: gi });
    setEditValue(g.value !== null ? String(g.value) : "");
    setEditComment(g.comment);
  }

  function saveEdit() {
    if (!editCell) return;
    const { row, col } = editCell;
    const num = parseInt(editValue);
    const newValue = editValue === "" ? null : (num >= 1 && num <= 5 ? num : null);
    setTableData(prev => prev.map((s, i) => {
      if (i !== row) return s;
      const newGrades = [...s.grades];
      newGrades[col] = { value: newValue, comment: editComment };
      return { ...s, grades: newGrades };
    }));
    setEditCell(null);
  }

  function deleteGrade() {
    if (!editCell) return;
    const { row, col } = editCell;
    setTableData(prev => prev.map((s, i) => {
      if (i !== row) return s;
      const newGrades = [...s.grades];
      newGrades[col] = { value: null, comment: "" };
      return { ...s, grades: newGrades };
    }));
    setEditCell(null);
  }

  function toggleAttendance(si: number, ai: number) {
    if (!isTeacher) return;
    setTableData(prev => prev.map((s, i) => {
      if (i !== si) return s;
      const att = [...s.attendance];
      att[ai] = !att[ai];
      return { ...s, attendance: att };
    }));
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-montserrat font-bold text-2xl text-foreground">Электронный журнал</h1>
          <p className="text-muted-foreground mt-1">
            {isTeacher ? "Оценки и посещаемость — режим редактирования" : "Просмотр оценок и посещаемости"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${isTeacher ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}`}>
            {isTeacher ? "Учитель" : role === "student" ? "Ученик" : "Родитель"}
          </span>
          {isTeacher && (
            <button className="gradient-blue text-white px-5 py-2.5 rounded-2xl text-sm font-semibold shadow-card flex items-center gap-2 hover:shadow-card-hover transition-all">
              <Icon name="Download" size={16} />
              Экспорт
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="glass rounded-3xl p-5 flex flex-wrap gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-muted-foreground font-medium">Класс</span>
          <div className="flex gap-2 flex-wrap">
            {classes.map((cls) => (
              <button key={cls} onClick={() => setActiveClass(cls)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeClass === cls ? "gradient-blue text-white shadow-card" : "bg-white/60 text-foreground hover:bg-white"}`}>
                {cls}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-muted-foreground font-medium">Предмет</span>
          <div className="flex gap-2 flex-wrap">
            {subjects.map((subj) => (
              <button key={subj} onClick={() => setActiveSubject(subj)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeSubject === subj ? "gradient-blue text-white shadow-card" : "bg-white/60 text-foreground hover:bg-white"}`}>
                {subj}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["grades", "attendance"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === tab ? "gradient-blue text-white shadow-card" : "glass text-foreground hover:bg-white/80"}`}>
            <Icon name={tab === "grades" ? "Star" : "UserCheck"} size={16} />
            {tab === "grades" ? "Оценки" : "Посещаемость"}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass rounded-3xl p-1 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px]">
            <thead>
              <tr className="border-b border-border/40">
                <th className="text-left p-4 font-semibold text-sm text-foreground w-48">
                  {activeClass} · {activeSubject}
                </th>
                {dates.map((d) => (
                  <th key={d} className="p-3 text-center text-xs text-muted-foreground font-medium min-w-[60px]">{d}</th>
                ))}
                <th className="p-3 text-center text-xs font-semibold text-foreground min-w-[72px] border-l border-border/30">
                  За четверть
                </th>
                {activeTab === "attendance" && (
                  <th className="p-3 text-center text-xs text-muted-foreground font-medium">Пропуски</th>
                )}
              </tr>
            </thead>
            <tbody>
              {tableData.map((student, si) => {
                const quarter = calcQuarter(student.grades);
                const absences = student.attendance.filter(a => !a).length;
                return (
                  <tr key={student.id} className="border-b border-border/20 hover:bg-white/40 transition-all">
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 gradient-blue rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {student.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span className="text-sm font-medium text-foreground">{student.name}</span>
                      </div>
                    </td>

                    {activeTab === "grades" ? (
                      <>
                        {student.grades.map((g, gi) => (
                          <td key={gi} className="p-2 text-center">
                            <button
                              onClick={() => openEdit(si, gi)}
                              title={g.comment || undefined}
                              className={`relative w-9 h-8 rounded-xl text-sm font-bold transition-all
                                ${g.value ? gradeStyle[g.value] : "text-muted-foreground/40 hover:bg-white/60"}
                                ${isTeacher ? "cursor-pointer hover:scale-110" : "cursor-default"}
                              `}
                            >
                              {g.value ?? (isTeacher ? "+" : "—")}
                              {g.comment && (
                                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border border-white" />
                              )}
                            </button>
                          </td>
                        ))}
                        <td className="p-3 text-center border-l border-border/30">
                          <span className={`text-sm font-bold px-2.5 py-1 rounded-xl ${quarterStyle(quarter)}`}>
                            {quarter}
                          </span>
                        </td>
                      </>
                    ) : (
                      <>
                        {student.attendance.map((present, ai) => (
                          <td key={ai} className="p-2 text-center">
                            <button
                              onClick={() => toggleAttendance(si, ai)}
                              className={`w-7 h-7 rounded-full mx-auto flex items-center justify-center text-xs transition-all
                                ${present ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-500"}
                                ${isTeacher ? "cursor-pointer hover:scale-110" : "cursor-default"}
                              `}
                            >
                              {present ? "✓" : "н"}
                            </button>
                          </td>
                        ))}
                        <td className="p-3 text-center border-l border-border/30">
                          <span className={`text-sm font-bold ${absences === 0 ? "text-emerald-600" : absences <= 2 ? "text-amber-600" : "text-red-600"}`}>
                            {absences === 0 ? "0" : `−${absences}`}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="text-sm text-muted-foreground">{absences} ур.</span>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="glass rounded-2xl px-5 py-4 flex flex-wrap gap-4 items-center">
        <span className="text-sm font-medium text-foreground">Шкала:</span>
        {[5, 4, 3, 2].map(g => (
          <div key={g} className="flex items-center gap-1.5">
            <span className={`w-8 h-7 rounded-lg flex items-center justify-center text-sm font-bold ${gradeStyle[g]}`}>{g}</span>
            <span className="text-xs text-muted-foreground">{g === 5 ? "Отлично" : g === 4 ? "Хорошо" : g === 3 ? "Удовл." : "Неудовл."}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 ml-1">
          <span className="w-12 h-7 rounded-lg flex items-center justify-center text-xs font-bold italic bg-gray-100 text-gray-500">Н/А</span>
          <span className="text-xs text-muted-foreground">менее 3 оценок</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
          <span className="text-xs text-muted-foreground">есть комментарий</span>
        </div>
        {isTeacher && (
          <span className="text-xs text-muted-foreground ml-auto">Нажмите на ячейку для редактирования</span>
        )}
      </div>

      {/* Edit modal */}
      {editCell && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setEditCell(null)}>
          <div className="glass rounded-3xl p-6 w-full max-w-sm shadow-card-hover" onClick={e => e.stopPropagation()}>
            <h3 className="font-montserrat font-bold text-lg text-foreground mb-1">Выставить оценку</h3>
            <p className="text-sm text-muted-foreground mb-5">
              {tableData[editCell.row].name} · {dates[editCell.col]}
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Оценка</label>
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      onClick={() => setEditValue(editValue === String(n) ? "" : String(n))}
                      className={`flex-1 h-11 rounded-xl text-sm font-bold transition-all ${
                        editValue === String(n)
                          ? gradeStyle[n] + " ring-2 ring-offset-1 ring-current scale-105"
                          : "bg-white/60 text-foreground hover:bg-white"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Комментарий учителя</label>
                <textarea
                  value={editComment}
                  onChange={e => setEditComment(e.target.value)}
                  placeholder="Необязательно — видно ученику и родителю..."
                  rows={3}
                  className="w-full mt-1.5 px-4 py-3 rounded-2xl border border-border bg-white/60 text-sm outline-none focus:border-elzhur-blue transition-all resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={deleteGrade}
                className="px-4 py-3 rounded-2xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-all"
              >
                Удалить
              </button>
              <button
                onClick={() => setEditCell(null)}
                className="flex-1 py-3 rounded-2xl bg-white/60 text-sm font-semibold text-foreground hover:bg-white transition-all"
              >
                Отмена
              </button>
              <button
                onClick={saveEdit}
                className="flex-1 py-3 rounded-2xl gradient-blue text-white text-sm font-semibold shadow-card hover:shadow-card-hover transition-all"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
