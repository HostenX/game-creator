import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await axios.post('https://tu-api-url.com/login', {
        usuario,
        password,
      });

      setMessage('Login exitoso');
      localStorage.setItem('token', response.data.token);
    } catch (err) {
      setError('Credenciales incorrectas o error en la conexión');
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
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}
      </form>
    </div>
  );
}

export default App;
