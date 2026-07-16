import { useEffect, useRef, useState } from "react";

// ICONS
import { MdOutlineMailOutline } from "react-icons/md";
import { IoPhonePortraitOutline } from "react-icons/io5";

import { THEMES } from "../constants/themes"

export default function CVPreview({cvData, setCvData}){

    const currentTheme = THEMES[cvData.theme || "marron"]

    const translateLevel = (level) => {
        if (cvData.lang === "FR")
            switch(level) {
                case "nativeLanguage": return "Langue maternelle";
                case "bilingual": return "Bilingue / C1-C2";
                case "intermediate": return "Intermédiaire / B1-B2";
                case "beginner": return "Débutant / A1-A2";
                default: return "";
            }
        else{
            switch(level) {
            case "nativeLanguage": return "Native Language";
            case "bilingual": return "Bilingual / C1-C2";
            case "intermediate": return "Intermediate / B1-B2";
            case "beginner": return "Beginner / A1-A2";
            default: return "";
            }
        }

    }

    // Transforme le format de date : "YYYY-MM" --> "MM/YYYY"
    const toNumericDateFormat = (dateString) => {
        if(!dateString){
            return "";
        }

        // sépare de part et d'autre du "-" dans "YYYY-MM"
        const [year, month] = dateString.split("-");

        return `${month}/${year}`;
    }



    const containerRef = useRef(null);
    const [scale, setScale] = useState(1);

    
    useEffect(() => {

        // Ajuste dynamiquement le zoom pour que la feuille rentre tjrs dans l'écran
        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                // récupère la largeur & hauteur dispo de la zone derrière la feuille
                const { width, height } = entry.contentRect;

                // Taille de la feuille A4
                const a4Width = 794;
                const a4Height = 1123;
                
                // Marge de 40px autour de la feuille
                const padding = 40;

                // On calcule du ratio (largeur et hauteur)
                const scaleX = (width - padding) / a4Width;
                const scaleY = (height - padding) / a4Height;

                // Min -> permet de ne pas couper la feuille
                setScale(Math.min(scaleX, scaleY));
            }
        });

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);




    return(

        // Arrière plan (derrière la feuille) 
        <div ref={containerRef} className="w-full h-full flex justify-center items-center overflow-hidden bg-[#F5EFE6] relative">

            {/* WRAPPER (on lui fait garder la taille d'une feuille A4) */}
            <div
                style={{
                    width: '794px',
                    height: '1123px',
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center', 
                    display: 'flex',
                    flexShrink: 0
                }}
            >
                {/* FEUILLE BLANCHE */}
                <div 
                id="cv-to-print" 
                className="bg-white shadow-2xl p-10 flex flex-col w-full h-full"
                style={{ fontFamily: currentTheme.font }}
                >

                    {/* HEADER */}
                    <header className="flex flex-col items-start gap-1">

                        <h1 className="text-3xl font-bold text-center">
                            <span className="uppercase"> {cvData.personalInfo.lastName || "NOM"} </span>{
                            cvData.personalInfo.firstName || "Prénom"} 
                        </h1>

                        <h2 className="text-xl font-bold text-center" style={{ color: currentTheme.primary }}>
                            {cvData.personalInfo.jobTitle || "Titre du poste"}
                        </h2>

                        <h3 className="text-gray-500 text-sm flex gap-3">

                            <p className="flex items-center"> 
                                <MdOutlineMailOutline className="mr-1"/> {cvData.personalInfo.email || "E-mail"} 
                            </p>

                            <p className="flex items-center"> 
                                <IoPhonePortraitOutline className="mr-1"/> {cvData.personalInfo.phone || "N° de téléphone"} 
                            </p>
                            
                            
                        </h3>
            
                    </header>

                    <hr className="border-t border-[#e3e3e3] my-4" />
                    
                    {/*  CORPS DU CV (2 COLONNES) */}
                    <div className="grid grid-cols-3 grid-rows-1 gap-4">

                            {/* ----------------- COLONNE GAUCHE ----------------- */}
                            <aside className="col-span-1 flex flex-col gap-6">
                                
                                {/* SECTION COMPÉTENCES */}
                                <div>

                                    <h1 className="text-sm font-bold tracking-wider uppercase mb-1" style={{ color: currentTheme.primary }}>
                                        {cvData.lang === "EN" ? "Skills" : "Compétences"}
                                    </h1>

                                    <hr className="border-t border-[#e3e3e3] mb-3" />
                                    
                                    <ul className="flex flex-col gap-2">

                                        {cvData.skills.length > 0 ? (
                                            cvData.skills.map((skill, index) => (

                                                <li key={skill._id || skill.id || index} className="text-sm text-gray-700 font-medium flex items-center overflow-clip">
                                                    
                                                    <span className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: currentTheme.primary }}></span>
                                                    {skill.name}

                                                </li>
                                            ))
                                            
                                        ) : (
                                            <li className="text-sm text-gray-400 italic">Vos compétences</li>
                                        )}
                                        
                                    </ul>
                                </div>

                                {/* SECTION LANGUES */}
                                <div>

                                    <h1 className="text-sm font-bold tracking-wider uppercase mb-1" style={{ color: currentTheme.primary }}>
                                        {cvData.lang === "EN" ? "Languages" : "Langues"}
                                    </h1>

                                    <hr className="border-t border-[#e3e3e3] mb-3" />
                                    
                                    <ul className="flex flex-col gap-3">
                                        
                                        {cvData.languages.length > 0 ? (
                                            cvData.languages.map((language, index) => (

                                                <li key={language._id || language.id || index} className="text-sm overflow-clip">
                                                    <p className="font-bold text-gray-800">{language.name}</p>
                                                    <p className="text-xs text-gray-500 italic">{translateLevel(language.level)}</p>
                                                </li>
                                            ))
                                        ) : (

                                            <li className="text-sm text-gray-400 italic">Vos langues</li>
                                        )}

                                    </ul>
                                </div>
                                
                            </aside>


                            {/* ----------------- COLONNE DROITE ----------------- */}
                            <main className="col-span-2 flex flex-col gap-6">
                                
                                {/* SECTION EXPÉRIENCES */}
                                <div>
                                    <h1 className="text-sm font-bold tracking-wider uppercase mb-1" style={{ color: currentTheme.primary }}>
                                        {cvData.lang === "EN" ? "Work Experience" : "Expériences Pro."}
                                    </h1>
                                    <hr className="border-t border-[#e3e3e3] mb-4" />
                                    
                                    <div className="flex flex-col gap-5">

                                        {cvData.experiences.length > 0 ? (
                                            cvData.experiences.map((experience, index) => (

                                                <div key={experience._id || experience.id || index} className="flex flex-col">
                                                    
                                                    {/* En-tête de l'expérience (Titre, date..)*/}
                                                    <div className="flex justify-between items-baseline mb-1">

                                                        <h3 className="font-bold text-gray-900">{experience.position || "Poste"}</h3>

                                                        <span className="text-xs font-semibold rounded-md px-1 py-0.5 whitespace-nowrap shrink-0" style={{ color: currentTheme.primary, backgroundColor: currentTheme.light }}>
                                                            {toNumericDateFormat(experience.startDate)} {toNumericDateFormat(experience.startDate) && toNumericDateFormat(experience.endDate) && " - "} {toNumericDateFormat(experience.endDate)}
                                                        </span>

                                                    </div>
                                                    
                                                    <h4 className="text-sm font-bold text-gray-400 mb-2">
                                                        {experience.company || "Entreprise"}
                                                    </h4>
                                                    
                                                    {/* Affichage du RichTextEditor */}
                                                    <div 
                                                        className="text-sm text-gray-700 leading-relaxed [&>ul]:list-disc [&>ul]:ml-4"
                                                        dangerouslySetInnerHTML={{ __html: experience.description || "<p style='color:#a8a8a8'>Description des missions...</p>" }}
                                                    />
                                                </div>
                                            ))
                                        
                                        ) : (
                                            <p className="text-sm text-gray-400 italic">Vos expériences</p>
                                        )}
                                    </div>

                                </div>

                                {/* SECTION FORMATIONS */}
                                <div>

                                    <h1 className="text-sm font-bold tracking-wider uppercase mb-1" style={{ color: currentTheme.primary }}>
                                        {cvData.lang === "EN" ? "Education" : "Formations"}
                                    </h1>

                                    <hr className="border-t border-[#e3e3e3] mb-4" />
                                    
                                    <div className="flex flex-col gap-4">

                                        {cvData.education.length > 0 ? (
                                            cvData.education.map((formation, index) => (

                                                <div key={formation._id || formation.id || index} className="flex flex-col">

                                                    <div className="flex justify-between items-baseline mb-1">

                                                        <h3 className="font-bold text-gray-900">{formation.degree || "Diplôme"}</h3>

                                                        <span className="text-xs font-semibold rounded-md px-1 py-0.5 whitespace-nowrap shrink-0" style={{ color: currentTheme.primary, backgroundColor: currentTheme.light }}>
                                                            {toNumericDateFormat(formation.startDate)} {toNumericDateFormat(formation.startDate) && toNumericDateFormat(formation.endDate) && " - "} {toNumericDateFormat(formation.endDate)}
                                                        </span>

                                                    </div>
                                                    
                                                    <h4 className="text-sm text-gray-600">
                                                        {formation.school || <p className="text-[#a8a8a8]">École / Établissement</p>}
                                                    </h4>

                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-400 italic">Vos formations</p>
                                        )}
                                        
                                    </div>

                                </div>

                            </main>
                    </div>     


                </div>                            
                




            </div>

        </div>
    )

}