
'use client';

import './globals.css';
import { useEffect } from 'react';
import { ThemeProvider, useTheme } from '@/hooks/use-theme';
import { Toaster } from '@/components/ui/toaster';
import Link from 'next/link';
import { 
    FileText, Home, Gavel, Book, FileUp, Settings, BarChart, FileQuestion, MessageSquare, ShieldAlert, FileCheck, LogOut, Clock
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { SmartAssistant } from '@/components/legiflow/smart-assistant';

const navItems = [
    { href: '/dashboard', icon: Home, label: 'Home' },
    { href: '/analyze', icon: FileUp, label: 'Upload Documents' },
    { href: '/samples', icon: FileCheck, label: 'Sample Agreements' },
    { href: '/agreements', icon: FileText, label: 'Agreements' },
    { href: '/risk', icon: ShieldAlert, label: 'High-Risk Agreements' },
    { href: '/reference', icon: Book, label: 'Legal Reference' },
    { href: '/search', icon: FileQuestion, label: 'Clause Search' },
    { href: '/compare', icon: BarChart, label: 'Compare' },
    { href: '/history', icon: Clock, label: 'History' },
    { href: '/notifications', icon: Gavel, label: 'Notifications' },
    { href: '/help', icon: MessageSquare, label: 'Help' },
    { href: '/settings', icon: Settings, label: 'Settings' },
];

function AppHeader() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="fixed left-0 right-0 top-0 h-16 flex items-center justify-between px-5 z-30 backdrop-blur-md bg-background/30">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-90"
                    >
                      <path d="M4 22h16" />
                      <path d="M4 22V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v14" />
                      <path d="M12 6V4" />
                      <path d="M12 14h-2" />
                      <path d="M12 18h-4" />
                    </svg>
                </div>
                <div>
                    <h1 className="font-bold text-lg">LegiFlow</h1>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={toggleTheme} size="sm">
                    {theme === 'dark' ? '🌙' : '☀️'}
                </Button>
                {user ? (
                     <div className="flex items-center gap-3">
                        <span className="text-sm font-medium px-3 py-1.5 rounded-full bg-card/80">{user.displayName || user.email}</span>
                        <Button variant="ghost" size="sm" onClick={logout}><LogOut className="mr-2 h-4 w-4"/> Sign Out</Button>
                     </div>
                ) : (
                    <Link href="/login">
                        <Button>Sign In</Button>
                    </Link>
                )}
            </div>
        </header>
    );
}

function AppLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const pathname = usePathname();

    if (loading) {
        return <div className="flex h-screen w-full items-center justify-center bg-background text-foreground"><LoaderCircle className="h-8 w-8 animate-spin" /></div>;
    }
  
    if (!user) {
       return <>{pathname === '/login' && children}</>;
    }
  
    return (
        <div className="min-h-screen flex text-foreground relative">
            <AppHeader />
            <div className="flex mt-16 h-[calc(100vh-4rem)] w-full">
                <aside className="w-64 flex-col fixed h-full p-3 bg-gradient-to-b from-card/60 to-card/20 border-r border-border/50">
                    <h3 className="text-base font-semibold text-foreground/80 px-3 mb-4">Navigation</h3>
                    <nav className="flex-grow space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    pathname === item.href
                                        ? 'bg-gradient-to-r from-sky-500/10 to-purple-500/10 text-accent-foreground'
                                        : 'text-muted-foreground hover:bg-card hover:text-foreground'
                                }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                     <div className="mt-auto p-3 text-xs text-muted-foreground">
                         <p>Signed in as:</p>
                         <div className="px-2 py-1 mt-2 rounded-full bg-card font-semibold text-center">{user.displayName || user.email}</div>
                     </div>
                </aside>
                <main className="flex-1 ml-64 p-7 overflow-y-auto">
                    {children}
                </main>
            </div>
            <SmartAssistant />
        </div>
    );
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet" />
            </head>
            <body className="antialiased">
                <AuthProvider>
                    <ThemeProvider defaultTheme='dark'>
                        <AppLayout>{children}</AppLayout>
                        <Toaster />
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    );
}

