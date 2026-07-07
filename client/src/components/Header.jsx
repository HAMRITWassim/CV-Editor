import cvLogo from '../assets/cv2.png'


export default function Header({cvData, setCvData}){


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

            <div className=' flex-1 flex justify-end pr-6'>
                
                <button className='bg-[#61310e] px-4 py-2 rounded-full font-bold text-[#fccc69] hover:cursor-pointer'>
                    Exporter en PDF
                </button>
            </div>
            

        </header>
        
    )


    
}