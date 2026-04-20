import { useState } from "react";
import Icon from "@/components/ui/icon";

const classes = ["9А", "9Б", "10А", "10Б", "11А"];
const subjects = ["Математика", "Физика", "Алгебра", "Геометрия", "Информатика"];

const students = [
  { id: 1, name: "Андреев Сергей", grades: [5, 4, null, 5, 4, null, 3, 5], attendance: [true, true, false, true, true, true, true, true] },
  { id: 2, name: "Борисова Анна", grades: [4, 5, 5, null, 4, 5, null, 4], attendance: [true, true, true, false, true, true, true, true] },
  { id: 3, name: "Волков Дмитрий", grades: [3, null, 4, 3, null, 4, 3, null], attendance: [true, false, true, true, true, false, true, true] },
  { id: 4, name: "Григорьева Мария", grades: [5, 5, null, 5, 5, null, 5, 5], attendance: [true, true, true, true, true, true, true, true] },
  { id: 5, name: "Дмитриев Иван", grades: [2, 3, null, 3, 2, null, 3, 2], attendance: [true, true, true, true, false, true, true, true] },
  { id: 6, name: "Ефимова Ольга", grades: [4, 4, 4, null, 5, 4, null, 4], attendance: [true, true, true, true, true, true, false, true] },
  { id: 7, name: "Зайцев Алексей", grades: [5, null, 5, 5, null, 5, 5, null], attendance: [true, true, true, true, true, true, true, true] },
  { id: 8, name: "Иванова Кристина", grades: [3, 4, null, 3, 4, null, 3, 4], attendance: [false, true, true, true, true, true, true, true] },
];

const dates = ["1 апр", "3 апр", "5 апр", "8 апр", "10 апр", "12 апр", "15 апр", "17 апр"];

const gradeStyle: Record<number, string> = {
  5: "bg-emerald-100 text-emerald-700 font-bold",
  4: "bg-blue-100 text-blue-700 font-bold",
  3: "bg-amber-100 text-amber-700 font-bold",
  2: "bg-red-100 text-red-700 font-bold",
};

