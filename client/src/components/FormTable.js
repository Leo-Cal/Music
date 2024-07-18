import React, {useEffect, useState} from 'react'
import { Link, Route, Routes } from 'react-router-dom';
import OpusTable from './OpusTable';
import './FormTable.css'

function FormTable() {
    const [backData, setBackData] = useState([{}]);
    const apiUrl = process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_BASE_URL
    : process.env.REACT_APP_LOCAL_API_BASE_URL;

    useEffect ( () => {
      fetch(`${apiUrl}/form`).then(
        response => response.json()).then(
          data => {setBackData(data)}
        )
    }, [apiUrl])
  
    return (
      <div className='form-table'>
        {
          (typeof backData.Forms === 'undefined') ? (
            <p>Loading forms list...</p>
          ) : (
            <table id="composerTable">
            {/* <caption className='table-caption'><b><u>Composers</u></b></caption> */}
            <thead>
              <tr>
                <th>Musical Form</th>
              </tr>
            </thead>
            <tbody> 
              {backData.Forms.map((format, i) => (
                <tr key={i}>
                  <td className='left-align'><Link className='td-link' to={`${apiUrl}/form/${format}`}>{format}<br></br></Link> </td>
                </tr>
              ))}
            </tbody>
          </table>
          )
        }
        <Routes>
          <Route path={'/form/:format'} element={<OpusTable/>} />
        </Routes>
  
      </div>
    )
}

export default FormTable