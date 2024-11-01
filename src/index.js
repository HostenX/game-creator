import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthProvider } from './Contexts/AuthContext'; // Asegúrate de importar el proveedor

ReactDOM.render(
    <React.StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
