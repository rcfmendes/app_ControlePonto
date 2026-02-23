import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id, 10);
        const company = await prisma.company.findUnique({
            where: { id },
            include: { units: true }
        });

        if (!company) {
            return NextResponse.json({ error: 'Company not found' }, { status: 404 });
        }

        return NextResponse.json(company);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch company' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id, 10);
        const body = await request.json();
        const { name, cnpj } = body;

        const company = await prisma.company.update({
            where: { id },
            data: { name, cnpj },
        });

        return NextResponse.json(company);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update company' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id, 10);
        await prisma.company.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete company' }, { status: 500 });
    }
}
