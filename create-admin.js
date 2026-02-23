const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('admin', 10);

    await prisma.user.upsert({
        where: { email: 'admin' },
        update: {},
        create: {
            email: 'admin',
            name: 'Administrador Master',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });
    console.log('Usuário admin criado com sucesso (Login: admin, Senha: admin)');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
