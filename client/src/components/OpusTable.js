import React, {useEffect, useState} from 'react'
import { useLocation } from 'react-router-dom';
import OpusBox from './OpusBox';
import './OpusTable.css'

function OpusTable() {
    const [backData, setBackData] = useState([{}]);
    const [description, setDescription] = useState('');
    const apiUrl = process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_BASE_URL
    : process.env.REACT_APP_LOCAL_API_BASE_URL;


    const location = useLocation();
    const decodedPath = decodeURIComponent(location.pathname || '');
    const pathParts = decodedPath.split('/')
    const composerName = pathParts[pathParts.length - 1]
  
    useEffect ( () => {
      fetch(`${apiUrl}/composer/?name=${composerName}`).then(
        response => response.json()).then(
          data => {setBackData(data)}
        )

        fetch(`${apiUrl}/searchwikicomposer/?composer=${composerName}`)
        .then(response => response.json())
        .then(data => { setDescription(data.summary); });
    }, [composerName, apiUrl])

  
    return (
        <div>
          <div className='description'>
            <h3>{composerName}</h3>
            <p>{description}</p>
          </div>
          


        {
        (typeof backData.Opus === 'undefined') ? (
            <p>No Opus found for this composer</p>
        ) : (

            (backData.Opus.length === 0) ? (
              <p> No work found for this composer on registered musical forms </p>
            ) : (
              backData.Opus.map((composer, i) => (
                <OpusBox key={i} opus={composer} index={i}/>
                ))
            )
              

        )
        }

      </div>
    )
}

export default OpusTable