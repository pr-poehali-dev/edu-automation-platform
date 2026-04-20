import { useState } from "react";
import Icon from "@/components/ui/icon";

const weekDays = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница"];
const weekDaysShort = ["Пн", "Вт", "Ср", "Чт", "Пт"];
const weekDates = ["14 апр", "15 апр", "16 апр", "17 апр", "18 апр"];

const subjectColors: Record<string, string> = {
  "Математика": "bg-blue-100 border-blue-300 text-blue-800",
  "Физика": "bg-cyan-100 border-cyan-300 text-cyan-800",
  "Алгебра": "bg-indigo-100 border-indigo-300 text-indigo-800",
  "Химия": "bg-emerald-100 border-emerald-300 text-emerald-800",
  "История": "bg-amber-100 border-amber-300 text-amber-800",
  "Литература": "bg-pink-100 border-pink-300 text-pink-800",
  "Английский": "bg-violet-100 border-violet-300 text-violet-800",
  "Русский язык": "bg-rose-100 border-rose-300 text-rose-800",
  "Биология": "bg-lime-100 border-lime-300 text-lime-800",
  "Геометрия": "bg-sky-100 border-sky-300 text-sky-800",
  "Информатика": "bg-purple-100 border-purple-300 text-purple-800",
  "Обществознание": "bg-orange-100 border-orange-300 text-orange-800",
  "Физкультура": "bg-teal-100 border-teal-300 text-teal-800",
};

type Lesson = { time: string; subject: string; class: string; teacher: string; room: string };
type ScheduleData = Record<string, Lesson[]>;

const scheduleData: ScheduleData = {
  "Понедельник": [
    { time: "08:00–08:45", subject: "Математика", class: "9А", teacher: "Иванова М.В.", room: "205" },
    { time: "09:00–09:45", subject: "Физика", class: "10Б", teacher: "Петров А.С.", room: "301" },
    { time: "10:00–10:45", subject: "Математика", class: "8В", teacher: "Иванова М.В.", room: "205" },
    { time: "11:00–11:45", subject: "Алгебра", class: "11А", teacher: "Иванова М.В.", room: "205" },
    { time: "12:00–12:45", subject: "Химия", class: "9Б", teacher: "Орлов Д.В.", room: "112" },
  ],
  "Вторник": [
    { time: "08:00–08:45", subject: "История", class: "10А", teacher: "Сидорова Н.П.", room: "406" },
    { time: "09:00–09:45", subject: "Физика", class: "9А", teacher: "Петров А.С.", room: "301" },
    { time: "10:00–10:45", subject: "Литература", class: "11А", teacher: "Козлова Е.В.", room: "201" },
    { time: "11:00–11:45", subject: "Английский", class: "8В", teacher: "Белова О.С.", room: "320" },
  ],
  "Среда": [
    { time: "08:00–08:45", subject: "Алгебра", class: "9А", teacher: "Иванова М.В.", room: "205" },
    { time: "09:00–09:45", subject: "Русский язык", class: "10Б", teacher: "Козлова Е.В.", room: "201" },
    { time: "10:00–10:45", subject: "Биология", class: "9Б", teacher: "Фёдорова А.Н.", room: "108" },
    { time: "11:00–11:45", subject: "Математика", class: "11А", teacher: "Иванова М.В.", room: "205" },
    { time: "12:00–12:45", subject: "Английский", class: "10А", teacher: "Белова О.С.", room: "320" },
    { time: "13:00–13:45", subject: "Физика", class: "8В", teacher: "Петров А.С.", room: "301" },
  ],
  "Четверг": [
    { time: "08:00–08:45", subject: "Геометрия", class: "9А", teacher: "Иванова М.В.", room: "205" },
    { time: "09:00–09:45", subject: "Обществознание", class: "11А", teacher: "Романова И.К.", room: "407" },
    { time: "10:00–10:45", subject: "Химия", class: "10Б", teacher: "Орлов Д.В.", room: "112" },
    { time: "11:00–11:45", subject: "История", class: "9Б", teacher: "Сидорова Н.П.", room: "406" },
  ],
  "Пятница": [
    { time: "08:00–08:45", subject: "Информатика", class: "9А", teacher: "Волков С.А.", room: "412" },
    { time: "09:00–09:45", subject: "Математика", class: "10А", teacher: "Иванова М.В.", room: "205" },
    { time: "10:00–10:45", subject: "Физкультура", class: "9А", teacher: "Громов П.В.", room: "Спортзал" },
    { time: "11:00–11:45", subject: "Литература", class: "10Б", teacher: "Козлова Е.В.", room: "201" },
    { time: "12:00–12:45", subject: "Биология", class: "11А", teacher: "Фёдорова А.Н.", room: "108" },
  ],
};

const currentHour = new Date().getHours();

function isCurrentLesson(time: string) {
  const start = parseInt(time.split(":")[0]);
  return currentHour >= start && currentHour < start + 1;
}

