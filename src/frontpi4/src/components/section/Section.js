import React from 'react';
import './Section.css';

function Section({ title, buttonLabel, onButtonClick, children }) {
  return (
    <section className="section">
      <div className="section-header">
        <h2>{title}</h2>
        {buttonLabel && <button className="add-button" onClick={onButtonClick}>{buttonLabel}</button>}
      </div>
      <div className="content-area">
        {children}
      </div>
    </section>
  );
}

export default Section;
