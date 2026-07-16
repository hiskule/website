export const ROUTES = {
  home: '/',
  events: '/event',
  team: '/team',
  mentor: '/mentor',
  contact: '/contact',
  judging: '/UTHSDC',
} as const

export const PRIMARY_NAVIGATION = [
  { label: 'EVENTS', path: ROUTES.events },
  { label: 'TEAM', path: ROUTES.team },
  { label: 'GET INVOLVED', path: ROUTES.mentor },
  { label: 'CONTACT US', path: ROUTES.contact },
] as const
