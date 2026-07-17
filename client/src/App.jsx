import { useEffect, useState } from 'react';

// COMPONENTS
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CVPreview from './components/CVPreview';

// ICONES
import { MoonLoader } from "react-spinners";


function App() {

	// STATES
	const [cvData, setCvData] = useState({
		title: "",
		lang: "FR",
		theme: "marron",
		layout: [
            { id: "col-small", size: 1, items: ["skills", "languages"] },
            { id: "col-large", size: 2, items: ["experiences", "education"] }
        ],

		personalInfo: {
			firstName: "",
			lastName: "",
			email: "",
			phone: "",
			jobTitle: ""
		},
		experiences: [],
		education: [],
		skills: [],
		languages: []
	});

	const [isCheckingSpelling, setIsCheckingSpelling] = useState(false);
    const [spellErrors, setSpellErrors] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	// Lors du chargement de la page -> Lit le dernier CV dans la BDD, et le charge (rempalce les champs du CV par les valeurs dans la BDD)
	useEffect(() => {
		const loadCV = async () => {
			try {
				// Appelle route GET
				const response = await fetch("http://localhost:5000/api/cv");
				

				if(response.ok){
					const data = await response.json();
					setCvData(data); // On utilise les données MongoDB pour remplir la page
				}
			}
			
			catch (error) {
				console.error("Erreur de connexion au serveur: ", error);
			}

			finally{
				setIsLoading(false); // Désactive le chargement
			}
		}

	loadCV();
	},  []) // [] --> Appel une fois au démarrage


	const handleSpellCheck = async () => {
		setIsCheckingSpelling(true);
		setSpellErrors([]); // Vide les anciennes erreurs

		let allErrors = []; // Stocke les erreurs de tout le CV

		// On récupère tous les textes à vérifier
		const elementsToCheck = [];

		// Vérifie le titre du poste
		if (cvData.personalInfo.jobTitle) {
        elementsToCheck.push({ 
            text: cvData.personalInfo.jobTitle, 
            sectionName: "Informations - Titre du poste" 
        });
    }

		// Boucle sur les Expériences
		cvData.experiences.forEach((exp, index) => {
			if (exp.position) {
				elementsToCheck.push({ text: exp.position, sectionName: `Expérience ${index + 1} - Titre` });
			}
			if (exp.description) {
				const plainText = exp.description.replace(/<[^>]+>/g, '').trim(); // On nettoie les balises HTML
				if (plainText) {
					elementsToCheck.push({ text: plainText, sectionName: `Expérience ${index + 1} - Description` });
				}
			}
		});

		// Boucle sur les Formations
		cvData.education.forEach((edu, index) => {
			if (edu.degree) {
				elementsToCheck.push({ text: edu.degree, sectionName: `Formation ${index + 1} - Titre` });
			}
		});

		// Boucle sur les langues
		cvData.languages.forEach((lang, index) => {
        if (lang.name) {
            elementsToCheck.push({ 
                text: lang.name, 
                sectionName: `Langue ${index + 1}` 
            });
        }
    });

		// S'arrête si rien n'est écrit sur le CV
		if (elementsToCheck.length === 0) {
			alert("Il n'y a pas de texte à analyser !");
			setIsCheckingSpelling(false);
			return;
		}

		try {
			// Boucle sur chaque texte
			for (let item of elementsToCheck) {
				const response = await fetch('http://localhost:5000/api/ai/orthographe', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ 
						text: item.text,
						lang: cvData.lang 
					}),
				});

				const data = await response.json();
				
				// Si on trouve des erreurs pour ce texte précis
				if (data.errors && data.errors.length > 0) {
					// Ajout de l'étiquette "sectionName" pour chaque erreur
					const errorsWithLabel = data.errors.map(err => ({
						...err,
						source: item.sectionName
					}));
					// Ajout au tableau de toutes les erreurs
					allErrors = [...allErrors, ...errorsWithLabel];
				}
			}

			// Résultat
			if (allErrors.length === 0) {
				alert("✅ Aucune faute trouvée.");
			} else {
				setSpellErrors(allErrors); // On affiche les erreurs dans la Sidebar
			}

		} catch (error) {
			console.error("Erreur lors de la vérification :", error);
			alert("Une erreur est survenue lors de la vérification orthographique.");
		} finally {
			setIsCheckingSpelling(false);
		}
	};
	
	// Écran de chargement en attendant la récupération du CV
	if(isLoading){
		return(
			<div className='flex justify-center items-center h-screen'>
				<div className='flex flex-col justify-center items-center gap-4'>
					<MoonLoader />
					<h1 className='text-xl'>Chargement de votre CV...</h1>
				</div>
				
			</div>
		)
	}

  	return (
		<>
			<div className='bg-[#EFE9E3] h-screen flex flex-col overflow-hidden'>

				{/* HEADER */}
				<Header cvData={cvData} setCvData={setCvData}/>

				<div className="flex flex-1 overflow-hidden">

					{/* SIDEBAR */}
					<Sidebar cvData={cvData} setCvData={setCvData} spellErrors={spellErrors} setSpellErrors={setSpellErrors} isCheckingSpelling={isCheckingSpelling} handleSpellCheck={handleSpellCheck}/>

					<main className="flex-1 bg-[#F5EFE6] flex justify-center items-center p-8 overflow-hidden">
						
						{/* FEUILLE DE PREVISUALISATION DU CV */}
						<CVPreview cvData={cvData} setCvData={setCvData}/>

					</main>


				</div>

			



			</div>
    
    	</>
  	)
}

export default App