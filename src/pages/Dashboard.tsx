import Icon from "@/components/ui/icon";

const stats = [
  { label: "Учеников", value: "127", icon: "Users", gradient: "gradient-blue", change: "+3 за месяц" },
  { label: "Средний балл", value: "4.2", icon: "TrendingUp", gradient: "gradient-green", change: "+0.1 за месяц" },
  { label: "Посещаемость", value: "94%", icon: "UserCheck", gradient: "gradient-cyan", change: "выше нормы" },
  { label: "Заданий сегодня", value: "8", icon: "ClipboardList", gradient: "gradient-orange", change: "3 на проверке" },
];

const recentGrades = [
  { student: "Анна Смирнова", subject: "Математика", grade: 5, date: "Сегодня, 10:20" },
  { student: "Иван Петров", subject: "Физика", grade: 4, date: "Сегодня, 09:45" },
  { student: "Мария Козлова", subject: "Химия", grade: 3, date: "Вчера, 15:30" },
  { student: "Дмитрий Орлов", subject: "История", grade: 5, date: "Вчера, 14:00" },
  { student: "Ольга Новикова", subject: "Литература", grade: 4, date: "Вчера, 11:15" },
];

const todaySchedule = [
  { time: "08:00", subject: "Математика", class: "9А", room: "205", status: "done" },
  { time: "09:00", subject: "Физика", class: "10Б", room: "301", status: "done" },
  { time: "10:00", subject: "Математика", class: "8В", room: "205", status: "current" },
  { time: "11:00", subject: "Алгебра", class: "11А", room: "205", status: "upcoming" },
  { time: "12:00", subject: "Физика", class: "9Б", room: "301", status: "upcoming" },
];

const quickActions = [
  { label: "Выставить оценку", icon: "Star", color: "text-elzhur-blue" },
  { label: "Задать ДЗ", icon: "BookMarked", color: "text-elzhur-violet" },
  { label: "Отметить посещаемость", icon: "ClipboardCheck", color: "text-elzhur-green" },
  { label: "Отправить уведомление", icon: "Send", color: "text-elzhur-orange" },
];

const gradeColor: Record<number, string> = {
  5: "grade-5",
  4: "grade-4",
  3: "grade-3",
  2: "grade-2",
};

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-montserrat font-bold text-2xl text-foreground">Добро пожаловать, Алексей!</h1>
        <p className="text-muted-foreground mt-1">Вот что происходит в школе сегодня</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div
            key={i}
            className={`glass rounded-3xl p-5 card-hover stagger-${i + 1} animate-slide-up`}
          >
            <div className={`w-12 h-12 ${s.gradient} rounded-2xl flex items-center justify-center mb-3 shadow-card`}>
              <Icon name={s.icon} size={22} className="text-white" />
            </div>
            <div className="font-montserrat font-bold text-2xl text-foreground">{s.value}</div>
            <div className="text-sm font-medium text-foreground/80 mt-0.5">{s.label}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.change}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent grades */}
        <div className="lg:col-span-2 glass rounded-3xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-montserrat font-bold text-lg text-foreground">Последние оценки</h2>
            <span className="text-xs text-elzhur-blue font-medium cursor-pointer hover:underline">Все оценки</span>
          </div>
          <div className="space-y-3">
            {recentGrades.map((g, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/50 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 gradient-blue rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {g.student.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{g.student}</div>
                    <div className="text-xs text-muted-foreground">{g.subject}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xl ${gradeColor[g.grade] ?? "font-bold"}`}>{g.grade}</div>
                  <div className="text-xs text-muted-foreground">{g.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today schedule */}
        <div className="glass rounded-3xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-montserrat font-bold text-lg text-foreground">Расписание</h2>
            <span className="text-xs text-elzhur-blue font-medium cursor-pointer hover:underline">Полное</span>
          </div>
          <div className="space-y-2">
            {todaySchedule.map((lesson, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl transition-all ${
                  lesson.status === "current"
                    ? "gradient-blue text-white shadow-glow-blue"
                    : lesson.status === "done"
                    ? "bg-white/40 opacity-60"
                    : "bg-white/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-sm font-semibold ${lesson.status === "current" ? "text-white" : "text-foreground"}`}>
                      {lesson.subject}
                    </div>
                    <div className={`text-xs mt-0.5 ${lesson.status === "current" ? "text-white/80" : "text-muted-foreground"}`}>
                      {lesson.class} · каб. {lesson.room}
                    </div>
                  </div>
                  <div className={`text-xs font-bold ${lesson.status === "current" ? "text-white" : "text-muted-foreground"}`}>
                    {lesson.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="glass rounded-3xl p-6">
        <h2 className="font-montserrat font-bold text-lg text-foreground mb-4">Быстрые действия</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action, i) => (
            <button
              key={i}
              className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/60 hover:bg-white hover:shadow-card transition-all card-hover text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-card flex items-center justify-center">
                <Icon name={action.icon} size={22} className={action.color} />
              </div>
              <span className="text-sm font-medium text-foreground leading-tight">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
