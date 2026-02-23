import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const employeeId = searchParams.get('employeeId');

        const where = employeeId ? { employeeId: parseInt(employeeId, 10) } : {};

        const records = await prisma.timeRecord.findMany({
            where,
            include: {
                employee: { select: { id: true, name: true, cpf: true } }
            },
            orderBy: { timestamp: 'desc' }
        });
        return NextResponse.json(records);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch time records' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { employeeId, type, timestamp, adjusted, adjustmentReason } = body;

        if (!employeeId || !type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const record = await prisma.timeRecord.create({
            data: {
                employeeId: parseInt(employeeId, 10),
                type,
                timestamp: timestamp ? new Date(timestamp) : new Date(),
                adjusted: adjusted || false,
                adjustmentReason,
            },
        });

        return NextResponse.json(record, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to register time record' }, { status: 500 });
    }
}
