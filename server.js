const express = require("express");
const productRoutes = require("./src/routes/productRoutes");
const userRoutes = require("./src/routes/userRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const reviewRoutes = require("./src/routes/reviewRoutes");
const cartRoutes = require("./src/routes/cartRoutes")

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

app.listen(PORT, () => {
    console.log(`🚀 Serwer działa na http://localhost:${PORT}`);
});
