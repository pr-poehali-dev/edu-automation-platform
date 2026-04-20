import { useState } from "react";
import Icon from "@/components/ui/icon";

type NotifType = "grade" | "homework" | "attendance" | "message" | "event";

interface Notification {
  id: number;
  type: NotifType;
  title: string;
  body: string;
  from: string;
  time: string;
  read: boolean;
  avatar?: string;
}

const initialNotifications: Notification[] = [
  { id: 1, type: "grade", title: "Новая оценка", body: "Анна Смирнова получила оценку «5» по Математике", from: "Электронный журнал", time: "5 мин назад", read: false },
  { id: 2, type: "homework", title: "Новое домашнее задание", body: "По Физике задано: прочитать §18, ответить на вопросы 1–5", from: "Петров А.С.", time: "20 мин назад", read: false },
  { id: 3, type: "attendance", title: "Отсутствие на уроке", body: "Дмитрий Волков отсутствовал на уроке Физики (3-й урок)", from: "Система посещаемости", time: "1 час назад", read: false },
  { id: 4, type: "message", title: "Сообщение от родителя", body: "Мама Анны Смирновой: «Анна сегодня болеет, пропустит занятия»", from: "Смирнова О.В.", time: "2 часа назад", read: false },
  { id: 5, type: "event", title: "Школьная олимпиада", body: "Напоминание: завтра в 10:00 олимпиада по математике, актовый зал", from: "Администрация школы", time: "3 часа назад", read: true },
  { id: 6, type: "grade", title: "Новые оценки выставлены", body: "Иван Петров: Физика — 4, Мария Козлова: Химия — 3", from: "Электронный журнал", time: "Вчера, 16:45", read: true },
  { id: 7, type: "homework", title: "Задание сдано", body: "Ольга Новикова сдала работу по Литературе", from: "Система сдачи работ", time: "Вчера, 15:20", read: true },
  { id: 8, type: "event", title: "Родительское собрание", body: "Родительское собрание 9А класса в четверг в 18:00, кабинет 205", from: "Классный руководитель", time: "Вчера, 09:00", read: true },
  { id: 9, type: "attendance", title: "Сводка посещаемости", body: "За неделю: 3 пропуска без уважительной причины в 9А классе", from: "Система мониторинга", time: "2 дня назад", read: true },
  { id: 10, type: "message", title: "Сообщение от директора", body: "Уважаемые коллеги, в пятницу педсовет в 15:00 в актовом зале", from: "Директор школы", time: "3 дня назад", read: true },
];

const typeConfig: Record<NotifType, { icon: string; gradient: string; label: string }> = {
  grade: { icon: "Star", gradient: "gradient-blue", label: "Оценки" },
  homework: { icon: "BookMarked", gradient: "gradient-violet", label: "Задания" },
  attendance: { icon: "UserCheck", gradient: "gradient-green", label: "Посещаемость" },
  message: { icon: "MessageCircle", gradient: "gradient-cyan", label: "Сообщения" },
  event: { icon: "CalendarDays", gradient: "gradient-orange", label: "События" },
};

