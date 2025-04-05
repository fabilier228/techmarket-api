const Joi = require('joi');

const createProductSchema = Joi.object({
    productId: Joi.string().required(),
    name: Joi.string().required(),
    categoryId: Joi.number().integer().required(),
    description: Joi.string(),
    price: Joi.number().required(),
    stockCount: Joi.number().integer().default(0),
    brand: Joi.string(),
    imageUrl: Joi.string(),
    isAvailable: Joi.bool().default(true)
});

module.exports = {
    createProductSchema
};