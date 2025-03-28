const cartSchema = {
    validateCartItem: (cartItem) => {
        const errors = [];

        if (!cartItem.userId) errors.push("Identyfikator użytkownika jest wymagany");
        if (!cartItem.productId) errors.push("Identyfikator produktu jest wymagany");
        if (cartItem.quantity === undefined || cartItem.quantity <= 0) {
            errors.push("Ilość produktu musi być większa od zera");
        }
        if (cartItem.dateAdded && isNaN(Date.parse(cartItem.dateAdded))) {
            errors.push("Nieprawidłowy format daty dodania");
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
};

module.exports = cartSchema;