import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { execSync } from "node:child_process";
import supertest from "supertest";
import { app } from "../src/app";

describe("app", () => {
  beforeAll(async () => {
    app.ready();
  });

  afterAll(async () => {
    app.close();
  });

  beforeEach(() => {
    execSync("npm run knex migrate:rollback --all");
    execSync("npm run knex migrate:latest");
  });

  it("should be able to create a new transaction", async () => {
    const response = await supertest(app.server).post("/transactions").send({
      title: "abc",
      amount: 5000,
      type: "credit",
    });

    expect(response.statusCode).equals(201);
  });

  it("should be able to list all transactions", async () => {
    const createTransactionResponse = await supertest(app.server)
      .post("/transactions")
      .send({
        title: "abc",
        amount: 5000,
        type: "credit",
      });

    const cookies = createTransactionResponse.get("Set-Cookie");

    const response = await supertest(app.server)
      .get("/transactions")
      .set("Cookie", cookies);

    expect(response.statusCode).equals(200);
    expect(response.body.transactions).toEqual([
      expect.objectContaining({
        title: "abc",
        amount: 5000,
      }),
    ]);
  });

  it("should be able to get specific transaction", async () => {
    const createTransactionResponse = await supertest(app.server)
      .post("/transactions")
      .send({
        title: "abc",
        amount: 5000,
        type: "credit",
      });

    const cookies = createTransactionResponse.get("Set-Cookie");

    const response = await supertest(app.server)
      .get("/transactions")
      .set("Cookie", cookies);

    const transactionId = response.body.transactions[0].id;

    const getTransactionResponse = await supertest(app.server)
      .get(`/transactions/${transactionId}`)
      .set("Cookie", cookies);

    expect(getTransactionResponse.statusCode).toEqual(200);
    expect(getTransactionResponse.body.transactions).toEqual(
      expect.objectContaining({
        title: "abc",
        amount: 5000,
      })
    );
  });

  it("should be able to get the summary", async () => {
    const createTransactionResponse = await supertest(app.server)
      .post("/transactions")
      .send({
        title: "Credit",
        amount: 5000,
        type: "credit",
      });

    const cookies = createTransactionResponse.get("Set-Cookie");

    await supertest(app.server)
      .post("/transactions")
      .set("Cookie", cookies)
      .send({
        title: "Debit",
        amount: 2000,
        type: "debit",
      });

    const summary = await supertest(app.server)
      .get("/transactions/summary")
      .set("Cookie", cookies);

    expect(summary.statusCode).equals(200);
    expect(summary.body.summary).toEqual({
      amount: 3000,
    });
  });
});
