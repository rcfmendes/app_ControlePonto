import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const journeys = await prisma.journey.findMany({
            orderBy: { name: 'asc' }
        });
        return NextResponse.json(journeys);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch journeys' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, dayOfWeek, entry1, exit1, entry2, exit2, totalHours } = body;

        if (!name || !dayOfWeek || !entry1 || !exit1 || !entry2 || !exit2 || !totalHours) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const journey = await prisma.journey.create({
            data: { name, dayOfWeek, entry1, exit1, entry2, exit2, totalHours },
        });

        return NextResponse.json(journey, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create journey' }, { status: 500 });
    }
}
