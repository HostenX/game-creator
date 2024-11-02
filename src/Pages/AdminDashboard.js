import React, { useState } from 'react';
import { deleteUser, registerTeacher, registerAdmin } from '../Services/apiService';

const AdminDashboard = () => {
    const [userId, setUserId] = useState(''); // Estado para almacenar el ID del usuario a eliminar
    const [message, setMessage] = useState(''); // Estado para mostrar mensajes

    // Estados para los formularios de registro
    const [teacherData, setTeacherData] = useState({
        UsuarioId: '', // Cambiado a UsuarioId
        nombreUsuario: '',
        nombreCompleto: '',
        contrasena: ''
    });

    const [adminData, setAdminData] = useState({
        UsuarioId: '', // Cambiado a UsuarioId
        nombreUsuario: '',
        nombreCompleto: '',
        contrasena: ''
    });

    // Manejar la eliminación de un usuario
    const handleDelete = async () => {
        if (!userId) {
            setMessage('Por favor, ingresa un ID de usuario.');
            return;
        }

        const result = await deleteUser(userId);
        if (result.success) {
            setMessage('Usuario eliminado con éxito');
        } else {
            setMessage(result.message || 'Error al eliminar el usuario');
        }

        // Limpiar el campo de ID después de intentar eliminar
        setUserId('');
    };

    // Manejar el registro de un docente
    const handleRegisterTeacher = async (e) => {
        e.preventDefault(); // Evitar el comportamiento por defecto del formulario
        const result = await registerTeacher(teacherData);
        setMessage(result.message || 'Error al registrar el docente');

        // Limpiar el formulario después de registrar
        setTeacherData({ UsuarioId: '', nombreUsuario: '', nombreCompleto: '', contrasena: '' });
    };

    // Manejar el registro de un administrador
    const handleRegisterAdmin = async (e) => {
        e.preventDefault(); // Evitar el comportamiento por defecto del formulario
        const result = await registerAdmin(adminData);
        setMessage(result.message || 'Error al registrar el administrador');

        // Limpiar el formulario después de registrar
        setAdminData({ UsuarioId: '', nombreUsuario: '', nombreCompleto: '', contrasena: '' });
    };

    return (
        <div>
            <h2>Gestión de Usuarios</h2>

            <div>
                <h3>Eliminar Usuario</h3>
                <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)} // Actualiza el estado del ID del usuario
                    placeholder="Ingresa el ID del usuario a eliminar"
                />
                <button onClick={handleDelete}>Eliminar Usuario</button>
            </div>

            {message && <p>{message}</p>} {/* Mostrar mensajes al usuario */}

            <div>
                <h3>Registrar Docente</h3>
                <form onSubmit={handleRegisterTeacher}>
                    <input
                        type="text"
                        value={teacherData.UsuarioId}
                        onChange={(e) => setTeacherData({ ...teacherData, UsuarioId: e.target.value })}
                        placeholder="Cédula"
                        required
                    />
                    <input
                        type="text"
                        value={teacherData.nombreUsuario}
                        onChange={(e) => setTeacherData({ ...teacherData, nombreUsuario: e.target.value })}
                        placeholder="Nombre de Usuario"
                        required
                    />
                    <input
                        type="text"
                        value={teacherData.nombreCompleto}
                        onChange={(e) => setTeacherData({ ...teacherData, nombreCompleto: e.target.value })}
                        placeholder="Nombre Completo"
                        required
                    />
                    <input
                        type="password"
                        value={teacherData.contrasena}
                        onChange={(e) => setTeacherData({ ...teacherData, contrasena: e.target.value })}
                        placeholder="Contraseña"
                        required
                    />
                    <button type="submit">Registrar Docente</button>
                </form>
            </div>

            <div>
                <h3>Registrar Administrador</h3>
                <form onSubmit={handleRegisterAdmin}>
                    <input
                        type="text"
                        value={adminData.UsuarioId}
                        onChange={(e) => setAdminData({ ...adminData, UsuarioId: e.target.value })}
                        placeholder="Cédula"
                        required
                    />
                    <input
                        type="text"
                        value={adminData.nombreUsuario}
                        onChange={(e) => setAdminData({ ...adminData, nombreUsuario: e.target.value })}
                        placeholder="Nombre de Usuario"
                        required
                    />
                    <input
                        type="text"
                        value={adminData.nombreCompleto}
                        onChange={(e) => setAdminData({ ...adminData, nombreCompleto: e.target.value })}
                        placeholder="Nombre Completo"
                        required
                    />
                    <input
                        type="password"
                        value={adminData.contrasena}
                        onChange={(e) => setAdminData({ ...adminData, contrasena: e.target.value })}
                        placeholder="Contraseña"
                        required
                    />
                    <button type="submit">Registrar Administrador</button>
                </form>
            </div>
        </div>
    );
};

export default AdminDashboard;
