export const ROUTES = {
  home: '/',
  events: '/event',
  team: '/team',
  mentor: '/mentor',
  contact: '/contact',
  portal: '/portal',
  adminDashboard: '/master',
} as const

export const PRIMARY_NAVIGATION = [
  { label: 'EVENTS', path: ROUTES.events },
  { label: 'TEAM', path: ROUTES.team },
  { label: 'MENTORSHIP', path: ROUTES.mentor },
  { label: 'CONTACT US', path: ROUTES.contact },
  { label: 'MASTER', path: ROUTES.adminDashboard },
  { label: 'PORTAL', path: ROUTES.portal },
] as const
