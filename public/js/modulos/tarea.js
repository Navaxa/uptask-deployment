const tareas = document.querySelector(".listado-pendientes");
import axios from "axios";
import Swal from 'sweetalert2';
import { actualizarAvance } from '../funciones/avance';


tareas.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-check-circle")) {
    const idTarea = e.target.parentElement.parentElement.dataset.tarea;
    const url = `${location.origin}/tareas/${idTarea}`;

    axios
      .patch(url, { idTarea })
      .then((respuesta) => {
        if ( respuesta.status === 200 ){
            e.target.classList.toggle('completo');
            actualizarAvance();
        }
      })
      .catch(err => console.log(err + ' => sucedio un error'));
  }

  if(e.target.classList.contains('fa-trash')) {
      const tareaHTML = e.target;
      const idTarea = tareaHTML.parentElement.parentElement.dataset.tarea;

      Swal.fire({
        title: "¿Deseas borrar la tarea?",
        text: "Una tarea eliminada no prodra ser recuperada!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, borrar!",
        cancelButtonText: "Cancelar",
      }).then((result) => {
          if (result.isConfirmed){
              const url = `${location.origin}/tareas/${idTarea}`;
              axios.delete(url, { params: { idTarea }}).then(respuesta => {
                  if(respuesta.status === 200 ) {
                        const child = tareaHTML.parentElement.parentElement.parentElement;
                        child.removeChild(tareaHTML.parentElement.parentElement);

                        Swal.fire(
                            'Tare eliminada',
                            respuesta.data,
                            'success'
                        );

                        actualizarAvance();
                  }
              }).catch(err => {
                console.log(err + ', => Hubo un error');
              });
          }
      });

  }
});

export default tareas;
