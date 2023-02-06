import { randomUUID } from "crypto";
import fastify from "fastify";
import { knex } from "./database";

const app = fastify();

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

app
  .listen({
    port: 3333,
  })
  .then(() => console.log("HTTP server running!"));
