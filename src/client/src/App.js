import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Paste from './components/Paste';
import "./app.scss";
import SideNav from './components/sideNav';

function App() {
  const [pastes, setPastes] = useState([]);

  useEffect(() => {
    const fetchPastes = async () => {
      const res = await axios('/getPastes');
      setPastes(res.data);
    };

    fetchPastes();
  }, []);
  
  return (
    <>
    <SideNav></SideNav>
    <div className='main'>
      <div className='pastes_container'>
        {getPastesComponents(pastes)}
      </div>
    </div>
    </>
  );
}

function getPastesComponents(pastes) {
  if (pastes.length > 0) {
    return pastes.map(paste => 
      (<Paste title={paste.title}
       author={paste.author} 
       content={paste.content} 
       date={paste.date}/>));
  } else {
    return <h1>loading</h1>;
  }
}

export default App;
