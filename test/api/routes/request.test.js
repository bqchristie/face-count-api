import supertest from "supertest";
import { jest } from "@jest/globals"; // eslint-disable-line

import app from "../../../src/app.js";
import RequestService from "../../../src/services/request.js";
import UserService from "../../../src/services/user.js";

jest.mock("../../../src/services/request.js");
jest.mock("../../../src/services/user.js");

UserService.authenticateWithToken = jest
  .fn()
  .mockResolvedValue({ email: "test@example.com" });

describe("/api/v1/request/", () => {
  test("anonymous requests are blocked", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/request");
    expect(res.status).toBe(401);
  });

  test("GET lists all the models", async () => {
    const data = [{ name: "First" }, { name: "Second" }];
    RequestService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get("/api/v1/request")
      .set("Authorization", "token abc");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(RequestService.list).toHaveBeenCalled();
  });

  test("POST creates a new Request", async () => {
    const data = {
      name: "test",
      createdAt: "2001-01-01T00:00:00Z",
      updatedAt: "2001-01-01T00:00:00Z",
      userId: 42,
      faceCount: 42,
    };

    RequestService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/request")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(RequestService.create).toHaveBeenCalledWith(data);
  });

  test("creating a new Request without required attributes fails", async () => {
    const data = {};

    RequestService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/request")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(RequestService.create).not.toHaveBeenCalled();
  });
});

describe("/api/v1/request/:id", () => {
  test("getting a single result succeeds for authorized user", async () => {
    const data = { email: "test@example.com" };
    RequestService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/request/1`)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(RequestService.get).toHaveBeenCalledWith(1);
  });

  test("getting a single result fails for anonymous user", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/request/1");
    expect(res.status).toBe(401);
  });

  test("request for nonexistent object returns 404", async () => {
    const id = "1";
    RequestService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/request/${id}`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(404);
    expect(RequestService.get).toHaveBeenCalled();
  });

  test("request with incorrectly-formatted ObjectId fails", async () => {
    RequestService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/request/bogus`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(400);
    expect(RequestService.get).not.toHaveBeenCalled();
  });

  test("Request update", async () => {
    const data = {
      name: "test",
      createdAt: "2001-01-01T00:00:00Z",
      userId: 42,
    };
    RequestService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/request/1`)
      .send(data)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(RequestService.update).toHaveBeenCalledWith(1, data);
  });

  test("Request deletion", async () => {
    RequestService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/request/1`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(204);
    expect(RequestService.delete).toHaveBeenCalledWith(1);
  });
});
