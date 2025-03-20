const request = require("supertest");
const app = require("../../server"); // Importujemy nasz serwer
const { sequelize } = require("../../src/config/database");

beforeAll(async () => {
    await sequelize.sync({ force: true }); // Resetujemy bazę przed testami
});

afterAll(async () => {
    await sequelize.close();
});

describe("Product API Endpoints", () => {
    let productId;

    it("✅ Powinien dodać nowy produkt", async () => {
        const res = await request(app)
            .post("/api/products")
            .send({
                name: "Laptop",
                category: "Electronics",
                description: "Wysokowydajny laptop",
                price: 2999.99,
                stockCount: 10,
                brand: "BrandA",
                imageUrl: "https://example.com/laptop.jpg",
                isAvailable: true
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBeDefined();
        productId = res.body.id;
    });

    it("✅ Powinien zwrócić wszystkie produkty", async () => {
        const res = await request(app).get("/api/products");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    it("✅ Powinien pobrać produkt po ID", async () => {
        const res = await request(app).get(`/api/products/${productId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(productId);
    });

    it("✅ Powinien zaktualizować produkt", async () => {
        const res = await request(app)
            .put(`/api/products/${productId}`)
            .send({ price: 2799.99 });

        expect(res.statusCode).toBe(201);
        expect(res.body.price).toBe(2799.99);
    });

    it("✅ Powinien usunąć produkt", async () => {
        const res = await request(app).delete(`/api/products/${productId}`);
        expect(res.statusCode).toBe(200);
    });
});
