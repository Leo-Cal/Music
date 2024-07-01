import React, {useEffect, useState} from 'react'
import { Link, Route, Routes } from 'react-router-dom';
import OpusTable from './OpusTable';
import './ComposerTable.css';

function ComposerTable() {

  const [backData, setBackData] = useState([{}]);

  useEffect ( () => {
    fetch('http://localhost:8888/composer').then(
      response => response.json()).then(
        data => {setBackData(data)}
      )
  }, [])

  return (
    <div className='composer-table'>

      {
        (typeof backData.Composers === 'undefined') ? (
          <p>Loading composer list...</p>
        ) : (
          <table id="composerTable">
            {/* <caption className='table-caption'><b><u>Composers</u></b></caption> */}
            <thead>
              <tr>
                <th>Name</th>
                <th>Birth Year</th>
              </tr>
            </thead>
            <tbody> 
              {backData.Composers.map((composer, i) => (
                <tr key={i}>
                  <td class='left-align'><Link className='td-link' to={`http://localhost:3000/composer/${composer.name}`}>{composer.name}<br></br></Link> </td>
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