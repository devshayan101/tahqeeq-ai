
import type { Metadata } from 'next';
import { Poppins, Roboto } from 'next/font/google'; 
import { Geist, Geist_Mono } from 'next/font/google'; // Corrected import
import './globals.css';
import { AppLayout } from '@/components/layout/app-layout';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/auth-context';
import { ThemeProvider } from '@/contexts/theme-provider';
import { ChatProvider } from '@/contexts/chat-context';
import { LanguageProvider } from '@/contexts/language-context'; // Import LanguageProvider

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
});

const geistSans = Geist({ // Corrected instantiation
  variable: '--font-geist-sans', 
  subsets: ['latin'],
});

const geistMono = Geist_Mono({ // Corrected instantiation
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Tahqeeq AI',
  description: 'AI-powered Islamic research assistant with a modern UI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>{/* Default lang and dir */}<body className={`${poppins.variable} ${roboto.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider> {/* Wrap with LanguageProvider */}
            <AuthProvider>
              <ChatProvider>
                <AppLayout>
                  {children}
                </AppLayout>
              </ChatProvider>
              <Toaster />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body></html>
  );
}
