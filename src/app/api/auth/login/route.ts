import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super_secret_key');

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Preencha todos os campos.' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ error: 'Credenciais inválidas.' }, { status: 401 });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return NextResponse.json({ error: 'Credenciais inválidas.' }, { status: 401 });
        }

        const token = await new SignJWT({ id: user.id, email: user.email, role: user.role })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('1d')
            .sign(JWT_SECRET);

        const response = NextResponse.json({ message: 'Login realizado com sucesso', role: user.role, email: user.email, userId: user.id });
        response.cookies.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24
        });

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
    }
}
