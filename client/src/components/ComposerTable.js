import React, {useEffect, useState} from 'react'
import { Link, Route, Routes } from 'react-router-dom';
import OpusTable from './OpusTable';
import './ComposerTable.css';

function ComposerTable() {

  const [backData, setBackData] = useState([{}]);
  const apiUrl = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_API_BASE_URL
  : process.env.REACT_APP_LOCAL_API_BASE_URL;

  useEffect ( () => {
    fetch(`${apiUrl}/composer`).then(
      response => response.json()).then(
        data => {setBackData(data)}
      )
  }, [apiUrl])

  return (
    <div className='composer-table'>

      {
        (typeof backData.Composers === 'undefined') ? (
          <p>Loading composer list...</p>
        ) : (
          <table id="composerTable">
            <thead>
              <tr>
                <th>Composer</th>
                <th>Birth Year</th>
              </tr>
            </thead>
            <tbody> 
              {backData.Composers.map((composer, i) => (
                <tr key={i}>
                  <td class='left-align'><Link className='td-link' to={`/composer/${composer.name}`}>{composer.name}<br></br></Link> </td>
                  <td class='center-align'>{composer.birthyear}</td>
                </tr>
              ))}
            </tbody>
          </table>

        )

      }
        <Routes>
          <Route path={'/composer/:name'} element={<OpusTable/>} />
        </Routes>

    </div>
  )
}

export default ComposerTable