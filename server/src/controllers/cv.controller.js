const CV = require("../models/CV");

// Sauvegarde le CV
const saveCV = async(req, res) => {
    try {
        const savedCV = await CV.findOneAndUpdate(
            {},
            req.body,
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );

        res.status(200).json({message: "CV sauvegardé avec succès", cv: savedCV});
    }

    catch (error) {
        console.error("Erreur lors de la sauvegarde:", error);
        
        if(error.name === "ValidationError"){
            return res.status(400).json({error: "Veuillez remplir votre Nom, Prénom, Email et donner un nom au CV avant de sauvegarder."});
        }

        res.status(500).json({error: "Erreur serveur lors de la sauvegarde."});
    }

};


// Récupère le CV au chargement
const getCV = async (req, res) => {
    try {
        const cv = await CV.findOne();

        if (!cv){
            return res.status(404).json({message: "Aucun CV trouvé."});
        }

        // Transforme le document Mongoose en objet JavaScript classique
        const cvToSend = cv.toObject();

        // Nettoie les variables internes de MongoDB
        delete cvToSend._id;
        delete cvToSend.__v;
        delete cvToSend.createdAt;
        delete cvToSend.updatedAt;

        res.status(200).json(cvToSend); // Renvoie le CV
    }
    
    catch (error) {
        console.error("Erreur lors de la récupération du CV: ", error);
        res.status(500).json({error: "Erreur lors de la récupération du CV."});
    }
};

module.exports = { saveCV, getCV };