import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { Link, Route, Switch, useLocation, useParams } from 'wouter';
import {
  AlertCircle,
  ArrowUpRight,
  Bell,
  CalendarDays,
  CalendarRange,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Clock3,
  Download,
  EyeOff,
  FileText,
  HeartHandshake,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  MessageCircle,
  MoreHorizontal,
  NotebookPen,
  Pencil,
  Plus,
  Search,
  Save,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  UserRound,
  UsersRound,
  X,
} from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router as WouterRouter } from 'wouter';

type Role = 'student' | 'counselor' | 'administrator';
type AppointmentStatus = 'requested' | 'confirmed' | 'completed' | 'cancelled';
type Appointment = {
  id: string;
  student: string;
  counselor: string;
  counselorId: string;
  date: string;
  time: string;
  type: string;
  status: AppointmentStatus;
  note?: string;
};
type Counselor = {
  id: string;
  name: string;
  initials: string;
  specialty: string;
  bio: string;
  next: string;
  days: string;
  color: string;
  active: boolean;
};
type SessionNote = {
  id: string;
  student: string;
  counselor: string;
  date: string;
  summary: string;
  privateNote: string;
  status: 'shared' | 'private';
};

const queryClient = new QueryClient();
const studentName = 'Amara Okafor';

const seededCounselors: Counselor[] = [
  { id: 'c-1', name: 'Dr. Naomi Mensah', initials: 'NM', specialty: 'Anxiety & academic pressure', bio: 'A warm, practical space for making sense of heavy semesters, transitions, and the expectations around you.', next: 'Today · 15:30', days: 'Mon, Wed, Fri', color: 'coral', active: true },
  { id: 'c-2', name: 'Elias Hart', initials: 'EH', specialty: 'Identity & belonging', bio: 'Support for questions about identity, relationships, home, and finding your people on campus.', next: 'Tomorrow · 10:00', days: 'Tue, Thu', color: 'gold', active: true },
  { id: 'c-3', name: 'Dr. Zinhle Dlamini', initials: 'ZD', specialty: 'Trauma-informed care', bio: 'A patient, consent-led approach for when life has asked too much and you are ready for support.', next: 'Wed · 11:30', days: 'Wed, Thu, Sat', color: 'sage', active: true },
  { id: 'c-4', name: 'Marcus Lee', initials: 'ML', specialty: 'Study & life balance', bio: 'Tools for focus, routines, sleep, and building a sustainable rhythm through your studies.', next: 'Thu · 14:00', days: 'Mon, Thu', color: 'blue', active: true },
];

const seededAppointments: Appointment[] = [
  { id: 'a-1', student: studentName, counselor: 'Dr. Naomi Mensah', counselorId: 'c-1', date: '2025-03-14', time: '15:30', type: 'First conversation', status: 'confirmed' },
  { id: 'a-2', student: studentName, counselor: 'Elias Hart', counselorId: 'c-2', date: '2025-03-22', time: '10:00', type: 'Follow-up', status: 'requested', note: 'I have been feeling stretched thin with exams and work.' },
  { id: 'a-3', student: studentName, counselor: 'Dr. Zinhle Dlamini', counselorId: 'c-3', date: '2025-02-28', time: '11:30', type: 'First conversation', status: 'completed' },
  { id: 'a-4', student: 'Tariq Bello', counselor: 'Dr. Naomi Mensah', counselorId: 'c-1', date: '2025-03-18', time: '09:00', type: 'Follow-up', status: 'requested', note: 'Would like to talk about returning after a leave of absence.' },
  { id: 'a-5', student: 'Maya Patel', counselor: 'Dr. Zinhle Dlamini', counselorId: 'c-3', date: '2025-03-17', time: '14:30', type: 'First conversation', status: 'confirmed' },
];

const seededNotes: SessionNote[] = [
  { id: 'n-1', student: studentName, counselor: 'Dr. Zinhle Dlamini', date: '28 Feb 2025', summary: 'We spoke about settling into a new routine and identifying one person on campus to contact this week.', privateNote: 'Student presented as thoughtful and engaged. Explore support network in next session.', status: 'shared' },
  { id: 'n-2', student: 'Tariq Bello', counselor: 'Dr. Naomi Mensah', date: '07 Mar 2025', summary: 'Follow-up planned after a conversation about return-to-study support.', privateNote: 'Private clinical note not available to administrators.', status: 'private' },
];

const navItems = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/appointments', label: 'Appointments', icon: CalendarDays },
  { href: '/counselors', label: 'Counselors', icon: UsersRound },
  { href: '/records', label: 'My records', icon: NotebookPen },
  { href: '/administration', label: 'Administration', icon: ClipboardCheck, roles: ['administrator'] as Role[] },
  { href: '/settings', label: 'Settings', icon: Settings2 },
];

function readStore<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) as T : fallback;
  } catch {
    return fallback;
  }
}

function useStoredState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => readStore(key, fallback));
  useEffect(() => localStorage.setItem(key, JSON.stringify(value)), [key, value]);
  return [value, setValue] as const;
}

