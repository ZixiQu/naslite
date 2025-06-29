// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';

// export async function GET(req: Request) {
//   const session = await auth.api.getSession({ headers: req.headers });

//   if (!session) {
//     return new Response('Unauthorized', { status: 401 });
//   }
//   console.log(session);
//   // Now you know who the user is
//   return new Response(`Hello ${session.user.email}`);
// }
