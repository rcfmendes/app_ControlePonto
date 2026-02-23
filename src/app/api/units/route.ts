import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const units = await prisma.unit.findMany({
            include: {
                company: true,
            },
            orderBy: { name: 'asc' }
        });
        return NextResponse.json(units);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch units' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, companyId } = body;

        if (!name || !companyId) {
            return NextResponse.json({ error: 'Name and companyId are required' }, { status: 400 });
        }

        const unit = await prisma.unit.create({
            data: {
                name,
                companyId: parseInt(companyId, 10),
            },
            include: {
                company: true
            }
        });

        return NextResponse.json(unit, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create unit' }, { status: 500 });
    }
}
