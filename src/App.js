import React, { useState } from "react";
import axios from "axios";

function App() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await axios.post(
        "https://localhost:7057/api/Usuario/login",
        {
          nombreUsuario: usuario, // Asegúrate de usar los mismos nombres de campos que en tu backend
          password,
        }
      );

      setMessage("Login exitoso");
      localStorage.setItem("token", response.data.token); // Puedes guardar el token en localStorage si usas JWT
    } catch (err) {
      setError("Credenciales incorrectas o error en la conexión");
    }
  };

  return (
    <div className="App">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre de Usuario</label>
          <input
            type="usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}
      </form>
    </div>
  );
}

export default App;
