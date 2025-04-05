const express = require("express");
const productRoutes = require("./src/routes/productRoutes");
const userRoutes = require("./src/routes/userRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const reviewRoutes = require("./src/routes/reviewRoutes");
const cartRoutes = require("./src/routes/cartRoutes")
const analyticsRoutes = require("./src/routes/analyticsRoutes")
const recommendationRoutes = require("./src/routes/recommendationRoutes")
const synchroniseRoutes = require("./src/routes/synchroniseRoutes")
const authRoutes = require("./src/routes/authRoutes")

const { connectToDatabase } = require("./src/config/mongo")

const app = express();
const PORT = process.env.PORT || 3000;

require('./src/config/database');

connectToDatabase()
    .then(client => {
        console.log('Połączono z MongoDB pomyślnie');
        global.mongoClient = client;
    })
    .catch(err => {
        console.error('Błąd podczas łączenia z MongoDB:', err);
        process.exit(1);
    });


app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/cart", cartRoutes)
app.use("/api/analytics", analyticsRoutes)
app.use("/api/recommendation", recommendationRoutes)
app.use("/api/products", synchroniseRoutes)
app.use("/api/auth", authRoutes)

app.listen(PORT, () => {
    console.log(`🚀 Serwer działa na http://localhost:${PORT}`);
});
