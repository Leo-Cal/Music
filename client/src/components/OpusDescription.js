import React, { useEffect, useState } from 'react'

function OpusDescription( {composer, opus} ) {

    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    useEffect ( () => {
        const fetchDescription = async () => {
            try {
                const queryParams = new URLSearchParams({
                    opus: opus,
                    composer: composer
                });
                const response = await fetch(`http://localhost:8888/searchwiki?${queryParams}`);
                const data = await response.json();
                setDescription(data.summary);
                setError('');
            } catch (err) {
                setError('Summary info not fetched');
                setDescription('');
            }
        }
        fetchDescription();
    }, [composer, opus]);

    return (
    <div>
       {error && <p>{error}</p>}
       {description ? <p>{description}</p> : <p>Loading...</p>}
    </div>
    )
    }

export default OpusDescription