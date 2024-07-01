import React, {useEffect, useState} from 'react'
import { Link, BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import OpusTable from './OpusTable';

function FormTable() {
    const [backData, setBackData] = useState([{}]);

    useEffect ( () => {
      fetch('http://localhost:8888/form').then(
        response => response.json()).then(
          data => {setBackData(data)}
        )
    }, [])
  
    return (
      <div>
      <h1>List of Musical Forms</h1>
        {
          (typeof backData.Forms === 'undefined') ? (
            <p>Loading forms list...</p>
          ) : (
            backData.Forms.map((format, i) => (
              <Link to={`http://localhost:3000/form/${format}`}>{format}<br></br></Link> 
            ))
          )
        }
          <Routes>
            <Route path={'/form/:format'} element={<OpusTable/>} />
          </Routes>
  
      </div>
    )
}

export default FormTable