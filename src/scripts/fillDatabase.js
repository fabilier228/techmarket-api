const { faker } = require('@faker-js/faker');
const { createProductViewSchema } = require('../schemas/productViewSchema');
const { createNewProductView, deleteAllProductViews } = require('../models/productViewModel')
const { createNewReview, deleteAllReviews} = require("../models/reviewModel")

const COLLECTION = 'productViews';

const sampleDataProductView = () => {
    console.log(faker.date.recent().toISOString())
    return {
        productId: faker.number.int({ min: 1, max: 5 }),
        userId: faker.number.int({ min: 1, max: 4 }),
        viewDate: faker.date.recent().toISOString(),
        duration: faker.number.int({ min: 1, max: 3600 }),
        source: faker.helpers.arrayElement(["web", "mobile", "tablet"])
    };
};

const sampleDataReview = () => {
    return {
        productId: faker.number.int({ min: 1, max: 5 }),
        userId: faker.number.int({ min: 1, max: 4 }),
        rating: faker.number.int({ min: 1, max: 5 }),
        title: faker.lorem.sentence({ min: 3, max: 5 }),
        content: faker.lorem.paragraph({ min: 2, max: 5 }),
        pros: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => faker.lorem.word()),
        cons: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => faker.lorem.word()),
        verifiedPurchase: faker.datatype.boolean(),
        helpfulVotes: faker.number.int({ min: 0, max: 100 }),
        reviewDate: faker.date.recent(30)
    };
};

const seedDatabase = async (count) => {
    await deleteAllProductViews()
    await deleteAllReviews()

    let succes = 0;
    for (let i = 0; i < count; i++) {
        try {
            const sdpv = sampleDataProductView();
            const sdr = sampleDataReview()
            const productView = await createNewProductView(sdpv)
            const review = await createNewReview(sdr)
            succes++
            console.log("Udalo się dodać: ", sdpv)
            console.log("Udalo się dodać: ", sdr)
        } catch (error) {
            succes--
            console.error("Błąd podczas wypełniania bazy danymi:", error);
        }
    }

    console.log("Udalo sie dodac ", succes, " rekordow")
    console.log("Niestety nie udalo sie dodac ", count - succes, " rekordow")

};

seedDatabase(30);
