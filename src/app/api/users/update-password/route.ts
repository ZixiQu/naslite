import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { hash, compare } from 'bcryptjs';

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { currentPassword, newPassword } = await req.json();

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { error: 'Both current and new passwords are required' },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user || !user.hashedPassword) {
    return NextResponse.json({ error: 'User not found or password not set' }, { status: 404 });
  }

  const isMatch = await compare(currentPassword, user.hashedPassword);
  if (!isMatch) {
    return NextResponse.json({ error: 'Incorrect current password' }, { status: 403 });
  }

  const hashed = await hash(newPassword, 12);

  await prisma.user.update({
    where: { email: session.user.email },
    data: { hashedPassword: hashed },
  });

  return NextResponse.json({ message: 'Password updated successfully' });
}
