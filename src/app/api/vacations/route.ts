import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const employeeId = searchParams.get('employeeId');

        const where = employeeId ? { employeeId: parseInt(employeeId, 10) } : {};

        const vacations = await prisma.vacation.findMany({
            where,
            include: {
                employee: { select: { name: true, cpf: true } }
            },
            orderBy: { startDate: 'desc' }
        });
        return NextResponse.json(vacations);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch vacations' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { employeeId, startDate, endDate, description } = body;

        if (!employeeId || !startDate || !endDate) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const vacation = await prisma.vacation.create({
            data: {
                employeeId: parseInt(employeeId, 10),
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                description,
            },
            include: {
                employee: true
            }
        });

        return NextResponse.json(vacation, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create vacation' }, { status: 500 });
    }
}
