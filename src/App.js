import './App.css';
import { useState, useEffect } from "react";
import Axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import noti from 'sweetalert2';

function App() {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState(0);
  const [pais, setPais] = useState("");
  const [cargo, setCargo] = useState("");
  const [años, setAños] = useState(0);
  const [id, setId] = useState(0);
  const [editar, setEditar] = useState(false);
  const [empleados_list, setEmpleados] = useState([]);

  // Configuración de SweetAlert2 con estilos de Bootstrap
  const swalWithBootstrapButtons = noti.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger"
    },
    buttonsStyling: false
  });

  // Función para agregar un nuevo empleado
  const add = () => {
    Axios.post("http://localhost:3001/create", {
      nombre: nombre,
      edad: edad,
      pais: pais,
      cargo: cargo,
      años: años
    }).then(() => {
      getEmpleados();
      cancelar();
      // Muestra una notificación de éxito
      noti.fire({
        position: "top-end",
        title: "<strong>Registro Exitoso</strong>",
        html: `<i>El empleado: <strong>${nombre}</strong> ha sido guardado con éxito!!</i>`,
        showConfirmButton: false,
        icon: "success",
        timer: 3000
      });
    });
  };

  // Función para actualizar un empleado existente
  const update = () => {
    Axios.put("http://localhost:3001/update", {
      id: id,
      nombre: nombre,
      edad: edad,
      pais: pais,
      cargo: cargo,
      años: años
    }).then(() => {
      getEmpleados();
      cancelar();
      // Muestra una notificación de éxito
      noti.fire({
        title: "<strong>Actualización Exitosa</strong>",
        html: "<i>El empleado fue actualizado con éxito</i>",
        icon: "success",
        timer: 3000
      });
    });
  };

  // Función para eliminar un empleado
  const eliminarEmplados = (id) => {
    Axios.delete(`http://localhost:3001/delete/${id}`)
      .then(() => {
        getEmpleados();
      });
  };

  // Función para manejar la eliminación de un empleado con confirmación
  const deleteEmpleado = (id) => {
    // Muestra una ventana de confirmación con SweetAlert2
    swalWithBootstrapButtons.fire({
      title: "¿Seguro Desea Eliminar?",
      text: "Después de este paso no se podrá revertir",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, Eliminar!",
      cancelButtonText: "No, Cancelar!",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // Elimina el empleado si la confirmación es positiva
        eliminarEmplados(id);
        // Muestra una notificación de éxito
        swalWithBootstrapButtons.fire({
          title: "Eliminado Con Éxito!",
          text: `Empleado Eliminado Con Éxito ${nombre}`,
          icon: "success"
        });
      } else if (result.dismiss === noti.DismissReason.cancel) {
        // Cancela la operación si el usuario hace clic en cancelar
        cancelar();
        // Muestra una notificación de cancelación
        swalWithBootstrapButtons.fire({
          title: "Cancelado",
          text: "Dato Asegurado :)",
          icon: "error"
        });
      }
    });
  };

  // Función para limpiar los campos y cancelar la edición
  const cancelar = () => {
    setEditar(false);
    setNombre("");
    setEdad("");
    setPais("");
    setCargo("");
    setAños("");
  };

  // Función para editar un empleado
  const editarEmpleado = (val) => {
    setEditar(true);
    setNombre(val.nombre);
    setEdad(val.edad);
    setCargo(val.cargo);
    setPais(val.pais);
    setAños(val.años);
    setId(val.id);
  };

  // Función para obtener la lista de empleados desde el servidor
  const getEmpleados = () => {
    Axios.get("http://localhost:3001/listar").then((response) => {
      setEmpleados(response.data);
    });
  };

  // Efecto para obtener la lista de empleados al cargar el componente
  useEffect(() => {
    getEmpleados();
  }, []);

  // Renderiza el componente
  return (
    <div className="container">
      <br></br>
      <div className="card text-bg-info card-info">
        <div className="card-header">
          <center><h2>Gestión Empleados</h2></center>
        </div>
        <div className="card-body">
          {/* Formulario para ingresar datos del empleado */}
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Nombre:</span>
            <input
              type="text"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              className="form-control"
              placeholder="Ingrese Un Nombre"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Edad:</span>
            <input
              type="number"
              value={edad}
              onChange={(event) => setEdad(event.target.value)}
              className="form-control"
              placeholder="Ingrese La Edad"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Pais:</span>
            <input
              type="text"
              value={pais}
              onChange={(event) => setPais(event.target.value)}
              className="form-control"
              placeholder="Ingrese El Pais"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Cargo:</span>
            <input
              type="text"
              value={cargo}
              onChange={(event) => setCargo(event.target.value)}
              className="form-control"
              placeholder="Ingrese El Cargo Del Empleado"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Años De Experiencia:</span>
            <input
              type="number"
              value={años}
              onChange={(event) => setAños(event.target.value)}
              className="form-control"
              placeholder="Ingrese Los Años De Trabajo En La Empresa"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
        </div>

        <div className="card-footer text-body-secondary">
          {/* Botones para realizar acciones (Registrar, Actualizar, Cancelar) */}
          {
            editar ?
              <div>
                <button className='btn btn-warning m-2' onClick={update}>Actualizar</button>
                <button className='btn btn-info m-2' onClick={cancelar}>Cancelar</button>
              </div>
              : <button className='btn btn-success' onClick={add}>Registrar</button>
          }
        </div>
      </div>

      {/* Tabla para mostrar la lista de empleados */}
      <table id='table' className="table table-primary table-striped table-hover">
        <thead>
          <tr>
            <th scope="col">id</th>
            <th scope="col">Nombre</th>
            <th scope="col">Edad</th>
            <th scope="col">Pais</th>
            <th scope="col">Cargo</th>
            <th scope="col">Experiencia</th>
            <th scope="col">ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {
            empleados_list.map((val, key) => {
              return <tr key={val.id}>
                <td>{val.id}</td>
                <td>{val.nombre}</td>
                <td>{val.edad}</td>
                <td>{val.pais}</td>
                <td>{val.cargo}</td>
                <td>{val.años}</td>
                <td>
                  {/* Botones para editar y eliminar un empleado */}
                  <div className="btn-group" role="group" aria-label="Basic outlined example">
                    <button type="button" className="btn btn-outline-success"
                      onClick={() => {
                        editarEmpleado(val);
                      }}
                    >Editar</button>
                    <button type="button" className="btn btn-outline-danger"
                      onClick={() => {
                        deleteEmpleado(val.id);
                      }}
                    >Eliminar</button>
                  </div>
                </td>
              </tr>
            })
          }
        </tbody>
      </table>
    
    </div>
  );
}

export default App;
