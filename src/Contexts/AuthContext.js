// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Carga el usuario desde localStorage si está presente
        const savedUser = localStorage.getItem('user');
        console.log(savedUser);
        return savedUser ? JSON.parse(savedUser) : null;
    });

    useEffect(() => {
        // Guarda el usuario en localStorage cuando cambie
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
