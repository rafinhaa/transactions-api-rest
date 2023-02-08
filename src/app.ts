import fastify from "fastify";
import cookie from "@fastify/cookie";
import { transactions } from "./routes/transactions";

export const app = fastify();

app.register(cookie).register(transactions, {
  prefix: "transactions",
});
