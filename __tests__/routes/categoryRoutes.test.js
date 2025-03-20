// __tests__/routes/categoryRoutes.test.js
const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/database.test"); // Plik testowy bazy danych
const CategoryModel = require("../../src/models/Category");
const request = require("supertest");
const { app, server } = require("../../server");

let Category;

beforeAll(async () => {
    Category = CategoryModel(sequelize, DataTypes);
    await sequelize.sync({ force: true }); // Reset bazy przed testami
});

afterAll(async () => {
    await sequelize.close();
    await server.close();
});

describe("Category API Endpoints", () => {
    let categoryId;

    it("powinien dodać nową kategorię", async () => {
        const categoryData = { name: "nabiał", description: "ser" };

        const res = await request(app).post("/api/categories").send(categoryData);

        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBeDefined();
        expect(res.body.name).toBe(categoryData.name);
        expect(res.body.description).toBe(categoryData.description);

        categoryId = res.body.id;
    });

    it("powinien zwrócić wszystkie kategorie", async () => {
        const res = await request(app).get("/api/categories");

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    it("powinien pobrać kategorię po ID", async () => {
        const res = await request(app).get(`/api/categories/${categoryId}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(categoryId);
    });

    it("powinien zaktualizować kategorię", async () => {
        const updatedData = { description: "nowy opis" };

        const res = await request(app)
            .put(`/api/categories/${categoryId}`)
            .send(updatedData);

        expect(res.statusCode).toBe(201);
        expect(res.body.description).toBe(updatedData.description);
    });

    it("powinien usunąć kategorię", async () => {
        const res = await request(app).delete(`/api/categories/${categoryId}`);
        expect(res.statusCode).toBe(200);
    });
});
