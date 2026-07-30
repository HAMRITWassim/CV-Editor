import { useState } from 'react';

// ICONES 
import { IoLanguageSharp, IoArrowUp, IoArrowDown } from "react-icons/io5";
import { LuSpellCheck } from "react-icons/lu";
import { SyncLoader } from "react-spinners";


// COMPONENTS
import Accordion from './Accordion';
import RichTextEditor from "./RichTextEditor";

// CONSTANTS
import { THEMES, FONTS } from "../constants/themes";

// LIBRAIRIES EXT.
import toast from "react-hot-toast";
import { HexColorPicker } from "react-colorful";



export default function Sidebar({
    cvData, 
    setCvData, 
    spellErrors, 
    setSpellErrors, 
    isCheckingSpelling, 
    handleSpellCheck, 
    isPickerOpen,
    setIsPickerOpen,
    tempColor,
    setTempColor
}){

    //STATES
    const [openAccordionsCount, setOpenAccordionsCount] = useState(0);

    const [loadingIndex, setLoadingIndex] = useState(null);

    const [loadingTrad, setLoadingTrad] = useState(false);

    const [customColors, setCustomColors] = useState([]);




    // Fct de validation de la couleur custom
    const handleValidateColor = () => {
        // envoie la couleur finale au CV
        setCvData({...cvData, theme: tempColor});

        // Ajout de la couleur à la palette dans la sidebar
        if(!customColors.includes(tempColor)){
            setCustomColors([...customColors, tempColor]);
            
        }

        // Referme le color picker
        setIsPickerOpen(false);

    }


    // Gère la prévisualisation en temps réel des couleurs custom sur le CV
    const handleColorPreview = (e) => {
        setCvData({...cvData, theme: e.target.value});
    };

    // Sauvegarde la couleur dans la sidebar lors du clic sur le bouton "Valider"
    const handleSaveCustomColor = () => {
        if(!customColors.includes(cvData.theme)){
            setCustomColors([...customColors, cvData.theme]);
        }
    };

    const handleAccordionToggle = (isOpen) => {

    if(isOpen) {
        setOpenAccordionsCount((prev) => prev+1);
    }
    else{
        setOpenAccordionsCount((prev) => prev-1);
    }
    };


    // Fonction de reformulation par IA (appel au BACK)
    const handleRephrase = async (index) => {
        
        // Récupère le HTML de description de l'expérience actuelle
        const currentText = cvData.experiences[index].description;

        // Retire les balises HTML
        const rawText = currentText?.replace(/<[^>]*>/g, '').trim();
        if(!rawText){
            toast.error("Veuillez d'abord remplir le champs de description avant de reformuler !");
            return;
        }

        try {
            setLoadingIndex(index);

            // Promesse que l'on passera ensuite au Toast
            const rephraseRequest = async () => {
                // Appel à l'API BACK
                const response = await fetch("http://localhost:5000/api/ai/reformuler",{
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({text: currentText})
                })

                if(!response.ok) throw new Error("Erreur lors de la communication avec le serveur.");

                const data = await response.json();

                if(data.result){
                    const newExperiences = [...cvData.experiences];

                    // Remplace le texte par le reformulé (à l'index correspondant)
                    newExperiences[index].description = data.result;

                    setCvData({
                        ...cvData,
                        experiences: newExperiences
                    });
                }
                else{
                    throw new Error("L'IA n'a rien renvoyé.")
                }
            };
            
            // On passe la promesse au toast
            await toast.promise(
                rephraseRequest(),  // action à surveiller
                {
                    loading: "L'IA reformule votre texte...",
                    success: "Texte reformulé !",
                    error: "Impossible de reformuler le texte."
                }
            );
                
        }
        catch (error) {
            console.error("Erreur de reformulation :", error);
        }
        finally{
            // Reset l'indice
            setLoadingIndex(null)
        }

    }

    // Fonction de traduction de tout le CV par l'API DeepL (appel au BACK), Alterne entre la Trad (FR>EN) et (EN>FR)
    const handleTranslateFullCV = async () => {
        try{
            setLoadingTrad(true);

            // On vérifie si on est en Français ou non pour déterminer le language cible 
            const isCurrentlyFrench = cvData.lang === "FR";

            const targetLanguage = isCurrentlyFrench ? "EN-GB" : "FR";

            // Fonction de traduction pour un String donné
            const translateString = async (textToTranslate) => {
                if (!textToTranslate){
                    return "";
                }
                
                const response = await fetch("http://localhost:5000/api/ai/traduire", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        text: textToTranslate,
                        targetLang: targetLanguage
                    }),

                });
                const data = await response.json();
                return data.translatedText;
            };

            // Copie du CV
            const newCV = JSON.parse(JSON.stringify(cvData));

            // TRADUCTION DES CHAMPS (champs exclus: Nom, Prénom, Email, Tel, Nom de l'école et de l'entreprise)
            newCV.title = await translateString(newCV.title);
            newCV.personalInfo.jobTitle = await translateString(newCV.personalInfo.jobTitle);

            // Boucle sur les Expériences
            for (let exp of newCV.experiences){
                exp.position = await translateString(exp.position);
                exp.description = await translateString(exp.description);
            }

            // Boucle sur les Formations
            for (let edu of newCV.education){
                edu.degree = await translateString(edu.degree);
            }

            // Boucle sur les Compétences
            for (let skill of newCV.skills){
                skill.name = await translateString(skill.name);
            }

            // Boucle sur les Langues
            for (let lang of newCV.languages){
                lang.name = await translateString(lang.name);
            }

            newCV.lang = isCurrentlyFrench ? "EN" : "FR";

            setCvData(newCV);

            console.log("Traduction du CV terminée avec succès !");
            toast.success("Traduction du CV terminée avec succès !");


        }
        catch (error){
            console.error("Erreur lors de la traduction du CV : ", error);
            toast.error("Erreur lors de la traduction du CV.");
        }
        finally{
            setLoadingTrad(false);
        }
    };

    // Fonction pour monter/descendre un élément d'une liste (selon la section)
    const moveItem = (sectionName, index, direction) => {
        // Copie du tableau (selon la section)
        const newArray = [...cvData[sectionName]]

        // MONTER
        if (direction === "up" && index > 0){
            [newArray[index - 1], newArray[index]] = [newArray[index], newArray[index - 1]];    //inversion des éléments
        }

        // DESCENDRE
        else if (direction === "down" && index < newArray.length - 1){
            [newArray[index + 1], newArray[index]] = [newArray[index], newArray[index + 1]];
        }

        // Mouvement invalide
        else{
            return; 
        }

        // Màj du State
        setCvData({...cvData, [sectionName]: newArray});

    }





    return (
        <aside className={`flex flex-col left-0 relative z-10 h-full ${openAccordionsCount > 0 ? "w-180" : "w-46"} bg-[#311603] pt-10 overflow-y-auto scrollbar-none shrink-0 transition-all duration-300`}>

            <Accordion 
            title="Informations" 
            onClick={(isOpen) => handleAccordionToggle(isOpen) }
            isSidebarOpen={openAccordionsCount > 0}
            variant={"main"}
            >
                <Accordion title="Informations Personnelles" variant={"secondary"}>
                    <div>
                        <h2>Nom</h2>
                        <input 
                        className="p-1 rounded-md bg-[#ffcd86] text-[#311603] outline-none w-full"  
                        type="text" 
                        placeholder="Example" 
                        value={cvData.personalInfo.lastName}
                        onChange={(e) => setCvData({
                            ...cvData,
                            personalInfo: { ...cvData.personalInfo, lastName: e.target.value}
                        })}
                        />
                    </div>

                    <div>
                        <h2>Prénom</h2>
                        <input 
                        type="text" 
                        placeholder="Example" 
                        className="p-1 rounded-md bg-[#ffcd86] text-[#311603] outline-none w-full"
                        value={cvData.personalInfo.firstName}
                        onChange={(e) => setCvData({
                            ...cvData,
                            personalInfo: { ...cvData.personalInfo, firstName: e.target.value}
                        })}
                        />
                    </div>

                    <div>
                        <h2>Email</h2>
                        <input 
                        type="email" 
                        placeholder="ex: example@test.com" 
                        className="p-1 rounded-md bg-[#ffcd86] text-[#311603] outline-none w-full" 
                        value={cvData.personalInfo.email}
                        onChange={(e) => setCvData({
                            ...cvData,
                            personalInfo: { ...cvData.personalInfo, email: e.target.value}
                        })}
                        />
                    </div>

                    <div>
                        <h2>Téléphone</h2>
                        <input 
                        type="tel" 
                        placeholder="ex: 06 07 08 09 10" 
                        className="p-1 rounded-md bg-[#ffcd86] text-[#311603] outline-none w-full" 
                        value={cvData.personalInfo.phone}
                        onChange={(e) => setCvData({
                            ...cvData,
                            personalInfo: { ...cvData.personalInfo, phone: e.target.value}
                        })}
                        />
                    </div>

                    <div>
                        <h2>Titre du poste</h2>
                        <input 
                        type="text" 
                        placeholder="ex: Développeur Front" 
                        className="p-1 rounded-md bg-[#ffcd86] text-[#311603] outline-none w-full" 
                        value={cvData.personalInfo.jobTitle}
                        onChange={(e) => setCvData({
                            ...cvData,
                            personalInfo: { ...cvData.personalInfo, jobTitle: e.target.value}
                        })}
                        />
                    </div>

                </Accordion>


                <Accordion title="Expériences" variant={"secondary"}>


                    {cvData.experiences.map((experience, index) => (

                        <div key={experience._id || experience.id || index} className="mb-8 pb-4 border-b border-[#61310e]/30">

                            <div className='flex justify-center items-center mb-4'>

                                <h3 className="text-base font-bold text-[#fccc69] flex flex-1 justify-start ">
                                    Expérience n°{index + 1}
                                </h3>

                                <div className='flex items-center gap-4 text-xl'>
                                    
                                    <button
                                    className={`border rounded-full p-0.5  bg-transparent ${index === 0 ? "text-gray-200" : "text-[#fccc69] hover:bg-amber-400/25 cursor-pointer"}  transition-colors duration-100`}
                                    onClick={() => moveItem("experiences", index, "up")}
                                    disabled={index===0}
                                    >
                                        <IoArrowUp />
                                    </button>


                                    <button
                                    className={`border rounded-full p-0.5  bg-transparent ${index === cvData.experiences.length - 1 ? "text-gray-200" : "text-[#fccc69] hover:bg-amber-400/25 cursor-pointer"} transition-colors duration-100`}
                                    onClick={() => moveItem("experiences", index, "down")}
                                    disabled={index === cvData.education.length - 1}
                                    >
                                        <IoArrowDown />
                                    </button>

                                </div>

                            </div>
                                
                            <span className='flex flex-col gap-3'>
                                <div>
                                    <h2>Intitulé du poste</h2>
                                    <input 
                                    type="text" 
                                    placeholder="ex: Data Analyst" 
                                    className="p-1 rounded-md bg-[#ffcd86] text-[#311603] outline-none w-full" 
                                    value={experience.position}
                                    onChange={(e) => {
                                        const newExperiences = [...cvData.experiences];
                                        newExperiences[index].position = e.target.value;
                                        setCvData({ ...cvData, experiences: newExperiences });
                                    }}
                                    />
                                </div>


                                <div>
                                    <h2>Nom de l'entreprise</h2>
                                    <input 
                                    type="text" 
                                    placeholder="ex: Bouygues" 
                                    className="p-1 rounded-md bg-[#ffcd86] text-[#311603] outline-none w-full"
                                    value={experience.company}
                                    onChange={(e) => {
                                        const newExperiences = [...cvData.experiences];
                                        newExperiences[index].company = e.target.value;
                                        setCvData({ ...cvData, experiences: newExperiences });
                                    }} 
                                    />
                                </div>


                                <div>
                                    <h2>Date de début</h2>
                                    <input 
                                    type="month" 
                                    className="p-1 rounded-md bg-[#ffcd86] text-[#311603] outline-none w-full"
                                    value={experience.startDate}
                                    onChange={(e) => {
                                        const newExperiences = [...cvData.experiences];
                                        newExperiences[index].startDate = e.target.value;
                                        setCvData({ ...cvData, experiences: newExperiences });
                                    }}  
                                    />
                                </div>

                                <div>
                                    <h2>Date de fin</h2>
                                    <input 
                                    type="month" 
                                    className="p-1 rounded-md bg-[#ffcd86] text-[#311603] outline-none w-full"
                                    value={experience.endDate}
                                    onChange={(e) => {
                                        const newExperiences = [...cvData.experiences];
                                        newExperiences[index].endDate = e.target.value;
                                        setCvData({ ...cvData, experiences: newExperiences });
                                    }}  
                                    />
                                </div>

                                <div>
                                    <h2>Description du poste</h2>
                                    <RichTextEditor 
                                        value={experience.description}
                                        onChange={(htmlContent) => {
                                            const newExperiences = [...cvData.experiences];
                                            newExperiences[index].description = htmlContent;
                                            setCvData({ ...cvData, experiences: newExperiences });
                                        }}
                                    />
                                </div>
                            </span>

                            <div className='flex flex-col w-[40%]'>
                                
                                <button
                                className={`flex-1 px-4 py-2 mt-3 rounded-full font-bold text-[#311603] transition-all duration-150 text-sm ${
                                        loadingIndex === index 
                                        ? 'bg-gray-700 text-gray-300 cursor-not-allowed' 
                                        : 'bg-[#fccc69] hover:bg-[#ffcd86] hover:cursor-pointer'
                                    }`}
                                onClick={() => handleRephrase(index)}
                                disabled={loadingIndex === index}
                                >
                                   {loadingIndex === index ? <SyncLoader color='#6a7282' size={5} speedMultiplier={0.7} />  : "✨ Reformuler" }
                                </button>

                                <button 
                                className='bg-[#61310e] mt-4 px-4 py-2 rounded-full font-bold text-[#fccc69] hover:cursor-pointer'
                                onClick={() => {
                                    const newExperiences = [...cvData.experiences];
                                    newExperiences.splice(index, 1) // coupe l'expérience à la position "index"

                                    setCvData({
                                        ...cvData,
                                        experiences: newExperiences
                                    });

                                    toast.success(`Expérience n°${index+1} supprimée.`)
                                }}	
                            
                                >
                                    Supprimer l'expérience
                                </button>

                                

                            </div>


                        </div>

                        




                    ))}		

                        <div>
                            <button 
                            className='bg-[#61310e] px-4 py-2 rounded-full font-bold text-[#fccc69] hover:cursor-pointer'
                            onClick={() => {
                                // créé un version vide du modèle Mongoose
                                const newEmptyExperience = {
                                    id: crypto.randomUUID(),
                                    position: "",
                                    company: "",
                                    startDate: "",
                                    endDate: "",
                                    description: ""
                                };

                                setCvData({
                                    ...cvData,
                                    experiences: [
                                        ...cvData.experiences,
                                        newEmptyExperience
                                    ]
                                });
                            }}	
                            >
                                + Ajouter une expérience
                            </button>

                        </div>




                </Accordion>

                <Accordion title="Formations" variant={"secondary"}>
                    {cvData.education.map((formation, index) => (

                        <div key={formation._id || formation.id || index} className="mb-8 pb-4 border-b border-[#61310e]/30">

                            <div className='flex justify-center items-center mb-4'>

                                <h3 className="text-base font-bold  text-[#fccc69] flex flex-1">
                                    Formation n°{index + 1}
                                </h3>
                                
                                <div className='flex  items-center gap-4 text-xl'>
                                    
                                    <button
                                    className={`border rounded-full p-0.5  bg-transparent ${index === 0 ? "text-gray-200" : "text-[#fccc69] hover:bg-amber-400/25 cursor-pointer"}  transition-colors duration-100`}
                                    onClick={() => moveItem("education", index, "up")}
                                    disabled={index===0}
                                    >
                                        <IoArrowUp />
                                    </button>


                                    <button
                                    className={`border rounded-full p-0.5  bg-transparent ${index === cvData.education.length - 1 ? "text-gray-200" : "text-[#fccc69] hover:bg-amber-400/25 cursor-pointer"} transition-colors duration-100`}
                                    onClick={() => moveItem("education", index, "down")}
                                    disabled={index === cvData.education.length - 1}
                                    >
                                        <IoArrowDown />
                                    </button>

                                </div>


                            </div>

                            <span className='flex flex-col gap-3'>
                                <div>
                                    <h2>Intitulé du diplôme</h2>
                                    <input 
                                    type="text" 
                                    placeholder="ex: Master en Ingénierie Informatique" 
                                    className="p-1 rounded-md bg-[#ffcd86] text-[#311603] outline-none w-full" 
                                    value={formation.degree}
                                    onChange={(e) => {
                                        const newFormation = [...cvData.education];
                                        newFormation[index].degree = e.target.value;
                                        setCvData({ ...cvData, education: newFormation });
                                    }}
                                    />
                                </div>


                                <div>
                                    <h2>Établissement</h2>
                                    <input 
                                    type="text" 
                                    placeholder="ex: Sorbonne Université" 
                                    className="p-1 rounded-md bg-[#ffcd86] text-[#311603] outline-none w-full" 
                                    value={formation.school}
                                    onChange={(e) => {
                                        const newFormation = [...cvData.education];
                                        newFormation[index].school = e.target.value;
                                        setCvData({ ...cvData, education: newFormation });
                                    }}
                                    />

                                </div>

                                <div>
                                    <h2>Date de début</h2>
                                    <input 
                                    type="month" 
                                    className="p-1 rounded-md bg-[#ffcd86] text-[#311603] outline-none w-full"
                                    value={formation.startDate}
                                    onChange={(e) => {
                                        const newFormation = [...cvData.education];
                                        newFormation[index].startDate = e.target.value;
                                        setCvData({ ...cvData, education: newFormation });
                                    }}
                                    />
                                </div>

                                <div>
                                    <h2>Date de fin</h2>
                                    <input 
                                    type="month" 
                                    className="p-1 rounded-md bg-[#ffcd86] text-[#311603] outline-none w-full"
                                    value={formation.endDate}
                                    onChange={(e) => {
                                        const newFormation = [...cvData.education];
                                        newFormation[index].endDate = e.target.value;
                                        setCvData({ ...cvData, education: newFormation });
                                    }}
                                    />
                                </div>
                            </span>

                            <div>
                                <button 
                                className='bg-[#61310e] mt-4 px-4 py-2 rounded-full font-bold text-[#fccc69] hover:cursor-pointer'
                                onClick={() => {
                                    const newFormation = [...cvData.education];
                                    newFormation.splice(index, 1) // coupe la formation à la position "index"

                                    setCvData({
                                        ...cvData,
                                        education: newFormation
                                    });

                                    toast.success(`Formation n°${index+1} supprimée.`)

                                }}	
                                >
                                    Supprimer la formation
                                </button>

                            </div>


                        </div>
                    ))}

                    <div>
                            <button 
                            className='bg-[#61310e] px-4 py-2 rounded-full font-bold text-[#fccc69] hover:cursor-pointer'
                            onClick={() => {
                                // créé un version vide du modèle Mongoose
                                const newEmptyFormation = {
                                    id: crypto.randomUUID(),
                                    degree: "",
                                    school: "",
                                    startDate: "",
                                    endDate: ""
                                };

                                setCvData({
                                    ...cvData,
                                    education: [
                                        ...cvData.education,
                                        newEmptyFormation
                                    ]
                                });
                            }}	
                            >
                                + Ajouter une formation
                            </button>

                        </div>

                </Accordion>




                <Accordion title="Compétences" variant={"secondary"}>
                    
                    {cvData.skills.map((skill, index) => (

                        <div key={skill._id || skill.id || index} className="mb-8 pb-4 border-b border-[#61310e]/30">


                            <div>

                                <div className='flex justify-center items-center mb-4'>
                                
                                    <h3 className="text-base flex flex-1 justify-start font-bold  text-[#fccc69]">
                                        Compétence n°{index+1}
                                    </h3>

                                    <div className='flex  items-center gap-4 text-xl'>
                                        
                                        <button
                                        className={`border rounded-full p-0.5  bg-transparent ${index === 0 ? "text-gray-200" : "text-[#fccc69] hover:bg-amber-400/25 cursor-pointer"}  transition-colors duration-100`}
                                        onClick={() => moveItem("skills", index, "up")}
                                        disabled={index===0}
                                        >
                                            <IoArrowUp />
                                        </button>


                                        <button
                                        className={`border rounded-full p-0.5  bg-transparent ${index === cvData.skills.length - 1 ? "text-gray-200" : "text-[#fccc69] hover:bg-amber-400/25 cursor-pointer"} transition-colors duration-100`}
                                        onClick={() => moveItem("skills", index, "down")}
                                        disabled={index === cvData.skills.length - 1}
                                        >
                                            <IoArrowDown />
                                        </button>

                                </div>

                            </div>
                                <input 
                                type="text" 
                                placeholder="ex: React.js" 
                                className="p-1 rounded-md bg-[#ffcd86] text-[#311603] outline-none w-full" 
                                value={skill.name}
                                onChange={(e) => {
                                    const newSkill = [...cvData.skills];
                                    newSkill[index].name = e.target.value;
                                    setCvData({ ...cvData, skills: newSkill });
                                }}
                                />
                            </div>

                            <div>
                                <button 
                                className='bg-[#61310e] mt-4 px-4 py-2 rounded-full font-bold text-[#fccc69] hover:cursor-pointer'
                                onClick={() => {
                                    const newSkill = [...cvData.skills];
                                    newSkill.splice(index, 1) // coupe la compétence à la position "index"

                                    setCvData({
                                        ...cvData,
                                        skills: newSkill
                                    });

                                    toast.success(`Compétence n°${index+1} supprimée.`)

                                }}	
                                >
                                    Supprimer
                                </button>

                            </div>


                        </div>

                    ))}

                    <div>
                            <button 
                            className='bg-[#61310e] px-4 py-2 rounded-full font-bold text-[#fccc69] hover:cursor-pointer'
                            onClick={() => {
                                // créé un version vide du modèle Mongoose
                                const newSkill = {
                                    id: crypto.randomUUID(),
                                    name: ""
                                };

                                setCvData({
                                    ...cvData,
                                    skills: [
                                        ...cvData.skills,
                                        newSkill
                                    ]
                                });
                            }}	
                            >
                                + Ajouter une compétence
                            </button>

                        </div>


                </Accordion>



                <Accordion title="Langues" variant={"secondary"}>
                    
                    {cvData.languages.map((language, index) => (

                        <div key={language._id || language.id || index} className="mb-8 pb-4 border-b border-[#61310e]/30">


                            <div className='flex justify-center items-center mb-4'>
                                
                                    <h3 className="text-md flex flex-1 justify-start text-lg font-bold  text-[#fccc69]">
                                        Langue n°{index+1}
                                    </h3>

                                    <div className='flex  items-center gap-4 text-xl'>
                                        
                                        <button
                                        className={`border rounded-full p-0.5  bg-transparent ${index === 0 ? "text-gray-200" : "text-[#fccc69] hover:bg-amber-400/25 cursor-pointer"}  transition-colors duration-100`}
                                        onClick={() => moveItem("languages", index, "up")}
                                        disabled={index===0}
                                        >
                                            <IoArrowUp />
                                        </button>


                                        <button
                                        className={`border rounded-full p-0.5  bg-transparent ${index === cvData.languages.length - 1 ? "text-gray-200" : "text-[#fccc69] hover:bg-amber-400/25 cursor-pointer"} transition-colors duration-100`}
                                        onClick={() => moveItem("languages", index, "down")}
                                        disabled={index === cvData.languages.length - 1}
                                        >
                                            <IoArrowDown />
                                        </button>

                                </div>

                            </div>

                            <span className='flex flex-col gap-3'>
                                <div>
                                    <h2>Nom</h2>
                                    <input 
                                    type="text" 
                                    placeholder="ex: Anglais" 
                                    className="p-1 rounded-md bg-[#ffcd86] text-[#311603] outline-none w-full" 
                                    value={language.name}
                                    onChange={(e) => {
                                        const newLanguage = [...cvData.languages];
                                        newLanguage[index].name = e.target.value;
                                        setCvData({ ...cvData, languages: newLanguage });
                                    }}
                                    />
                                </div>

                                <div>
                                    <h2>Niveau</h2>
                                    <select 
                                    className="p-1 rounded-md bg-[#ffcd86] text-[#311603] outline-none w-full" 
                                    value={language.level}
                                    onChange={(e) => {
                                        const newLanguage = [...cvData.languages];
                                        newLanguage[index].level = e.target.value;
                                        setCvData({ ...cvData, languages: newLanguage });
                                    }}
                                    >
                                        <option value="" disabled>Sélectionner un niveau</option>
                                        <option value="nativeLanguage">Langue maternelle</option>
                                        <option value="bilingual">Bilingue/Courant (C1/C2)</option>
                                        <option value="intermediate">Intermédiaire(B1/B2)</option>
                                        <option value="beginner">Débutant(A1/A2)</option>

                                    </select>
                                </div>
                            </span>

                            <div>
                                <button 
                                className='bg-[#61310e] mt-4 px-4 py-2 rounded-full font-bold text-[#fccc69] hover:cursor-pointer'
                                onClick={() => {
                                    const newLanguage = [...cvData.languages];
                                    newLanguage.splice(index, 1) // coupe la langue à la position "index"

                                    setCvData({
                                        ...cvData,
                                        languages: newLanguage
                                    });

                                    toast.success(`Langue n°${index+1} supprimée.`)

                                }}	
                                >
                                    Supprimer
                                </button>

                            </div>


                        </div>

                    ))}

                    <div>
                            <button 
                            className='bg-[#61310e] px-4 py-2 rounded-full font-bold text-[#fccc69] hover:cursor-pointer'
                            onClick={() => {
                                // créé un version vide du modèle Mongoose
                                const newLanguage = {
                                    id: crypto.randomUUID(),
                                    name: "",
                                    level: ""
                                };

                                setCvData({
                                    ...cvData,
                                    languages: [
                                        ...cvData.languages,
                                        newLanguage
                                    ]
                                });
                            }}	
                            >
                                + Ajouter une langue
                            </button>

                        </div>


                </Accordion>
            </Accordion>


            <Accordion 
            title="Fonctionnalités IA"
            onClick={(isOpen) => handleAccordionToggle(isOpen)}
            isSidebarOpen={openAccordionsCount > 0}
            variant={"main"}
            >

                

                <div className='flex flex-col gap-4 w-full justify-center relative'>

                     {/* BOUTON TRADUCTION FR <-> EN */}
                    <div className="flex flex-col gap-4 items-center">
                        <button className={`bg-[#61310e] px-4 py-2 rounded-full font-bold text-[#fccc69] hover:cursor-pointer flex justify-center items-center transition-all duration-150 w-[50%] ${
                                loadingTrad === true 
                                ? 'bg-gray-700 text-gray-300 cursor-not-allowed' 
                                : 'bg-[#61310e] hover:bg-[#3e1c04] hover:cursor-pointer'
                            }`}
                        
                        onClick={handleTranslateFullCV}
                        disabled={loadingTrad === true}
                        >
                            
                            {loadingTrad === true 
                            ? <SyncLoader color='#6a7282' size={5} speedMultiplier={0.7} /> 
                            : <div className='flex justify-center items-center'><IoLanguageSharp className='mr-1' /> <p className='mr-1'>Traduire</p>
                            
                            {cvData.lang === "FR"
                            ? " en Anglais"
                            : " en Français"
                            }</div>}
                            
                        </button>
                    </div>



                    {/* BOUTON DE VÉRIFICATION ORTHOGRAPHIQUE */}
                    <div className="flex flex-col gap-4 items-center">
                        
                        
                        <button 
                            className='bg-[#61310e] hover:bg-[#3e1c04] px-8 py-2 rounded-full font-bold text-[#fccc69] hover:cursor-pointer disabled:opacity-50 flex justify-center items-center w-[50%] transition-all duration-150'
                            onClick={handleSpellCheck}
                            disabled={isCheckingSpelling}
                        >
                            <LuSpellCheck className='mr-1' /> {isCheckingSpelling ? "Analyse en cours..." : "Vérifier l'orthographe"}
                        </button>

                        {/* RÉSULTATS DE LA VERIFICATION*/}
                        {spellErrors.length > 0 && (
                            <div className="flex flex-col gap-3 mt-2">
                                
                                <h3 className="text-[#fccc69] text-sm font-bold border-b border-[#61310e] pb-1">
                                    Résultats de l'analyse :
                                </h3>
                                
                                {spellErrors.map((err, index) => {
                                    
                                    // Isole le mot où l'erreur se trouve
                                    const wrongWord = err.context.text.substring(err.context.offset, err.context.offset + err.context.length);

                                    return (
                                        <div key={index} className="bg-[#f5e3d6] rounded-md p-3 flex flex-col gap-2 shadow-sm">
                                            
                                            {/* Emplacement de la faute dans le CV */}
                                            <span className="text-[10px] self-start bg-white text-[#61310e] px-2 py-0.5 rounded-full font-bold border border-[#61310e]/20">
                                                {err.source}
                                            </span>

                                            {/* Affichage de l'erreur */}
                                            <p className="text-sm text-gray-800">
                                                Faute détectée : <span className="font-bold text-red-600 line-through decoration-1 decoration-red-600">{wrongWord}</span>
                                            </p>

                                            {/* Affiche la raison de l'erreur */}
                                            <p className="text-xs text-gray-600 italic border-l-2 border-[#61310e] pl-2">
                                                {err.message}
                                            </p>

                                            {/* Suggestions de correction */}
                                            {err.replacements.length > 0 && (

                                                <div className="flex flex-wrap gap-1 mt-1">

                                                    <span className="text-xs font-bold text-gray-700 mr-1 mt-1">Suggestions:</span>
                                                    
                                                    {/* N'affiche que les 3 meilleures solutions */}
                                                    {err.replacements.slice(0, 3).map((rep, idx) => (

                                                        <span key={idx} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                                                            {rep.value}
                                                        </span>

                                                    ))}

                                                </div>
                                            )}
                                            
                                        </div>
                                    );
                                })}

                            </div>
                        )}
                    </div>
                        
                   

                </div>
                    

            </Accordion>

            {/* STYLE */}
            <Accordion
            title={"Style"}
            variant={"main"}
            onClick={(isOpen) => handleAccordionToggle(isOpen)}
            isSidebarOpen={openAccordionsCount > 0}
            >
                {/* SECTION COULEURS */}
                <div className="mb-6">

                    <h3 className="font-bold mb-2">Couleur</h3>

                    <div className="flex flex-wrap gap-8 items-center py-2">

                        {/* Transforme THEMES en tableau pour boucler dessus*/}
                        {Object.entries(THEMES).map(([themeKey, themeValues]) => (
                            <button 
                                key={themeKey}
                                className={`
                                    w-10 h-10 rounded-full border-2 transition-all duration-200 
                                    cursor-pointer hover:shadow-lg 
                                    ${cvData.theme === themeKey ? "border-white scale-110 shadow-md  ring-white/30" : "border-black/50 opacity-80"}
                                `}
                                style={{ backgroundColor: themeValues.primary }}
                                onClick={() => setCvData({...cvData, theme: themeKey})}
                                title={themeValues.name}
                            />
                        ))}

                        {/* Couleurs personnalisées */}
                        {customColors.map((color, index) => (
                            <button
                            key={index}
                            className={`
                                w-10 h-10 rounded-full border-2 transition-all duration-200 
                                cursor-pointer hover:shadow-lg group relative 
                                ${cvData.theme === color ? "border-white scale-110 shadow-md  ring-white/30" : "border-black/50 opacity-80"}
                            `}
                            style={{ backgroundColor: color }}
                            onClick={() => setCvData({...cvData, theme: color})}
                        
                            />
                        ))}

                        {/* Bouton d'ajout de couleurs "+" */}
                        <button 
                        className='flex justify-center items-center w-10 h-10 rounded-full border-dashed border-2 transition-all duration-200 cursor-pointer hover:shadow-lg text-gray-500 hover:text-gray-200'
                        onClick={() => {
                            // Initialise avec la couleur actuelle
                            setTempColor(cvData.theme?.startsWith("#") ? cvData.theme : "#171717");
                            
                            setIsPickerOpen(!isPickerOpen);
                        }}
                        
                        >
                    
                            <span className='font-bold text-2xl'>+</span>



                        </button>

                        {isPickerOpen && (
                            <div className="absolute top-10 left-0 z-50 bg-white p-4 rounded-xl shadow-2xl border border-gray-200 flex flex-col gap-4 w-[220px]">

                                {/* COLOR PICKER */}
                                <HexColorPicker 
                                    color={tempColor} 
                                    onChange={setTempColor} 
                                    style={{ width: "100%", height: "150px" }}
                                />

                                {/* Prévisualisation de la couleur */}
                                <div className="flex items-center gap-2">
                                    <div 
                                        className="w-6 h-6 rounded border shadow-inner" 
                                        style={{ backgroundColor: tempColor }}
                                    ></div>
                                    <span className="text-sm font-mono text-gray-600 uppercase">
                                        {tempColor}
                                    </span>
                                </div>

                                {/* Boutons "Annuler" & "Valider" */}
                                <div className="flex justify-between items-center mt-1">

                                    <button 
                                        onClick={() => setIsPickerOpen(false)}
                                        className="px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-gray-800 transition-colors"
                                    >
                                        Annuler
                                    </button>


                                    <button 
                                        onClick={handleValidateColor}
                                        className="px-4 py-1.5 bg-green-500 text-white text-xs font-bold rounded-lg shadow-md hover:bg-green-600 transition-all "
                                    >
                                        Valider
                                    </button>


                                </div>

                            </div>
                        )}

                        
                        
                    </div>
                </div>


                {/* SECTION POLICES */}
                <div className="mb-6">
                    <h3 className="font-bold mb-2">Police d'écriture</h3>

                    <div className="flex flex-wrap gap-8 items-center py-2">
                        {Object.entries(FONTS).map(([fontKey, fontData]) => (

                            <button
                            key={fontKey}
                            onClick={() => setCvData({...cvData, font:fontKey})}
                            style={{fontFamily: fontData.value}} //affiche le bouton avec sa police associée
                            className={`p-2 border-2 text-left rounded-md hover:bg-black/10 transition-colors cursor-pointer
                                ${cvData.font === fontKey ? "border-white " : "border-black/40"}
                                `}
                            >
                                {fontData.name}
                            </button>

                        ))}


                    </div>

                </div>
                
                


            </Accordion>

        </aside>
    )









}