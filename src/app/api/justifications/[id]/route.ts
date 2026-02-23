import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id, 10);
        const body = await request.json();
        const { status } = body; // Typically, HR will only update status to APPROVED or REJECTED

        if (!status) {
            return NextResponse.json({ error: 'Status is required to update' }, { status: 400 });
        }

        const justification = await prisma.absenceJustification.update({
            where: { id },
            data: {
                status
            },
        });

        return NextResponse.json(justification);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update justification' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id, 10);
        await prisma.absenceJustification.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete justification' }, { status: 500 });
    }
}
