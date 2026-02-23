import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { differenceInMinutes, parseISO } from 'date-fns';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const employeeId = searchParams.get('employeeId');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        if (!startDate || !endDate) {
            return NextResponse.json({ error: 'startDate and endDate are required' }, { status: 400 });
        }

        const whereClause: any = {
            timestamp: {
                gte: new Date(startDate),
                lte: new Date(endDate),
            }
        };

        if (employeeId) {
            whereClause.employeeId = parseInt(employeeId, 10);
        }

        const records = await prisma.timeRecord.findMany({
            where: whereClause,
            include: {
                employee: { select: { id: true, name: true } }
            },
            orderBy: { timestamp: 'asc' }
        });

        // Agrupando registros por dia e por funcionário
        const groupedData: Record<string, any> = {};

        records.forEach((record: any) => {
            const day = record.timestamp.toISOString().split('T')[0];
            const empId = record.employeeId;
            const key = `${empId}_${day}`;

            if (!groupedData[key]) {
                groupedData[key] = {
                    employeeName: record.employee.name,
                    date: day,
                    records: []
                };
            }
            groupedData[key].records.push(record);
        });

        // Calculando baseando-se nos 4 turnos: ENTRY1, EXIT1, ENTRY2, EXIT2
        const reports = Object.values(groupedData).map((group: any) => {
            let entry1: Date | null = null;
            let exit1: Date | null = null;
            let entry2: Date | null = null;
            let exit2: Date | null = null;

            group.records.forEach((r: any) => {
                if (r.type === 'ENTRY1' && !entry1) entry1 = r.timestamp;
                if (r.type === 'EXIT1' && !exit1) exit1 = r.timestamp;
                if (r.type === 'ENTRY2' && !entry2) entry2 = r.timestamp;
                if (r.type === 'EXIT2') exit2 = r.timestamp; // Pega última batida do dia
            });

            let totalMinutes = 0;
            if (entry1 && exit1) {
                totalMinutes += differenceInMinutes(exit1, entry1);
            }
            if (entry2 && exit2) {
                totalMinutes += differenceInMinutes(exit2, entry2);
            }

            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;

            return {
                ...group,
                totalTimeFormatted: `${hours}h ${minutes}m`,
                totalMinutes
            };
        });

        return NextResponse.json(reports);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
    }
}
