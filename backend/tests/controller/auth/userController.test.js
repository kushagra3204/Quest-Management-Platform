const request = require("supertest");
const jwt = require("jsonwebtoken");
const User = require("../../../src/models/User");
const app = require("../../../src/app");

jest.mock("../../../src/models/User");
jest.mock("jsonwebtoken");

describe("User Controller", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should successfully retrieve user data", async () => {
        const mockUser = {
            _id: "user123",
            username: "testuser",
            email: "test@example.com",
            toJSON: function () { return { _id: this._id, username: this.username, email: this.email }; }
        };

        const mockToken = "valid.jwt.token";
        jwt.verify.mockReturnValue({ _id: "user123" });
        User.findOne.mockResolvedValue(mockUser);

        const response = await request(app)
            .get("/api/auth/user")
            .set("Cookie", [`jwt=${mockToken}`]);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ _id: "user123", username: "testuser", email: "test@example.com" });
    });

    it("should return 400 if JWT token is missing", async () => {
        const response = await request(app).get("/api/auth/user");

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("unauthenticated");
    });

    it("should return 401 if JWT token is invalid", async () => {
        jwt.verify.mockImplementation(() => {
            throw new Error("Invalid token");
        });

        const response = await request(app)
            .get("/api/auth/user")
            .set("Cookie", ["jwt=invalid.token"]);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("unauthenticated");
    });

    it("should return 401 if user does not exist", async () => {
        jwt.verify.mockReturnValue({ _id: "user123" });
        User.findOne.mockResolvedValue(null);

        const response = await request(app)
            .get("/api/auth/user")
            .set("Cookie", ["jwt=valid.jwt.token"]);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("unauthenticated");
    });
});