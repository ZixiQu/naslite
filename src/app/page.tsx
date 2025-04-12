import { Cloud } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Cloud size={60} className="mb-3 text-blue-500" />
      <h1 className="text-6xl font-bold mb-4">Welcome to NASlite</h1>
      <p className="text-xl mb-8">Your lightweight NAS solution.</p>
    </div>
  );
}