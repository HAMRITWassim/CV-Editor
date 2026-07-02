const mongoose = require("mongoose");

const connectDB = async () => {

    // Tentative de connexion
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("BASE DE DONNÉES MONGODB CONNECTÉE AVEC SUCCÈS !");
    }

    // Connexion Echoue
    catch (error) {
        console.error("ERREUR DE CONNEXION À MONGODB :", error.message)
        process.exit(1); // arrête le serveur
    }
};

module.exports = connectDB;