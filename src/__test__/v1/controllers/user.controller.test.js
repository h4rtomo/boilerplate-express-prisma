const request = require("supertest");
const express = require("express");
const router = require("../../../v1/controllers/user.controller"); // Update this with the correct path

const app = express();
app.use(express.json());
app.use("/v1/users", router);

describe("User Routes", () => {
  // Test GET /users
  it("should get all users", async () => {
    const response = await request(app).get("/v1/users");
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(0);
  });

  // Test POST /users
  it("should create a new user", async () => {
    const newUser = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password123",
    };

    const response = await request(app).post("/v1/users").send(newUser);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "User created");
  });

  // Test POST /users
  it("should error create user", async () => {
    const newUser = {
      name: "John Doe",
      email: "john.doe@example.com",
    };

    const response = await request(app).post("/v1/users").send(newUser);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors", "Some fields are missing");
  });

  // Test GET /users
  it("should get all users", async () => {
    const response = await request(app).get("/v1/users");
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  // Test GET /users/:id
  it("should get a single user by ID", async () => {
    const userId = 1;
    const response = await request(app).get(`/v1/users/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", userId);
  });

  // Test GET /users/:id
  it("should not found user", async () => {
    const userId = 2;
    const response = await request(app).get(`/v1/users/${userId}`);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
  });

  // Test PUT /users/:id
  it("should update a user by ID", async () => {
    const userId = 1;
    const updatedUserData = {
      name: "Updated Name",
      email: "updated.email@example.com",
      password: "updatedPassword",
    };

    const response = await request(app).put(`/v1/users/${userId}`).send(updatedUserData);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "User updated");
  });

  // Test PUT /users/:id
  it("should error update user", async () => {
    const userId = 1;
    const updatedUserData = {
      email: "updated.email@example.com",
      password: "updatedPassword",
    };

    const response = await request(app).put(`/v1/users/${userId}`).send(updatedUserData);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors", "Some fields are missing");
  });

  // Test DELETE /users/:id
  it("should delete a user by ID", async () => {
    const userId = 1;
    const response = await request(app).delete(`/v1/users/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "User deleted");
  });
});
