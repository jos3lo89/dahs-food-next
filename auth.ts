import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "./schemas/auth.schema";
import { comparePassword } from "./lib/bcrypt";
import prisma from "./lib/prisma";

export const { signIn, signOut, auth, handlers } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const result = loginSchema.safeParse(credentials);
        if (!result.success) {
          throw new Error("Credenciales inválidas");
        }

        const { email, password } = result.data;

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          throw new Error("Usuario no encontrado");
        }

        const isValidPassword = await comparePassword(password, user.password);

        if (!isValidPassword) {
          throw new Error("Contraseña inválida");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role;
        session.user.email = session.user.email;
        session.user.name = session.user.name;
      }
      return session;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.AUTH_SECRET,
});
