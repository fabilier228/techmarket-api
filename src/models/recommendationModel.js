const { connectToDatabase } = require("../config/mongo");

const COLLECTION = "productViews";

const connectToClient = async () => {
    const client = await connectToDatabase();
    return client.db("test-mongo").collection(COLLECTION);
};

const makeRecommendationForUser = async (userId) => {
    try {
        const productViewsCollection = await connectToClient();

        // 1️⃣ Pobierz historię przeglądania danego użytkownika
        const userHistory = await productViewsCollection.distinct("productId", { userId });

        if (userHistory.length === 0) {
            return []; // Jeśli użytkownik nic nie oglądał, brak rekomendacji
        }

        // 2️⃣ Znajdź innych użytkowników, którzy oglądali te same produkty
        const similarUsers = await productViewsCollection.distinct("userId", {
            productId: { $in: userHistory },
            userId: { $ne: userId } // Wykluczamy samego użytkownika
        });

        if (similarUsers.length === 0) {
            return []; // Brak podobnych użytkowników → brak rekomendacji
        }

        // 3️⃣ Pobierz produkty oglądane przez podobnych użytkowników, ale nie przez użytkownika
        const recommendedProducts = await productViewsCollection.distinct("productId", {
            userId: { $in: similarUsers },
            productId: { $nin: userHistory } // Wykluczamy produkty, które użytkownik już widział
        });

        return recommendedProducts;
    } catch (error) {
        console.error("Error generating recommendations:", error);
        return [];
    }
};

module.exports = {
    makeRecommendationForUser
};
