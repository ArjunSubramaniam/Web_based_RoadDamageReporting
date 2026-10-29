import { Navigate, Route, Routes } from 'react-router-dom'
import { GuestOnly, ProtectedRoute } from '../components/ProtectedRoute.jsx'
import { AppLayout } from '../layouts/AppLayout.jsx'
import { AdminDashboard } from '../pages/AdminDashboard.jsx'
import { AdminReports, VerificationQueue } from '../pages/AdminReports.jsx'
import { Analytics } from '../pages/Analytics.jsx'
import { CitizenDashboard } from '../pages/CitizenDashboard.jsx'
import { Landing } from '../pages/Landing.jsx'
import { Login } from '../pages/Login.jsx'
import { MaintenanceDashboard } from '../pages/MaintenanceDashboard.jsx'
import { MaintenanceTasks } from '../pages/MaintenanceTasks.jsx'
import { MapPage } from '../pages/MapPage.jsx'
import { MyReports } from '../pages/MyReports.jsx'
import { NewReport } from '../pages/NewReport.jsx'
import { NotFound } from '../pages/NotFound.jsx'
import { NotificationsPage } from '../pages/NotificationsPage.jsx'
import { Profile } from '../pages/Profile.jsx'
import { Register } from '../pages/Register.jsx'
import { ReportDetails } from '../pages/ReportDetails.jsx'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<GuestOnly />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route element={<ProtectedRoute roles={['citizen']} />}>
        <Route element={<AppLayout />}>
          <Route path="/citizen" element={<CitizenDashboard />} />
          <Route path="/citizen/report" element={<NewReport />} />
          <Route path="/citizen/reports" element={<MyReports />} />
          <Route path="/citizen/reports/:id" element={<ReportDetails />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute roles={['admin']} />}>
        <Route element={<AppLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/reports/:id" element={<ReportDetails />} />
          <Route path="/admin/verification" element={<VerificationQueue />} />
          <Route path="/admin/analytics" element={<Analytics />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute roles={['maintenance']} />}>
        <Route element={<AppLayout />}>
          <Route path="/maintenance" element={<MaintenanceDashboard />} />
          <Route path="/maintenance/tasks" element={<MaintenanceTasks />} />
          <Route path="/maintenance/completed" element={<MaintenanceTasks completed />} />
          <Route path="/maintenance/tasks/:id" element={<ReportDetails />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute roles={['citizen', 'admin', 'maintenance']} />}>
        <Route element={<AppLayout />}>
          <Route path="/map" element={<MapPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
