import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hash } from 'bcryptjs';

export async function POST(req: Request) {
  const { email, password, name } = await req.json();

  if (!email || !password || !name) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
  }

  const hashedPassword = await hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword,
    },
  });

  return NextResponse.json({ message: 'User created', userId: user.id }, { status: 201 });
}