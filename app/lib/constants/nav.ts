import { LayoutDashboard, TrendingUp, Briefcase, User, LucideIcon, BarChart2 } from 'lucide-react';

export type NavItem = {
  name: string;
  href: string;
  icon: LucideIcon; 
};

export const NAV_ITEMS: NavItem[] = [
  {
    name: 'OVERVIEW',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'MARKETS',
    href: '/stocks',
    icon: TrendingUp,
  },
  {
    name: 'PORTFOLIO',
    href: '/portfolio',
    icon: Briefcase,
  },
  {
    name: 'RESEARCH',
    href: '/peers',
    icon: BarChart2,
  },
];