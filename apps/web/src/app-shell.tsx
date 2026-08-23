export const navigation = [
  { label: 'Overview', href: '/' },
  { label: 'Investigate', href: '/investigate' },
  { label: 'People', href: '/people' },
  { label: 'Business', href: '/business' },
  { label: 'Social', href: '/social' },
  { label: 'Images', href: '/images' },
  { label: 'Workbench', href: '/workbench' },
  { label: 'AI Analyst', href: '/analyst' },
  { label: 'WatchDog', href: '/watchdog' },
  { label: 'Cases', href: '/cases' },
  { label: 'Reports', href: '/reports' },
];

export function AppShell({ children }: { children: unknown }) {
  return { navigation, children };
}
