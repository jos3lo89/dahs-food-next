import { string, object, infer } from "zod";
const envVars = object({
  DATABASE_URL: string(),
  NODE_ENV: string(),
  PASSWORD_SALT_ROUNDS: string(),
  PASSWORD_ADMIN: string(),
  NEXTAUTH_SECRET: string(),
  AUTH_SECRET: string(),
  AUTH_URL: string(),
});

envVars.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends infer<typeof envVars> {}
  }
}
