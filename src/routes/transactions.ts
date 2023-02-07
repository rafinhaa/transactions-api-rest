import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";

const SEVEN_DAYS = 1000 * 60 * 60 * 24 * 7;

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

  app.get<{
    Params: TransactionParams;
  }>("/summary", async (req, rep) => {
    const summary = await knex("transactions")
      .sum("amount", {
        as: "amount",
      })
      .first();

    return rep.status(200).send({ summary });
  });

  app.post<{ Body: TransactionBody }>("/", async (req, rep) => {
    const { amount, title, type } = createTransactionBodySchema.parse(req.body);

    const sessionId = req.cookies.sessionId;

    const [transactions] = await knex("transactions").insert(
      {
        id: randomUUID(),
        title,
        amount: type === "credit" ? amount : amount * -1,
        session_id: sessionId ? sessionId : randomUUID(),
      },
      ["session_id"]
    );

    return rep
      .cookie("sessionId", transactions.session_id, {
        path: "/transactions",
        maxAge: SEVEN_DAYS,
      })
      .status(201)
      .send();
  });
};
