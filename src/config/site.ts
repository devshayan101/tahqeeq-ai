
import type { NavItem } from '@/types/nav';
import { MessageSquare, History, Award, Library, Music2, Users, Bookmark, UserCircle, Info, Settings, Search } from 'lucide-react'; // Added Search here

export type SiteConfig = {
  name: string;
  description: string;
  mainNav: NavItem[];
  secondaryNav?: NavItem[]; 
};

export const siteConfig: SiteConfig = {
  name: 'Tahqeeq AI',
  description:
    'AI-powered Islamic research assistant for offline data presentation, intelligent search, and document management.',
  mainNav: [
    {
      title: 'nav.chat', // Translation key
      href: '/',
      icon: MessageSquare,
    },
    {
      title: 'nav.search', // Translation key
      href: '/search',
      icon: Search,
    },
    {
      title: 'nav.virtualLibrary', // Translation key
      href: '/documents',
      icon: Library, 
    },
    {
      title: 'nav.audioLibrary', // Translation key
      href: '/audio',
      icon: Music2,
    },
     {
      title: 'nav.bookmarksAndNotes', // Translation key
      href: '/bookmarks',
      icon: Bookmark,
    },
    {
      title: 'nav.learningModules', // Translation key
      href: '/learn',
      icon: Award,
    },
    {
      title: 'nav.chatHistory', // Translation key
      href: '/history',
      icon: History,
    },
    {
      title: 'nav.community', // Translation key
      href: '/community',
      icon: Users,
    },
    {
      title: 'nav.profile', // Translation key
      href: '/profile',
      icon: UserCircle,
    },
    {
      title: 'nav.settings', // Translation key for Settings (new)
      href: '/settings',     // Link to settings page
      icon: Settings,
    },
    {
      title: 'nav.aboutSawadeAzam', // Translation key
      href: '/about',
      icon: Info,
    }
  ],
};
