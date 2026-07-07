

export default function CVPreview({cvData, setCvData}){



    return(

        <div className="bg-white h-full aspect-[210/297] shadow-2xl relative p-4">

            <h1 className="text-3xl font-bold text-center">
                            {cvData.personalInfo.firstName || "Prénom"} {cvData.personalInfo.lastName || "Nom"}
            </h1>

        </div>
    )

}