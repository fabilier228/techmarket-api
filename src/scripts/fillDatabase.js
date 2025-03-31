const { faker } = require('@faker-js/faker');
const { createProductViewSchema } = require('../schemas/productViewSchema');
const { createNewProductView, deleteAllProductViews } = require('../models/productViewModel')

const COLLECTION = 'productViews';

const sampleData = () => {
    return {
        productId: faker.number.int({ min: 1, max: 9999 }),
        userId: faker.number.int({ min: 1, max: 1000 }),
        viewDate: faker.date.recent().toISOString(),
        duration: faker.number.int({ min: 1, max: 3600 }),
        source: faker.helpers.arrayElement(["web", "mobile", "tablet"])
    };
};

const seedDatabase = async (count) => {
    await deleteAllProductViews()

    let succes = 0;
    for (let i = 0; i < count; i++) {
        try {
            const data = sampleData();
            const result = await createNewProductView(sampleData())
            succes++
            console.log("Udalo się dodać: ", result)
        } catch (error) {
            succes--
            console.error("Błąd podczas wypełniania bazy danymi:", error);
        }
    }

    console.log("Udalo sie dodac ", succes, " rekordow")
    console.log("Niestety nie udalo sie dodac ", count - succes, " rekordow")

};

seedDatabase(30);