const filters: { id: NotifType | "all"; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "grade", label: "Оценки" },
  { id: "homework", label: "Задания" },
  { id: "attendance", label: "Посещаемость" },
  { id: "message", label: "Сообщения" },
  { id: "event", label: "События" },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeFilter, setActiveFilter] = useState<NotifType | "all">("all");
  const [showCompose, setShowCompose] = useState(false);
  const [compose, setCompose] = useState({ to: "", subject: "", body: "" });

  const unreadCount = notifications.filter(n => !n.read).length;

  const filtered = activeFilter === "all"
    ? notifications
    : notifications.filter(n => n.type === activeFilter);

  function markRead(id: number) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  function deleteNotif(id: number) {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-montserrat font-bold text-2xl text-foreground">Уведомления</h1>
            {unreadCount > 0 && (
              <span className="gradient-blue text-white text-xs font-bold px-2.5 py-1 rounded-full notification-badge">
                {unreadCount}
              </span>
            )}
          </div>
          <p className="text-muted-foreground mt-1">Оповещения для учителей, учеников и родителей</p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="glass px-4 py-2.5 rounded-2xl text-sm font-semibold text-foreground hover:bg-white/80 transition-all flex items-center gap-2"
            >
              <Icon name="CheckCheck" size={16} />
              Прочитать все
            </button>
          )}
          <button
            onClick={() => setShowCompose(true)}
            className="gradient-blue text-white px-5 py-2.5 rounded-2xl text-sm font-semibold shadow-card flex items-center gap-2 hover:shadow-card-hover transition-all"
          >
            <Icon name="Send" size={16} />
            Отправить
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(Object.entries(typeConfig) as [NotifType, typeof typeConfig[NotifType]][]).map(([type, cfg]) => {
          const count = notifications.filter(n => n.type === type && !n.read).length;
          return (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`glass rounded-2xl p-4 text-left transition-all card-hover ${activeFilter === type ? "ring-2 ring-elzhur-blue" : ""}`}
            >
              <div className={`w-9 h-9 ${cfg.gradient} rounded-xl flex items-center justify-center mb-2`}>
                <Icon name={cfg.icon} size={16} className="text-white" />
              </div>
              <div className="font-bold text-xl text-foreground">{count > 0 ? count : "✓"}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{cfg.label}</div>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeFilter === f.id ? "gradient-blue text-white shadow-card" : "glass text-foreground hover:bg-white/80"
            }`}
          >
            {f.label}
            {f.id !== "all" && (
              <span className="ml-1.5 text-xs opacity-70">
                ({notifications.filter(n => n.type === f.id).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.map((notif) => {
          const cfg = typeConfig[notif.type];
          return (
            <div
              key={notif.id}
              className={`glass rounded-2xl p-4 transition-all cursor-pointer hover:shadow-card ${
                !notif.read ? "border-l-4 border-elzhur-blue" : ""
              }`}
              onClick={() => markRead(notif.id)}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 ${cfg.gradient} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-card`}>
                  <Icon name={cfg.icon} size={18} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${!notif.read ? "text-foreground" : "text-foreground/70"}`}>
                        {notif.title}
                      </span>
                      {!notif.read && (
                        <span className="w-2 h-2 bg-elzhur-blue rounded-full flex-shrink-0 notification-badge" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{notif.time}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteNotif(notif.id); }}
                        className="p-1 rounded-lg hover:bg-white/60 transition-all"
                      >
                        <Icon name="X" size={14} className="text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                  <p className={`text-sm mt-1 leading-relaxed ${!notif.read ? "text-foreground/80" : "text-muted-foreground"}`}>
                    {notif.body}
                  </p>
                  <span className="text-xs text-muted-foreground mt-1.5 block">От: {notif.from}</span>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="glass rounded-3xl p-12 text-center">
            <Icon name="BellOff" size={40} className="text-muted-foreground mx-auto mb-3" />
            <p className="font-montserrat font-bold text-lg text-foreground">Нет уведомлений</p>
            <p className="text-muted-foreground text-sm mt-1">В этой категории пока ничего нет</p>
          </div>
        )}
      </div>

      {/* Compose modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowCompose(false)}>
          <div className="glass rounded-3xl p-6 w-full max-w-md shadow-card-hover" onClick={e => e.stopPropagation()}>
            <h3 className="font-montserrat font-bold text-lg text-foreground mb-5">Отправить уведомление</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Кому</label>
                <select
                  value={compose.to}
                  onChange={e => setCompose(p => ({ ...p, to: e.target.value }))}
                  className="w-full mt-1.5 px-4 py-3 rounded-2xl border border-border bg-white/60 text-sm outline-none focus:border-elzhur-blue transition-all"
                >
                  <option value="">Выберите получателя...</option>
                  <option>Все родители 9А</option>
                  <option>Все ученики 10Б</option>
                  <option>Все учителя</option>
                  <option>Вся школа</option>
                  <option>Анна Смирнова</option>
                  <option>Иван Петров</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Тема</label>
                <input
                  value={compose.subject}
                  onChange={e => setCompose(p => ({ ...p, subject: e.target.value }))}
                  placeholder="Тема уведомления"
                  className="w-full mt-1.5 px-4 py-3 rounded-2xl border border-border bg-white/60 text-sm outline-none focus:border-elzhur-blue transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Сообщение</label>
                <textarea
                  value={compose.body}
                  onChange={e => setCompose(p => ({ ...p, body: e.target.value }))}
                  placeholder="Текст уведомления..."
                  rows={4}
                  className="w-full mt-1.5 px-4 py-3 rounded-2xl border border-border bg-white/60 text-sm outline-none focus:border-elzhur-blue transition-all resize-none"
                />
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 text-sm text-foreground hover:bg-white transition-all">
                  <Icon name="Bell" size={14} />
                  Push
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 text-sm text-foreground hover:bg-white transition-all">
                  <Icon name="Mail" size={14} />
                  Email
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 text-sm text-foreground hover:bg-white transition-all">
                  <Icon name="MessageSquare" size={14} />
                  SMS
                </button>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowCompose(false)} className="flex-1 py-3 rounded-2xl bg-white/60 text-sm font-semibold text-foreground hover:bg-white transition-all">
                Отмена
              </button>
              <button
                onClick={() => setShowCompose(false)}
                className="flex-1 py-3 rounded-2xl gradient-blue text-white text-sm font-semibold shadow-card hover:shadow-card-hover transition-all flex items-center justify-center gap-2"
              >
                <Icon name="Send" size={16} />
                Отправить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
