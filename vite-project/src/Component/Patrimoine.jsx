import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

const DataComponent = () => {
    // Définir les états pour les données et les erreurs
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [date, setDate] = useState('');
    const [patrimoine, setPatrimoine] = useState(0);

    // Fonction pour envoyer des données
    const sendData = async () => {
        const dataToSend = {
            dateEnvoie: date
        };
        try {
            const response = await axios.post('http://localhost:3000/api/data', dataToSend);
            console.log('Réponse du serveur:', response.data);
        } catch (error) {
            console.error('Erreur lors de l\'envoi des données:', error);
        }
    };

    const getData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/data');
            setPatrimoine(response.data.data.pat);
        } catch (error) {
            setError(error.message);
        }
    };

    function handleDateChange(event) {
        setDate(event.target.value);
    }

    // Fonction pour envoyer des données et récupérer les résultats
    async function handleButtonClick() {
        await sendData(); // Attendre que les données soient envoyées
        await getData();  // Puis récupérer les données
    }

    const getData2 = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/datab');
            const possessions = response.data.find(item => item.model === 'Patrimoine').data.possessions;
            console.log(possessions);
            setData(possessions);
        } catch (error) {
            setError(error.message);
        }
    };

    // Utiliser useEffect pour appeler getData2 lors du premier rendu
    useEffect(() => {
        getData2();
    }, []);

    return (
  
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="power">
                    <div className="container mt-5">
                        <h1>Calcule ton patrimoine</h1>
                        {error && <p className="text-danger">Error: {error}</p>}
                        {data ? (
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Possesseur</th>
                                        <th>Libelle</th>
                                        <th>Valeur</th>
                                        <th>Date de début</th>
                                        <th>Taux d'amortissement</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.possesseur.nom}</td>
                                            <td>{item.libelle}</td>
                                            <td>{item.valeur === 0 ? item.valeurConstante : item.valeur}</td>
                                            <td>{new Date(item.dateDebut).toLocaleDateString()}</td>
                                            <td>{item.tauxAmortissement !== null ? item.tauxAmortissement : 'N/A'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>
        
                    <label htmlFor="date">Sélectionner une Date :</label>
                    <input type="date" className="mx-3" name="date" id="date" value={date} onChange={handleDateChange} />
                    <h2 className="mt-5">Valeur du patrimoine : <span>{patrimoine.toFixed(2)}</span></h2>
                    <Button className="mt-3" onClick={handleButtonClick}>Lancer</Button>
                </div>
            </div>
        );
        

};

export default DataComponent;
