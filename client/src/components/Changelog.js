import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './Changelog.css';

const Changelog = () => {
  const [changelog, setChangelog] = useState('');

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/CHANGELOG.md')
      .then(response => response.text())
      .then(text => setChangelog(text));
  }, []);

  return (
    <div className="changelog">
      <h2>Versions</h2>
      <ReactMarkdown children={changelog} remarkPlugins={[remarkGfm]} />
    </div>
  );
};

export default Changelog;