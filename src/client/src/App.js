import React, { useState, useEffect } from 'react';
import axios from 'axios';


function App() {
  const [pastes, setPastes] = useState([]);

  useEffect(() => {
    const fetchPastes = async () => {
      const result = await axios('/getPastes');
      setPastes(result.data);
    };

    fetchPastes();
  }, []);

  return (
    <>
    <div>{pastes.map(paste => (
      <li key={paste.id}>{paste.title} - {paste.date}</li>
    ))}</div>
    </>
  );
}

export default App;
