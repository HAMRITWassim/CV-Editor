const puppeteer = require("puppeteer");

const generatePDF = async (req, res) => {
    try {
        // Récupère le code HTML et le titre (envoyé par React)
        const { html, title } = req.body;

        // Lancement du navigateur
        const browser = await puppeteer.launch({headless: "new"});
        const page = await browser.newPage();

        // Squelette HTML qui utilise le code envoyé par React
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <script src="https://cdn.tailwindcss.com"></script>
                <style>
                    @media print {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                </style>
            </head>
            <body class="bg-white p-10 font-sans">
                
                ${html} </body>
            </html>
        `;

        // "networkidle0" --> attend le chargement de la page + application de Tailwind
        await page.setContent(htmlContent, {waitUntil: "networkidle0"});

        // Génère le PDF au format A4
        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {top: '0px', right: '0px', bottom: '0px', left: '0px'}
        });

        await browser.close();

        // Renvoie le PDF au FRONT
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${title || "Mon_CV"}.pdf"`
        });

        res.send(pdfBuffer)

    } 
    catch (error) {
        console.error("Erreur lors de la génération du PDF:", error);
        res.status(500).json({error: "Erreur lors de la génération du PDF"});
    }
};

module.exports = {generatePDF};