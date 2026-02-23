import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id, 10);
        const unit = await prisma.unit.findUnique({
            where: { id },
            include: { company: true, employees: true }
        });

        if (!unit) {
            return NextResponse.json({ error: 'Unit not found' }, { status: 404 });
        }

        return NextResponse.json(unit);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch unit' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id, 10);
        const body = await request.json();
        const { name, companyId } = body;

        const unit = await prisma.unit.update({
            where: { id },
            data: { name, companyId: companyId ? parseInt(companyId, 10) : undefined },
            include: { company: true }
        });

        return NextResponse.json(unit);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update unit' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id, 10);
        await prisma.unit.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete unit' }, { status: 500 });
    }
}
