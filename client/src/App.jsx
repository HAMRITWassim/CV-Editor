import { useEffect, useState } from 'react';

// COMPONENTS
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CVPreview from './components/CVPreview';

function App() {

	// STATES
	const [cvData, setCvData] = useState({
		title: "",
		lang: "FR",

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



  return (
		<>
			<div className='bg-[#EFE9E3] h-screen flex flex-col overflow-hidden'>

				{/* HEADER */}
				<Header cvData={cvData} setCvData={setCvData}/>

				<div className="flex flex-1 overflow-hidden">

					{/* SIDEBAR */}
					<Sidebar cvData={cvData} setCvData={setCvData}/>

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