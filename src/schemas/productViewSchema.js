const Joi = require('joi');

const createProductViewSchema = Joi.object({
    productId: Joi.string().required(),
    userId: Joi.string().required(), // Walidacja ObjectId
    viewDate: Joi.date().iso(),
    duration: Joi.number().integer().required(), // Czas trwania w sekundach (1-3600)
    source: Joi.string().required(), // Źródło z ograniczonymi wartościami
});

module.exports = {
    createProductViewSchema
};
