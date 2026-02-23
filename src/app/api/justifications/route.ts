import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const employeeId = searchParams.get('employeeId');

        const where = employeeId ? { employeeId: parseInt(employeeId, 10) } : {};

        const justifications = await prisma.absenceJustification.findMany({
            where,
            include: {
                employee: { select: { name: true, cpf: true } }
            },
            orderBy: { date: 'desc' }
        });
        return NextResponse.json(justifications);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch justifications' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { employeeId, date, reason, documentUrl } = body;

        if (!employeeId || !date || !reason) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const justification = await prisma.absenceJustification.create({
            data: {
                employeeId: parseInt(employeeId, 10),
                date: new Date(date),
                reason,
                documentUrl,
                status: 'PENDING'
            },
            include: {
                employee: true
            }
        });

        return NextResponse.json(justification, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create justification' }, { status: 500 });
    }
}
