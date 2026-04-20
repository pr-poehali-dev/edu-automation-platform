import { useState } from "react";
import Icon from "@/components/ui/icon";

const weekDays = [
  { day: "Пн", date: "14 апр", full: "Понедельник" },
  { day: "Вт", date: "15 апр", full: "Вторник" },
  { day: "Ср", date: "16 апр", full: "Среда" },
  { day: "Чт", date: "17 апр", full: "Четверг" },
  { day: "Пт", date: "18 апр", full: "Пятница" },
];

const homeworks: Record<string, { subject: string; task: string; teacher: string; dueDate: string; completed: boolean; grade?: number; comment?: string; color: string }[]> = {
  "Пн": [
    { subject: "Математика", task: "Решить задачи §12, упр. 45–50. Повторить формулы тригонометрии.", teacher: "Иванова М.В.", dueDate: "До вт, 15 апр", completed: true, grade: 5, color: "gradient-blue" },
    { subject: "Физика", task: "Прочитать параграф 18. Ответить на вопросы 1–5.", teacher: "Петров А.С.", dueDate: "До вт, 15 апр", completed: true, grade: 4, color: "gradient-cyan" },
    { subject: "История", task: "Подготовить реферат на тему «Индустриализация в СССР».", teacher: "Сидорова Н.П.", dueDate: "До пт, 18 апр", completed: false, color: "gradient-orange" },
  ],
  "Вт": [
    { subject: "Русский язык", task: "Упражнение 312. Сочинение на тему «Моя будущая профессия» (120–150 слов).", teacher: "Козлова Е.В.", dueDate: "До ср, 16 апр", completed: false, color: "gradient-blue" },
    { subject: "Химия", task: "Записать уравнения реакций. Задача на вычисление молярной массы.", teacher: "Орлов Д.В.", dueDate: "До ср, 16 апр", completed: true, grade: 5, color: "gradient-green" },
  ],
  "Ср": [
    { subject: "Алгебра", task: "Решить систему уравнений из §15. Упражнения 78–82.", teacher: "Иванова М.В.", dueDate: "До чт, 17 апр", completed: false, color: "gradient-blue" },
    { subject: "Биология", task: "Нарисовать схему строения клетки. Подписать все органоиды.", teacher: "Фёдорова А.Н.", dueDate: "До чт, 17 апр", completed: false, color: "gradient-green" },
    { subject: "Английский", task: "Выучить слова Unit 7 (стр. 89). Подготовить монолог о хобби.", teacher: "Белова О.С.", dueDate: "До пт, 18 апр", completed: false, comment: "Пожалуйста, подготовьтесь к диалогу в парах", color: "gradient-cyan" },
  ],
  "Чт": [
    { subject: "Геометрия", task: "Доказать теорему Пифагора. Решить задачи 15.4–15.7.", teacher: "Иванова М.В.", dueDate: "До пт, 18 апр", completed: false, color: "gradient-blue" },
    { subject: "Обществознание", task: "Прочитать главу 4. Составить план параграфа.", teacher: "Романова И.К.", dueDate: "До пт, 18 апр", completed: false, color: "gradient-orange" },
  ],
  "Пт": [
    { subject: "Информатика", task: "Написать программу сортировки массива на Python. Сдать до воскресенья.", teacher: "Волков С.А.", dueDate: "До вс, 20 апр", completed: false, color: "gradient-violet" },
    { subject: "Физкультура", task: "Принести справку от врача. Повторить нормативы ГТО.", teacher: "Громов П.В.", dueDate: "До пн, 21 апр", completed: false, color: "gradient-green" },
  ],
};

