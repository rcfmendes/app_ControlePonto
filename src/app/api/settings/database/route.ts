import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const envPath = path.join(process.cwd(), '.env');
        let envContent = '';

        if (fs.existsSync(envPath)) {
            envContent = fs.readFileSync(envPath, 'utf8');
        }

        const extract = (key: string) => {
            const regex = new RegExp(`${key}=(.*)`);
            const match = envContent.match(regex);
            return match ? match[1].replace(/['"]/g, '').trim() : '';
        };

        return NextResponse.json({
            host: extract('MYSQL_HOST') || '127.0.0.1',
            port: extract('MYSQL_PORT') || '3306',
            user: extract('MYSQL_USER') || 'root',
            password: extract('MYSQL_PASSWORD') || '',
            database: extract('MYSQL_DATABASE') || 'controle_ponto',
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read configuration' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { host, port, user, password, database } = await request.json();

        if (!host || !port || !user || !database) {
            return NextResponse.json({ error: 'Preencha os campos obrigatórios' }, { status: 400 });
        }

        const envPath = path.join(process.cwd(), '.env');
        let currentEnv = '';
        if (fs.existsSync(envPath)) {
            currentEnv = fs.readFileSync(envPath, 'utf8');
        }

        // Remove old MYSQL configs
        const cleanEnv = currentEnv
            .split('\n')
            .filter(line => !line.startsWith('MYSQL_') && !line.startsWith('DATABASE_URL='))
            .join('\n');

        // Note: SQLite remains active for now as requested in earlier steps,
        // but we save the MySQL string here for future schema updates.
        const dbUrl = `mysql://${user}:${password}@${host}:${port}/${database}`;

        const newConfigs = [
            `MYSQL_HOST="${host}"`,
            `MYSQL_PORT="${port}"`,
            `MYSQL_USER="${user}"`,
            `MYSQL_PASSWORD="${password}"`,
            `MYSQL_DATABASE="${database}"`,
            `DATABASE_URL="file:./dev.db" # Banco atual (SQLite)`,
            `# PRISMA_MYSQL_URL="${dbUrl}"` // Saved for actual MySQL usage
        ].join('\n');

        fs.writeFileSync(envPath, `${cleanEnv.trim()}\n\n${newConfigs}\n`);

        return NextResponse.json({ message: 'Configurações salvas com sucesso' });
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao salvar configurações' }, { status: 500 });
    }
}
