import React from 'react';
import './NavBar.css';

const NavBar = () => {
    return (
        <nav className="nav-bar">
            <ul>
                <li><a href="#about">Sobre Nosotros</a></li>
                <li><a href="#features">Características</a></li>
                <li><a href="#contact">Contacto</a></li>
            </ul>
        </nav>
    );
};

export default NavBar;
