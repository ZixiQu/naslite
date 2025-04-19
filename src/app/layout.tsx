// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import ClientLayout from './client-layout';
import { Geist, Geist_Mono } from 'next/font/google';

export const metadata: Metadata = {
    title: 'naslite',
    description: 'a light-weight NAS server'
};

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin']
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin']
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-neutral-50 justify-center items-center flex flex-col`}>
                <ClientLayout>{children}</ClientLayout>
            </body>
        </html>
    );
}
