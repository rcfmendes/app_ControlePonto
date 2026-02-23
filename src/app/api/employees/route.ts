import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const employees = await prisma.employee.findMany({
            include: {
                unit: { include: { company: true } },
                journey: true,
            },
            orderBy: { name: 'asc' }
        });
        return NextResponse.json(employees);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, cpf, email, role, salary, unitId, journeyId } = body;

        if (!name || !cpf || !role || !unitId || !journeyId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const employee = await prisma.employee.create({
            data: {
                name,
                cpf,
                email,
                role,
                salary,
                unitId: parseInt(unitId, 10),
                journeyId: parseInt(journeyId, 10),
            },
            include: {
                unit: true,
                journey: true
            }
        });

        return NextResponse.json(employee, { status: 201 });
    } catch (error) {
        if ((error as any).code === 'P2002') {
            return NextResponse.json({ error: 'An employee with this CPF or Email already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 });
    }
}
