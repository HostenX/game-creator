import React, { useState } from "react";
import apiService from "../Services/apiService";
import { Modal, Button, Form } from "react-bootstrap";

const ExportModal = ({ show, handleClose }) => {
  const [tipoArchivo, setTipoArchivo] = useState("excel");
  const [usuarioId, setUsuarioId] = useState("");
  const [minijuegoId, setMinijuegoId] = useState("");

  const handleExport = async () => {
    try {
      const response = await apiService.exportarResultados(
        tipoArchivo,
        usuarioId,
        minijuegoId
      );
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download =
        tipoArchivo === "excel" ? "Resultados.xlsx" : "Resultados.pdf";
      link.click();
      handleClose();
    } catch (error) {
      console.error("Error al exportar:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Exportar Resultados</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Tipo de Archivo</Form.Label>
            <Form.Control
              as="select"
              value={tipoArchivo}
              onChange={(e) => setTipoArchivo(e.target.value)}
            >
              <option value="excel">Excel</option>
              <option value="pdf">PDF</option>
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>ID de Usuario (Opcional)</Form.Label>
            <Form.Control
              type="number"
              value={usuarioId}
              onChange={(e) => setUsuarioId(e.target.value)}
              placeholder="Ingrese el ID del usuario"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>ID de Minijuego (Opcional)</Form.Label>
            <Form.Control
              type="number"
              value={minijuegoId}
              onChange={(e) => setMinijuegoId(e.target.value)}
              placeholder="Ingrese el ID del minijuego"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleExport}>
          Exportar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExportModal;
