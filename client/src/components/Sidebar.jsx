import { useState } from 'react'


// COMPONENTS
import Accordion from './Accordion'
import RichTextEditor from "./RichTextEditor"

export default function Sidebar({cvData, setCvData}){

    //STATES
    const [openAccordionsCount, setOpenAccordionsCount] = useState(0);



    
    const handleAccordionToggle = (isOpen) => {

    if(isOpen) {
        setOpenAccordionsCount((prev) => prev+1);
    }
    else{
        setOpenAccordionsCount((prev) => prev-1);
    }
    };





    return (
        <aside className={`flex flex-col left-0 relative z-10 h-full ${openAccordionsCount > 0 ? "w-90" : "w-40"} bg-[#311603] pt-10 overflow-y-auto scrollbar-none shrink-0 transition-all duration-300`}>

            <Accordion 
            title="INFORMATIONS" 
            onClick={(isOpen) => handleAccordionToggle(isOpen) }
            isSidebarOpen={openAccordionsCount > 0}
            >
                <Accordion title="Informations Personnelles">
                    <div>
                        <h2>Nom</h2>
                        <input 
                        className="p-1 rounded-md bg-[#ffcd86] text-[#311603] outline-none" 
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
                        className="p-1 rounded-md bg-[#ffcd86] text-[#311603] outline-none"
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
                        className="p-1 rounded-md bg-[#ffcd86] text-[#311603] outline-none" 
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
                        className="p-1 rounded-md bg-[#ffcd86] text-[#311603] outline-none" 
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
                        className="p-1 rounded-md bg-[#ffcd86] text-[#311603] outline-none" 
                        value={cvData.personalInfo.jobTitle}
                        onChange={(e) => setCvData({
                            ...cvData,
                            personalInfo: { ...cvData.personalInfo, jobTitle: e.target.value}
                        })}
                        />
                    </div>

                </Accordion>


                <Accordion title="Expériences">


                    {cvData.experiences.map((experience, index) => (

                        <div key={experience.id} className="mb-8 pb-4 border-b border-[#61310e]/30">

                            <h3 className="text-lg font-bold mb-4 text-[#fccc69]">
                                Expérience n°{index + 1}
                            </h3>

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

                            <div>
                                <button 
                                className='bg-[#61310e] mt-4 px-4 py-2 rounded-full font-bold text-[#fccc69] hover:cursor-pointer'
                                onClick={() => {
                                    const newExperiences = [...cvData.experiences];
                                    newExperiences.splice(index, 1) // coupe l'expérience à la position "index"

                                    setCvData({
                                        ...cvData,
                                        experiences: newExperiences
                                    });
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

                <Accordion title="Formations">
                    {cvData.education.map((formation, index) => (

                        <div key={formation.id} className="mb-8 pb-4 border-b border-[#61310e]/30">

                            <h3 className="text-lg font-bold mb-4 text-[#fccc69]">
                                Formation n°{index + 1}
                            </h3>

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




                <Accordion title="Compétences">
                    
                    {cvData.skills.map((skill, index) => (

                        <div key={skill.id} className="mb-8 pb-4 border-b border-[#61310e]/30">


                            <div>
                                <h2>Compétence n°{index+1}</h2>
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



                <Accordion title="Langues">
                    
                    {cvData.languages.map((language, index) => (

                        <div key={language.id} className="mb-8 pb-4 border-b border-[#61310e]/30">


                            <div>
                                <h2>Langue n°{index+1}</h2>
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
                                    <option value="biligual">Bilingue/Courant (C1/C2)</option>
                                    <option value="intermediate">Intermédiaire(B1/B2)</option>
                                    <option value="beginner">Débutant(A1/A2)</option>

                                </select>
                            </div>

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
            >

                <button className='bg-[#61310e] px-4 py-2 rounded-full font-bold text-[#fccc69] hover:cursor-pointer'>
                    Reformuler
                </button>

                <button className='bg-[#61310e] px-4 py-2 rounded-full font-bold text-[#fccc69] hover:cursor-pointer'>
                    Traduire
                </button>

                <button className='bg-[#61310e] px-4 py-2 rounded-full font-bold text-[#fccc69] hover:cursor-pointer'>
                    Vérifier l'orthographe
                </button>

                    

            </Accordion>

        </aside>
    )









}