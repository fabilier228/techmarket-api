const request = require("supertest");
const app = require("../../server");
const { sequelize } = require("../../src/config/database");

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

describe("User API Endpoints", () => {
    let userId;

    it("✅ Powinien dodać nowego użytkownika", async () => {
        const res = await request(app)
            .post("/api/users")
            .send({
                username: "testuser",
                email: "test@example.com",
                password_hash: "hashedpassword",
                first_name: "John",
                last_name: "Doe"
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBeDefined();
        userId = res.body.id;
    });

    it("✅ Powinien pobrać użytkownika po ID", async () => {
        const res = await request(app).get(`/api/users/${userId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(userId);
    });

    it("✅ Powinien usunąć użytkownika", async () => {
        const res = await request(app).delete(`/api/users/${userId}`);
        expect(res.statusCode).toBe(200);
    });
});
