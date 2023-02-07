import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";

const createTransactionBodySchema = z.object({
  title: z.string(),
  amount: z.number(),
  type: z.enum(["credit", "debit"]),
});

type TransactionBody = z.infer<typeof createTransactionBodySchema>;

export const transactions = async (app: FastifyInstance) => {
  app.post<{ Body: TransactionBody }>("/", async (req, rep) => {
    const { amount, title, type } = createTransactionBodySchema.parse(req.body);
    await knex("transactions").insert({
      id: randomUUID(),
      title,
      amount: type === "credit" ? amount : amount * -1,
    });

    return rep.status(201).send();
  });
};