function initials(name: string) {
  return name.split(' ').map((part) => part[0]).slice(0, 2).join('');
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${date}T12:00:00`));
}

function Shell({ children, role, setRole }: { children: ReactNode; role: Role; setRole: (role: Role) => void }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showRoles, setShowRoles] = useState(false);
  const visibleNav = navItems.filter((item) => !item.roles || item.roles.includes(role));

  return (
    <div className="app-frame">
      <aside className={`side-rail ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true"><HeartHandshake size={19} strokeWidth={2.3} /></div>
          <div><div className="brand-name">hush<span>.</span></div><div className="brand-subtitle">student support</div></div>
          <button className="icon-button side-close" onClick={() => setMobileOpen(false)} aria-label="Close navigation" data-testid="button-close-navigation"><X size={18} /></button>
        </div>
        <div className="rail-context">
          <div className="context-kicker">Your workspace</div>
          <button className="role-select" onClick={() => setShowRoles(!showRoles)} data-testid="button-role-switcher">
            <span className={`role-dot ${role}`} />
            <span>{role === 'administrator' ? 'Administrator' : role === 'counselor' ? 'Counselor view' : 'Student view'}</span>
            <ChevronDown size={15} />
          </button>
          {showRoles && <div className="role-menu">
            {(['student', 'counselor', 'administrator'] as Role[]).map((option) => (
              <button key={option} onClick={() => { setRole(option); setShowRoles(false); }} data-testid={`button-role-${option}`}>
                <span className={`role-dot ${option}`} /><span>{option === 'administrator' ? 'Administrator' : option === 'counselor' ? 'Counselor' : 'Student'}</span>
                {role === option && <Check size={14} />}
              </button>
            ))}
          </div>}
        </div>
        <nav className="rail-nav" aria-label="Main navigation">
          <div className="rail-label">Workspace</div>
          {visibleNav.map(({ href, label, icon: Icon }) => (
            <Link href={href} key={href} onClick={() => setMobileOpen(false)} className={`rail-link ${location === href ? 'active' : ''}`} data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}>
              <Icon size={18} strokeWidth={1.8} /><span>{label}</span>{href === '/appointments' && role === 'counselor' && <span className="nav-count">2</span>}
            </Link>
          ))}
        </nav>
        <div className="rail-bottom">
          <div className="privacy-mini"><LockKeyhole size={15} /><span>Private by design</span></div>
          <div className="user-mini">
            <div className="avatar avatar-small">{role === 'student' ? 'AO' : role === 'counselor' ? 'NM' : 'SA'}</div>
            <div className="user-mini-copy"><strong>{role === 'student' ? studentName : role === 'counselor' ? 'Dr. Naomi Mensah' : 'Sam Adeyemi'}</strong><span>{role}</span></div>
            <MoreHorizontal size={17} />
          </div>
        </div>
      </aside>
      {mobileOpen && <button className="mobile-scrim" onClick={() => setMobileOpen(false)} aria-label="Close menu" data-testid="button-close-menu" />}
      <main className="main-canvas">
        <header className="top-bar">
          <button className="icon-button mobile-menu-button" onClick={() => setMobileOpen(true)} aria-label="Open navigation" data-testid="button-open-navigation"><Menu size={20} /></button>
          <div className="crumb"><span>hush.</span><ChevronRight size={14} /> <strong>{location === '/' ? 'Overview' : location.slice(1).replace('/', ' / ')}</strong></div>
          <div className="top-actions">
            <button className="icon-button has-dot" aria-label="Notifications" data-testid="button-notifications"><Bell size={18} /></button>
            <button className="help-button" aria-label="Help center" data-testid="button-help"><CircleHelp size={17} /><span>Help center</span></button>
            <div className="avatar avatar-top">{role === 'student' ? 'AO' : role === 'counselor' ? 'NM' : 'SA'}</div>
          </div>
        </header>
        <div className="page-wrap">{children}</div>
      </main>
    </div>
  );
}