function avgGrade(grades: (number | null)[]) {
  const valid = grades.filter((g): g is number => g !== null);
  if (!valid.length) return null;
  return (valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(1);
}

export default function Journal() {
  const [activeClass, setActiveClass] = useState("9А");
  const [activeSubject, setActiveSubject] = useState("Математика");
  const [editCell, setEditCell] = useState<{ row: number; col: number } | null>(null);
  const [tableData, setTableData] = useState(students);
  const [activeTab, setActiveTab] = useState<"grades" | "attendance">("grades");

  function handleGradeInput(studentIdx: number, gradeIdx: number, val: string) {
    const num = parseInt(val);
    if (val === "" || (num >= 1 && num <= 5)) {
      const updated = tableData.map((s, i) => {
        if (i !== studentIdx) return s;
        const newGrades = [...s.grades];
        newGrades[gradeIdx] = val === "" ? null : num;
        return { ...s, grades: newGrades };
      });
      setTableData(updated);
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-montserrat font-bold text-2xl text-foreground">Электронный журнал</h1>
          <p className="text-muted-foreground mt-1">Оценки и посещаемость учащихся</p>
        </div>
        <button className="gradient-blue text-white px-5 py-2.5 rounded-2xl text-sm font-semibold shadow-card flex items-center gap-2 hover:shadow-card-hover transition-all">
          <Icon name="Download" size={16} />
          Экспорт
        </button>
      </div>

      {/* Filters */}
      <div className="glass rounded-3xl p-5 flex flex-wrap gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-muted-foreground font-medium">Класс</span>
          <div className="flex gap-2 flex-wrap">
            {classes.map((cls) => (
              <button
                key={cls}
                onClick={() => setActiveClass(cls)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeClass === cls ? "gradient-blue text-white shadow-card" : "bg-white/60 text-foreground hover:bg-white"
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-muted-foreground font-medium">Предмет</span>
          <div className="flex gap-2 flex-wrap">
            {subjects.map((subj) => (
              <button
                key={subj}
                onClick={() => setActiveSubject(subj)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeSubject === subj ? "gradient-blue text-white shadow-card" : "bg-white/60 text-foreground hover:bg-white"
                }`}
              >
                {subj}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("grades")}
          className={`px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === "grades" ? "gradient-blue text-white shadow-card" : "glass text-foreground hover:bg-white/80"
          }`}
        >
          <Icon name="Star" size={16} />
          Оценки
        </button>
        <button
          onClick={() => setActiveTab("attendance")}
          className={`px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === "attendance" ? "gradient-blue text-white shadow-card" : "glass text-foreground hover:bg-white/80"
          }`}
        >
          <Icon name="UserCheck" size={16} />
          Посещаемость
        </button>
      </div>

      {/* Table */}
      <div className="glass rounded-3xl p-1 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-border/40">
                <th className="text-left p-4 font-semibold text-sm text-foreground w-48">
                  Ученик — {activeClass} · {activeSubject}
                </th>
                {dates.map((d) => (
                  <th key={d} className="p-3 text-center text-xs text-muted-foreground font-medium min-w-[60px]">{d}</th>
                ))}
                <th className="p-3 text-center text-xs text-muted-foreground font-medium">Средний</th>
                {activeTab === "attendance" && (
                  <th className="p-3 text-center text-xs text-muted-foreground font-medium">Пропуски</th>
                )}
              </tr>
            </thead>
            <tbody>
              {tableData.map((student, si) => {
                const avg = avgGrade(student.grades);
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
                            {editCell?.row === si && editCell?.col === gi ? (
                              <input
                                autoFocus
                                type="number"
                                min={1}
                                max={5}
                                defaultValue={g ?? ""}
                                onChange={(e) => handleGradeInput(si, gi, e.target.value)}
                                onBlur={() => setEditCell(null)}
                                className="w-10 h-8 text-center text-sm font-bold rounded-lg border border-elzhur-blue outline-none bg-white"
                              />
                            ) : (
                              <button
                                onClick={() => setEditCell({ row: si, col: gi })}
                                className={`w-9 h-8 rounded-xl text-sm transition-all hover:scale-110 ${
                                  g ? gradeStyle[g] : "text-transparent hover:bg-white/60 hover:text-muted-foreground"
                                }`}
                              >
                                {g ?? "+"}
                              </button>
                            )}
                          </td>
                        ))}
                        <td className="p-3 text-center">
                          {avg && (
                            <span className={`text-sm font-bold ${
                              parseFloat(avg) >= 4.5 ? "text-emerald-600" :
                              parseFloat(avg) >= 3.5 ? "text-blue-600" :
                              parseFloat(avg) >= 2.5 ? "text-amber-600" : "text-red-600"
                            }`}>{avg}</span>
                          )}
                        </td>
                      </>
                    ) : (
                      <>
                        {student.attendance.map((present, ai) => (
                          <td key={ai} className="p-2 text-center">
                            <div className={`w-7 h-7 rounded-full mx-auto flex items-center justify-center text-xs ${
                              present ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-500"
                            }`}>
                              {present ? "✓" : "н"}
                            </div>
                          </td>
                        ))}
                        <td className="p-3 text-center">
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
        <span className="text-sm font-medium text-foreground">Шкала оценок:</span>
        {[5, 4, 3, 2].map(g => (
          <div key={g} className="flex items-center gap-2">
            <span className={`w-8 h-7 rounded-lg flex items-center justify-center text-sm ${gradeStyle[g]}`}>{g}</span>
            <span className="text-xs text-muted-foreground">
              {g === 5 ? "Отлично" : g === 4 ? "Хорошо" : g === 3 ? "Удовл." : "Неудовл."}
            </span>
          </div>
        ))}
        <span className="text-xs text-muted-foreground ml-auto">Нажмите на ячейку, чтобы выставить оценку</span>
      </div>
    </div>
  );
}
