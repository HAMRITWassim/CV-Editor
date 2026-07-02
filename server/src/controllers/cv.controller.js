const CV = require("../models/CV");

// Fct de création d'un CV (POST)
const createCV = async (req, res) => {
    try{
        // utilisel les données envoyées par le FRONT
        const newCV = new CV(req.body)  

        // sauvegarde dans la BDD
        const savedCV = await newCV.save()

        // Réponse au FRONT (201 -> Créé avec succès, +  CV sauvegardé)
        res.status(201).json(savedCV)
    }

    catch (error){
        // Les données ne respectent pas le modèle (400 -> Bad request)
        res.status(400).json({message: "Erreur lors de la création", error: error.message});
    }
};

// Fct de récupération de tous les CVs (GETs)
const getAllCVs = async (req, res) => {
    try{
        // ramène tout le contenu de la collection
        const cvs = await CV.find();
        
        // Réponse au FRONT (200 -> OK, + liste des CVs)
        res.status(200).json(cvs)
    }

    catch (error){
        res.status(500).json({message: "Erreur serveur", error: error.message});
    }

};

module.exports = {createCV, getAllCVs};