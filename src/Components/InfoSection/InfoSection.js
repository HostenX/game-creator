import React from 'react';
import './InfoSection.css';

const InfoSection = ({ id, title, content }) => {
    return (
        <section id={id}>
            <h2>{title}</h2>
            <p>{content}</p>
        </section>
    );
};

export default InfoSection;
