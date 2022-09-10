import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Paste from './Paste';
import "./app.scss";

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
    <div className='pastes_container'>
      {pastes.map(paste => 
        (<Paste title={paste.title}
         author={paste.author} 
         contentFull={paste.contentFull} 
         date={paste.date}/>)
      )}
    </div>
    </>
  );
}

export default App;
