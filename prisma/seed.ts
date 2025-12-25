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
      password: await hashPassword(process.env.PASSWORD_ADMIN),
      name: "Administrador",
      role: "ADMIN",
    },
  });
  console.log("Usuario administrador creado:", {
    email: admin.email,
    name: admin.name,
  });

  // ====================================
  // 2. CREAR CATEGORÍAS
  // ====================================
  console.log("\n📁 Creando categorías...");

  const categorias = await Promise.all([
    prisma.category.upsert({
      where: { slug: "desayunos" },
      update: {},
      create: {
        name: "Desayunos",
        slug: "desayunos",
        order: 1,
        active: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: "bebidas" },
      update: {},
      create: {
        name: "Bebidas",
        slug: "bebidas",
        order: 2,
        active: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: "extras" },
      update: {},
      create: {
        name: "Extras",
        slug: "extras",
        order: 3,
        active: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: "postres" },
      update: {},
      create: {
        name: "Postres",
        slug: "postres",
        order: 4,
        active: true,
      },
    }),
  ]);

  console.log(`✅ ${categorias.length} categorías creadas`);

  // ====================================
  // 3. CREAR PRODUCTOS
  // ====================================
  console.log("\n🍽️  Creando productos...");

  const desayunosCategory = categorias[0];
  const bebidasCategory = categorias[1];
  const extrasCategory = categorias[2];
  const postresCategory = categorias[3];

  // DESAYUNOS
  const desayunos = await Promise.all([
    prisma.product.upsert({
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
        categoryId: desayunosCategory.id,
        active: true,
        featured: true,
        stock: 999,
      },
    }),
    prisma.product.upsert({
      where: { slug: "desayuno-continental" },
      update: {},
      create: {
        name: "Desayuno Continental",
        slug: "desayuno-continental",
        description:
          "Croissant mantecoso, pan francés, mermelada casera, mantequilla y queso crema",
        price: 20.0,
        image:
          "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800",
        categoryId: desayunosCategory.id,
        active: true,
        featured: true,
        stock: 999,
      },
    }),
    prisma.product.upsert({
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
        categoryId: desayunosCategory.id,
        active: true,
        featured: true,
        stock: 999,
      },
    }),
    prisma.product.upsert({
      where: { slug: "desayuno-criollo" },
      update: {},
      create: {
        name: "Desayuno Criollo",
        slug: "desayuno-criollo",
        description:
          "Tamales verdes, pan francés, salsa criolla, chicharrón y café pasado",
        price: 18.0,
        image:
          "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800",
        categoryId: desayunosCategory.id,
        active: true,
        featured: false,
        stock: 999,
      },
    }),
    prisma.product.upsert({
      where: { slug: "desayuno-dulce" },
      update: {},
      create: {
        name: "Desayuno Dulce",
        slug: "desayuno-dulce",
        description:
          "Waffles belgas, fresas frescas, crema batida, chispas de chocolate y jarabe",
        price: 23.0,
        image:
          "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800",
        categoryId: desayunosCategory.id,
        active: true,
        featured: true,
        stock: 999,
      },
    }),
  ]);

  // BEBIDAS
  const bebidas = await Promise.all([
    prisma.product.upsert({
      where: { slug: "jugo-naranja" },
      update: {},
      create: {
        name: "Jugo de Naranja",
        slug: "jugo-naranja",
        description: "Jugo natural de naranjas frescas recién exprimidas",
        price: 8.0,
        image:
          "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800",
        categoryId: bebidasCategory.id,
        active: true,
        featured: false,
        stock: 999,
      },
    }),
    prisma.product.upsert({
      where: { slug: "cafe-americano" },
      update: {},
      create: {
        name: "Café Americano",
        slug: "cafe-americano",
        description: "Café de grano selecto, preparado al momento",
        price: 6.0,
        image:
          "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
        categoryId: bebidasCategory.id,
        active: true,
        featured: false,
        stock: 999,
      },
    }),
    prisma.product.upsert({
      where: { slug: "cafe-latte" },
      update: {},
      create: {
        name: "Café Latte",
        slug: "cafe-latte",
        description: "Espresso con leche vaporizada y arte latte",
        price: 9.0,
        image:
          "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800",
        categoryId: bebidasCategory.id,
        active: true,
        featured: true,
        stock: 999,
      },
    }),
    prisma.product.upsert({
      where: { slug: "te-verde" },
      update: {},
      create: {
        name: "Té Verde",
        slug: "te-verde",
        description: "Té verde premium con menta y limón",
        price: 7.0,
        image:
          "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800",
        categoryId: bebidasCategory.id,
        active: true,
        featured: false,
        stock: 999,
      },
    }),
    prisma.product.upsert({
      where: { slug: "smoothie-fresa" },
      update: {},
      create: {
        name: "Smoothie de Fresa",
        slug: "smoothie-fresa",
        description: "Batido cremoso de fresas, plátano y yogurt griego",
        price: 12.0,
        image:
          "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=800",
        categoryId: bebidasCategory.id,
        active: true,
        featured: true,
        stock: 999,
      },
    }),
  ]);

  // EXTRAS
  const extras = await Promise.all([
    prisma.product.upsert({
      where: { slug: "yogurt-granola" },
      update: {},
      create: {
        name: "Yogurt con Granola",
        slug: "yogurt-granola",
        description: "Yogurt griego natural con granola casera y miel",
        price: 10.0,
        image:
          "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800",
        categoryId: extrasCategory.id,
        active: true,
        featured: false,
        stock: 999,
      },
    }),
    prisma.product.upsert({
      where: { slug: "tostadas-aguacate" },
      update: {},
      create: {
        name: "Tostadas con Aguacate",
        slug: "tostadas-aguacate",
        description:
          "Pan integral tostado con aguacate, huevo poché y semillas",
        price: 15.0,
        image:
          "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800",
        categoryId: extrasCategory.id,
        active: true,
        featured: true,
        stock: 999,
      },
    }),
    prisma.product.upsert({
      where: { slug: "frutas-temporada" },
      update: {},
      create: {
        name: "Frutas de Temporada",
        slug: "frutas-temporada",
        description: "Bowl de frutas frescas cortadas con miel y menta",
        price: 12.0,
        image:
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
        categoryId: extrasCategory.id,
        active: true,
        featured: false,
        stock: 999,
      },
    }),
    prisma.product.upsert({
      where: { slug: "pan-huevo" },
      update: {},
      create: {
        name: "Pan con Huevo",
        slug: "pan-huevo",
        description: "Pan francés relleno de huevo revuelto y queso",
        price: 8.0,
        image:
          "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800",
        categoryId: extrasCategory.id,
        active: true,
        featured: false,
        stock: 999,
      },
    }),
  ]);

  // POSTRES
  const postres = await Promise.all([
    prisma.product.upsert({
      where: { slug: "cheesecake-fresa" },
      update: {},
      create: {
        name: "Cheesecake de Fresa",
        slug: "cheesecake-fresa",
        description: "Suave cheesecake con salsa de fresas naturales",
        price: 14.0,
        image:
          "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=800",
        categoryId: postresCategory.id,
        active: true,
        featured: true,
        stock: 999,
      },
    }),
    prisma.product.upsert({
      where: { slug: "brownie-chocolate" },
      update: {},
      create: {
        name: "Brownie de Chocolate",
        slug: "brownie-chocolate",
        description:
          "Brownie caliente con helado de vainilla y salsa de chocolate",
        price: 12.0,
        image:
          "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800",
        categoryId: postresCategory.id,
        active: true,
        featured: false,
        stock: 999,
      },
    }),
  ]);

  console.log(
    `✅ ${desayunos.length + bebidas.length + extras.length + postres.length} productos creados`,
  );

  // ====================================
  // 4. CREAR PROMOCIONES
  // ====================================
  console.log("\n🎉 Creando promociones...");

  const promociones = await Promise.all([
    prisma.promotion.upsert({
      where: { code: "PRIMERAORDEN" },
      update: {},
      create: {
        name: "Primera Orden",
        description: "15% de descuento en tu primer pedido",
        discount: 15.0,
        code: "PRIMERAORDEN",
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-12-31"),
        active: true,
      },
    }),
    prisma.promotion.upsert({
      where: { code: "FINDEMES" },
      update: {},
      create: {
        name: "Fin de Mes",
        description: "10% de descuento los últimos 5 días del mes",
        discount: 10.0,
        code: "FINDEMES",
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-12-31"),
        active: true,
      },
    }),
  ]);

  console.log(`✅ ${promociones.length} promociones creadas`);

  // ====================================
  // 5. CREAR PEDIDO DE EJEMPLO
  // ====================================
  console.log("\n📦 Creando pedido de ejemplo...");

  const pedidoEjemplo = await prisma.order.create({
    data: {
      orderNumber: `ORD-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, "0")}${new Date().getDate().toString().padStart(2, "0")}-001`,
      customerName: "María García",
      customerPhone: "987654321",
      customerAddress: "Av. Principal 123, Lima",
      subtotal: 48.0,
      discount: 0,
      total: 48.0,
      status: "PENDING",
      paymentMethod: "efectivo",
      notes: "Sin cebolla por favor",
      items: {
        create: [
          {
            productId: desayunos[0].id,
            quantity: 1,
            price: 25.0,
            subtotal: 25.0,
          },
          {
            productId: bebidas[0].id,
            quantity: 2,
            price: 8.0,
            subtotal: 16.0,
          },
          {
            productId: extras[3].id,
            quantity: 1,
            price: 8.0,
            subtotal: 8.0,
          },
        ],
      },
    },
    include: {
      items: true,
    },
  });

  console.log(`✅ Pedido de ejemplo creado: ${pedidoEjemplo.orderNumber}`);

  // ====================================
  // RESUMEN
  // ====================================
  console.log("\n");
  console.log("═══════════════════════════════════════════");
  console.log("🎉 SEED COMPLETADO EXITOSAMENTE");
  console.log("═══════════════════════════════════════════");
  console.log("\n📊 RESUMEN:");
  console.log(`   👤 Usuarios: 1`);
  console.log(`   📁 Categorías: ${categorias.length}`);
  console.log(
    `   🍽️  Productos: ${desayunos.length + bebidas.length + extras.length + postres.length}`,
  );
  console.log(`   🎉 Promociones: ${promociones.length}`);
  console.log(`   📦 Pedidos: 1`);
  console.log("\n🔐 CREDENCIALES DE ACCESO:");
  console.log("   Email: admin@desayunos.com");
  console.log("   Password: Admin123!");
  console.log(
    "\n💡 Usa estas credenciales para acceder al panel de administración",
  );
  console.log("═══════════════════════════════════════════\n");
}

main()
  .catch((e) => {
    console.error("Error en el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
