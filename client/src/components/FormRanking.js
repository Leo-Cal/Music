import React, {useEffect, useState} from 'react'
import { useLocation } from 'react-router-dom';

function FormRanking() {
    const [backData, setBackData] = useState([{}]);

    const location = useLocation();
    const decodedPath = decodeURIComponent(location.pathname || '');
    const pathParts = decodedPath.split('/')
    const formName = pathParts[pathParts.length - 1]
  
    useEffect ( () => {
      fetch(`http://localhost:8888/form/?formname=${formName}`).then(
        response => response.json()).then(
          data => {setBackData(data)}
        )
    }, [formName])
  
    return (
        <div className='form-ranking-table'>
            <p> Ranking of <b>{formName}</b></p>

        {
        (typeof backData.FormOpus === 'undefined') ? (
            <p>No work found for this musical form</p>
        ) : (
            backData.FormOpus.map((opus, i) => (
              <p key={i}>
                  <b>{i+1} Place</b> <br/>
                  <b>Name</b>: {opus.opusName}<br />
                  <b>Composer</b>: {opus.composer} <br />
                  <b>Popularity</b>: {Number(opus.formPopularity).toFixed(2)}<br />
                  <b>Recordings</b>: {opus.recordingCount}
              </p>
            ))
        )
        }

      </div>
    )
}

export default FormRanking