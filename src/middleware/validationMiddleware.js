function validateRequest(schema, property) {
    return (req, res, next) => {
        const { error } = schema.validate(req[property]);  // Walidacja na podstawie podanego schematu

        if (error) {
            return res.status(400).json({
                message: 'Validation error',
                details: error.details.map(detail => detail.message)  // Szczegóły błędów walidacji
            });
        }

        next();  // Jeśli walidacja przebiegła pomyślnie, przejdź do kolejnego middleware
    };
}

module.exports = {
    validateRequest
}