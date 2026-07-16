import cvLogo from '../assets/cv_icon.png'


export default function Header({cvData, setCvData}){

    // Gère la sauvegarde du CV
    const handleSaveCV = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/cv/save", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(cvData)
            });

            const data = await response.json();

            if(response.ok){
                alert("✅ CV sauvegardé avec succès !");
            }
            
            else{   // Il manque les champs "required" du modèles Mongoose
                alert(`❌ Erreur: ${data.error}`);
            }
        }
        
        catch (error) {
            console.error("Erreur réseau: ", error);
            alert("Impossible de joindre le serveur.");
        }
    };

    // Gère l'export du PDF
    const handleExportPDF = async () => {
        try {
            const cvElement = document.getElementById('cv-to-print');
            
            if(!cvElement){
                alert("Erreur: Impossible de trouver le CV ! (aucun ID 'cv-to-print')")
                return;
            }

            // Extrait le contenu HTML à l'intérieur de 'cv-to-print'
            const htmlToPrint = cvElement.innerHTML;

            // Envoi au BACKEND
            const response = await fetch("http://localhost:5000/api/pdf/generate", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    html: htmlToPrint,
                    title: cvData.title
                }),
            });

            if (!response.ok) throw new Error("Erreur réseau");

            // Transforme la réponse en fichier (Blob)
            const blob = await response.blob();

            
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${cvData.title || 'Mon_CV'}.pdf`);
            document.body.appendChild(link);
            link.click();   //déclenche le téléchargement

            link.parentNode.removeChild(link);
        } 
        catch (error) {
            console.error("Erreur lors de l'export:", error);
            alert("Impossible de générer le PDF.");
        }
    }


    return (

        <header className='w-screen h-18 bg-[#fccc69] relative z-20 flex justify-between items-center shrink-0'>

            <div className='flex-1 flex justify-start pl-6'>
                <img src={cvLogo} alt="cvLogo" className='h-14' />
            </div>

            <h1 className='flex-1 flex justify-center font-bold text-[#311603]'>
                <input 
                type="text"
                value={cvData.title}
                onChange={(e) => setCvData({...cvData, title: e.target.value})}
                placeholder='Donnez un nom à votre CV'
                className='font-bold text-lg text-[#311603] text-center bg-transparent outline-none w-full  hover:bg-[#61310e]/10 focus:bg-[#61310e]/10 rounded-md px-2 py-1 transition-colors' />
            
            </h1>

            <div className=' flex-1 flex justify-end pr-6 gap-3'>

                {/* BOUTON SAUVEGARDER */}
                <button
                    className='bg-transparent border-2 border-[#61310e] px-4 py-2 rounded-full font-bold text-[#61310e] hover:bg-[#61310e]/10 transition-colors cursor-pointer'
                    onClick={handleSaveCV}
                >
                    Sauvegarder
                </button>
                

                {/* BOUTON EXPORT PDF */}
                <button
                className='bg-[#61310e] px-4 py-2 rounded-full font-bold text-[#fccc69] hover:cursor-pointer hover:bg-[#452006] transition-colors'
                onClick={handleExportPDF}
                >
                    Exporter en PDF
                </button>
            </div>
            

        </header>
        
    )


    
}