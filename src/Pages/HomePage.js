import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header/Header";
import NavBar from "../Components/NavBar/NavBar";
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
      <NavBar id="nav-bar" />
      <div className="button-container" id="button-container">
        <PrimaryButton id="register-button" onClick={handleRegisterClick}>Registrarse</PrimaryButton>
        <PrimaryButton id="login-button" onClick={handleLoginClick}>Iniciar Sesión</PrimaryButton>
      </div>
      
      <InfoSection
        id="about-section"
        title="Sobre Nosotros"
        content="Bienvenido a nuestra plataforma de gamificación en inglés, donde aprender es divertido y desafiante. Explora minijuegos, interactúa con NPCs y mejora tus habilidades lingüísticas mientras juegas."
      />
      
      <InfoSection
        id="how-it-works-section"
        title="¿Cómo Funciona?"
        content="Usa las flechas para moverte, presiona Z para interactuar con NPCs o minijuegos y resuelve desafíos como completar frases y conectar preguntas con respuestas. ¡Aprender nunca fue tan emocionante!"
      />
      
      <InfoSection
        id="editor-section"
        title="Editor de Minijuegos"
        content="Los docentes pueden crear y personalizar minijuegos educativos para desafiar a sus estudiantes y reforzar el aprendizaje del inglés de manera interactiva."
      />
      
      <InfoSection
        id="features-section"
        title="Ejemplos de Minijuegos"
        content="Explora actividades como 'Completa la frase', 'Conecta la pregunta con la respuesta' y muchos más, diseñados para mejorar la gramática y comprensión del inglés."
      />
      
      <InfoSection
        id="benefits-section"
        title="Beneficios"
        content="Aprende inglés de forma interactiva, mejora tu comprensión gramatical, gana recompensas por tu progreso y diviértete mientras refuerzas tus habilidades lingüísticas."
      />
      
      <InfoSection
        id="contact-section"
        title="Contacto"
        content="Para más información, contáctanos y únete a nuestra comunidad de aprendizaje."
      />
    </div>
  );
};

export default HomePage;