function PageIntro({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="page-intro">
    <div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{description && <p>{description}</p>}</div>
    {action && <div className="intro-action">{action}</div>}
  </div>;
}

function StatusPill({ status }: { status: string }) {
  const labels: Record<string, string> = { requested: 'Needs review', confirmed: 'Confirmed', completed: 'Completed', cancelled: 'Cancelled', shared: 'Shared with you', private: 'Private note' };
  return <span className={`status-pill ${status}`} data-testid={`status-${status}`}><span className="status-dot" />{labels[status] ?? status}</span>;
}

function Avatar({ name, color = 'coral' }: { name: string; color?: string }) {
  return <div className={`avatar avatar-med ${color}`} data-testid={`avatar-${name.toLowerCase().replaceAll(' ', '-')}`}>{initials(name)}</div>;
}

function EmptyState({ icon: Icon, title, body, action }: { icon: typeof Search; title: string; body: string; action?: ReactNode }) {
  return <div className="empty-state"><div className="empty-icon"><Icon size={23} /></div><h3>{title}</h3><p>{body}</p>{action}</div>;
}

function Dashboard({ role, appointments, notes, counselors, onNavigate }: { role: Role; appointments: Appointment[]; notes: SessionNote[]; counselors: Counselor[]; onNavigate: (href: string) => void }) {
  const myAppointments = role === 'student' ? appointments.filter((item) => item.student === studentName) : role === 'counselor' ? appointments.filter((item) => item.counselor === 'Dr. Naomi Mensah') : appointments;
  const upcoming = myAppointments.filter((item) => item.status === 'confirmed' || item.status === 'requested').slice(0, 3);
  const requested = appointments.filter((item) => item.status === 'requested');
  const sharedNotes = notes.filter((item) => role === 'student' ? item.student === studentName && item.status === 'shared' : role === 'counselor' ? item.counselor === 'Dr. Naomi Mensah' : true);
  const greeting = role === 'student' ? 'Good morning, Amara' : role === 'counselor' ? 'Good morning, Naomi' : 'Good morning, Sam';
  return <div className="dashboard">
    <div className="welcome-row">
      <div><div className="eyebrow">Tuesday, 11 March 2025</div><h1>{greeting}<span className="coral-dot">.</span></h1><p className="welcome-copy">{role === 'student' ? 'You do not have to carry everything alone.' : role === 'counselor' ? 'A clear view of the people who are waiting for you.' : 'A steady view of care across your institution.'}</p></div>
      <div className="welcome-badge"><Sparkles size={16} /><span>{role === 'student' ? 'Your space is yours' : role === 'counselor' ? 'Care team workspace' : 'Operations, with care'}</span></div>
    </div>
    {role === 'student' && <div className="support-banner">
      <div className="support-banner-art"><div className="art-ring ring-one" /><div className="art-ring ring-two" /><HeartHandshake size={32} /></div>
      <div><div className="banner-kicker">A note for you</div><h2>Starting a conversation is a brave thing.</h2><p>Whether you know exactly what you need or just know something feels off, we can start there.</p></div>
      <button className="button button-coral" onClick={() => onNavigate('/counselors')} data-testid="button-find-support">Find a counselor <ArrowUpRight size={16} /></button>
    </div>}
    <div className="stat-strip">
      <div className="stat-card"><div className="stat-label">{role === 'counselor' ? 'Awaiting your review' : role === 'administrator' ? 'Active students' : 'Upcoming sessions'}</div><div className="stat-value">{role === 'counselor' ? requested.length : role === 'administrator' ? '1,284' : upcoming.filter((a) => a.status === 'confirmed').length}</div><div className="stat-meta">{role === 'administrator' ? '+8.4% this month' : role === 'counselor' ? 'Across your caseload' : 'You have time held for you'}</div></div>
      <div className="stat-card"><div className="stat-label">{role === 'administrator' ? 'Sessions this month' : 'Conversations held'}</div><div className="stat-value">{role === 'administrator' ? '342' : role === 'student' ? '2' : '18'}</div><div className="stat-meta accent-meta">{role === 'administrator' ? '91% attendance' : 'Small steps count'}</div></div>
      <div className="stat-card"><div className="stat-label">{role === 'administrator' ? 'Average response' : 'Your privacy'}</div><div className="stat-value">{role === 'administrator' ? '4.2h' : <ShieldCheck size={25} />}</div><div className="stat-meta">{role === 'administrator' ? '↓ 36m from last month' : 'Notes stay between you and your counselor'}</div></div>
    </div>
    <div className="dashboard-grid">
      <section className="panel schedule-panel">
        <div className="panel-heading"><div><div className="eyebrow">Your calendar</div><h2>{role === 'counselor' ? 'Requests & sessions' : 'Coming up'}</h2></div><button className="text-button" onClick={() => onNavigate('/appointments')} data-testid="button-view-all-appointments">View all <ChevronRight size={15} /></button></div>
        {upcoming.length === 0 ? <EmptyState icon={CalendarDays} title="Nothing booked yet" body="Your calendar is open. When you are ready, choose a counselor." /> : <div className="appointment-list">{upcoming.map((appointment) => <AppointmentRow key={appointment.id} appointment={appointment} role={role} />)}</div>}
      </section>
      <section className="panel notes-panel">
        <div className="panel-heading"><div><div className="eyebrow">A little context</div><h2>{role === 'student' ? 'Recent notes' : role === 'counselor' ? 'Recent documentation' : 'Service pulse'}</h2></div><button className="icon-button" onClick={() => onNavigate(role === 'administrator' ? '/administration' : '/records')} aria-label="Open details" data-testid="button-open-panel-details"><ArrowUpRight size={17} /></button></div>
        {role === 'administrator' ? <div className="pulse-list"><div className="pulse-item"><span className="pulse-key">Students reaching out</span><strong>+12.6%</strong><div className="mini-bars"><i /><i /><i /><i /><i /><i /><i /></div></div><div className="pulse-item"><span className="pulse-key">No-show rate</span><strong className="ink">6.8%</strong><div className="mini-bars muted-bars"><i /><i /><i /><i /><i /><i /><i /></div></div><div className="privacy-callout"><LockKeyhole size={15} /><span>Private note content is never shown in administration.</span></div></div> : sharedNotes.length === 0 ? <EmptyState icon={FileText} title="No notes to show" body="Notes from your conversations will appear here." /> : <div className="note-preview-list">{sharedNotes.slice(0, 2).map((note) => <div className="note-preview" key={note.id}><div className="note-date">{note.date}</div><p>{note.summary}</p><button className="subtle-link" onClick={() => onNavigate('/records')} data-testid={`button-read-note-${note.id}`}>Read note <ArrowUpRight size={14} /></button></div>)}</div>}
      </section>
    </div>
    {role !== 'administrator' && <section className="panel quick-panel"><div className="panel-heading"><div><div className="eyebrow">Gentle next steps</div><h2>What would help today?</h2></div></div><div className="quick-actions"><button onClick={() => onNavigate('/appointments')} data-testid="button-quick-book"><CalendarRange size={18} /><span>Book a session</span><ChevronRight size={16} /></button><button onClick={() => onNavigate('/counselors')} data-testid="button-quick-counselor"><UsersRound size={18} /><span>Explore counselors</span><ChevronRight size={16} /></button><button onClick={() => onNavigate('/settings')} data-testid="button-quick-settings"><SlidersHorizontal size={18} /><span>Update preferences</span><ChevronRight size={16} /></button></div></section>}
    {role === 'administrator' && <section className="panel activity-panel"><div className="panel-heading"><div><div className="eyebrow">Last 7 days</div><h2>Service activity</h2></div><button className="text-button" onClick={() => onNavigate('/administration')} data-testid="button-open-activity">Open reports <ArrowUpRight size={15} /></button></div><div className="activity-chart"><div className="chart-y"><span>80</span><span>40</span><span>0</span></div><div className="chart-bars">{[38, 54, 46, 72, 62, 78, 67].map((height, index) => <div className="chart-col" key={index}><div style={{ height: `${height}%` }} /><span>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</span></div>)}</div></div></section>}
  </div>;
}

function AppointmentRow({ appointment, role }: { appointment: Appointment; role: Role }) {
  return <div className="appointment-row" data-testid={`row-appointment-${appointment.id}`}><div className="date-tile"><span>{new Intl.DateTimeFormat('en-GB', { day: '2-digit' }).format(new Date(`${appointment.date}T12:00:00`))}</span><small>{new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(new Date(`${appointment.date}T12:00:00`))}</small></div><div className="appointment-main"><div className="appointment-title">{role === 'counselor' ? appointment.student : appointment.counselor}</div><div className="appointment-detail"><Clock3 size={13} /> {appointment.time} · {appointment.type}</div></div><StatusPill status={appointment.status} /><button className="icon-button row-more" aria-label="More appointment actions" data-testid={`button-more-appointment-${appointment.id}`}><MoreHorizontal size={17} /></button></div>;
}

function AppointmentsPage({ role, appointments, setAppointments }: { role: Role; appointments: Appointment[]; setAppointments: (value: Appointment[]) => void }) {
  const [modal, setModal] = useState<'request' | 'reschedule' | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | AppointmentStatus>('all');
  const [search, setSearch] = useState('');
  const visible = appointments.filter((item) => (role === 'student' ? item.student === studentName : role === 'counselor' ? item.counselor === 'Dr. Naomi Mensah' : true)).filter((item) => filter === 'all' || item.status === filter).filter((item) => `${item.student} ${item.counselor}`.toLowerCase().includes(search.toLowerCase()));
  const updateStatus = (id: string, status: AppointmentStatus) => setAppointments(appointments.map((item) => item.id === id ? { ...item, status } : item));
  const saveRequest = (data: { counselor: string; counselorId: string; date: string; time: string; note: string }) => {
    if (modal === 'reschedule' && selectedId) {
      setAppointments(appointments.map((item) => item.id === selectedId ? { ...item, date: data.date, time: data.time, status: 'requested' } : item));
    } else {
      setAppointments([...appointments, { id: `a-${Date.now()}`, student: studentName, counselor: data.counselor, counselorId: data.counselorId, date: data.date, time: data.time, type: 'First conversation', status: 'requested', note: data.note }]);
    }
    setSelectedId(null);
    setModal(null);
  };
  return <div><PageIntro eyebrow="Your time, held gently" title={role === 'counselor' ? 'Appointments' : 'Appointments'} description={role === 'student' ? 'Request time with a counselor, or keep track of the conversations already in motion.' : role === 'counselor' ? 'Review requests and keep your availability in a rhythm that works for you.' : 'A complete view of scheduled and requested support.'} action={role === 'student' ? <button className="button button-coral" onClick={() => setModal('request')} data-testid="button-request-appointment"><Plus size={16} /> Request a session</button> : role === 'counselor' ? <Link href="/counselors" className="button button-coral" data-testid="link-manage-availability"><CalendarRange size={16} /> Manage availability</Link> : undefined} />
    <div className="toolbar"><div className="search-wrap"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search appointments" aria-label="Search appointments" data-testid="input-search-appointments" /></div><div className="filter-tabs">{(['all', 'requested', 'confirmed', 'completed'] as const).map((item) => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)} data-testid={`button-filter-${item}`}>{item === 'all' ? 'All' : item === 'requested' ? 'Needs review' : item[0].toUpperCase() + item.slice(1)}</button>)}</div><button className="filter-button" data-testid="button-more-filters"><SlidersHorizontal size={16} /> Filters</button></div>
    <div className="appointment-page-grid"><section className="panel appointment-table-panel"><div className="table-heading"><div><div className="eyebrow">Showing {visible.length} {visible.length === 1 ? 'conversation' : 'conversations'}</div><h2>{filter === 'all' ? 'All appointments' : filter === 'requested' ? 'Requests to review' : `${filter[0].toUpperCase()}${filter.slice(1)} sessions`}</h2></div><CalendarDays size={22} className="heading-icon" /></div>{visible.length === 0 ? <EmptyState icon={CalendarDays} title="No appointments match" body="Try a different search or filter." /> : <div className="full-appointment-list">{visible.map((item) => <div className="full-appointment" key={item.id}><AppointmentRow appointment={item} role={role} />{item.note && <div className="appointment-note"><MessageCircle size={14} /> “{item.note}”</div>}{role === 'counselor' && item.status === 'requested' && <div className="row-actions"><button className="button button-small button-coral" onClick={() => updateStatus(item.id, 'confirmed')} data-testid={`button-approve-${item.id}`}><Check size={14} /> Approve request</button><button className="button button-small button-quiet" onClick={() => { setSelectedId(item.id); setModal('reschedule'); }} data-testid={`button-reschedule-${item.id}`}><CalendarRange size={14} /> Reschedule</button></div>}{role !== 'student' && item.status === 'confirmed' && <div className="row-actions"><button className="button button-small button-quiet" onClick={() => { setSelectedId(item.id); setModal('reschedule'); }} data-testid={`button-reschedule-confirmed-${item.id}`}><CalendarRange size={14} /> Reschedule</button><button className="text-button danger-text" onClick={() => updateStatus(item.id, 'cancelled')} data-testid={`button-cancel-${item.id}`}><X size={14} /> Cancel</button></div>}{role === 'student' && (item.status === 'requested' || item.status === 'confirmed') && <div className="row-actions"><button className="text-button danger-text" onClick={() => updateStatus(item.id, 'cancelled')} data-testid={`button-cancel-student-${item.id}`}><X size={14} /> Cancel request</button></div>}</div>)}</div>}</section><aside className="side-summary"><div className="small-card calendar-card"><div className="small-card-heading"><CalendarDays size={17} /><span>March 2025</span><ChevronRight size={15} /></div><div className="mini-calendar"><div className="calendar-days">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => <span key={index}>{day}</span>)}</div><div className="calendar-numbers">{Array.from({ length: 31 }, (_, index) => <span key={index} className={index + 1 === 14 ? 'selected' : index + 1 === 18 ? 'has-event' : ''}>{index + 1}</span>)}</div></div></div><div className="small-card privacy-card"><ShieldCheck size={20} /><h3>Only you decide</h3><p>Your appointments are private. Admins can see service patterns, never the details of your conversations.</p><Link href="/settings" className="subtle-link" data-testid="link-privacy-settings">Privacy settings <ArrowUpRight size={14} /></Link></div></aside></div>
    {modal && <AppointmentModal type={modal} onClose={() => setModal(null)} onSave={saveRequest} />}
  </div>;
}

