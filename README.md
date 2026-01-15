# Dahs Food - Ecommerce de Comida 🍔

Dahs Food es una plataforma de comercio electrónico moderna construida con **Next.js**, diseñada para ofrecer una experiencia fluida en la compra de alimentos, con gestión de productos, categorías, promociones y pedidos.

---

## 🚀 Guía de Inicio Rápido

Sigue estos pasos para configurar el proyecto localmente desde cero.

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd dahs-food-next
```

### 2. Requisitos del Sistema

- **Node.js**: v20.0.0 o superior (Recomendado v22.x LTS)
- **NPM**: v10.0.0 o superior
- **Base de Datos**: PostgreSQL 15+
- **Memoria RAM**: 4GB mínimo (8GB recomendado para compilación)
- **Sistema Operativo**: Windows 10+, macOS o Linux (Ubuntu 20.04+)

### 3. Instalar dependencias

```bash
npm install
```

### 4. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto basándote en `.env.template`:

```bash
cp .env.template .env
```

Luego, abre el archivo `.env` y completa los valores necesarios:

```env
# Conexión a Base de Datos
DATABASE_URL="postgresql://usuario:password@localhost:5432/nombre_db?schema=public"

# Configuración de Entorno
NODE_ENV="development"
PASSWORD_SALT_ROUNDS="10"
PASSWORD_ADMIN="tu_password_segura" # Para el panel de administración

# Autenticación (NextAuth / Auth.js v5)
AUTH_SECRET="ejecuta_npx_auth_secret" # Genera uno con `npx auth secret`
AUTH_URL="http://localhost:3000"

# Cloudinary (Para gestión de imágenes)
CLOUDINARY_CLOUD_NAME="tu_cloud_name"
CLOUDINARY_API_KEY="tu_api_key"
CLOUDINARY_API_SECRET="tu_api_secret"
```

### 5. Configurar la Base de Datos con Prisma

Este proyecto usa **Prisma** como ORM. Sigue este orden para sincronizar la base de datos:

1. **Generar el cliente de Prisma**:
   (Nota: El cliente se genera en `app/generated/prisma` según la configuración del proyecto).

   ```bash
   npx prisma generate
   ```

2. **Empujar el esquema a la base de datos**:

   ```bash
   npx prisma db push
   ```

3. **Ejecutar el Seed (Opcional - para datos iniciales)**:
   Si deseas cargar categorías y productos de prueba:
   ```bash
   npx tsx prisma/seed.ts
   ```

### 6. Ejecutar el proyecto en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

---

## 🛠️ Tecnologías Utilizadas

- **Framework**: [Next.js 16 (React 19)](https://nextjs.org/)
- **Base de Datos**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
- **Gestión de Estado**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Autenticación**: [Auth.js (v5)](https://authjs.dev/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide React](https://lucide.dev/)
- **Validación**: [Zod](https://zod.dev/)

---

## 📂 Estructura del Proyecto

- `app/`: Directorio principal de Next.js (App Router).
- `components/`: Componentes de interfaz de usuario reutilizables.
- `prisma/`: Esquema de base de datos y scripts de migración/seed.
- `store/`: Tiendas de estado global (Zustand).
- `services/`: Lógica de comunicación con APIs y base de datos.
- `actions/`: Server Actions de Next.js.
- `types/`: Definiciones de tipos TypeScript.

---

## ⚠️ Notas Importantes

- **Generación de Prisma**: Debido a la configuración personalizada, asegúrate de correr siempre `npx prisma generate` después de instalar dependencias para que TypeScript reconozca los tipos generados en el directorio custom.
- **Imágenes**: Se requiere una cuenta de **Cloudinary** para cargar y visualizar imágenes de productos correctamente.
