import { useState } from 'react'

export default function Accordion({title, children})
{
    // STATES
    const [isOpen, setIsOpen] = useState(false);

    return(

        <div className={` pl-4 1 my-4 relative  ${ isOpen ? 'bg-[#24130c]' : 'hover:font-bold hover:bg-[#24130c]' } p-3 hover:cursor-pointer transition-all duration-200` }
        onClick={() => setIsOpen(!isOpen)}
        >
            <button className='pointer-events-none'>
                <h1 className={`${isOpen ? "text-[#ffffff] font-bold " : "text-[#fccc69]"} text-lg transition-all duration-150`}>
                    {title}
                    <span className={`absolute right-[10%] transition-all duration-200 ${isOpen ? 'rotate-90' : 'rotate-0'}`}>{">"} </span>
                </h1>
                
                
            </button>

        <div 
        className={`grid transition-all duration-300 ease-in-out ${ isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0' }`}
        >
            <div className="overflow-hidden">
                <div 
                className="p-6  text-[#fcfbf9] flex flex-col gap-4 cursor-default"
                onClick={(e) => e.stopPropagation()}
                >
                    {children}
                </div>
            </div>
        </div>

        </div>

    );

} 