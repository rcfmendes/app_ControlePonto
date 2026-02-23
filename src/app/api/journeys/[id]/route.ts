import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id, 10);
        const journey = await prisma.journey.findUnique({
            where: { id },
            include: { employees: true }
        });

        if (!journey) {
            return NextResponse.json({ error: 'Journey not found' }, { status: 404 });
        }

        return NextResponse.json(journey);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch journey' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id, 10);
        const body = await request.json();
        const { name, dayOfWeek, entry1, exit1, entry2, exit2, totalHours } = body;

        const journey = await prisma.journey.update({
            where: { id },
            data: { name, dayOfWeek, entry1, exit1, entry2, exit2, totalHours },
        });

        return NextResponse.json(journey);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update journey' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id, 10);
        await prisma.journey.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete journey' }, { status: 500 });
    }
}