function AppointmentModal({ type, onClose, onSave }: { type: 'request' | 'reschedule'; onClose: () => void; onSave: (data: { counselor: string; counselorId: string; date: string; time: string; note: string }) => void }) {
  const [counselorId, setCounselorId] = useState('c-1');
  const [date, setDate] = useState('2025-03-20');
  const [time, setTime] = useState('15:30');
  const [note, setNote] = useState('');
  const counselor = seededCounselors.find((item) => item.id === counselorId) ?? seededCounselors[0];
  return <div className="modal-backdrop" role="presentation"><div className="modal" role="dialog" aria-modal="true" aria-labelledby="appointment-modal-title"><div className="modal-top"><div><div className="eyebrow">{type === 'request' ? 'Make some room' : 'Find another moment'}</div><h2 id="appointment-modal-title">{type === 'request' ? 'Request a session' : 'Reschedule session'}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close dialog" data-testid="button-close-appointment-modal"><X size={18} /></button></div><p className="modal-copy">{type === 'request' ? 'Choose a counselor and a time that feels possible. They will respond as soon as they can.' : 'Pick a new time. The counselor will be notified of your request.'}</p><label className="field-label">Counselor<select value={counselorId} onChange={(event) => setCounselorId(event.target.value)} data-testid="select-appointment-counselor">{seededCounselors.map((item) => <option value={item.id} key={item.id}>{item.name} · {item.specialty}</option>)}</select></label><div className="form-two"><label className="field-label">Preferred date<input type="date" value={date} onChange={(event) => setDate(event.target.value)} data-testid="input-appointment-date" /></label><label className="field-label">Time<select value={time} onChange={(event) => setTime(event.target.value)} data-testid="select-appointment-time">{['09:00', '10:00', '11:30', '14:00', '15:30'].map((item) => <option key={item}>{item}</option>)}</select></label></div><label className="field-label">What would you like them to know? <span className="optional">Optional</span><textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="A sentence is enough, or leave this blank." rows={3} data-testid="input-appointment-note" /></label><div className="modal-actions"><button className="button button-quiet" onClick={onClose} data-testid="button-cancel-modal">Not now</button><button className="button button-coral" onClick={() => onSave({ counselor: counselor.name, counselorId: counselor.id, date, time, note })} data-testid="button-save-appointment"><Check size={16} /> {type === 'request' ? 'Send request' : 'Save new time'}</button></div><div className="modal-footnote"><LockKeyhole size={13} /> Your note is only shared with the counselor you choose.</div></div></div>;
}

