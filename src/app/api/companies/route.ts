import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const companies = await prisma.company.findMany({
            include: {
                units: true,
            },
            orderBy: { name: 'asc' }
        });
        return NextResponse.json(companies);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, cnpj } = body;

        if (!name || !cnpj) {
            return NextResponse.json({ error: 'Name and CNPJ are required' }, { status: 400 });
        }

        const company = await prisma.company.create({
            data: {
                name,
                cnpj,
            },
        });

        return NextResponse.json(company, { status: 201 });
    } catch (error) {
        if ((error as any).code === 'P2002') {
            return NextResponse.json({ error: 'A company with this CNPJ already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });
    }
}
