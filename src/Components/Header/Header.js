import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    
    // Efecto para detectar el scroll y cambiar la apariencia del header
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        
        // Limpieza del event listener
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    
    return (
        <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
            <div className="header-content">
                <div className="logo-container">
                    {/* Puedes agregar un logo aquí */}
                    <h1>EnglishQuest</h1>
                    <span className="tagline">Tu aventura de aprendizaje en un mundo interactivo</span>
                </div>
                
                <nav className="header-nav">
                    <ul>
                        <li><Link to="/">Inicio</Link></li>
                        <li><Link to="/login">Iniciar Sesion</Link></li>
                        <li><Link to="/register">Registrarse</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;