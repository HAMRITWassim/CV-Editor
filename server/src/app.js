const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import de la fct de connexion
const connectDB = require('./db.js');

const app = express();
const PORT = process.env.PORT || 5000;

// Connexion à la BDD
connectDB();

// Middlewares
app.use(cors());            // Autorise le front à parler au back
app.use(express.json());    // Permet de lire le JSON dans les requêtes

const cvRoutes = require("./routes/cv.routes.js");
const pdfRoutes = require("./routes/pdf.routes.js");
const aiRoutes = require("./routes/ai.routes.js");
// Route de test
app.get('/api/test', (req, res) => {
    res.json({ message: "BACKEND FONCTIONNEL !" });
});

// Toutes les requêtes commençant par "/api/cv" seront gérées par cv.routes.js
app.use("/api/cv", cvRoutes);

// Toutes les requêtes commençant par "/api/pdf" seront gérées par pdf.routes.js
app.use("/api/pdf", pdfRoutes);

// Toutes les requêtes commençant par "/api/ai" seront gérées par ai.routes.js
app.use("/api/ai", aiRoutes);

// Lancement du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});