function CounselorsPage({ role, counselors, setCounselors, onRequest }: { role: Role; counselors: Counselor[]; setCounselors: (value: Counselor[]) => void; onRequest: () => void }) {
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('All areas');
  const filtered = counselors.filter((item) => item.active && `${item.name} ${item.specialty}`.toLowerCase().includes(search.toLowerCase())).filter((item) => specialty === 'All areas' || item.specialty.includes(specialty));
  const specialties = ['All areas', 'Anxiety', 'Identity', 'Trauma', 'Study'];
  return <div><PageIntro eyebrow={role === 'administrator' ? 'People who make care possible' : 'Find your fit'} title={role === 'administrator' ? 'Counselor roster' : 'Meet your counselors'} description={role === 'administrator' ? 'Keep the care team current and visible to the people who need them.' : 'There is no right way to ask for help. Browse by what feels closest to you.'} action={role === 'administrator' ? <button className="button button-coral" onClick={() => setCounselors([...counselors, { id: `c-${Date.now()}`, name: 'New counselor', initials: 'NC', specialty: 'General wellbeing', bio: 'Available for student support conversations.', next: 'To be scheduled', days: 'Mon – Fri', color: 'blue', active: true }])} data-testid="button-add-counselor"><Plus size={16} /> Add counselor</button> : undefined} /><div className="toolbar counselor-toolbar"><div className="search-wrap"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name or support area" aria-label="Search counselors" data-testid="input-search-counselors" /></div><div className="filter-tabs">{specialties.map((item) => <button key={item} className={specialty === item ? 'active' : ''} onClick={() => setSpecialty(item)} data-testid={`button-specialty-${item.toLowerCase().replaceAll(' ', '-')}`}>{item}</button>)}</div></div><div className="counselor-grid">{filtered.map((counselor) => <article className="counselor-card" key={counselor.id} data-testid={`card-counselor-${counselor.id}`}><div className="counselor-card-top"><Avatar name={counselor.name} color={counselor.color} /><button className="icon-button" aria-label={`More options for ${counselor.name}`} onClick={() => setCounselors(counselors.map((item) => item.id === counselor.id ? { ...item, active: !item.active } : item))} data-testid={`button-counselor-menu-${counselor.id}`}><MoreHorizontal size={17} /></button></div><div className="counselor-name">{counselor.name}</div><div className="counselor-specialty">{counselor.specialty}</div><p>{counselor.bio}</p><div className="availability-line"><span className="availability-dot" /><span>Next opening</span><strong>{counselor.next}</strong></div><div className="counselor-days"><CalendarDays size={14} /> Usually available {counselor.days}</div>{role === 'student' && <button className="button button-coral full-button" onClick={onRequest} data-testid={`button-book-counselor-${counselor.id}`}>Request a session <ArrowUpRight size={15} /></button>}{role === 'administrator' && <div className="admin-card-actions"><span className="active-label"><span className="status-dot" /> Active profile</span><button className="text-button" onClick={() => setCounselors(counselors.map((item) => item.id === counselor.id ? { ...item, active: false } : item))} data-testid={`button-deactivate-${counselor.id}`}>Deactivate</button></div>}</article>)}</div>{filtered.length === 0 && <EmptyState icon={UsersRound} title="No counselors found" body="Try another search or area of support." />}</div>;
}

