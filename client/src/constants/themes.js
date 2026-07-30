// Dictionnaire des thèmes couleur
export const THEMES = {
    marron: { name: "Marron", primary: "#7f3b0a", light: "#f5e3d6" },
    bleu: { name: "Bleu Océan", primary: "#1e3a8a", light: "#dbeafe" },
    vert: { name: "Vert Émeraude", primary: "#064e3b", light: "#d1fae5" },
    noir: { name: "Noir Classique", primary: "#171717", light: "#f3f4f6" }
};

export const FONTS = {
    sans: { name: "Moderne", value: "ui-sans-serif, system-ui, sans-serif" },
    serif: { name: "Classique", value: "Georgia, serif" },
    mono: { name: "Technique", value: "ui-monospace, monospace" }
};

export const DEFAULT_LAYOUT = [
    { id: "col-small", size: 1, items: ["skills", "languages"] },
    { id: "col-large", size: 2, items: ["experiences", "education"] }
]