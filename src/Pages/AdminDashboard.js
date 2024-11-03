import React, { useState, useEffect } from 'react';
import { deleteUser, registerTeacher, registerAdmin, getTeachers, updateTeacher, updateAdmin, getAdmins } from '../Services/apiService';
import CryptoJS from 'crypto-js';
import './Dashboard.css';

const AdminDashboard = () => {
    const [teachers, setTeachers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [message, setMessage] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [selectedAdmin, setSelectedAdmin] = useState(null);

    const [teacherData, setTeacherData] = useState({
        usuarioId: '',
        nombreUsuario: '',
        nombreCompleto: '',
        contrasena: ''
    });

    const [adminData, setAdminData] = useState({
        usuarioId: '',
        nombreUsuario: '',
        nombreCompleto: '',
        contrasena: ''
    });

    useEffect(() => {
        fetchTeachers();
        fetchAdmins();
    }, []);

    const fetchTeachers = async () => {
        const result = await getTeachers();
        setTeachers(result);
    };

    const fetchAdmins = async () => {
        const result = await getAdmins();
        setAdmins(result);
    };

    const handleDelete = async (id) => {
        const result = await deleteUser(id);
        setMessage(result.message || 'Error al eliminar el usuario');
        fetchTeachers();
        fetchAdmins();
    };

    const handleEditTeacher = (teacher) => {
        setSelectedTeacher(teacher);
        setTeacherData(teacher);
    };

    const handleEditAdmin = (admin) => {
        setSelectedAdmin(admin);
        setAdminData(admin);
    };

    const handleUpdateTeacher = async (e) => {
        e.preventDefault();
        const hashedPassword = CryptoJS.SHA256(teacherData.contrasena).toString();
        const updatedData = { ...teacherData, contrasena: hashedPassword };
        const result = await updateTeacher(selectedTeacher.usuarioId, updatedData);
        setMessage(result.message || 'Error al actualizar el docente');
        setSelectedTeacher(null);
        setTeacherData({ usuarioId: '', nombreUsuario: '', nombreCompleto: '', contrasena: '' });
        fetchTeachers();
    };

    const handleUpdateAdmin = async (e) => {
        e.preventDefault();
        const hashedPassword = CryptoJS.SHA256(adminData.contrasena).toString();
        const updatedData = { ...adminData, contrasena: hashedPassword };
        const result = await updateAdmin(selectedAdmin.usuarioId, updatedData);
        setMessage(result.message || 'Error al actualizar el administrador');
        setSelectedAdmin(null);
        setAdminData({ usuarioId: '', nombreUsuario: '', nombreCompleto: '', contrasena: '' });
        fetchAdmins();
    };

    const handleRegisterTeacher = async (e) => {
        e.preventDefault();
        const hashedPassword = CryptoJS.SHA256(teacherData.contrasena).toString();
        const result = await registerTeacher({ ...teacherData, contrasena: hashedPassword });
        setMessage(result.message || 'Error al registrar el docente');
        setTeacherData({ usuarioId: '', nombreUsuario: '', nombreCompleto: '', contrasena: '' });
        fetchTeachers();
    };

    const handleRegisterAdmin = async (e) => {
        e.preventDefault();
        const hashedPassword = CryptoJS.SHA256(adminData.contrasena).toString();
        const result = await registerAdmin({ ...adminData, contrasena: hashedPassword });
        setMessage(result.message || 'Error al registrar el administrador');
        setAdminData({ usuarioId: '', nombreUsuario: '', nombreCompleto: '', contrasena: '' });
        fetchAdmins();
    };

    return (
        <div id="admin-dashboard-container">
            <h2 id="teacher-section-title">Gestión de Docentes</h2>

            {message && <p id="admin-dashboard-message">{message}</p>}

            <form id="teacher-form" onSubmit={selectedTeacher ? handleUpdateTeacher : handleRegisterTeacher}>
                <input
                    type="text"
                    id="teacher-id-input"
                    value={teacherData.usuarioId}
                    onChange={(e) => setTeacherData({ ...teacherData, usuarioId: e.target.value })}
                    placeholder="Cédula"
                    required
                />
                <input
                    type="text"
                    id="teacher-username-input"
                    value={teacherData.nombreUsuario}
                    onChange={(e) => setTeacherData({ ...teacherData, nombreUsuario: e.target.value })}
                    placeholder="Nombre de Usuario"
                    required
                />
                <input
                    type="text"
                    id="teacher-fullname-input"
                    value={teacherData.nombreCompleto}
                    onChange={(e) => setTeacherData({ ...teacherData, nombreCompleto: e.target.value })}
                    placeholder="Nombre Completo"
                    required
                />
                <input
                    type="password"
                    id="teacher-password-input"
                    value={teacherData.contrasena}
                    onChange={(e) => setTeacherData({ ...teacherData, contrasena: e.target.value })}
                    placeholder="Contraseña"
                    required
                />
                <button id="teacher-submit-button" type="submit">{selectedTeacher ? 'Actualizar Docente' : 'Registrar Docente'}</button>
                {selectedTeacher && <button id="teacher-cancel-button" onClick={() => setSelectedTeacher(null)}>Cancelar</button>}
            </form>

            <h3 id="teacher-list-title">Lista de Docentes Registrados</h3>
            <table id="teacher-table">
                <thead>
                    <tr>
                        <th>Cédula</th>
                        <th>Nombre de Usuario</th>
                        <th>Nombre Completo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {teachers.map(teacher => (
                        <tr key={teacher.usuarioId}>
                            <td>{teacher.usuarioId}</td>
                            <td>{teacher.nombreUsuario}</td>
                            <td>{teacher.nombreCompleto}</td>
                            <td>
                                <button id={`edit-teacher-${teacher.usuarioId}`} onClick={() => handleEditTeacher(teacher)}>Editar</button>
                                <button id={`delete-teacher-${teacher.usuarioId}`} onClick={() => handleDelete(teacher.usuarioId)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2 id="admin-section-title">Gestión de Administradores</h2>

            <form id="admin-form" onSubmit={selectedAdmin ? handleUpdateAdmin : handleRegisterAdmin}>
                <input
                    type="text"
                    id="admin-id-input"
                    value={adminData.usuarioId}
                    onChange={(e) => setAdminData({ ...adminData, usuarioId: e.target.value })}
                    placeholder="Cédula"
                    required
                />
                <input
                    type="text"
                    id="admin-username-input"
                    value={adminData.nombreUsuario}
                    onChange={(e) => setAdminData({ ...adminData, nombreUsuario: e.target.value })}
                    placeholder="Nombre de Usuario"
                    required
                />
                <input
                    type="text"
                    id="admin-fullname-input"
                    value={adminData.nombreCompleto}
                    onChange={(e) => setAdminData({ ...adminData, nombreCompleto: e.target.value })}
                    placeholder="Nombre Completo"
                    required
                />
                <input
                    type="password"
                    id="admin-password-input"
                    value={adminData.contrasena}
                    onChange={(e) => setAdminData({ ...adminData, contrasena: e.target.value })}
                    placeholder="Contraseña"
                    required
                />
                <button id="admin-submit-button" type="submit">{selectedAdmin ? 'Actualizar Administrador' : 'Registrar Administrador'}</button>
                {selectedAdmin && <button id="admin-cancel-button" onClick={() => setSelectedAdmin(null)}>Cancelar</button>}
            </form>

            <h3 id="admin-list-title">Lista de Administradores Registrados</h3>
            <table id="admin-table">
                <thead>
                    <tr>
                        <th>Cédula</th>
                        <th>Nombre de Usuario</th>
                        <th>Nombre Completo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {admins.map(admin => (
                        <tr key={admin.usuarioId}>
                            <td>{admin.usuarioId}</td>
                            <td>{admin.nombreUsuario}</td>
                            <td>{admin.nombreCompleto}</td>
                            <td>
                                <button id={`edit-admin-${admin.usuarioId}`} onClick={() => handleEditAdmin(admin)}>Editar</button>
                                <button id={`delete-admin-${admin.usuarioId}`} onClick={() => handleDelete(admin.usuarioId)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
