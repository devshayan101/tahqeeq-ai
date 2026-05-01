
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types/nav';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { useChat } from '@/contexts/chat-context';
import { useLanguage } from '@/contexts/language-context'; // Import useLanguage

interface SidebarNavProps {
  items: NavItem[];
}

export function SidebarNav({ items }: SidebarNavProps) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const { startNewChat } = useChat(); // Keep for potential future "New Chat" button in sidebar
  const { t } = useLanguage(); // Get translation function

  if (!items?.length) {
    return null;
  }

  return (
    <SidebarMenu>
      {items.map((item, index) => {
        const Icon = item.icon;
        const translatedTitle = t(item.title); // Translate title

        // Regular navigation items
        const isActive = item.href === '/' ? pathname === item.href : pathname?.startsWith(item.href!);
        return item.href ? (
          <SidebarMenuItem key={index}>
            <SidebarMenuButton
              asChild
              variant="default"
              size="default"
              isActive={isActive}
              className={cn(
                "justify-start",
                isActive ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                "group-data-[collapsible=icon]:justify-center"
              )}
              tooltip={translatedTitle} // Use translated title for tooltip
              onClick={() => {
                if (isMobile) {
                  setOpenMobile(false);
                }
              }}
            >
              <Link href={item.href} className="flex items-center w-full">
                {Icon && <Icon className="mr-2 h-5 w-5 shrink-0 group-data-[collapsible=icon]:mr-0" />}
                <span className="truncate group-data-[collapsible=icon]:hidden">{translatedTitle}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ) : (
          <SidebarMenuItem key={index} className="px-3 py-2 text-xs font-semibold uppercase text-sidebar-foreground/70 group-data-[collapsible=icon]:text-center">
            {translatedTitle}
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
