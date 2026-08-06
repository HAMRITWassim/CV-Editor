const mongoose = require("mongoose")

// Création du schéma (moule) du CV
const cvSchema = new mongoose.Schema({

    // Titre
    title: {
        type: String,
        required: true,
        default: "Mon CV"
    },

    // Langue du CV
    lang: {
        type: String,
        default: "FR"
    },

    // Thème couleur du CV
    theme: {
        type: String,
        default: "marron"
    },

    // Template du CV utilisée
    template: { type: String, default: "classic" },

    // Police d'écriture
    font: { type: String, default: "sans" },

    // Alignement du Header
    headerAlignment: { type: String, default: "left" },

    // Structure des blocs du CV
    layout: {
        type: Array,

        // Par défaut: Petite Colonne (Gauche) + Grande Colonne (Droite)
        default: [
            { id: "col-small", size: 1, items: ["skills", "languages"] },
            { id: "col-large", size: 2, items: ["experiences", "education"] }
        ]
    },

    // Informations personnelles (sous-obj)
    personalInfo: {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        email: {type: String, required: true},
        phone: {type: String, default: ""},
        jobTitle: {type: String, default: ""}
    },

    // Expériences (tableau de sous-obj)
    experiences: [{
        id: String,
        position: String,
        company: String,
        startDate: String,
        endDate: String,
        description: String
    }],

    // Formations
    education: [{
        id: String,
        degree: String,
        school: String,
        startDate: String,
        endDate: String
    }],

    // Compétences (liste de mots)
    skills: [{
        id: String,
        name: String
    }],

    // Langues
    languages: [{
        name: String,
        level: String
    }]
}, {timestamps: true /* ajoute automatiquement les dates de création/modif */ });

module.exports = mongoose.model("CV", cvSchema);