function RecordsPage({ role, notes, setNotes }: { role: Role; notes: SessionNote[]; setNotes: (value: SessionNote[]) => void }) {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const visible = notes.filter((item) => role === 'student' ? item.student === studentName && item.status === 'shared' : role === 'counselor' ? item.counselor === 'Dr. Naomi Mensah' : true).filter((item) => `${item.student} ${item.summary}`.toLowerCase().includes(search.toLowerCase()));
  return <div><PageIntro eyebrow="A careful record" title={role === 'student' ? 'Your records' : role === 'counselor' ? 'Session records' : 'Operational records'} description={role === 'student' ? 'A private place to revisit what you and your counselor have chosen to keep visible.' : role === 'counselor' ? 'Document the shape of each conversation. Private notes stay private.' : 'Review record activity without access to confidential note content.'} action={role === 'counselor' ? <button className="button button-coral" onClick={() => setShowForm(true)} data-testid="button-new-session-note"><Plus size={16} /> New session note</button> : undefined} /><div className="record-safety"><div className="safety-icon"><LockKeyhole size={17} /></div><div><strong>{role === 'administrator' ? 'Privacy boundary active' : 'Your records are confidential'}</strong><span>{role === 'administrator' ? 'You can see dates, statuses, and service patterns — never private note content.' : 'Only you and your assigned counselor can view the content of your session records.'}</span></div><ShieldCheck size={20} /></div><div className="toolbar"><div className="search-wrap"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={role === 'student' ? 'Search your notes' : 'Search records'} aria-label="Search records" data-testid="input-search-records" /></div><button className="filter-button" data-testid="button-record-filters"><SlidersHorizontal size={16} /> Filter</button></div><section className="panel records-panel"><div className="table-heading"><div><div className="eyebrow">{visible.length} {visible.length === 1 ? 'record' : 'records'}</div><h2>{role === 'student' ? 'Shared with you' : 'Recent session notes'}</h2></div><FileText size={22} className="heading-icon" /></div>{visible.length === 0 ? <EmptyState icon={FileText} title="No records yet" body={role === 'student' ? 'Your counselor will share a summary here after a session.' : 'Matching records will appear here.'} /> : <div className="record-list">{visible.map((note) => <article className="record-row" key={note.id} data-testid={`row-record-${note.id}`}><div className="record-date">{note.date}<span>{note.counselor}</span></div><div className="record-body"><div className="record-row-top"><h3>{note.student === studentName ? 'Conversation summary' : note.student}</h3><StatusPill status={note.status} /></div><p>{role === 'administrator' ? 'Confidential content hidden from this role.' : note.summary}</p>{role === 'counselor' && <div className="private-line"><EyeOff size={13} /> Private note: {note.privateNote}</div>}</div><button className="icon-button" aria-label="Open record" data-testid={`button-open-record-${note.id}`}><ArrowUpRight size={16} /></button></article>)}</div>}</section>{showForm && <NoteModal onClose={() => setShowForm(false)} onSave={(summary, privateNote, shared) => { setNotes([...notes, { id: `n-${Date.now()}`, student: studentName, counselor: 'Dr. Naomi Mensah', date: '11 Mar 2025', summary, privateNote, status: shared ? 'shared' : 'private' }]); setShowForm(false); }} />}</div>;
}

function NoteModal({ onClose, onSave }: { onClose: () => void; onSave: (summary: string, privateNote: string, shared: boolean) => void }) {
  const [summary, setSummary] = useState('');
  const [privateNote, setPrivateNote] = useState('');
  const [shared, setShared] = useState(true);
  return <div className="modal-backdrop"><div className="modal" role="dialog" aria-modal="true"><div className="modal-top"><div><div className="eyebrow">Document with care</div><h2>New session note</h2></div><button className="icon-button" onClick={onClose} aria-label="Close note dialog" data-testid="button-close-note-modal"><X size={18} /></button></div><p className="modal-copy">A short, clear summary is often enough. You can add a private reflection below.</p><label className="field-label">Shared summary<textarea value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="What would you like the student to take away?" rows={3} data-testid="input-note-summary" /></label><label className="field-label">Private counselor note<textarea value={privateNote} onChange={(event) => setPrivateNote(event.target.value)} placeholder="For your professional record only." rows={3} data-testid="input-private-note" /></label><label className="check-line"><input type="checkbox" checked={shared} onChange={(event) => setShared(event.target.checked)} data-testid="checkbox-share-note" /><span>Share the summary with the student</span></label><div className="modal-actions"><button className="button button-quiet" onClick={onClose} data-testid="button-cancel-note">Cancel</button><button className="button button-coral" disabled={!summary.trim()} onClick={() => onSave(summary, privateNote, shared)} data-testid="button-save-note"><Save size={16} /> Save note</button></div><div className="modal-footnote"><EyeOff size={13} /> Private notes are never visible to administrators.</div></div></div>;
}

