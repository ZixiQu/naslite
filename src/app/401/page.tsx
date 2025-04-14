import { Button } from '@/components/ui/button';
import { ShieldOff } from 'lucide-react';
import Link from 'next/link';

export default function NotLoggedInPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
            <ShieldOff className="w-12 h-12 mb-5" />
            <h1 className="text-3xl font-bold mb-5">401 – Not Logged In</h1>
            <Link href="/" className="mt-5">
                <Button>Go to Home</Button>
            </Link>
        </div>
    );
}
