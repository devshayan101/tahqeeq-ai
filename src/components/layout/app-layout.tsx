
"use client";

import React from 'react';
import Image from 'next/image';
import {
  SidebarProvider, // Added SidebarProvider
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { SidebarNav } from './sidebar-nav';
import { UserNav } from './user-nav';
import { siteConfig } from '@/config/site';
import { Button } from '@/components/ui/button';
import { LogIn, HeartHandshake, Menu, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/contexts/theme-provider';
import { ThemeToggle } from './theme-toggle';
import { useChat } from '@/contexts/chat-context';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, initialAuthDone } = useAuth();
  const { startNewChat } = useChat();
  const pathname = usePathname();
  const { actualTheme } = useTheme();

  const logoUrl = "/images/sawade-azam-logo.png";
  const iconUrl = "/images/sawade-azam-logo.png";

  if (pathname === '/auth' && !initialAuthDone) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="sr-only">Loading application...</span>
      </div>
    );
  }

  if (pathname === '/auth') {
    return <>{children}</>;
  }

  const donateButtonBaseClasses = "font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105";
  const donateButtonLightClasses = "bg-secondary text-secondary-foreground hover:bg-secondary/90";
  const donateButtonDarkClasses = "bg-white/10 hover:bg-white/20 text-white border border-white/30";

  return (
    <SidebarProvider defaultOpen>
      <Sidebar className="border-r border-border/30 glass-sidebar">
        <SidebarHeader className="p-4 border-b border-border/30">
          <Link href="https://www.sawadeazam.org" passHref legacyBehavior>
            <a target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
             <Image
              src={logoUrl}
              alt={`${siteConfig.name} Logo - Sawade Azam`}
              width={100}
              height={60}
              data-ai-hint="organization logo"
              className="group-data-[collapsible=icon]:hidden object-contain"
              priority
            />
             <Image
              src={iconUrl}
              alt={`${siteConfig.name} Icon - Sawade Azam`}
              width={32}
              height={32}
              data-ai-hint="organization icon"
              className="hidden group-data-[collapsible=icon]:block rounded-md object-contain"
              priority
            />
            <h1 className="text-xl font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden sr-only">
              {siteConfig.name}
            </h1>
           </a>
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarNav items={siteConfig.mainNav} />
        </SidebarContent>
        <SidebarFooter className="p-2 mt-auto border-t border-border/30 flex items-center justify-end">
           <ThemeToggle />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-background">
        <header className="glass-header flex h-16 items-center gap-4 border-b border-border/30 px-4 sm:px-6">
          <SidebarTrigger className="md:hidden" asChild>
            <Button variant="ghost" size="icon"><Menu /></Button>
          </SidebarTrigger>
          <div className="flex-1">
            {/* Optional: Breadcrumbs or current page title can go here */}
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              asChild
              className={`${donateButtonBaseClasses} ${actualTheme === 'dark' ? donateButtonDarkClasses : donateButtonLightClasses}`}
            >
              <a href="https://sawadeazam.org/pe/" target="_blank" rel="noopener noreferrer" className="flex items-center">
                <HeartHandshake className="mr-2 h-4 w-4 shrink-0" />
                <span >Donate</span>
              </a>
            </Button>
            {/* ThemeToggle was moved to SidebarFooter, so removing from here if that was the final decision */}
            {/* <ThemeToggle /> */}
            {initialAuthDone && (
              user ? <UserNav /> : (
                <Button asChild variant="outline" size="sm">
                  <Link href="/auth">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Link>
                </Button>
              )
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={startNewChat}
              title="New Chat"
              className="h-9 w-9 text-muted-foreground hover:text-primary"
            >
              <PlusCircle className="h-5 w-5" />
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
