const request = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = require("../../../src/app"); // Adjust path if needed
const User = require("../../../src/models/User");

process.env.JWT_SECRET = "test_secret";

const mockUser = {
    _id: new mongoose.Types.ObjectId(),
    username: "testuser",
    email: "test@example.com",
    password: bcrypt.hashSync("password123", 10),
    role: "user",
    lastLogin: null,
};

beforeAll(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/testdb", { useNewUrlParser: true, useUnifiedTopology: true });
    await User.create(mockUser);
});

afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
});

describe("Login Controller", () => {
    it("should login successfully with email and return a token", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ username__email: mockUser.email, password: "password123" });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("success");
        expect(res.body.role).toBe(mockUser.role);
        expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("should login successfully with username and return a token", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ username__email: mockUser.username, password: "password123" });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("success");
        expect(res.body.role).toBe(mockUser.role);
    });

    it("should return 400 if the password is incorrect", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ username__email: mockUser.email, password: "wrongpassword" });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Invalid credentials");
    });

    it("should return 400 if the user is not found", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ username__email: "nonexistent@example.com", password: "password123" });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("User not found");
    });

    it("should handle server errors gracefully", async () => {
        jest.spyOn(User, "findOne").mockImplementationOnce(() => {
            throw new Error("Database error");
        });

        const res = await request(app)
            .post("/api/auth/login")
            .send({ username__email: mockUser.email, password: "password123" });

        expect(res.status).toBe(500);
        expect(res.body.message).toBe("Database error");
    });
});