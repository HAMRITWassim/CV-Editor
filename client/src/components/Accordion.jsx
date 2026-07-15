import { useState } from 'react'

export default function Accordion({title, children, onClick, isSidebarOpen, variant})
{
    // STATES
    const [isOpen, setIsOpen] = useState(false);

    const isMainTitle = variant === "main";
    const titleStyle = isMainTitle ? "uppercase tracking-widest font-extrabold text-lg" : `text-base font-medium `;

    const contentBG = !isMainTitle ? "bg-black/18 rounded-md mt-2": "bg-transparent";

    return(

        <div className={` pl-4 my-1 relative p-3 hover:cursor-pointer transition-all duration-300 bg-[#4a2307] mx-2 rounded-sm` }
        onClick={() => {  
            const nextState = !isOpen // futur état que l'on passe à App.jsx
            setIsOpen(nextState);
            
            if(onClick) {
                onClick(nextState); // passage du prochain état (après le clic) à App.jsx
            }
        }}
        >
            <button className='pointer-events-none w-full text-left'>

                <h1 className={`
                    ${isOpen ? "text-[#ffffff]" : "text-[#fccc69]"} 
                    ${isSidebarOpen === false ? "text-sm" : titleStyle} 
                    transition-all duration-300
                `}>
                    
                    {title}
                    <span className={`absolute right-[10%] transition-all duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`}>{">"}</span>

                </h1>
                
                
            </button>

        <div 
        className={`grid transition-all duration-300 ease-in-out ${ isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0' }`}
        >

            <div className="overflow-hidden">

                <div 
                className={`py-4 px-4 text-[#fcfbf9] flex flex-col gap-4 cursor-default ${contentBG}`}
                onClick={(e) => e.stopPropagation()}
                >
                    {children}
                </div>
                
            </div>

        </div>

        </div>

    );

} 