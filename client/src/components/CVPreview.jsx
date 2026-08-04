import { useEffect, useRef, useState } from "react";

// ICONS
import { IoPhonePortraitOutline, IoSaveOutline  } from "react-icons/io5";
import { MdOutlineMailOutline, MdFormatAlignLeft, MdFormatAlignCenter, MdFormatAlignRight } from "react-icons/md"

import { THEMES, DEFAULT_LAYOUT, FONTS } from "../constants/themes"

import toast from "react-hot-toast";


export default function CVPreview({cvData, setCvData, previewColor}){

    
    const activeTheme = previewColor || cvData.theme || "marron";


    const currentTheme = THEMES[activeTheme] || THEMES.marron;

    // Police par défaut : "Sans"
    const currentFontValue = FONTS[cvData.font]?.value || FONTS.sans.value;

    const isCustomColor = activeTheme?.startsWith("#");

    // Couleur principale
    const mainColor = isCustomColor ? activeTheme : currentTheme.primary;

    // Couleur secondaire
    // Pour les couleurs custom, applique "26" à la fin du code HEXA (équivaut à une opacité de 15%)
    const lightColor = isCustomColor ? `${activeTheme}26` : currentTheme.light;



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
                const a4Width = 890;
                const a4Height = 1219;
                
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


        // --------------------------------------------------------- FCTS DE DRAG & DROP
    
        // Dèbut du DRAG d'un objet
        const handleDragStart = (e, type, colIndex, itemIndex) => {
            // Type & Numéro de colonne de l'objet que l'on DRAG
            e.dataTransfer.setData("type", type);
            e.dataTransfer.setData("colIndex", colIndex);
    
            // Position de l'objet
            if (itemIndex !== undefined){
                e.dataTransfer.setData("itemIndex", itemIndex);
            }
        };
    
        // On DROP un objet sur un colonne
        const handleDropOnColumn = (e, targetColIndex) => {
            e.preventDefault();
            const type = e.dataTransfer.getData("type");
            const sourceColIndex = parseInt(e.dataTransfer.getData("colIndex"));
    
            // Copie du layout acutel
            const currentLayout = cvData.layout || DEFAULT_LAYOUT;
            const newLayout = JSON.parse(JSON.stringify(currentLayout));
    
            // Inverse les positons si c'est une COLONNE
            if (type === "column"){
    
                if(sourceColIndex === targetColIndex){
                    return;
                }
    
                [newLayout[sourceColIndex], newLayout[targetColIndex]] = [newLayout[targetColIndex], newLayout[sourceColIndex]];
            }
    
            // Change l'item de colonne si c'est un ITEM
            else if (type === "item"){
                const sourceItemIndex = parseInt(e.dataTransfer.getData("itemIndex"));
                const [draggedItem] = newLayout[sourceColIndex].items.splice(sourceItemIndex, 1);
                newLayout[targetColIndex].items.push(draggedItem);
            }
    
            // Sauvegarde le nouveau layout
            setCvData({ ...cvData, layout: newLayout });
        };
    
        // On DROP un objet sur un autre objet
        const handleDropOnItem = (e, targetColIndex, targetItemIndex) => {
            e.preventDefault();
            e.stopPropagation(); // Empêche de déclencher 'handleDropOnColumn'
            const type = e.dataTransfer.getData("type");
    
            if (type === "item"){
                const sourceColIndex = parseInt(e.dataTransfer.getData("colIndex"));
                const sourceItemIndex = parseInt(e.dataTransfer.getData("itemIndex"));
    
                // Copie du layout acutel
                const currentLayout = cvData.layout || DEFAULT_LAYOUT;
                const newLayout = JSON.parse(JSON.stringify(currentLayout));
    
                // Insère l'élément à l'index où on l'a DROP
                const [draggedItem] = newLayout[sourceColIndex].items.splice(sourceItemIndex, 1);
                newLayout[targetColIndex].items.splice(targetItemIndex, 0, draggedItem);
    
                // Sauvegarde le nouveau layout
                setCvData({ ...cvData, layout: newLayout });
            }
    
    
        };

        // Savoir si on est en mode MISE EN PAGE
        const [isLayoutMode, setIsLayoutMode] = useState(false);

        // Pt de sauvegarde du layout
        const [layoutSnapshot, setLayoutSnapshot] = useState(null);

        // Entre en mode Layout
        const handleEnterLayoutMode = () => {
            setLayoutSnapshot(JSON.parse(JSON.stringify(cvData.layout || DEFAULT_LAYOUT))); // Copie du Layout actuel
            setIsLayoutMode(true);
        }

        // Valide les changements du mode Layout
        const handleValidateLayout = () => {
            setIsLayoutMode(false);
            setLayoutSnapshot(null); // Vide la sauvegarde 

            toast.success("Mise en page sauvegardée !", {icon: <IoSaveOutline />})
        }

        // Annule les changements du mode Layout
        const handleCancelLayout = () => {
            if(layoutSnapshot) {
                setCvData({ ...cvData, layout: layoutSnapshot }); // On repasse sur le layout avant les changements
            }

            setIsLayoutMode(false);
            setLayoutSnapshot(null);

            toast("Modifications annulées", {icon: "↩️"})
        }

        // Fct pour changer l'alignement du texte dans 1 colonne
        const handleAlignColumn = (colIndex, align) => {
            const currentLayout = cvData.layout || DEFAULT_LAYOUT;
            const newLayout = JSON.parse(JSON.stringify(currentLayout));

            // Sauvegarde de l'alignement dans colonne
            newLayout[colIndex].alignment = align;
            setCvData({ ...cvData, layout: newLayout });
            
        };

        // Fct pour changer l'alignement du Header
        const handleAlignHeader = (align) => {
            setCvData({ ...cvData, headerAlignment: align });
        };

        // Classes CSS dynamiques pour le Header
        const headerAlign = cvData.headerAlignment || "left";
        const headerFlexClass = headerAlign === "center" ? "items-center" : headerAlign === "right" ? "items-end" : "items-start";
        const headerTextClass = headerAlign === "center" ? "text-center" : headerAlign === "right" ? "text-right" : "text-left";
        const headerJustifyClass = headerAlign === "center" ? "justify-center" : headerAlign === "right" ? "justify-end" : "justify-start";

        const layoutToRender = cvData.layout || DEFAULT_LAYOUT;

        // Créé le rendu visuel d'une section du CV selon son nom (Ajoute un style visuel si l'on est en mode édition)
        const renderBlock = (blockName, colIndex, itemIndex) => {

            // Lit l'alignement de la colonne
            const colAlign = layoutToRender[colIndex].alignment || "left";

            // Créé la classe flex selon l'alignement de la colonne
            const justifyClass = colAlign === "center" ? "justify-center" : colAlign === "right" ? "justify-end" : "justify-start";

            const headerFlexClass = colAlign === "center" ? "flex flex-col items-center gap-1"  // Centre  
                : colAlign === "right" ? "flex flex-row-reverse justify-between items-baseline" // Droite
                : "flex flex-row justify-between items-baseline";   // Gauche

            let blockContent = null;

            switch(blockName){
                
                case "skills":
                    blockContent = (
                    <>
                        <h1 className="text-sm font-bold tracking-wider uppercase mb-1" style={{ color: mainColor }}>{cvData.lang === "EN" ? "Skills" : "Compétences"}</h1>
                        <hr className="border-t border-[#e3e3e3] mb-3" />
                        <ul className="flex flex-col gap-2">

                            {cvData.skills.length > 0 ? (
                                cvData.skills.map((skill, index) => (

                                    <li key={skill._id || skill.id || index} className={`text-sm text-gray-700 font-medium flex items-center overflow-clip ${justifyClass}`}>
                                        
                                        <span className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: mainColor }}></span>
                                        {skill.name}

                                    </li>
                                ))
                                
                            ) : (
                                <li className="text-sm text-gray-400 italic">Vos compétences</li>
                            )}
                            
                        </ul>
                    </>
                    );
                    break;

                case "languages":
                    blockContent = (
                    <>
                        <h1 className="text-sm font-bold tracking-wider uppercase mb-1" style={{ color: mainColor }}>
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
                    </>
                    );
                    break;

                case "experiences":
                    blockContent = (
                    <>

                        <h1 className="text-sm font-bold tracking-wider uppercase mb-1" style={{ color: mainColor }}>
                            {cvData.lang === "EN" ? "Work Experience" : "Expériences Pro."}
                        </h1>
                        <hr className="border-t border-[#e3e3e3] mb-4" />
                        
                        <div className="flex flex-col gap-5">

                            {cvData.experiences.length > 0 ? (
                                cvData.experiences.map((experience, index) => (

                                    <div key={experience._id || experience.id || index} className="flex flex-col">
                                        
                                        {/* En-tête de l'expérience (Titre, date..)*/}
                                        <div className={`${headerFlexClass} mb-1 w-full`}>

                                            <h3 className="font-bold text-gray-900">{experience.position || "Poste"}</h3>

                                            <span className="text-xs font-semibold rounded-md px-1 py-0.5 whitespace-nowrap shrink-0" style={{ color: mainColor, backgroundColor: lightColor }}>
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

                    </>
                    );
                    break;

                case "education":
                    blockContent = (
                    <>

                        <h1 className="text-sm font-bold tracking-wider uppercase mb-1" style={{ color: mainColor }}>
                            {cvData.lang === "EN" ? "Education" : "Formations"}
                        </h1>

                        <hr className="border-t border-[#e3e3e3] mb-4" />
                        
                        <div className="flex flex-col gap-4">

                            {cvData.education.length > 0 ? (
                                cvData.education.map((formation, index) => (

                                    <div key={formation._id || formation.id || index} className="flex flex-col">

                                        <div className={`${headerFlexClass} mb-1 w-full`}>

                                            <h3 className="font-bold text-gray-900">{formation.degree || "Diplôme"}</h3>

                                            <span className="text-xs font-semibold rounded-md px-1 py-0.5 whitespace-nowrap shrink-0" style={{ color: mainColor, backgroundColor: lightColor }}>
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

                    </>
                    );
                    break;

            }

            return(

                <div
                key={blockName}
                className={`transition-all duration-200 ${isLayoutMode ? "border-2 border-dashed border-[#fccc69] bg-orange-50/50 p-3 rounded cursor-grab active:cursor-grabbing hover:bg-orange-100/50" : ""}`}
                draggable={isLayoutMode} // DRAG dispo que dans le mode édition
                onDragStart={(e) => {
                    if(!isLayoutMode) return; // Ne fait rien si pas en mode édition
                    e.stopPropagation();    // Évite de déplacer toute la colonne si on déplace un petit bloc
                    handleDragStart(e, "item", colIndex, itemIndex);
                }}

                onDragOver={(e) => {
                    if(!isLayoutMode) return;
                    e.preventDefault(); // Autorise le DROP d'autre blocs par dessus
                    e.stopPropagation();
                }}

                onDrop={(e) => {
                    if(!isLayoutMode) return;
                    handleDropOnItem(e, colIndex, itemIndex);
                }}
                >

                    {blockContent}

                </div>

            );
        }


    return(

        // Arrière plan (derrière la feuille) 
        <div ref={containerRef} className="w-full h-full flex justify-center items-center overflow-hidden bg-[#F5EFE6] relative">

            {/* WRAPPER (on lui fait garder la taille d'une feuille A4) */}
            <div
                className="group relative p-12 transition-all duration-300"
                style={{
                    width: '890px',
                    height: '1219px',
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center', 
                    display: 'flex',
                    flexShrink: 0
                }}
            >
                
                {/* BOUTONS FLOTTANTS */}
                <div className={`absolute -top-4 right-10 z-50 flex gap-3 transition-all duration-300 ${!isLayoutMode ? "opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0" : "scale-105 -translate-y-2"}`}>
                    
                    {!isLayoutMode ? (

                        // BOUTON "MODIFIER" (Mode normal)
                        <button 
                            onClick={handleEnterLayoutMode}
                            className="px-6 py-2 rounded-full font-bold text-lg shadow-lg transition-all cursor-pointer bg-transparent backdrop-blur-sm border-3 border-[#4a2307]/70 text-[#4a2307]/80 hover:bg-[#4a2307]/10"
                        >
                            Modifier la mise en page
                        </button>

                    ) : (

                        // BOUTONS "Annuler" & "Valider" (Mode Layout)
                        <>
                            <button 
                                onClick={handleCancelLayout}
                                className="px-6 py-2 rounded-full font-bold text-lg shadow-lg transition-all cursor-pointer bg-gray-500 text-white hover:bg-gray-600"
                            >
                                Annuler
                            </button>

                            <button 
                                onClick={handleValidateLayout}
                                className="px-6 py-2 rounded-full font-bold text-lg shadow-lg transition-all cursor-pointer bg-green-500 text-white hover:bg-green-600 "
                            >
                                Valider
                            </button>
                        </>
                    )}

                </div>




                {/* FEUILLE BLANCHE */}
                <div 
                id="cv-to-print" 
                className={`bg-white shadow-2xl p-10 flex flex-col w-full h-full transition-all duration-300 ${isLayoutMode ? "ring-4 ring-[#fccc69] ring-offset-4" : ""}`}
                style={{ fontFamily: currentFontValue }}
                >

                    {/* HEADER */}
                    <header className={`group/header relative flex flex-col gap-1 transition-all duration-300 ${headerFlexClass} ${headerTextClass}
                    ${isLayoutMode ? "border-4 border-dashed border-gray-200 pt-12 px-4 pb-4 rounded bg-gray-50/50" : ""}
                    `}>

                        {isLayoutMode && (
                            <div 
                                className="opacity-0 group-hover/header:opacity-100 transition-opacity duration-200 absolute top-2 left-1/2 -translate-x-1/2 flex gap-1 z-10 bg-white p-1 rounded-md shadow-md border border-gray-200 cursor-default" 
                                onDragStart={(e) => { e.preventDefault(); e.stopPropagation(); }} 
                                onPointerDown={(e) => e.stopPropagation()} 
                            >
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleAlignHeader("left"); }}
                                    className={`p-1.5 rounded transition-colors ${headerAlign === "left" ? "bg-[#fccc69] text-[#311603]" : "text-gray-400 hover:bg-gray-100"}`}
                                    title="Aligner à gauche"
                                >
                                    <MdFormatAlignLeft />
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleAlignHeader("center"); }}
                                    className={`p-1.5 rounded transition-colors ${headerAlign === "center" ? "bg-[#fccc69] text-[#311603]" : "text-gray-400 hover:bg-gray-100"}`}
                                    title="Centrer"
                                >
                                    <MdFormatAlignCenter />
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleAlignHeader("right"); }}
                                    className={`p-1.5 rounded transition-colors ${headerAlign === "right" ? "bg-[#fccc69] text-[#311603]" : "text-gray-400 hover:bg-gray-100"}`}
                                    title="Aligner à droite"
                                >
                                    <MdFormatAlignRight />
                                </button>
                            </div>
                        )}

                        <h1 className="text-3xl font-bold text-center">
                            <span className="uppercase"> {cvData.personalInfo.lastName || "NOM"} </span>{
                            cvData.personalInfo.firstName || "Prénom"} 
                        </h1>

                        <h2 className="text-xl font-bold text-center" style={{ color: mainColor }}>
                            {cvData.personalInfo.jobTitle || "Titre du poste"}
                        </h2>

                        <h3 className="text-gray-500 text-sm flex gap-3">

                            <p className={`flex items-center w-full ${headerJustifyClass}`}> 
                                <MdOutlineMailOutline className="mr-1"/> {cvData.personalInfo.email || "E-mail"} 
                            </p>

                            <p className="flex items-center"> 
                                <IoPhonePortraitOutline className="mr-1"/> {cvData.personalInfo.phone || "N° de téléphone"} 
                            </p>
                            
                            
                        </h3>
            
                    </header>

                    <hr className="border-t border-[#e3e3e3] my-4" />
                    
                    {/*  CORPS DU CV (2 COLONNES) */}
                    <div className="flex w-full gap-4 min-h-[500px]">
                            
                        {/* Boucle sur les colonnes */}
                        {layoutToRender.map((col, colIndex) => (

                            <div
                            key={col.id || colIndex}
                            className={`group/col relative flex flex-col gap-6 transition-all duration-300 
                                        ${col.size === 1 ? 'w-1/3' : 'w-2/3'}
                                        ${isLayoutMode ? "border-4 border-dashed border-gray-200 p-2 rounded bg-gray-50/50 cursor-grab active:cursor-grabbing" : ""}
                                        ${col.alignment === "center" ? "text-center" : col.alignment === "right" ? "text-right" : "text-left"}
                            `}

                            // DRAG & DROP (Colonnes)
                            draggable={isLayoutMode}
                            onDragStart={(e) => {
                                if(!isLayoutMode) return;
                                handleDragStart(e, "column", colIndex);
                            }}

                            onDragOver={(e) => {
                                if(!isLayoutMode) return;
                                e.preventDefault(); // Autorise le survol d'une Colonne sur une autre
                            }}

                            onDrop={(e) => {
                                if(!isLayoutMode) return;
                                handleDropOnColumn(e, colIndex);
                            }}
                            
                            >

                                {/* BARRE D'OUTILS D'ALIGNEMENT (Mode Layout) */}
                                {isLayoutMode && (
                                    <div 
                                        
                                        className="opacity-0 group-hover/col:opacity-100 transition-opacity duration-200 absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10 bg-white p-1 rounded-md shadow-md border border-gray-200 cursor-default" 
                                        draggable
                                        onDragStart={(e) => { e.preventDefault(); e.stopPropagation(); }} // Évite de déplacer toute la colonne lors du clic
                                        onPointerDown={(e) => e.stopPropagation()} 
                                    >
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleAlignColumn(colIndex, "left"); }}
                                            className={`p-1.5 rounded transition-colors ${col.alignment === "left" || !col.alignment ? "bg-[#fccc69] text-[#311603]" : "text-gray-400 hover:bg-gray-100"}`}
                                            title="Aligner à gauche"
                                        >
                                            <MdFormatAlignLeft />
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleAlignColumn(colIndex, "center"); }}
                                            className={`p-1.5 rounded transition-colors ${col.alignment === "center" ? "bg-[#fccc69] text-[#311603]" : "text-gray-400 hover:bg-gray-100"}`}
                                            title="Centrer"
                                        >
                                            <MdFormatAlignCenter />
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleAlignColumn(colIndex, "right"); }}
                                            className={`p-1.5 rounded transition-colors ${col.alignment === "right" ? "bg-[#fccc69] text-[#311603]" : "text-gray-400 hover:bg-gray-100"}`}
                                            title="Aligner à droite"
                                        >
                                            <MdFormatAlignRight />
                                        </button>
                                    </div>
                                )}


                                {/* Dessine tous les items (skills, languages...) */}
                                {col.items.map((item, itemIndex) => renderBlock(item, colIndex, itemIndex))}

                                {isLayoutMode && col.items.length === 0 && (
                                    <div className="flex-1 flex items-center justify-center text-gray-400 italic text-sm border-2 border-dashed border-gray-300 rounded m-2">
                                        Colonne vide
                                    </div>
                                )}


                            </div>

                        ))}
                            
                    </div>     


                </div>                            
                




            </div>

        </div>
    )

}