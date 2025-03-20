const request = require("supertest");
const app = require("../../server");
const { sequelize } = require("../../src/config/database");

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

describe("Review API Endpoints", () => {
    let productId, userId, reviewId;

    beforeAll(async () => {
        // Tworzymy testowy produkt
        const productRes = await request(app)
            .post("/api/products")
            .send({
                name: "Smartphone",
                category: "Electronics",
                description: "Nowoczesny smartfon",
                price: 799.99,
                stockCount: 20,
                brand: "BrandB",
                imageUrl: "https://example.com/smartphone.jpg",
                isAvailable: true
            });
        productId = productRes.body.id;

        // Tworzymy testowego użytkownika
        const userRes = await request(app)
            .post("/api/users")
            .send({
                username: "reviewer",
                email: "reviewer@example.com",
                password_hash: "hashedpassword",
                first_name: "Jane",
                last_name: "Doe"
            });
        userId = userRes.body.id;
    });

    it("✅ Powinien dodać recenzję", async () => {
        const res = await request(app)
            .post("/api/reviews")
            .send({
                product_id: productId,
                user_id: userId,
                rating: 5,
                comment: "Świetny produkt!"
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBeDefined();
        reviewId = res.body.id;
    });

    it("✅ Powinien pobrać recenzję po ID", async () => {
        const res = await request(app).get(`/api/reviews/${reviewId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(reviewId);
    });

    it("✅ Powinien pobrać wszystkie recenzje dla produktu", async () => {
        const res = await request(app).get(`/api/reviews/product/${productId}`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    it("✅ Powinien usunąć recenzję", async () => {
        const res = await request(app).delete(`/api/reviews/${reviewId}`);
        expect(res.statusCode).toBe(200);
    });
});
