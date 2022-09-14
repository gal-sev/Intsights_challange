import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Paste from './components/Paste';
import "./app.scss";
import SideNav from './components/sideNav';
import SearchBar from './components/SearchBar';

function App() {
  const [pastes, setPastes] = useState([]);
  const [search, setSearch] = useState("");

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
    <SearchBar setSearch={(value) => setSearch(value)}></SearchBar>
      <div className='pastes_container'>
        {getPastesComponents(pastes, search)}
      </div>
    </div>
    </>
  );
}

function getPastesComponents(pastes, searchText) {
  if (pastes.length > 0) {
    let outputPastes = [];  
    pastes.forEach(paste => {
      if (searchText !== "") {
        if (paste.title.includes(searchText) || 
        paste.author.includes(searchText) || 
        paste.content.includes(searchText) ||
        paste.date.includes(searchText)) {
          outputPastes.push((<Paste title={paste.title}
            author={paste.author} 
            content={paste.content} 
            date={paste.date}/>));
        }
      } else {
        outputPastes.push((<Paste title={paste.title}
          author={paste.author} 
          content={paste.content} 
          date={paste.date}/>));
      }
    });
    return outputPastes;
  } else {
    return <h1>loading</h1>;
  }
}

export default App;