export default function Schedule() {
  const [activeDay, setActiveDay] = useState("Среда");
  const [view, setView] = useState<"day" | "week">("day");

  const lessons = scheduleData[activeDay] ?? [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-montserrat font-bold text-2xl text-foreground">Расписание уроков</h1>
          <p className="text-muted-foreground mt-1">Учебный план на неделю</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView("day")}
            className={`px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all flex items-center gap-2 ${
              view === "day" ? "gradient-blue text-white shadow-card" : "glass text-foreground"
            }`}
          >
            <Icon name="CalendarDays" size={16} />
            День
          </button>
          <button
            onClick={() => setView("week")}
            className={`px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all flex items-center gap-2 ${
              view === "week" ? "gradient-blue text-white shadow-card" : "glass text-foreground"
            }`}
          >
            <Icon name="LayoutGrid" size={16} />
            Неделя
          </button>
        </div>
      </div>

      {/* Day tabs */}
      <div className="glass rounded-3xl p-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {weekDays.map((d, i) => {
            const count = (scheduleData[d] ?? []).length;
            const isActive = activeDay === d;
            return (
              <button
                key={d}
                onClick={() => setActiveDay(d)}
                className={`flex-shrink-0 flex flex-col items-center px-5 py-3 rounded-2xl transition-all ${
                  isActive ? "gradient-blue text-white shadow-card" : "bg-white/60 text-foreground hover:bg-white"
                }`}
              >
                <span className={`text-xs font-medium ${isActive ? "text-white/80" : "text-muted-foreground"}`}>
                  {weekDaysShort[i]}
                </span>
                <span className={`text-sm font-bold mt-0.5 ${isActive ? "text-white" : "text-foreground"}`}>
                  {weekDates[i]}
                </span>
                <span className={`text-xs mt-1 ${isActive ? "text-white/70" : "text-muted-foreground"}`}>
                  {count} ур.
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {view === "day" ? (
        /* Day view */
        <div className="space-y-3">
          {lessons.map((lesson, i) => {
            const isCurrent = isCurrentLesson(lesson.time);
            const colorClass = subjectColors[lesson.subject] ?? "bg-gray-100 border-gray-300 text-gray-800";
            return (
              <div
                key={i}
                className={`glass rounded-3xl p-5 card-hover transition-all ${isCurrent ? "ring-2 ring-elzhur-blue shadow-glow-blue" : ""}`}
              >
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="text-center w-20 flex-shrink-0">
                    <div className="text-xs text-muted-foreground">Урок {i + 1}</div>
                    <div className="font-montserrat font-bold text-sm text-foreground mt-0.5">{lesson.time.split("–")[0]}</div>
                    <div className="text-xs text-muted-foreground">{lesson.time.split("–")[1]}</div>
                  </div>

                  <div className={`w-1 h-12 rounded-full flex-shrink-0 ${isCurrent ? "gradient-blue" : "bg-border"}`} />

                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-base font-bold text-foreground`}>{lesson.subject}</span>
                      {isCurrent && (
                        <span className="gradient-blue text-white text-xs px-2.5 py-1 rounded-full font-semibold animate-pulse-soft">
                          Сейчас
                        </span>
                      )}
                      <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${colorClass}`}>
                        {lesson.class}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Icon name="User" size={12} />
                        {lesson.teacher}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Icon name="MapPin" size={12} />
                        Каб. {lesson.room}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="p-2 rounded-xl bg-white/60 hover:bg-white transition-all">
                      <Icon name="Bell" size={16} className="text-muted-foreground" />
                    </button>
                    <button className="p-2 rounded-xl bg-white/60 hover:bg-white transition-all">
                      <Icon name="MoreHorizontal" size={16} className="text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Week view */
        <div className="glass rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[700px]">
              {/* Header */}
              <div className="grid grid-cols-5 border-b border-border/40">
                {weekDays.map((d, i) => (
                  <div key={d} className={`p-4 text-center ${activeDay === d ? "gradient-blue" : "bg-white/40"}`}>
                    <div className={`text-xs font-medium ${activeDay === d ? "text-white/80" : "text-muted-foreground"}`}>
                      {weekDaysShort[i]}
                    </div>
                    <div className={`text-sm font-bold mt-0.5 ${activeDay === d ? "text-white" : "text-foreground"}`}>
                      {weekDates[i]}
                    </div>
                  </div>
                ))}
              </div>
              {/* Cells */}
              <div className="grid grid-cols-5">
                {weekDays.map((d) => (
                  <div key={d} className="border-r border-border/20 last:border-r-0 p-2 space-y-1.5 min-h-[300px]">
                    {(scheduleData[d] ?? []).map((lesson, i) => {
                      const colorClass = subjectColors[lesson.subject] ?? "bg-gray-100 border-gray-300 text-gray-800";
                      return (
                        <div key={i} className={`p-2.5 rounded-xl border ${colorClass} cursor-pointer hover:opacity-80 transition-all`}>
                          <div className="text-xs font-bold">{lesson.subject}</div>
                          <div className="text-xs opacity-70 mt-0.5">{lesson.time.split("–")[0]} · {lesson.class}</div>
                          <div className="text-xs opacity-70">каб. {lesson.room}</div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-4 text-center">
          <div className="font-montserrat font-bold text-2xl text-elzhur-blue">
            {Object.values(scheduleData).flat().length}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Уроков в неделю</div>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <div className="font-montserrat font-bold text-2xl text-elzhur-violet">5</div>
          <div className="text-xs text-muted-foreground mt-1">Учебных дней</div>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <div className="font-montserrat font-bold text-2xl text-elzhur-green">
            {new Set(Object.values(scheduleData).flat().map(l => l.subject)).size}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Предметов</div>
        </div>
      </div>
    </div>
  );
}
