import { string, object, infer } from "zod";
const envVars = object({
  DATABASE_URL: string(),
  NODE_ENV: string(),
  PASSWORD_SALT_ROUNDS: string(),
  PASSWORD_ADMIN: string(),
  NEXTAUTH_SECRET: string(),
  AUTH_SECRET: string(),
  AUTH_URL: string(),
  CLOUDINARY_CLOUD_NAME: string(),
  CLOUDINARY_API_KEY: string(),
  CLOUDINARY_API_SECRET: string(),
  NEXT_PUBLIC_WHATSAPP_PHONE: string(),
  PERUDEVS_API_KEY: string(),
  EMAIL_HOST: string(),
  EMAIL_PORT: string(),
  EMAIL_USER: string(),
  EMAIL_PASS: string(),
  NEXT_PUBLIC_APP_URL: string(),
  CURRENT_ADMIN_EMAIL: string(),
});

envVars.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends infer<typeof envVars> {}
  }
}