function AdministrationPage({ role, appointments, counselors }: { role: Role; appointments: Appointment[]; counselors: Counselor[] }) {
  const [userFilter, setUserFilter] = useState('');
  if (role !== 'administrator') {
    return <div><PageIntro eyebrow="Restricted workspace" title="Administration" description="This area is reserved for administrators who manage access and service operations." /><div className="panel"><EmptyState icon={LockKeyhole} title="You do not have access to this view" body="Your role keeps the details of care private. You can still manage your own appointments, counselors, and records." action={<Link href="/" className="button button-coral" data-testid="link-return-to-overview">Return to overview</Link>} /></div></div>;
  }
  const users = [{ name: 'Amara Okafor', email: 'amara.okafor@northbridge.edu', role: 'Student', status: 'Active', joined: 'Jan 2025' }, { name: 'Dr. Naomi Mensah', email: 'naomi.mensah@northbridge.edu', role: 'Counselor', status: 'Active', joined: 'Aug 2022' }, { name: 'Tariq Bello', email: 'tariq.bello@northbridge.edu', role: 'Student', status: 'Active', joined: 'Sep 2024' }, { name: 'Lydia Chen', email: 'lydia.chen@northbridge.edu', role: 'Student', status: 'Review', joined: 'Mar 2025' }].filter((user) => `${user.name} ${user.email}`.toLowerCase().includes(userFilter.toLowerCase()));
  return <div><PageIntro eyebrow="Steady operations" title="Administration" description="Keep access clear, service healthy, and the privacy boundary visible." action={<button className="button button-quiet" onClick={() => window.print()} data-testid="button-export-report"><Download size={16} /> Export report</button>} /><div className="admin-metrics"><div className="metric-card coral-metric"><div className="metric-icon"><UsersRound size={17} /></div><span>Active students</span><strong>1,284</strong><small>+8.4% from February</small></div><div className="metric-card"><div className="metric-icon"><CalendarDays size={17} /></div><span>Sessions this month</span><strong>342</strong><small>91% attended</small></div><div className="metric-card"><div className="metric-icon"><Clock3 size={17} /></div><span>Average response</span><strong>4.2h</strong><small>36m faster than last month</small></div><div className="metric-card"><div className="metric-icon"><ShieldCheck size={17} /></div><span>Privacy events</span><strong>0</strong><small>All systems healthy</small></div></div><div className="admin-grid"><section className="panel users-panel"><div className="panel-heading"><div><div className="eyebrow">Access & roles</div><h2>User directory</h2></div><button className="icon-button" aria-label="User directory options" data-testid="button-user-directory-options"><MoreHorizontal size={17} /></button></div><div className="search-wrap table-search"><Search size={16} /><input value={userFilter} onChange={(event) => setUserFilter(event.target.value)} placeholder="Search people" aria-label="Search users" data-testid="input-search-users" /></div><div className="user-table">{users.map((user, index) => <div className="user-row" key={user.email} data-testid={`row-user-${index}`}><div className="avatar avatar-small">{initials(user.name)}</div><div className="user-identity"><strong>{user.name}</strong><span>{user.email}</span></div><span className={`role-tag ${user.role.toLowerCase()}`}>{user.role}</span><span className={`user-status ${user.status.toLowerCase()}`}><span className="status-dot" />{user.status}</span><button className="icon-button" aria-label={`Edit ${user.name}`} data-testid={`button-edit-user-${index}`}><Pencil size={15} /></button></div>)}</div></section><section className="panel report-panel"><div className="panel-heading"><div><div className="eyebrow">Monthly overview</div><h2>Service activity</h2></div><button className="text-button" data-testid="button-view-full-report">Full report <ArrowUpRight size={15} /></button></div><div className="report-summary"><div className="report-total"><strong>342</strong><span>sessions completed</span><em>↑ 14.2%</em></div><div className="donut-wrap"><div className="donut"><span>91<span>%</span></span></div><div className="donut-legend"><span><i className="dot coral" />Attended <b>91%</b></span><span><i className="dot sand" />Cancelled <b>6%</b></span><span><i className="dot teal" />No-show <b>3%</b></span></div></div></div><div className="report-foot"><span>Most requested area</span><strong>Anxiety & academic pressure</strong><span className="trend-up">↑ 24 requests</span></div></section></div><section className="panel audit-panel"><div className="panel-heading"><div><div className="eyebrow">Accountability trail</div><h2>Recent audit activity</h2></div><button className="text-button" data-testid="button-view-audit">View all <ChevronRight size={15} /></button></div><div className="audit-list"><div className="audit-row"><div className="audit-icon coral"><Pencil size={14} /></div><div><strong>Availability updated</strong><span>Dr. Naomi Mensah changed Friday hours</span></div><time>12 min ago</time></div><div className="audit-row"><div className="audit-icon gold"><UserRound size={14} /></div><div><strong>New counselor added</strong><span>Marcus Lee was added to the care team</span></div><time>Yesterday</time></div><div className="audit-row"><div className="audit-icon sage"><ShieldCheck size={14} /></div><div><strong>Privacy review completed</strong><span>Monthly access review passed with no issues</span></div><time>3 days ago</time></div></div></section><div className="admin-footnote"><LockKeyhole size={15} /> Administrators can manage access and see service patterns, but never private session note content. <Link href="/settings" data-testid="link-admin-privacy">Review privacy controls <ArrowUpRight size={14} /></Link></div></div>;
}

