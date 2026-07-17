// Dictionnaire des thèmes couleur
export const THEMES = {
    marron: { name: "Marron", primary: "#7f3b0a", light: "#f5e3d6", font: "ui-sans-serif, system-ui, sans-serif" },
    bleu: { name: "Bleu Océan", primary: "#1e3a8a", light: "#dbeafe", font: "Georgia, serif" },
    vert: { name: "Vert Émeraude", primary: "#064e3b", light: "#d1fae5", font: "ui-sans-serif, system-ui, sans-serif" },
    noir: { name: "Noir Classique", primary: "#171717", light: "#f3f4f6", font: "'Times New Roman', Times, serif" }
};

export const DEFAULT_LAYOUT = [
    { id: "col-small", size: 1, items: ["skills", "languages"] },
    { id: "col-large", size: 2, items: ["experiences", "education"] }
]