import React, { useState, useEffect } from 'react';
import axios from 'axios';


function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios('/data');
      setMessage(result.data.message);
    };

    fetchData();
  }, []);

  return (
    <div>{message}</div>
  );
}

export default App;
