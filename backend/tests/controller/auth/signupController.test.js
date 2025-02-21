const request = require("supertest");
const app = require("../../../src/app");
const mongoose = require("mongoose");
const User = require("../../../src/models/User");
const UserActivity = require("../../../src/models/UserActivity");
const bcrypt = require("bcrypt");

jest.mock("../../../src/models/User");
jest.mock("../../../src/models/UserActivity");
jest.mock("bcrypt");

describe("Signup Controller", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should successfully create a new user", async () => {
        bcrypt.hash.mockResolvedValue("hashedpassword");

        User.findOne.mockResolvedValue(null);
        User.prototype.save.mockResolvedValue({
            _id: "user123",
            username: "testuser",
            email: "test@example.com",
            password: "hashedpassword",
            role: "user",
            toJSON: function () { return { _id: this._id, username: this.username, email: this.email, role: this.role }; }
        });

        UserActivity.prototype.save.mockResolvedValue({});

        const response = await request(app)
            .post("/api/auth/signup")
            .send({
                username: "testuser",
                email: "test@example.com",
                password: "password123",
                role: "user"
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("success");
    });

    it("should return 400 if email already exists", async () => {
        User.findOne.mockResolvedValueOnce({ email: "test@example.com" });

        const response = await request(app)
            .post("/api/auth/signup")
            .send({
                username: "testuser",
                email: "test@example.com",
                password: "password123",
                role: "user"
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("User with this email already exists");
    });

    it("should return 400 if username already exists", async () => {
        User.findOne
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce({ username: "testuser" });

        const response = await request(app)
            .post("/api/auth/signup")
            .send({
                username: "testuser",
                email: "test@example.com",
                password: "password123",
                role: "user"
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("User with this username already exists");
    });

    it("should return 500 on server error", async () => {
        User.findOne.mockRejectedValue(new Error("Database error"));

        const response = await request(app)
            .post("/api/auth/signup")
            .send({
                username: "testuser",
                email: "test@example.com",
                password: "password123",
                role: "user"
            });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Database error");
    });
});