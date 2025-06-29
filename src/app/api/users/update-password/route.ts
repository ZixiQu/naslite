import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { hash, compare } from 'bcryptjs';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'Not authenticated' });

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Both current and new password are required' });
  }

  if (!session?.user?.email) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || !user.hashedPassword) {
      return res.status(404).json({ error: 'User not found or password not set' });
    }

    const isMatch = await compare(currentPassword, user.hashedPassword);
    if (!isMatch) {
      return res.status(403).json({ error: 'Current password is incorrect' });
    }

    const newHashed = await hash(newPassword, 12);
    await prisma.user.update({
      where: { email: session.user.email },
      data: { hashedPassword: newHashed },
    });

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch {
    return res.status(500).json({ error: 'Password update failed' });
  }
}
