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

  // 1. USUARIO ADMINISTRADOR
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

  // 2. CATEGORÍAS
  console.log("\n📁 Creando categorías...");
  const slugs = ["desayunos", "bebidas", "extras", "postres"];
  const names = ["Desayunos", "Bebidas", "Extras", "Postres"];

  const categorias = await Promise.all(
    slugs.map((slug, i) =>
      prisma.category.upsert({
        where: { slug },
        update: {},
        create: { name: names[i], slug, order: i + 1, active: true },
      })
    )
  );

  const [catDesayunos, catBebidas, catExtras, catPostres] = categorias;

  // 3. PRODUCTOS
  console.log("\n🍽️ Creando productos...");

  // Desayunos
  const pAmericano = await prisma.product.upsert({
    where: { slug: "desayuno-americano" },
    update: {},
    create: {
      name: "Desayuno Americano",
      slug: "desayuno-americano",
      description:
        "Huevos revueltos, tocino crujiente, hot cakes esponjosos, jarabe de maple y mantequilla",
      price: 25.0,
      image:
        "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800",
      categoryId: catDesayunos.id,
      featured: true,
    },
  });

  const pSaludable = await prisma.product.upsert({
    where: { slug: "desayuno-saludable" },
    update: {},
    create: {
      name: "Desayuno Saludable",
      slug: "desayuno-saludable",
      description:
        "Bowl de açaí, granola artesanal, frutas frescas de estación, miel de abeja y coco",
      price: 22.0,
      image:
        "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=800",
      categoryId: catDesayunos.id,
      featured: true,
    },
  });

  // Bebidas
  const pJugoNaranja = await prisma.product.upsert({
    where: { slug: "jugo-naranja" },
    update: {},
    create: {
      name: "Jugo de Naranja",
      slug: "jugo-naranja",
      description: "Jugo natural de naranjas frescas recién exprimidas",
      price: 8.0,
      image:
        "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800",
      categoryId: catBebidas.id,
    },
  });

  const pCafeLatte = await prisma.product.upsert({
    where: { slug: "cafe-latte" },
    update: {},
    create: {
      name: "Café Latte",
      slug: "cafe-latte",
      description: "Espresso con leche vaporizada y arte latte",
      price: 9.0,
      image:
        "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800",
      categoryId: catBebidas.id,
      featured: true,
    },
  });

  // Extras
  const pPanHuevo = await prisma.product.upsert({
    where: { slug: "pan-huevo" },
    update: {},
    create: {
      name: "Pan con Huevo",
      slug: "pan-huevo",
      description: "Pan francés relleno de huevo revuelto y queso",
      price: 8.0,
      image:
        "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800",
      categoryId: catExtras.id,
    },
  });

  // 4. PROMOCIONES (Con relación a productos)
  console.log("\n🎉 Creando promociones...");
  const promoPrimera = await prisma.promotion.upsert({
    where: { code: "PRIMERAORDEN" },
    update: {},
    create: {
      name: "Primera Orden",
      description: "15% de descuento en tu primer pedido",
      discount: 15.0,
      code: "PRIMERAORDEN",
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-12-31"),
      type: "DISCOUNT",
      products: {
        create: [
          { productId: pAmericano.id, discountPrice: 21.25 },
          { productId: pSaludable.id, discountPrice: 18.7 },
        ],
      },
    },
  });

  // 5. PACKS PROMOCIONALES (Nueva tabla en tu esquema)
  console.log("\n📦 Creando packs promocionales...");
  await prisma.promotionPack.create({
    data: {
      promotionId: promoPrimera.id,
      name: "Combo Energético",
      description: "Desayuno Americano + Jugo de Naranja",
      originalPrice: 33.0,
      packPrice: 28.0,
      active: true,
      items: [
        { productId: pAmericano.id, quantity: 1 },
        { productId: pJugoNaranja.id, quantity: 1 },
      ],
    },
  });

  // 6. PEDIDO DE EJEMPLO
  console.log("\n🛒 Creando pedido de ejemplo...");
  const orderNum = `ORD-2025${(new Date().getMonth() + 1)
    .toString()
    .padStart(2, "0")}${new Date().getDate().toString().padStart(2, "0")}-001`;

  await prisma.order.upsert({
    where: { orderNumber: orderNum },
    update: {},
    create: {
      orderNumber: orderNum,
      customerName: "María García",
      customerPhone: "987654321",
      customerAddress: "Av. Principal 123, Lima",
      subtotal: 42.0,
      total: 42.0,
      status: "PENDING",
      paymentMethod: "efectivo",
      items: {
        create: [
          {
            productId: pAmericano.id,
            quantity: 1,
            price: 25.0,
            subtotal: 25.0,
          },
          {
            productId: pJugoNaranja.id,
            quantity: 1,
            price: 8.0,
            subtotal: 8.0,
          },
          { productId: pPanHuevo.id, quantity: 1, price: 9.0, subtotal: 9.0 },
        ],
      },
    },
  });

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
