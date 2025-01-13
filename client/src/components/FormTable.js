import React, { useState, useEffect } from 'react'
import { Link, Route, Routes } from 'react-router-dom';
import OpusTable from './OpusTable';
import './FormTable.css'

function FormTable() {
    const [backData, setBackData] = useState({ Forms: [] });
    const [searchTerm, setSearchTerm] = useState('');
    
    const apiUrl = process.env.NODE_ENV === 'production'
      ? process.env.REACT_APP_API_BASE_URL
      : process.env.REACT_APP_LOCAL_API_BASE_URL;

    useEffect(() => {
      fetch(`${apiUrl}/form`)
        .then(response => response.json())
        .then(data => { setBackData(data) })
        .catch(error => console.error('Error fetching forms:', error));
    }, [apiUrl]);

    const FORM_CATEGORIES = {
      "Orchestral Works": { color: '#B4A595' },
      "Concertos": { color: '#AC9D8D' },
      "Chamber Music": { color: '#A49585' },
      "Sonatas": { color: '#9C8D7D' },
      "Sacred & Vocal": { color: '#948575' },
      "Piano Character Pieces": { color: '#8C7D6D' },
      "Dance Forms": { color: '#847565' },
      "Other Forms": { color: '#7C6D5D' }
    };

    if (!backData || !backData.Forms) {
      return <p>Loading musical forms...</p>;
    }

    // Group forms by their category, maintaining server's popularity order
    const groupedForms = backData.Forms.reduce((acc, form) => {
      if (form.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        const category = form.category;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(form);
      }
      return acc;
    }, {});

    return (
      <div className='forms-container'>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search musical forms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {Object.entries(FORM_CATEGORIES).map(([category, { color }]) => {
          if (!groupedForms[category] || groupedForms[category].length === 0) return null;

          return (
            <div key={category} className="category-section">
              <h2 className="category-header" style={{ backgroundColor: color }}>
                <div>{category}</div>
              </h2>
              <div className="forms-grid">
                {groupedForms[category].map((form, i) => (
                  <Link 
                    to={`/form/${encodeURIComponent(form.name)}`}
                    key={i}
                    className="form-card"
                    style={{ borderColor: color }}
                  >
                    <div className="form-info">
                      <h3>{form.name}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}

        <Routes>
          <Route path={'/form/:formname'} element={<OpusTable/>} />
        </Routes>
      </div>
    )
}

export default FormTable