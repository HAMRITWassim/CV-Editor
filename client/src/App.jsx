import { useEffect, useState } from 'react';

// COMPONENTS
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CVPreview from './components/CVPreview';

// ICONES
import { MoonLoader } from "react-spinners";

import toast, { Toaster } from "react-hot-toast";

function App() {

	// CV de départ
	const initialCV = {
		title: "",
		lang: "FR",
		theme: "marron",
		font: "sans",
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
	};

	// "Capsule" Temporelle
	const [historyState, setHistoryState] = useState({
		history: [initialCV], 		// Historique de n versions du CV (on définit n=20 plus bas)
		currentIndex: 0				// Position du cv actuel dans l'historique (0 = début)
	});
		
	
	// CV actuel (Cv de l'historique pointé par son index)
	const cvData = historyState.history[historyState.currentIndex];

	// Prévisualisation des couleurs
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [tempColor, setTempColor] = useState("#000000");


	const setCvData = (action) => {

		// On utilise "prev" pour tjrs prendre la version la plus récente
		setHistoryState((prev) => {
			const { history, currentIndex } = prev;

			const currentCv = history[currentIndex];
			const resolvedCvData = typeof action === "function" ? action(currentCv) : action;	// S'adapte si l'on passe une fct

			// Supprime les futurs "alternatifs" (après modification, plus besoin d'y accéder)
			const newHistory = history.slice(0, currentIndex + 1);

			// Copie du CV
			const clonedData = JSON.parse(JSON.stringify(resolvedCvData));
			newHistory.push(clonedData);

			// Limite de 20 CVs dans l'historique
			if (newHistory.lenght > 20)
			{
				newHistory.shift();
				return { history: newHistory, currentIndex: 19};
			}

			else
			{
				return { history: newHistory, currentIndex: currentIndex + 1 };
			}
		});
	};

	// Charge un CV sans créer d'historique (permet de ne pas avoir le bouton UNDO cliquable lors du chargement de la page)
	const initCvData = (loadedCvData) => {
		// Écrase l'historique pour qu'il ne contienne que loadedCvData
		const clonedData = JSON.parse(JSON.stringify(loadedCvData))
		setHistoryState({
			history: [clonedData],
			currentIndex: 0
		});
	};

	// FCT Annuler
	const handleUndo = () => {
		if (historyState.currentIndex > 0)
		{
			toast("Action annulée", {icon: "↩️"});

			setHistoryState((prev) => ({ 
				...prev, 
				currentIndex: prev.currentIndex - 1 
			}));
		}
	};

	// FCT Rétablir
	const handleRedo = () => {
		if (historyState.currentIndex < historyState.history.length - 1)
		{
			toast('Action rétablie', { icon: '↪️' });

			setHistoryState((prev) => ({ 
				...prev, 
				currentIndex: prev.currentIndex + 1
			}));
		}
	};


	// Utilisation des raccourcis pour Annuler/Rétablir un changement
	useEffect(() => {
		const handleKeyDown = (e) => {
			// Vérifie si on appuie sur CTRL(Windows) ou CMD(Mac)
			const isCTRLorCMD = e.ctrlKey || e.metaKey;

			if (isCTRLorCMD && e.key.toLowerCase() === "z") {
				//empêche le comportement par défaut du navigateur
				e.preventDefault();

				// CTRL + SHIFT + Z --> Rétablir
				if (e.shiftKey){
					handleRedo(); 
				}

				// CTRL + Z --> Annuler
				else{
					handleUndo();
				}
			}

			// CTRL + Y --> Rétablir
			else if (isCTRLorCMD && e.key.toLowerCase() === "y") {
				e.preventDefault();
				handleRedo(); 		
			}
		};

		// Attache l'écouteur à la fenêtre
		window.addEventListener("keydown", handleKeyDown);

		return () => window.removeEventListener("keydown", handleKeyDown);	// Retire l'ecouteur 

	}, [historyState.currentIndex, historyState.history]);




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
					initCvData(data); // On utilise les données MongoDB pour remplir la page
				}
			}
			
			catch (error) {
				console.error("Erreur de connexion au serveur: ", error);
				toast.error("Erreur de connexion au serveur.");
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
			toast.error("Il n'y a pas de texte à analyser !");
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
				toast.success("Aucune faute trouvée.");
			} else {
				setSpellErrors(allErrors); // On affiche les erreurs dans la Sidebar
				toast.error(`${allErrors.length} erreur(s) détectée(s) !`)
			}

		} catch (error) {
			console.error("Erreur lors de la vérification :", error);
			toast.error("Une erreur est survenue lors de la vérification orthographique.");
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

				<Toaster 
				position="bottom-right"
				/>

				{/* HEADER */}
				<Header
				cvData={cvData}
				setCvData={setCvData}
				onUndo={handleUndo}
				onRedo={handleRedo} 
				canUndo={historyState.currentIndex > 0} 
				canRedo={historyState.currentIndex < historyState.history.length - 1}
				/>

				<div className="flex flex-1 overflow-hidden">

					{/* SIDEBAR */}
					<Sidebar 
					cvData={cvData}
					setCvData={setCvData} 
					spellErrors={spellErrors}
					setSpellErrors={setSpellErrors} 
					isCheckingSpelling={isCheckingSpelling} 
					handleSpellCheck={handleSpellCheck}
					isPickerOpen={isPickerOpen}
					setIsPickerOpen={setIsPickerOpen}
					tempColor={tempColor}
					setTempColor={setTempColor}
					/>

					<main className="flex-1 bg-[#F5EFE6] flex justify-center items-center p-8 overflow-hidden">
						
						{/* FEUILLE DE PREVISUALISATION DU CV */}
						<CVPreview cvData={cvData} setCvData={setCvData} previewColor={isPickerOpen ? tempColor : null}/>

					</main>


				</div>

			



			</div>
    
    	</>
  	)
}

export default App