export default function Diary() {
  const [activeDay, setActiveDay] = useState("Ср");
  const [tasks, setTasks] = useState(homeworks);
  const [showAdd, setShowAdd] = useState(false);
  const [newTask, setNewTask] = useState({ subject: "", task: "", dueDate: "" });

  const currentTasks = tasks[activeDay] ?? [];
  const completedCount = currentTasks.filter(t => t.completed).length;

  function toggleComplete(idx: number) {
    setTasks(prev => {
      const updated = [...(prev[activeDay] ?? [])];
      updated[idx] = { ...updated[idx], completed: !updated[idx].completed };
      return { ...prev, [activeDay]: updated };
    });
  }

  function addTask() {
    if (!newTask.subject || !newTask.task) return;
    const colors = ["gradient-blue", "gradient-green", "gradient-cyan", "gradient-orange"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    setTasks(prev => ({
      ...prev,
      [activeDay]: [...(prev[activeDay] ?? []), {
        subject: newTask.subject,
        task: newTask.task,
        teacher: "Вы",
        dueDate: newTask.dueDate || "Без срока",
        completed: false,
        color,
      }],
    }));
    setNewTask({ subject: "", task: "", dueDate: "" });
    setShowAdd(false);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-montserrat font-bold text-2xl text-foreground">Электронный дневник</h1>
          <p className="text-muted-foreground mt-1">Домашние задания и комментарии учителей</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="gradient-blue text-white px-5 py-2.5 rounded-2xl text-sm font-semibold shadow-card flex items-center gap-2 hover:shadow-card-hover transition-all"
        >
          <Icon name="Plus" size={16} />
          Добавить задание
        </button>
      </div>

      {/* Week selector */}
      <div className="glass rounded-3xl p-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {weekDays.map((d) => {
            const dayTasks = tasks[d.day] ?? [];
            const done = dayTasks.filter(t => t.completed).length;
            const isActive = activeDay === d.day;
            return (
              <button
                key={d.day}
                onClick={() => setActiveDay(d.day)}
                className={`flex-shrink-0 flex flex-col items-center px-5 py-3 rounded-2xl transition-all ${
                  isActive ? "gradient-blue text-white shadow-card" : "bg-white/60 text-foreground hover:bg-white"
                }`}
              >
                <span className={`text-xs font-medium ${isActive ? "text-white/80" : "text-muted-foreground"}`}>{d.day}</span>
                <span className={`text-sm font-bold mt-0.5 ${isActive ? "text-white" : "text-foreground"}`}>{d.date}</span>
                {dayTasks.length > 0 && (
                  <div className={`mt-1.5 text-xs px-2 py-0.5 rounded-full ${
                    isActive ? "bg-white/20 text-white" : done === dayTasks.length ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                  }`}>
                    {done}/{dayTasks.length}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress */}
      {currentTasks.length > 0 && (
        <div className="glass rounded-2xl px-5 py-4 flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-foreground">Выполнено сегодня</span>
              <span className="text-muted-foreground">{completedCount} из {currentTasks.length}</span>
            </div>
            <div className="h-2.5 bg-white/60 rounded-full overflow-hidden">
              <div
                className="h-full gradient-green rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / currentTasks.length) * 100}%` }}
              />
            </div>
          </div>
          {completedCount === currentTasks.length && (
            <div className="flex items-center gap-2 text-emerald-600">
              <Icon name="CheckCircle" size={20} />
              <span className="text-sm font-semibold">Всё готово!</span>
            </div>
          )}
        </div>
      )}

      {/* Tasks */}
      <div className="space-y-4">
        {currentTasks.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center">
            <Icon name="PartyPopper" size={40} className="text-elzhur-green mx-auto mb-3" />
            <p className="font-montserrat font-bold text-lg text-foreground">Нет заданий!</p>
            <p className="text-muted-foreground text-sm mt-1">На этот день домашних заданий нет</p>
          </div>
        ) : (
          currentTasks.map((hw, i) => (
            <div
              key={i}
              className={`glass rounded-3xl p-5 transition-all card-hover ${hw.completed ? "opacity-70" : ""}`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-2 self-stretch rounded-full ${hw.color} flex-shrink-0`} />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-montserrat font-bold text-foreground">{hw.subject}</span>
                        {hw.grade && (
                          <span className={`text-sm font-bold px-2 py-0.5 rounded-lg ${
                            hw.grade === 5 ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                          }`}>
                            Оценка: {hw.grade}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{hw.teacher} · {hw.dueDate}</div>
                    </div>
                    <button
                      onClick={() => toggleComplete(i)}
                      className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                        hw.completed
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "border-border hover:border-elzhur-blue"
                      }`}
                    >
                      {hw.completed && <Icon name="Check" size={14} />}
                    </button>
                  </div>

                  <p className={`text-sm mt-3 leading-relaxed ${hw.completed ? "line-through text-muted-foreground" : "text-foreground/80"}`}>
                    {hw.task}
                  </p>

                  {hw.comment && (
                    <div className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
                      <Icon name="MessageCircle" size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-amber-700">{hw.comment}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add task modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="glass rounded-3xl p-6 w-full max-w-md shadow-card-hover" onClick={e => e.stopPropagation()}>
            <h3 className="font-montserrat font-bold text-lg text-foreground mb-5">Добавить задание</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Предмет</label>
                <input
                  value={newTask.subject}
                  onChange={e => setNewTask(p => ({ ...p, subject: e.target.value }))}
                  placeholder="Математика"
                  className="w-full mt-1.5 px-4 py-3 rounded-2xl border border-border bg-white/60 text-sm outline-none focus:border-elzhur-blue transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Задание</label>
                <textarea
                  value={newTask.task}
                  onChange={e => setNewTask(p => ({ ...p, task: e.target.value }))}
                  placeholder="Описание задания..."
                  rows={3}
                  className="w-full mt-1.5 px-4 py-3 rounded-2xl border border-border bg-white/60 text-sm outline-none focus:border-elzhur-blue transition-all resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Срок сдачи</label>
                <input
                  value={newTask.dueDate}
                  onChange={e => setNewTask(p => ({ ...p, dueDate: e.target.value }))}
                  placeholder="До пт, 18 апр"
                  className="w-full mt-1.5 px-4 py-3 rounded-2xl border border-border bg-white/60 text-sm outline-none focus:border-elzhur-blue transition-all"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-3 rounded-2xl bg-white/60 text-sm font-semibold text-foreground hover:bg-white transition-all">
                Отмена
              </button>
              <button onClick={addTask} className="flex-1 py-3 rounded-2xl gradient-blue text-white text-sm font-semibold shadow-card hover:shadow-card-hover transition-all">
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
