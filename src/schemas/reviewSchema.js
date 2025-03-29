const Joi = require('joi');

const createReviewSchema = Joi.object({
    productId: Joi.string().required(),  // Id produktu, które jest wymagane
    userId: Joi.string().required(),  // Id użytkownika, które jest wymagane
    rating: Joi.number().required().min(1).max(5),  // Ocena od 1 do 5
    title: Joi.string().required().min(3).max(100),  // Tytuł recenzji, wymagany, długość od 3 do 100 znaków
    content: Joi.string().required().min(10).max(5000),  // Treść recenzji, wymagany, długość od 10 do 5000 znaków
    pros: Joi.array().items(Joi.string().min(1)).required(),  // Tablica z zaletami, każda pozycja to ciąg znaków
    cons: Joi.array().items(Joi.string().min(1)).required(),  // Tablica z wadami, każda pozycja to ciąg znaków
    verifiedPurchase: Joi.boolean().required(),  // Flaga czy zakup został zweryfikowany
    helpfulVotes: Joi.number().integer().min(0).required()  // Liczba głosów pomocnych, liczba całkowita, nieujemna
});

module.exports = {
    createReviewSchema
};
