import { knex as setupKnex, Knex } from "knex";
import { env } from "./env";

const isDevelopment = env.DATABASE_CLIENT === "sqlite";
const dbConnection = isDevelopment
  ? {
      filename: env.DATABASE_URL,
    }
  : env.DATABASE_URL;

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection: dbConnection,
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./database/migrations",
  },
};

export const knex = setupKnex(config);
