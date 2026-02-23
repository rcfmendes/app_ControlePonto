import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id, 10);
        const body = await request.json();
        const { type, timestamp, adjusted, adjustmentReason } = body;

        const record = await prisma.timeRecord.update({
            where: { id },
            data: {
                type,
                timestamp: timestamp ? new Date(timestamp) : undefined,
                adjusted,
                adjustmentReason
            },
        });

        return NextResponse.json(record);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update time record' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id, 10);
        await prisma.timeRecord.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete time record' }, { status: 500 });
    }
}
