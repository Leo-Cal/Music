import React, {useEffect, useState} from 'react'
import { useLocation } from 'react-router-dom';
import OpusBox from './OpusBox';

function FormRanking() {
    const [backData, setBackData] = useState({ FormOpus: [] });

    const location = useLocation();
    const decodedPath = decodeURIComponent(location.pathname || '');
    const pathParts = decodedPath.split('/')
    const formName = pathParts[pathParts.length - 1]
  
    useEffect ( () => {
      fetch(`http://localhost:8888/form/?formname=${formName}`)
      .then(response => response.json())
      .then(data => {setBackData(data)})
    }, [formName])
  
    return (
      <div className='form-ranking-table'>
        <p> Ranking of <b>{formName}</b></p>
        {
          backData.FormOpus.length === 0 ? (
            <p>No work found for this musical form</p>
          ) : (
            backData.FormOpus.map((opus, i) => (
              <OpusBox key={i} opus={opus} index={i}/>
            ))
          )
        }
      </div>
    );
}

export default FormRanking