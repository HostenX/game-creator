import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header/Header";
import NavBar from "../Components/NavBar/NavBar";
import PrimaryButton from "../Components/Buttons/PrimaryButton";
import InfoSection from "../Components/InfoSection/InfoSection";

const HomePage = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="home-page">
      <Header />
      <NavBar />
      <div className="button-container">
        <PrimaryButton onClick={handleRegisterClick}>Registrarse</PrimaryButton>
        <PrimaryButton onClick={handleLoginClick}>Iniciar Sesión</PrimaryButton>
      </div>
      <InfoSection
        id="about"
        title="Sobre Nosotros"
        content="Bienvenido a nuestra plataforma..."
      />
      <InfoSection
        id="features"
        title="Características"
        content="Ofrecemos una experiencia de aprendizaje..."
      />
      <InfoSection
        id="contact"
        title="Contacto"
        content="Para más información, contáctanos..."
      />
    </div>
  );
};

export default HomePage;
