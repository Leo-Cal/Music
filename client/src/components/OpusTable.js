import React, {useEffect, useState} from 'react'
import { useLocation } from 'react-router-dom';
import OpusBox from './OpusBox';

function OpusTable() {
    const [backData, setBackData] = useState([{}]);

    const location = useLocation();
    const decodedPath = decodeURIComponent(location.pathname || '');
    const pathParts = decodedPath.split('/')
    const composerName = pathParts[pathParts.length - 1]
  
    useEffect ( () => {
      fetch(`http://localhost:8888/composer/?name=${composerName}`).then(
        response => response.json()).then(
          data => {setBackData(data)}
        )
    }, [composerName])

    console.log(backData)
  
    return (
        <div>
            <p><b>{composerName}</b> Opus Table</p>

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