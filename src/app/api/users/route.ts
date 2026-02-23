import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, role: true, createdAt: true },
            orderBy: { name: 'asc' }
        });
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password, role } = body;

        if (!name || !email || !password || !role) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role
            },
            select: { id: true, name: true, email: true, role: true }
        });

        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        if ((error as any).code === 'P2002') {
            return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}
