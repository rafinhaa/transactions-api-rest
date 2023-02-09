import { config } from "dotenv";
import { z } from "zod";

const dotEnvPath = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
config({ path: dotEnvPath });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
  DATABASE_CLIENT: z.enum(["sqlite", "pg"]),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  const errorMessage = "Invalid environment variables";
  console.error(errorMessage, _env.error.format());
  throw new Error(errorMessage);
}

export const env = _env.data;
