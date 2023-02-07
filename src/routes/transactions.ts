import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";
import { knex } from "../database";

export const transactions = async (app: FastifyInstance) => {
  app.get("/hello", async () => {
    const transaction = await knex("transactions").insert(
      {
        id: randomUUID(),
        title: "Transação de teste",
        amount: 1000,
      },
      "*"
    );

    return transaction;
  });
};
