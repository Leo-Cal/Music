import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import ComposerTable from './components/ComposerTable';
import Home from './components/Home'
import OpusTable  from './components/OpusTable';
import FormTable from './components/FormTable';
import FormRanking from './components/FormRanking';
import About from './components/About';

const App = () => {
  return (
    <Router>
      <div>

        <div class = "title-div">
          <div>
            <img src={process.env.PUBLIC_URL + '/alto-clef.png'} alt="logo" className='logo-image'/>
          </div>
          <div>
            <h1 class='title'>Music Pearls</h1>
            <h2 class="sub-header">The Classical Music Compendium</h2>
          </div>
        </div>

        {/* Navigation Bar */}
          <nav className='nav-bar'>
              <a href='/'>Home</a>
              <a href='/composers'>Composers</a>
              <a href='/form'>Musical Forms</a>
              <a href='/about'>About</a>
          </nav>


        {/* Route Components */}
        <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route path="/composers/*" element={<ComposerTable/>} />
          <Route path={'/composer/:name'} element={<OpusTable/>} />
          <Route path="/form/*" element={<FormTable/>} />
          <Route path={'/form/:name'} element={<FormRanking/>} />
          <Route exact path='/about' element={<About/>}/>
        </Routes>

      </div>
    </Router>
  )
}

export default App;