import Swal from "sweetalert2";
import axios from "axios";

const btnEliminar = document.querySelector("#eliminar-proyecto");
btnEliminar.addEventListener("click", (e) => {
  const urlProyecto = e.target.dataset.proyectoUrl;
  Swal.fire({
    title: "¿Deseas borrar el proyecto?",
    text: "Un proyecto eliminado no prodra ser recuperado despues!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, borrar!",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      const url = `${location.origin}/proyectos/${urlProyecto}`;
      axios
        .delete(url, { params: { urlProyecto } })
        .then((respuesta) => {
          Swal.fire("Eliminado!", respuesta.data, "success");
          setTimeout(() => {
            window.location.href = "/";
          }, 3000);
        })
        .catch(() => {
          Swal.fire({
            type: "error",
            title: "Hubo un error",
            test: "No se pudo eliminar el proyecto",
          });
        });
    }
  });
});

export default btnEliminar;
