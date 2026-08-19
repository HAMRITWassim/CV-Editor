const { OpenAI } = require("openai");
const deepl = require('deepl-node');


// INITIALISATIONS
const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
})

const translator = new deepl.Translator(process.env.DEEPL_API_KEY);



// OPENAI API (REFORMULATION)
const textRephrase = async (req,res) => {
    try {
        const { text } = req.body;

        if(!text) {
            return res.status(400).json({error: "Aucun texte fourni."});
        }

        const completion = await openai.chat.completions.create({
            model: "openai/gpt-oss-20b",
            messages: [
                {
                    role: "system",
                    content: `Tu es un expert en rédaction de CV. Ton rôle est de reformuler le texte fourni pour le rendre ultra-professionnel et percutant.

                    RÈGLES ABSOLUES (Sous peine d'échec) :
                    1. INFINITIF OBLIGATOIRE : Chaque phrase ou puce DOIT commencer par un verbe à l'infinitif (ex: Créer, Traduire, Développer, Concevoir).
                    2. ZÉRO PRONOM PERSONNEL : Interdiction absolue d'utiliser "Je", "J'", "mon", "mes" ou "ma".
                    3. CONSERVATION HTML : Le texte d'entrée contient des balises HTML (ex: <ul>, <li>, <p>). Tu DOIS renvoyer une structure HTML identique. Interdiction d'utiliser du Markdown (pas de * ou de **).
                    4. AUCUN BAVARDAGE : Renvoie UNIQUEMENT le texte reformulé. Aucune phrase d'introduction.

                    EXEMPLE D'ENTRÉE :
                    <ul><li>J'ai fait souvent de la traduction de Figma UI vers le code en utilisant React</li><li>J'ai aussi créé un site web personnel en utilisant uniquement React et Tailwind</li></ul>

                    EXEMPLE DE SORTIE ATTENDUE :
                    <ul><li>Traduire des maquettes Figma UI en code React pour des interfaces interactives.</li><li>Développer un site web personnel de A à Z avec React et Tailwind CSS.</li></ul>`
                },

                {
                    role: "user",
                    content: text
                }

            ],
            temperature: 0.3,
        });

        // Renvoie la réponse de l'IA au FRONT
        const RephrasedText = completion.choices[0].message.content;
        res.json({result: RephrasedText});

    }
    catch (error) {
        console.error("Erreur API IA :", error);
        res.status(500).json({error: "Erreur lors de la reformulation."});
    }
}

// DEEPL API (TRADUCTION)
const translateText = async (req, res) => {
    try {
        // le FRONT envoie le texte et la langue de traduction cible
        const {text, targetLang} = req.body;

        if (!text || !targetLang){
            return res.status(400).json({message: "Le texte et la langue cible sont requis !"});
        }

        // Appel à l'API DEEPL (null --> détection automatique de la langue d'origine)
        const result = await translator.translateText(text, null, targetLang);

        res.status(200).json({translatedText: result.text});

    }
    catch (error) {
        console.error("Erreur DeepL: ", error);
        res.status(500).json({message: "Erreur lors de la traduction."});
    }
};

// LANGUAGETOOL API (VÉRIFICATION ORTHOGRAPHIQUE)
const checkSpelling = async (req, res) => {
    try {
        const { text, lang } = req.body;

        if(!text){
            return res.status(400).json({message: "Le texte est requis pour vérifier l'orthographe."});
        }

        // LanguageTool prend un format Formulaire (URLSearchParams), pas du JSON
        const params = new URLSearchParams();
        params.append("text", text);
        params.append("language", lang === "EN" ? "en-GB" : "fr")

        // Appel à l'API LanguageTool
        const response = await fetch('https://api.languagetool.org/v2/check', {
            method: "POST",
            body: params
        });

        const data = await response.json();

        // matches --> fautes trouvées
        res.status(200).json({errors: data.matches})
    }
    catch (error) {
        console.error("Erreur LanguageTool : ", error);
        res.status(500).json({message: "Erreur lors de la vérification orthographique."});
    }
};


module.exports = { textRephrase, translateText, checkSpelling };