import { useEffect, useState } from 'react'
import cvLogo from './assets/cv2.png'
import exportLogo from './assets/export.png'

import Accordion from './components/Accordion'

function App() {

  // STATES


  return (
    <>
		<div className='bg-[#EFE9E3] h-screen flex flex-col overflow-hidden'>

			<header className='w-screen h-18 bg-[#fccc69] relative z-20 flex justify-between items-center shrink-0'>

				<div className='flex-1 flex justify-start pl-6'>
					<img src={cvLogo} alt="cvLogo" className='h-14' />
				</div>

				<h1 className='font-bold text-[#311603]'>
					Mon Cv
				</h1>

				<div className=' flex-1 flex justify-end pr-6'>
					
					<button className='bg-[#61310e] px-4 py-2 rounded-full font-bold text-[#fccc69] hover:cursor-pointer'>
						Exporter en PDF
					</button>
				</div>
				

			</header>

			<div className="flex flex-1 overflow-hidden">

				<aside className='flex flex-col left-0 relative z-10 h-full w-80 bg-[#311603] pt-10 overflow-y-auto scrollbar-none shrink-0'>

					<Accordion title="Informations Personnelles">
						<div>
							<h2>Nom</h2>
							<input 
							type="text" 
							placeholder="Example" 
							className="p-1 rounded-md bg-[#ffcd86] text-[#311603] outline-none" 
							/>
						</div>

						<div>
							<h2>Prénom</h2>
							<input 
							type="text" 
							placeholder="Example" 
							className="p-1 rounded-md bg-[#ffcd86] text-[#311603] outline-none" 
							/>
						</div>

						<div>
							<h2>Email</h2>
							<input 
							type="email" 
							placeholder="ex: example@test.com" 
							className="p-1 rounded-md bg-[#ffcd86] text-[#311603] outline-none" 
							/>
						</div>

						<div>
							<h2>Téléphone</h2>
							<input 
							type="tel" 
							placeholder="ex: 06 07 08 09 10" 
							className="p-1 rounded-md bg-[#ffcd86] text-[#311603] outline-none" 
							/>
						</div>

						<div>
							<h2>Titre du poste</h2>
							<input 
							type="text" 
							placeholder="ex: Développeur Front" 
							className="p-1 rounded-md bg-[#ffcd86] text-[#311603] outline-none" 
							/>
						</div>

					</Accordion>


					<Accordion title="Expériences et Formations">
						<div>
							<h2>Nom de l'entreprise</h2>
							<input 
							type="text" 
							placeholder="ex: Bouygues" 
							className="p-1 rounded-md bg-[#ffcd86] text-[#311603] outline-none" 
							/>
						</div>


						{/* TODO: RAJOUTER EDITEUR RICHE TIPTAP */}
						<div>
							<h2>Description du poste</h2>
							<input 
							type="text" 
							placeholder="" 
							className="p-1 rounded-md bg-[#ffcd86] text-[#311603] outline-none" 
							/>
						</div>


						<div>
							<h2>Date de début</h2>
							<input 
							type="date" 
							placeholder="Example" 
							className="p-1 rounded-md bg-[#ffcd86] text-[#311603] outline-none" 
							/>
						</div>

						<div>
							<h2>Date de fin</h2>
							<input 
							type="date" 
							placeholder="Example" 
							className="p-1 rounded-md bg-[#ffcd86] text-[#311603] outline-none" 
							/>
						</div>

						<div>
							<button className='bg-[#61310e] px-4 py-2 rounded-full font-bold text-[#fccc69] hover:cursor-pointer'>
								+ Ajouter
							</button>

						</div>




					</Accordion>

					<Accordion title="Fonctionnalités IA">

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

				<main className="flex-1 bg-[#F5EFE6] flex justify-center items-center p-8 overflow-hidden">
                    
                    <div className="bg-white h-full aspect-[210/297] shadow-2xl relative">
                    </div>

                </main>


			</div>

			



		</div>
    
    </>
  )
}

export default App