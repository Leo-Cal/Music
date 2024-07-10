import React, { useState } from 'react'
import './OpusBox.css'
import { getOrdinal } from '../utils/getOrdinal';

function OpusBox( { opus, index } ) {

    const [expanded, setExpanded] = useState(false);
    const toggleExpand = () => {
        setExpanded(!expanded);
    }

    const getMedalImage = (rank) => {
        if (rank === 1) {
          return '/gold.png'; // Path to gold medal image
        } else if (rank === 2) {
          return '/silver.png'; // Path to silver medal image
        } else if (rank === 3) {
          return '/bronze.png'; // Path to bronze medal image
        }
        return null;
      };
      const medalImage = getMedalImage(index + 1);

  return (
    <div className={`opus-box ${expanded ? 'expanded' : ''}`}>
        <p>
            <b>{getOrdinal(index + 1)} Place</b> 
            {medalImage && <img src={medalImage} alt={`${getOrdinal(index+1)} Medal`} className="medal-image" />}
            <br />
            <b>Name</b>: {opus.opusName}<br />
            <b>Composer</b>: {opus.composer} <br />
            <b>Popularity</b>: {Number(opus.formPopularity).toFixed(2)}<br />
            <b>Recordings</b>: {opus.recordingCount}
        </p>
        {expanded && (
        <div>
            {/* Additional information goes here */}
            <p><b>Year</b>: {opus.year}</p>
            <p><b>Genre</b>: {opus.genre}</p>
            {/* Add more fields as needed */}
        </div>
        )}
        <button onClick={toggleExpand}>
            {expanded ? 'Collapse' : 'Show more'}
        </button>
    </div>
  );
};

export default OpusBox