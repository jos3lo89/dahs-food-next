import { PrismaClient } from "@/app/generated/prisma/client";
import { config } from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "@/lib/bcrypt";

config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Iniciando seed de la base de datos...");

  console.log("Creando usuario administrador...");
  const admin = await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: {},
    create: {
      email: "admin@admin.com",
      password: await hashPassword(process.env.PASSWORD_ADMIN || "Admin123!"),
      name: "Administrador",
      role: "ADMIN",
    },
  });

  console.log("Usuario administrador creado:", admin);

  console.log("\n═══════════════════════════════════════════");
  console.log("🎉 SEED COMPLETADO EXITOSAMENTE");
  console.log("═══════════════════════════════════════════");
}

main()
  .catch((e) => {
    console.error("Error en el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
