import React, { useState } from 'react'
import './OpusBox.css'
import { getOrdinal } from '../utils/getOrdinal';

function OpusBox( { opus, index } ) {

    const [expanded, setExpanded] = useState(false);
    const toggleExpand = () => {
        setExpanded(!expanded);
    }

    console.log(opus)

  return (
    <div className={`opus-box ${expanded ? 'expanded' : ''}`}>
        <p>
            <b>{getOrdinal(index + 1)} Place</b> <br />
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