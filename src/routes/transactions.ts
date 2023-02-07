import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";

const createTransactionBodySchema = z.object({
  title: z.string(),
  amount: z.number(),
  type: z.enum(["credit", "debit"]),
});

const getTransactionParamsSchema = z.object({
  id: z.string().uuid(),
});

type TransactionBody = z.infer<typeof createTransactionBodySchema>;
type TransactionParams = z.infer<typeof getTransactionParamsSchema>;

export const transactions = async (app: FastifyInstance) => {
  app.get("/", async (_, rep) => {
    const transactions = await knex("transactions").select("*");

    return rep.status(200).send({ transactions });
  });

  app.get<{
    Params: TransactionParams;
  }>("/:id", async (req, rep) => {
    const { id } = getTransactionParamsSchema.parse(req.params);
    const transactions = await knex("transactions")
      .select("*")
      .where({
        id,
      })
      .first();

    return rep.status(200).send({ transactions });
  });

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
