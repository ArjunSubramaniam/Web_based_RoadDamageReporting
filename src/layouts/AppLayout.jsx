import {
  Bell,
  BarChart3,
  ChevronDown,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Map,
  Menu,
  PlusCircle,
  Settings,
  Shield,
  Wrench,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { BrandMark } from '../components/Brand.jsx'
import { Breadcrumbs } from '../components/Breadcrumbs.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { useNotifications } from '../hooks/useReports.js'

const NAV = {
  citizen: [
    { to: '/citizen', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/citizen/report', label: 'Submit report', icon: PlusCircle },
    { to: '/citizen/reports', label: 'My reports', icon: ClipboardList },
    { to: '/map', label: 'Map', icon: Map },
    { to: '/notifications', label: 'Notifications', icon: Bell },
    { to: '/profile', label: 'Settings', icon: Settings },
  ],
  admin: [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/verification', label: 'Verification', icon: Shield },
    { to: '/admin/reports', label: 'All reports', icon: ClipboardList },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/map', label: 'Map', icon: Map },
    { to: '/notifications', label: 'Notifications', icon: Bell },
    { to: '/profile', label: 'Settings', icon: Settings },
  ],
  maintenance: [
    { to: '/maintenance', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/maintenance/tasks', label: 'Assigned tasks', icon: Wrench },
    { to: '/maintenance/completed', label: 'Completed', icon: ClipboardList },
    { to: '/map', label: 'Map', icon: Map },
    { to: '/notifications', label: 'Notifications', icon: Bell },
    { to: '/profile', label: 'Profile', icon: Settings },
  ],
}

function crumbsFromPath(pathname) {
  const map = {
    '/citizen': [{ label: 'Home', to: '/citizen' }, { label: 'Dashboard' }],
    '/citizen/report': [{ label: 'Home', to: '/citizen' }, { label: 'Submit report' }],
    '/citizen/reports': [{ label: 'Home', to: '/citizen' }, { label: 'My reports' }],
    '/admin': [{ label: 'Home', to: '/admin' }, { label: 'Dashboard' }],
    '/admin/reports': [{ label: 'Home', to: '/admin' }, { label: 'All reports' }],
    '/admin/verification': [{ label: 'Home', to: '/admin' }, { label: 'Verification' }],
    '/admin/analytics': [{ label: 'Home', to: '/admin' }, { label: 'Analytics' }],
    '/maintenance': [{ label: 'Home', to: '/maintenance' }, { label: 'Dashboard' }],
    '/maintenance/tasks': [{ label: 'Home', to: '/maintenance' }, { label: 'Assigned tasks' }],
    '/maintenance/completed': [{ label: 'Home', to: '/maintenance' }, { label: 'Completed tasks' }],
    '/map': [{ label: 'Map' }],
    '/notifications': [{ label: 'Notifications' }],
    '/profile': [{ label: 'Settings' }],
  }
  if (map[pathname]) return map[pathname]
  if (pathname.includes('/reports/')) return [{ label: 'Reports', to: pathname.split('/').slice(0, -1).join('/') }, { label: 'Details' }]
  if (pathname.includes('/tasks/')) return [{ label: 'Tasks', to: '/maintenance/tasks' }, { label: 'Details' }]
  return [{ label: 'RoadWatch' }]
}

export function AppLayout() {
  const { user, logout } = useAuth()
  const { unread } = useNotifications()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [menu, setMenu] = useState(false)
  const menuRef = useRef(null)
  const items = NAV[user.role] || NAV.citizen
  const crumbs = crumbsFromPath(location.pathname)
  const pageTitle = crumbs[crumbs.length - 1]?.label || 'RoadWatch'

  useEffect(() => {
    const onClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenu(false)
    }
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [])

  return (
    <div className="min-h-screen bg-[#eef2f7]">
      {open ? <button type="button" className="fixed inset-0 z-30 bg-navy-950/50 backdrop-blur-[2px] lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu" /> : null}

      <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 max-w-[85vw] flex-col bg-navy-900 text-white shadow-xl transition-transform duration-200 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <BrandMark inverted compact={false} />
          <button type="button" className="rounded-lg p-2 hover:bg-white/10 lg:hidden" onClick={() => setOpen(false)} aria-label="Close navigation">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `relative flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium ${
                  isActive ? 'bg-white/10 text-white shadow-sm' : 'text-navy-100 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive ? <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-blue-400" /> : null}
                  <item.icon className="h-4 w-4" />
                  <span className="flex-1">{item.label}</span>
                  {item.to === '/notifications' && unread ? (
                    <span className="rounded-full bg-red-500 px-2 py-0.5 text-[11px] font-semibold">{unread}</span>
                  ) : null}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-blue-600 text-xs font-semibold">
              {user.name.slice(0, 1)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-[11px] capitalize text-navy-200">{user.role === 'admin' ? 'Administrator' : user.role}</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200/80 bg-white/90 px-4 shadow-sm backdrop-blur-md">
          <button type="button" className="rounded-lg p-2 hover:bg-slate-100 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <p className="min-w-0 flex-1 truncate text-sm font-semibold text-navy-900">{pageTitle}</p>
          <Link to="/notifications" className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            {unread ? <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" /> : null}
          </Link>
          <div className="relative" ref={menuRef}>
            <button type="button" onClick={() => setMenu((value) => !value)} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-left text-sm hover:border-navy-200 hover:bg-slate-50" aria-expanded={menu} aria-haspopup="menu">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-navy-800 text-xs font-semibold text-white">
                {user.name.slice(0, 1)}
              </span>
              <span className="hidden sm:block">
                <span className="block font-medium text-navy-900">{user.name}</span>
                <span className="block text-[11px] capitalize text-slate-500">{user.role === 'admin' ? 'Administrator' : user.role}</span>
              </span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
            {menu ? (
              <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl" role="menu">
                <Link to="/profile" className="block px-4 py-2.5 text-sm hover:bg-slate-50" onClick={() => setMenu(false)}>
                  Profile & settings
                </Link>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-700 hover:bg-red-50"
                  onClick={() => {
                    logout()
                    navigate('/login')
                  }}
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </div>
            ) : null}
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Breadcrumbs items={crumbs} />
          <Outlet />
        </main>
      </div>
    </div>
  )
}
