import { useEffect, useState } from "react";

const API_URL = "/api/pacientes";
const emptyForm = { nombre: "", apellido: "" };

function App() {
  const [pacientes, setPacientes] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const cargarPacientes = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("No se pudo obtener la lista de pacientes");
      }

      const data = await response.json();
      setPacientes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPacientes();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const limpiarFormulario = () => {
    setForm(emptyForm);
    setEditId(null);
  };

  const guardarPaciente = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    const method = editId ? "PUT" : "POST";
    const url = editId ? `${API_URL}/${editId}` : API_URL;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        throw new Error("No se pudo guardar el paciente");
      }

      limpiarFormulario();
      await cargarPacientes();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const editarPaciente = (paciente) => {
    setEditId(paciente.id);
    setForm({
      nombre: paciente.nombre,
      apellido: paciente.apellido
    });
  };

  const eliminarPaciente = async (id) => {
    setError("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("No se pudo eliminar el paciente");
      }

      await cargarPacientes();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="page">
      <section className="header">
        <div>
          <p className="eyebrow">Innovatech Chile</p>
          <h1>Pacientes</h1>
        </div>
        <button className="secondary" type="button" onClick={cargarPacientes}>
          Actualizar
        </button>
      </section>

      <section className="layout">
        <form className="panel form" onSubmit={guardarPaciente}>
          <h2>{editId ? "Editar paciente" : "Nuevo paciente"}</h2>

          <label>
            Nombre
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              maxLength="100"
              placeholder="Ej: Ana"
            />
          </label>

          <label>
            Apellido
            <input
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              required
              maxLength="100"
              placeholder="Ej: Lopez"
            />
          </label>

          <div className="actions">
            <button type="submit" disabled={saving}>
              {saving ? "Guardando" : editId ? "Guardar" : "Crear"}
            </button>
            {editId && (
              <button className="secondary" type="button" onClick={limpiarFormulario}>
                Cancelar
              </button>
            )}
          </div>
        </form>

        <section className="panel table-panel">
          <div className="table-header">
            <h2>Listado</h2>
            <span>{pacientes.length} registros</span>
          </div>

          {error && <p className="error">{error}</p>}

          {loading ? (
            <p className="empty">Cargando pacientes</p>
          ) : pacientes.length === 0 ? (
            <p className="empty">Sin pacientes registrados</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pacientes.map((paciente) => (
                    <tr key={paciente.id}>
                      <td>{paciente.id}</td>
                      <td>{paciente.nombre}</td>
                      <td>{paciente.apellido}</td>
                      <td>
                        <div className="row-actions">
                          <button className="secondary" type="button" onClick={() => editarPaciente(paciente)}>
                            Editar
                          </button>
                          <button className="danger" type="button" onClick={() => eliminarPaciente(paciente.id)}>
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default App;
