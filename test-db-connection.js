const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Attempting database query using URL:", process.env.DATABASE_URL || "from schema");

        console.log("Checking Usuario table...");
        const users = await prisma.usuario.findMany({ take: 1 });
        console.log("Users count:", users.length);

        console.log("Checking Reserva table...");
        const reservas = await prisma.reserva.findMany({ take: 1 });
        console.log("Reservas count:", reservas.length);

        console.log("Checking PagosUsuario table...");
        const pagos = await prisma.pagosUsuario.findMany({ take: 1 });
        console.log("Pagos count:", pagos.length);

        console.log("Database connection & query succeeded!");
    } catch (err) {
        console.error("DATABASE QUERY FAILED WITH ERROR:", err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
