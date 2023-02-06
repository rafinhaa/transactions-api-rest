import "dotenv/config";
import { knex as setupKnex, Knex } from "knex";

if (!process.env.DATABASE_CLIENT || !process.env.DATABASE_URL)
  throw new Error("Database config not found, please init your dotenv file");

export const config: Knex.Config = {
  client: process.env.DATABASE_CLIENT,
  connection: {
    filename: "./database/app.db",
  },
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: process.env.DATABASE_URL,
  },
};

export const knex = setupKnex(config);
