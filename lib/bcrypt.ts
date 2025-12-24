import bcrypt from "bcryptjs";
export const SALT_ROUNDS = parseInt(
  process.env.PASSWORD_SALT_ROUNDS || "10",
  10,
);

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
