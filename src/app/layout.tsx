import './globals.css';
import type { Metadata } from 'next';
import ClientLayout from './client-layout';

export const metadata: Metadata = {
    title: 'naslite',
    description: 'a light-weight NAS server'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`antialiased min-h-screen bg-neutral-50 justify-center items-center flex flex-col`}>
                <ClientLayout>{children}</ClientLayout>
            </body>
        </html>
    );
}
