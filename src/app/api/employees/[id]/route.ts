import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id, 10);
        const employee = await prisma.employee.findUnique({
            where: { id },
            include: {
                unit: { include: { company: true } },
                journey: true,
            }
        });

        if (!employee) {
            return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
        }

        return NextResponse.json(employee);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch employee' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id, 10);
        const body = await request.json();
        const { name, cpf, email, role, unitId, journeyId } = body;

        const employee = await prisma.employee.update({
            where: { id },
            data: {
                name,
                cpf,
                email,
                role,
                unitId: unitId ? parseInt(unitId, 10) : undefined,
                journeyId: journeyId ? parseInt(journeyId, 10) : undefined,
            },
            include: {
                unit: true,
                journey: true
            }
        });

        return NextResponse.json(employee);
    } catch (error) {
        if ((error as any).code === 'P2002') {
            return NextResponse.json({ error: 'An employee with this CPF or Email already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id, 10);
        await prisma.employee.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
    }
}
