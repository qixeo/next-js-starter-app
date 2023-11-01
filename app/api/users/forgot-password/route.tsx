import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';
import bcrypt from 'bcrypt';
import RecoverPasswordEmail from '@/emails/RecoverPasswordEmail';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { email: body.email },
  });

  if (!user)
    return NextResponse.json({ error: 'User not found' }, { status: 404 });

  // Create a verification token and save to the associated user email
  const token = bcrypt.genSaltSync(10);
  const expires = new Date();

  await prisma.verificationToken.create({
    data: {
      identifier: body.email,
      token,
      expires,
    },
  });

  const resend = new Resend(process.env.RESEND_API_KEY);
  const defaultEmail = 'hello@qixeo.com';

  // Send a recovery email with the token
  await resend.emails.send({
    from: defaultEmail,
    to: [body.email],
    subject: 'Reset your password',
    react: <RecoverPasswordEmail token={token} />,
  });

  return NextResponse.json({});
}
