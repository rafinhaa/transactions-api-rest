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

  it("should user can create a new transaction", async () => {
    const response = await supertest(app.server).post("/transactions").send({
      title: "abc",
      amount: 5000,
      type: "credit",
    });

    expect(response.statusCode).equals(201);
  });
});
