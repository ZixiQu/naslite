import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth'; // your new NextAuth config

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
