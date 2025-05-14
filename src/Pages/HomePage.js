import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header/Header";
import PrimaryButton from "../Components/Buttons/PrimaryButton";
import InfoSection from "../Components/InfoSection/InfoSection";
import "./HomePage.css"; 

const HomePage = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="home-page" id="home-page">
      <Header id="header" />
      
      <div className="hero-section">
        <h1>Aprende inglés en un mundo virtual</h1>
        <p>Explora, interactúa y mejora tus habilidades de inglés a través de una experiencia gamificada única</p>
        <div className="button-container" id="button-container">
          <PrimaryButton id="register-button" onClick={handleRegisterClick}>Registrarse</PrimaryButton>
          <PrimaryButton id="login-button" onClick={handleLoginClick}>Iniciar Sesión</PrimaryButton>
        </div>
      </div>
      
      <div className="info-sections-container">
        <InfoSection
          id="about-section"
          title="Sobre Nosotros"
          content="Somos una plataforma educativa innovadora que transforma el aprendizaje del inglés mediante la gamificación. Hemos creado un mundo virtual donde cada interacción es una oportunidad para reforzar tus conocimientos lingüísticos de forma natural y divertida. Nuestro enfoque combina metodologías pedagógicas efectivas con elementos de juego que mantienen alta la motivación y el compromiso de los estudiantes."
        />
        
        <InfoSection
          id="how-it-works-section"
          title="¿Cómo Funciona?"
          content="Explora nuestro mundo virtual utilizando las flechas de tu teclado para moverte por diferentes escenarios educativos. Interactúa con personajes (NPCs) presionando la tecla Z para descubrir conversaciones, misiones y desafíos. Cada minijuego está diseñado para enfocarse en aspectos específicos del aprendizaje del inglés, desde vocabulario básico hasta estructuras gramaticales complejas, adaptándose progresivamente a tu nivel de competencia."
        />
        
        <InfoSection
          id="editor-section"
          title="Editor de Minijuegos para Docentes"
          content="Nuestra plataforma ofrece a los educadores un potente editor de contenido educativo que les permite diseñar experiencias de aprendizaje personalizadas. Crea actividades que refuercen exactamente lo que tus estudiantes necesitan practicar, establece niveles de dificultad adaptados a diferentes capacidades, y monitorea el progreso individual y grupal a través de nuestro panel de análisis."
        />
        
        <InfoSection
          id="features-section"
          title="Ejemplos de Minijuegos"
          content="Nuestra biblioteca incluye una variedad de actividades interactivas diseñadas por expertos en pedagogía lingüística: 'Completa la frase', donde debes seleccionar términos apropiados según el contexto; 'Conecta preguntas y respuestas', para practicar diálogos naturales"
        />
      </div>
    </div>
  );
};

export default HomePage;