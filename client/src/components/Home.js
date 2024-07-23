import React from 'react'
import Changelog from './Changelog';
import './Home.css'

const Home = () => {
  return (
    <div className='home-div'>
      <div style={{textAlign: 'center', padding:'1rem'}}>
      <h1>Welcome to <b>Music Pearls</b></h1>
      <p>Your guide to discovering classical music</p>
      <p>Use the navigation bar above to explore:</p>
      <ul style={{ listStyleType: 'none', padding:0 }}>
        <li><b>Composers</b> - View rankings of their most famous works</li>
        <li><b>Musical Forms</b> - Discover top works by musical form</li>
      </ul>
      <p>Refer to the <a href="/about">About</a> page for detailed documentation</p>
      </div>
      <div style={{ marginTop: '2rem' }}>
      <Changelog />
      </div>
    </div>
  );
};

export default Home