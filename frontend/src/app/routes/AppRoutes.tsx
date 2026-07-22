import { lazy, Suspense } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { AppLayout } from '../layout/AppLayout'
import { ROUTES } from '../../shared/config/routes'

const ContactPage = lazy(() => import('../../pages/Contact/Contact'))
const EventsPage = lazy(() => import('../../pages/Events/Events'))
const HomePage = lazy(() => import('../../pages/Home/Home'))

const MasterDashboard = lazy(() => import('../../pages/MasterDashboard/MasterDashboard'))
const PortalDashboard = lazy(() => import('../../pages/PortalDashboard/PortalDashboard'))
const MentorPage = lazy(() => import('../../pages/Mentor/Mentor'))
const TeamPage = lazy(() => import('../../pages/Team/Team'))

export function AppRoutes() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path={ROUTES.home} element={<HomePage />} />
          <Route path={ROUTES.events} element={<EventsPage />} />
          <Route path={ROUTES.team} element={<TeamPage />} />
          <Route path={ROUTES.mentor} element={<MentorPage />} />
          <Route path={ROUTES.contact} element={<ContactPage />} />
          <Route path={ROUTES.portal} element={<PortalDashboard />} />
          <Route path={ROUTES.adminDashboard} element={<MasterDashboard />} />
          <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
