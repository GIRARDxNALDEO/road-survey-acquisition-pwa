import { NavLink, Route, Routes } from 'react-router-dom';
import { AcquisitionPage } from '../pages/AcquisitionPage';
import { MapPage } from '../pages/MapPage';
import { SessionsPage } from '../pages/SessionsPage';
import { SettingsPage } from '../pages/SettingsPage';

const navItems = [
  { to: '/', label: 'Acquisition' },
  { to: '/map', label: 'Carte' },
  { to: '/sessions', label: 'Sessions' },
  { to: '/settings', label: 'Réglages' }
];

export function AppRouter() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">PWA terrain</p>
          <h1>Road Survey Acquisition</h1>
        </div>
      </header>
      <main className="page-shell">
        <Routes>
          <Route path="/" element={<AcquisitionPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/sessions" element={<SessionsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
      <nav className="bottom-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `bottom-link${isActive ? ' active' : ''}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
