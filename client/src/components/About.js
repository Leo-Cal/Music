import React from 'react'
import './About.css'

function About() {
    return (
        <div className="about-container">
          <section className="about-section">
            <h2>About</h2>
            <p>
            Music Pearls is a free app designed to help you explore the world of classical music. Whether you're a seasoned fan or just starting out, 
            we offer easy-to-understand info about classical music works and artists. Our unique approach looks at the popularity of whole pieces, not just individual movements, 
            so you get a complete picture of each composition.
            </p>
          </section>
    
          <section className="about-section">
            <h2>Disclaimers</h2>
            <h4>Music Pearls strives for accuracy but is not flawless</h4>
            <ul>
                <li><strong>Categorization:</strong> We use extensive regular expression functions and AI categorization to parse and classify over a million music tracks 
                into their respective musical forms based on their titles. 
                While this method is robust, errors can occur, and some works with non-standard titles, especially those of modern composers, may be left out.
                </li>
                <li><strong>Descriptions:</strong> We use the Wikipedia API to generate descriptions for each displayed work. Despite our best efforts to ensure accuracy, 
                some descriptions may not perfectly match the intended works.</li>
            </ul>
          </section>
    
          <section className="about-section">
            <h2>Methodology</h2>
            Starting with raw track data from Spotify, we apply a three-step process to produce the results shown on our pages: grouping, normalizing, and filtering.
            <ul>
                    <li><strong>Grouping: </strong> This step combines tracks that represent the same work (e.g., the multiple movements of a symphony or sonata). 
                    For example, the four movements of a symphony are grouped into a single entry representing the entire symphony, 
                    with the average popularity of all movements considered.</li>
                    <li><strong>Normalizing: </strong>This step refines the 'Popularity' data to make it more descriptive. Initially, each track has a 'popularity' 
                    score from 0 to 100, assigned by Spotify based on the number of plays and the recency of those plays. 
                    After grouping, each work receives a 'Popularity' score based on the average popularity of its constituent tracks. 
                    Within each musical form or composer, we normalize these scores from 0 to 100 (100 being the most popular and 0 the least) 
                    based on the number of recordings each work has. Works with high popularity but few recordings are penalized in this process.</li>
                    <li><strong>Filtering: </strong>We aim to display only relevant works in our generated lists. For each criterion, we strive to show at least 10 entries, 
                    selecting works with more than 50 recordings. If fewer than 10 entries meet the criteria, we include those with the highest number of recordings 
                    until we reach 10 entries.</li>
            </ul>
          </section>
    
          <section className="about-section">
            <h2>Contact Us</h2>
            <p>
              Have questions or want to learn more about our services? Feel free to reach out to us at
              <a href="mailto:contact@ourcompany.com"> contact@ourcompany.com</a>.
            </p>
          </section>
        </div>
      );
}

export default About