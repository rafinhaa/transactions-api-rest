import { describe, expect, it, beforeAll, afterAll } from "vitest";
import supertest from "supertest";
import { app } from "../src/app";

describe("app", () => {
  beforeAll(async () => {
    app.ready();
  });

  afterAll(async () => {
    app.close();
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
});
