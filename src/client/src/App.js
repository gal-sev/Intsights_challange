import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Paste from './components/Paste';
import "./app.scss";
import SideNav from './components/sideNav';
import SearchBar from './components/SearchBar';
import useDebounce from './hooks/useDebounce';

function App() {
  const [pastes, setPastes] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredPastes, setFiltered] = useState([]);

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    const fetchPastes = async () => {
      const res = await axios('/getPastes');
      setPastes(res.data);
      setFiltered(res.data);
    };
    fetchPastes();
  }, []);

  useEffect(() => {
    setFiltered(filterPastes(pastes, debouncedSearch));
  }, [pastes, debouncedSearch]);
  
  return (
    <>
    <SideNav></SideNav>
    <div className='main'>
    <SearchBar setSearch={(value) => setSearch(value)}></SearchBar>
      <div className='pastes_container'>
        {getPastesComponents(filteredPastes)}
      </div>
    </div>
    </>
  );
}

function filterPastes(pastes, searchText) {
  let outputPastes = [];  
  if (pastes.length > 0) {
    pastes.forEach(paste => {
      if (searchText !== "") {
        if (paste.title.includes(searchText) || 
        paste.author.includes(searchText) || 
        paste.content.includes(searchText) || 
        paste.date.includes(searchText)) {
          outputPastes.push(paste);
        }
      } else {
        outputPastes.push(paste);
      }
    });
  }
  return outputPastes;
}

function getPastesComponents(pastes) {
  if (pastes.length > 0) {
    return pastes.map(paste => 
      (<Paste key={paste.id}
        title={paste.title}
        author={paste.author} 
        content={paste.content} 
        date={paste.date}/>)
    );
  } else {
    return <h1 className='loading'>No pastes avaliable</h1>;
  }
}

export default App;
