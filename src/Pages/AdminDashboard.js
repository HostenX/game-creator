import React, { useState, useEffect } from 'react';
import { deleteUser, registerTeacher, registerAdmin, getTeachers, updateTeacher, updateAdmin, getAdmins, sendEmailReport } from '../Services/apiService';
import CryptoJS from 'crypto-js';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [teachers, setTeachers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [message, setMessage] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [showEmailInput, setShowEmailInput] = useState(false);
    const [recipientEmail, setRecipientEmail] = useState('');

    const [teacherData, setTeacherData] = useState({
        usuarioId: '',
        nombreUsuario: '',
        nombreCompleto: '',
        correoElectronico: '',
        contrasena: ''
    });

    const [adminData, setAdminData] = useState({
        usuarioId: '',
        nombreUsuario: '',
        nombreCompleto: '',
        correoElectronico: '',
        contrasena: ''
    });

    useEffect(() => {
        fetchTeachers();
        fetchAdmins();
    }, []);

    const fetchTeachers = async () => {
        try {
            const result = await getTeachers();
            // Extraer los datos del array $values
            if (result && result.$values) {
                setTeachers(result.$values);
            } else if (result && result.$id && result.$values) {
                // Manejar estructura anidada
                setTeachers(result.$values);
            } else {
                console.error('Formato de respuesta inesperado:', result);
                setTeachers([]);
            }
        } catch (error) {
            console.error('Error al obtener docentes:', error);
            setTeachers([]);
        }
    };

    const fetchAdmins = async () => {
        try {
            const result = await getAdmins();
            // Extraer los datos del array $values
            if (result && result.$values) {
                setAdmins(result.$values);
            } else if (result && result.$id && result.$values) {
                // Manejar estructura anidada
                setAdmins(result.$values);
            } else {
                console.error('Formato de respuesta inesperado:', result);
                setAdmins([]);
            }
        } catch (error) {
            console.error('Error al obtener administradores:', error);
            setAdmins([]);
        }
    };

    const handleDelete = async (id) => {
        try {
            const result = await deleteUser(id);
            setMessage(result.message || 'Usuario eliminado correctamente');
            fetchTeachers();
            fetchAdmins();
        } catch (error) {
            setMessage('Error al eliminar el usuario');
            console.error('Error al eliminar usuario:', error);
        }
    };

    const handleEditTeacher = (teacher) => {
        setSelectedTeacher(teacher);
        setTeacherData({
            usuarioId: teacher.usuarioId,
            nombreUsuario: teacher.nombreUsuario,
            nombreCompleto: teacher.nombreCompleto,
            correoElectronico: teacher.correoElectronico,
            contrasena: ''
        });
    };

    const handleEditAdmin = (admin) => {
        setSelectedAdmin(admin);
        setAdminData({
            usuarioId: admin.usuarioId,
            nombreUsuario: admin.nombreUsuario,
            nombreCompleto: admin.nombreCompleto,
            correoElectronico: admin.correoElectronico,
            contrasena: ''
        });
    };

    const handleUpdateTeacher = async (e) => {
        e.preventDefault();
        try {
            const hashedPassword = teacherData.contrasena 
                ? CryptoJS.SHA256(teacherData.contrasena).toString() 
                : undefined;
            
            const updatedData = { 
                ...teacherData, 
                contrasena: hashedPassword,
                rolId: 2 // Asegurar que se mantiene el rol de profesor
            };
            
            // Si la contraseña está vacía, no la enviar en la actualización
            if (!teacherData.contrasena) {
                delete updatedData.contrasena;
            }
            
            const result = await updateTeacher(selectedTeacher.usuarioId, updatedData);
            setMessage(result.message || 'Docente actualizado correctamente');
            setSelectedTeacher(null);
            setTeacherData({ usuarioId: '', nombreUsuario: '', nombreCompleto: '', correoElectronico: '', contrasena: '' });
            fetchTeachers();
        } catch (error) {
            setMessage('Error al actualizar el docente');
            console.error('Error al actualizar docente:', error);
        }
    };

    const handleUpdateAdmin = async (e) => {
        e.preventDefault();
        try {
            const hashedPassword = adminData.contrasena 
                ? CryptoJS.SHA256(adminData.contrasena).toString() 
                : undefined;
            
            const updatedData = { 
                ...adminData, 
                contrasena: hashedPassword,
                rolId: 1 // Asegurar que se mantiene el rol de administrador
            };
            
            // Si la contraseña está vacía, no la enviar en la actualización
            if (!adminData.contrasena) {
                delete updatedData.contrasena;
            }
            
            const result = await updateAdmin(selectedAdmin.usuarioId, updatedData);
            setMessage(result.message || 'Administrador actualizado correctamente');
            setSelectedAdmin(null);
            setAdminData({ usuarioId: '', nombreUsuario: '', nombreCompleto: '', correoElectronico: '', contrasena: '' });
            fetchAdmins();
        } catch (error) {
            setMessage('Error al actualizar el administrador');
            console.error('Error al actualizar administrador:', error);
        }
    };

    const handleRegisterTeacher = async (e) => {
        e.preventDefault();
        try {
            const hashedPassword = CryptoJS.SHA256(teacherData.contrasena).toString();
            const newTeacher = { 
                ...teacherData, 
                contrasena: hashedPassword,
                rolId: 2, // Rol de profesor
                curso: "N/A" // Campo requerido según el modelo
            };
            
            const result = await registerTeacher(newTeacher);
            setMessage(result.message || 'Docente registrado correctamente');
            setTeacherData({ usuarioId: '', nombreUsuario: '', nombreCompleto: '', correoElectronico: '', contrasena: '' });
            fetchTeachers();
        } catch (error) {
            setMessage('Error al registrar el docente');
            console.error('Error al registrar docente:', error);
        }
    };

    const handleRegisterAdmin = async (e) => {
        e.preventDefault();
        try {
            const hashedPassword = CryptoJS.SHA256(adminData.contrasena).toString();
            const newAdmin = { 
                ...adminData, 
                contrasena: hashedPassword,
                rolId: 1, // Rol de administrador
                curso: "N/A" // Campo requerido según el modelo
            };
            
            const result = await registerAdmin(newAdmin);
            setMessage(result.message || 'Administrador registrado correctamente');
            setAdminData({ usuarioId: '', nombreUsuario: '', nombreCompleto: '', correoElectronico: '', contrasena: '' });
            fetchAdmins();
        } catch (error) {
            setMessage('Error al registrar el administrador');
            console.error('Error al registrar administrador:', error);
        }
    };

    const handleSendReport = async () => {
        if (!recipientEmail) {
            setMessage('Por favor, introduce un correo electrónico.');
            return;
        }
        try {
            const result = await sendEmailReport(recipientEmail);
            setMessage(result.message || 'Informe enviado correctamente.');
            setRecipientEmail('');
            setShowEmailInput(false);
        } catch (error) {
            setMessage('Error al enviar el informe.');
            console.error('Error al enviar informe:', error);
        }
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
                    disabled={selectedTeacher}
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
                    type="email"
                    id="teacher-email-input"
                    value={teacherData.correoElectronico}
                    onChange={(e) => setTeacherData({ ...teacherData, correoElectronico: e.target.value })}
                    placeholder="Correo Electrónico"
                    required
                />
                <input
                    type="password"
                    id="teacher-password-input"
                    value={teacherData.contrasena}
                    onChange={(e) => setTeacherData({ ...teacherData, contrasena: e.target.value })}
                    placeholder={selectedTeacher ? "Dejar en blanco para mantener actual" : "Contraseña"}
                    required={!selectedTeacher}
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
                        <th>Correo Electrónico</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {teachers && teachers.length > 0 ? (
                        teachers.map(teacher => (
                            <tr key={teacher.$id || teacher.usuarioId}>
                                <td>{teacher.usuarioId}</td>
                                <td>{teacher.nombreUsuario}</td>
                                <td>{teacher.nombreCompleto}</td>
                                <td>{teacher.correoElectronico}</td>
                                <td>
                                    <button id={`edit-teacher-${teacher.usuarioId}`} onClick={() => handleEditTeacher(teacher)}>Editar</button>
                                    <button id={`delete-teacher-${teacher.usuarioId}`} onClick={() => handleDelete(teacher.usuarioId)}>Eliminar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No hay docentes registrados</td>
                        </tr>
                    )}
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
                    disabled={selectedAdmin}
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
                    type="email"
                    id="admin-email-input"
                    value={adminData.correoElectronico}
                    onChange={(e) => setAdminData({ ...adminData, correoElectronico: e.target.value })}
                    placeholder="Correo Electrónico"
                    required
                />
                <input
                    type="password"
                    id="admin-password-input"
                    value={adminData.contrasena}
                    onChange={(e) => setAdminData({ ...adminData, contrasena: e.target.value })}
                    placeholder={selectedAdmin ? "Dejar en blanco para mantener actual" : "Contraseña"}
                    required={!selectedAdmin}
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
                        <th>Correo Electrónico</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {admins && admins.length > 0 ? (
                        admins.map(admin => (
                            <tr key={admin.$id || admin.usuarioId}>
                                <td>{admin.usuarioId}</td>
                                <td>{admin.nombreUsuario}</td>
                                <td>{admin.nombreCompleto}</td>
                                <td>{admin.correoElectronico}</td>
                                <td>
                                    <button id={`edit-admin-${admin.usuarioId}`} onClick={() => handleEditAdmin(admin)}>Editar</button>
                                    <button id={`delete-admin-${admin.usuarioId}`} onClick={() => handleDelete(admin.usuarioId)}>Eliminar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No hay administradores registrados</td>
                        </tr>
                    )}
                </tbody>
            </table>
            
            <button id="send-report-button" onClick={() => setShowEmailInput(!showEmailInput)}>
                Enviar informe de usuarios
            </button>

            {showEmailInput && (
                <div id="email-report-container">
                    <input
                        type="email"
                        id="recipient-email-input"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        placeholder="Correo destinatario"
                        required
                    />
                    <button id="send-email-button" onClick={handleSendReport}>Enviar Informe</button>
                    <button id="cancel-email-button" onClick={() => setShowEmailInput(false)}>Cancelar</button>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;