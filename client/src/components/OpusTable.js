import React, {useEffect, useState} from 'react'
import { useLocation, Link } from 'react-router-dom';
import OpusBox from './OpusBox';
import './OpusTable.css'

function OpusTable() {
    const [backData, setBackData] = useState([{}]);
    const [description, setDescription] = useState('');
    const [wikiUrl, setWikiUrl] = useState('');
    const [topForms, setTopForms] = useState([]);
    const apiUrl = process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_BASE_URL
    : process.env.REACT_APP_LOCAL_API_BASE_URL;

    const location = useLocation();
    const decodedPath = decodeURIComponent(location.pathname || '');
    const pathParts = decodedPath.split('/')
    const composerName = pathParts[pathParts.length - 1]
  
    useEffect(() => {
      fetch(`${apiUrl}/opus?composer=${composerName}`).then(
        response => response.json()).then(
          data => {
            setBackData(data);
            setTopForms(data.TopForms || []);
          }
        )

      fetch(`${apiUrl}/wiki/composer?composer=${composerName}`)
        .then(response => response.json())
        .then(data => { 
            setDescription(data.summary);
            setWikiUrl(data.url);
        });
    }, [composerName, apiUrl])

    return (
        <div>
          <div className='description'>
            <h3>{composerName}</h3>
            <p>{description}</p>
            {wikiUrl && (
                <p className="wiki-link">
                    <a href={wikiUrl} target="_blank" rel="noopener noreferrer">
                        See more →
                    </a>
                </p>
            )}
            
            {topForms.length > 0 && (
                <div className="top-forms">
                    <h3>Most Popular Forms</h3>
                    <div className="forms-list">
                        {topForms.map((form, index) => (
                            <div key={form} className="top-form-item">
                                <span className="form-rank">{index + 1}</span>
                                <Link 
                                    to={`/form/${encodeURIComponent(form)}`}
                                    className="form-name"
                                >
                                    {form}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}
          </div>

          {(typeof backData.Opus === 'undefined') ? (
            <p>No Opus found for this composer</p>
          ) : (
            (backData.Opus.length === 0) ? (
              <p>No work found for this composer on registered musical forms</p>
            ) : (
              backData.Opus.map((composer, i) => (
                <OpusBox key={i} opus={composer} index={i}/>
              ))
            )
          )}
        </div>
    )
}

export default OpusTable