function SettingsPage({ role, notifications, setNotifications }: { role: Role; notifications: { appointment: boolean; updates: boolean; digest: boolean }; setNotifications: (value: { appointment: boolean; updates: boolean; digest: boolean }) => void }) {
  const [saved, setSaved] = useState(false);
  const toggle = (key: keyof typeof notifications) => { setNotifications({ ...notifications, [key]: !notifications[key] }); setSaved(true); setTimeout(() => setSaved(false), 1800); };
  return <div><PageIntro eyebrow="Make this yours" title="Settings" description="Choose how hush. keeps in touch, and decide what feels comfortable to share." action={saved ? <span className="saved-message"><CheckCircle2 size={16} /> Saved just now</span> : undefined} /><div className="settings-layout"><aside className="settings-nav"><button className="active" data-testid="button-settings-profile"><UserRound size={16} /> Profile</button><button data-testid="button-settings-notifications"><Bell size={16} /> Notifications</button><button data-testid="button-settings-privacy"><LockKeyhole size={16} /> Privacy & access</button></aside><div className="settings-content"><section className="settings-section"><div className="settings-section-heading"><div className="section-symbol"><UserRound size={17} /></div><div><h2>Profile</h2><p>The basics your support team uses to recognize you.</p></div><button className="text-button" data-testid="button-edit-profile"><Pencil size={14} /> Edit</button></div><div className="profile-card"><div className="avatar avatar-large">{role === 'student' ? 'AO' : role === 'counselor' ? 'NM' : 'SA'}</div><div><h3>{role === 'student' ? studentName : role === 'counselor' ? 'Dr. Naomi Mensah' : 'Sam Adeyemi'}</h3><p>{role === 'student' ? 'BSc Environmental Science · Year 2' : role === 'counselor' ? 'Counselor · Student wellbeing' : 'Administrator · Student support'}</p><span className="profile-email">{role === 'student' ? 'amara.okafor@northbridge.edu' : 'northbridge.edu'}</span></div></div></section><section className="settings-section"><div className="settings-section-heading"><div className="section-symbol coral-symbol"><Bell size={17} /></div><div><h2>Notifications</h2><p>Small reminders, never noise.</p></div></div><div className="preference-list"><PreferenceRow label="Appointment updates" description="Requests, approvals, and changes to your sessions." checked={notifications.appointment} onChange={() => toggle('appointment')} testId="appointment" /><PreferenceRow label="Support team updates" description="Occasional news about services and opening hours." checked={notifications.updates} onChange={() => toggle('updates')} testId="updates" /><PreferenceRow label="Monthly wellbeing digest" description="A quiet collection of resources and reminders." checked={notifications.digest} onChange={() => toggle('digest')} testId="digest" /></div></section><section className="settings-section"><div className="settings-section-heading"><div className="section-symbol gold-symbol"><LockKeyhole size={17} /></div><div><h2>Privacy & access</h2><p>You are in control of your support story.</p></div></div><div className="privacy-settings"><div className="privacy-setting"><div><strong>Private by default</strong><p>Session notes are only visible to your counselor unless they choose to share a summary.</p></div><span className="fixed-badge"><ShieldCheck size={13} /> Always on</span></div><div className="privacy-setting"><div><strong>Operational visibility</strong><p>{role === 'administrator' ? 'Your role sees anonymised trends, never the substance of care.' : 'Administrators see service patterns, never the substance of your care.'}</p></div><EyeOff size={18} className="muted-icon" /></div></div></section><button className="button button-quiet danger-button" onClick={() => { localStorage.clear(); window.location.reload(); }} data-testid="button-reset-demo"><Trash2 size={15} /> Reset demo data</button></div></div></div>;
}

function PreferenceRow({ label, description, checked, onChange, testId }: { label: string; description: string; checked: boolean; onChange: () => void; testId: string }) {
  return <div className="preference-row"><div><strong>{label}</strong><p>{description}</p></div><button className={`switch ${checked ? 'on' : ''}`} onClick={onChange} role="switch" aria-checked={checked} aria-label={label} data-testid={`switch-${testId}`}><span /></button></div>;
}

function NotFound() {
  return <div className="not-found"><HeartHandshake size={30} /><h1>That page is taking a quiet moment.</h1><p>There is nothing here yet.</p><Link href="/" className="button button-coral" data-testid="link-back-home">Back to overview</Link></div>;
}

function RouterContent({ role, setRole }: { role: Role; setRole: (role: Role) => void }) {
  const [appointments, setAppointments] = useStoredState<Appointment[]>('hush-appointments', seededAppointments);
  const [notes, setNotes] = useStoredState<SessionNote[]>('hush-notes', seededNotes);
  const [counselors, setCounselors] = useStoredState<Counselor[]>('hush-counselors', seededCounselors);
  const [notifications, setNotifications] = useStoredState('hush-notifications', { appointment: true, updates: false, digest: true });
  const [, navigate] = useLocation();
  return <Switch>
    <Route path="/"><Dashboard role={role} appointments={appointments} notes={notes} counselors={counselors} onNavigate={navigate} /></Route>
    <Route path="/appointments"><AppointmentsPage role={role} appointments={appointments} setAppointments={setAppointments} /></Route>
    <Route path="/counselors"><CounselorsPage role={role} counselors={counselors} setCounselors={setCounselors} onRequest={() => navigate('/appointments')} /></Route>
    <Route path="/records"><RecordsPage role={role} notes={notes} setNotes={setNotes} /></Route>
    <Route path="/administration"><AdministrationPage role={role} appointments={appointments} counselors={counselors} /></Route>
    <Route path="/settings"><SettingsPage role={role} notifications={notifications} setNotifications={setNotifications} /></Route>
    <Route component={NotFound} />
  </Switch>;
}

function App() {
  const [role, setRole] = useStoredState<Role>('hush-active-role', 'student');
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><ErrorBoundary resetKey={role}><Shell role={role} setRole={setRole}><RouterContent role={role} setRole={setRole} /></Shell></ErrorBoundary></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;