import { useEffect, useState } from 'react'

function App() {

  // STATES
  const [message, setMessage] = useState('Chargement...')

  // Au chargement de la page
  useEffect(() => {
    fetch('http://localhost:5000/api/test')
      .then(response => response.json())
      .then(data => {
        // màj du State message
        setMessage(data.message)
      })
      .catch(error => {
        console.error("Erreur de connexion:", error)
        setMessage('Erreur : Impossible de joindre le serveur.')
      })
  }, []) // [] <-> Qu'une fois au démarrage

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="p-10 bg-white rounded-2xl shadow-xl text-center">
        <h1 className="text-3xl font-bold text-indigo-600 mb-4">
          Projet CV - État du système
        </h1>
        <p className="text-xl text-gray-700 font-medium bg-gray-50 p-4 rounded-lg border border-gray-200">
          {message}
        </p>
      </div>
    </div>
  )
}

export default App