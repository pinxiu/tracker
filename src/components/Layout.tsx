import { Link, NavLink } from 'react-router-dom';
import { useAppState } from '../state';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/products', label: 'Products' },
  { to: '/skills', label: 'Skills' },
  { to: '/weeks', label: 'Weekly Plan' },
  { to: '/media', label: 'Media Log' },
  { to: '/ship', label: 'Ship Log' },
  { to: '/settings', label: 'Settings' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { state } = useAppState();
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link to="/" className="logo">
          Learning Tracker
        </Link>
        <div className="streak">
          <div>Streak</div>
          <strong>{state.streak} days</strong>
        </div>
        <nav>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'nav active' : 'nav')}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}
