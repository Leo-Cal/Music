import React, { useEffect, useState } from 'react'

function OpusDescription( {composer, opus} ) {

    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const apiUrl = process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_BASE_URL
    : process.env.REACT_APP_LOCAL_API_BASE_URL;


    useEffect ( () => {
        const fetchDescription = async () => {
            try {
                const queryParams = new URLSearchParams({
                    opus: opus,
                    composer: composer
                });
                const response = await fetch(`${apiUrl}/searchwikiopus?${queryParams}`);
                const data = await response.json();
                setDescription(data.summary);
                setError('');
            } catch (err) {
                setError('Summary info not fetched');
                setDescription('');
            }
        }
        fetchDescription();
    }, [composer, opus, apiUrl]);

    return (
    <div>
       {error && <p>{error}</p>}
       {description ? <p>{description}</p> : <p>Loading...</p>}
    </div>
    )
    }

export default OpusDescription