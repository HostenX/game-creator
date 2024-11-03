import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header/Header";
import NavBar from "../Components/NavBar/NavBar";
import PrimaryButton from "../Components/Buttons/PrimaryButton";
import InfoSection from "../Components/InfoSection/InfoSection";
import "./HomePage.css"; // Asegúrate de importar el archivo de estilo

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
        content="Bienvenido a nuestra plataforma..."
      />
      <InfoSection
        id="features-section"
        title="Características"
        content="Ofrecemos una experiencia de aprendizaje..."
      />
      <InfoSection
        id="contact-section"
        title="Contacto"
        content="Para más información, contáctanos..."
      />
    </div>
  );
};

export default HomePage;
