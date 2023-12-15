
document.addEventListener('DOMContentLoaded', function () {
    const tar = localStorage.getItem('Tareas');
    if (tar) {
        tareas = JSON.parse(tar);
        mostrarTareas();
    }
});

document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        guardarTarea();
    } else if (e.key === 'Delete') {
        borrarTareas()
    } else if (e.key >= '1' && e.key <= '9') {
        marcarTarea(parseInt(e.key));
    } else if (e.key === 'm') {
        finalizarTarea()
    }
})
let tareas = [];

/**
 * La función "guardarTarea" guarda una nueva tarea con un título y descripción en una lista de tareas,
 * actualiza el almacenamiento local y muestra las tareas.
 */
function guardarTarea() {
    let localTareas = obtenerTareas();
    if (Array.isArray(localTareas) && localTareas.length) {
        tareas = tareas.filter(tarea => localTareas.some(localTarea => localTarea.id === tarea.id));
    }
    const tarea = {
        id: "",
        titulo: "",
        descripcion: "",
        completada: false
    };
    const titulo = document.querySelector('#titulo').value;
    const descripcion = document.querySelector('#descripcion').value;
    if (titulo === "" || descripcion === "") {
        alert("Introduzca algún título y descripción");
    } else {
        tarea.id = Date.now();
        tarea.titulo = titulo;
        tarea.descripcion = descripcion;
        tarea.completada = false;
        tareas.push(tarea);
        actualizarLocalStorage();
        mostrarTareas();
    }
}

/**
 * La función "actualizarLocalStorage" actualiza el almacenamiento local con el estado actual de la
 * variable "Tareas".
 */
function actualizarLocalStorage() {
    localStorage.setItem('Tareas', JSON.stringify(tareas));
}

/**
 * La función "mostrarTareas" se utiliza para mostrar tareas existentes manejando el DOM para mostrarlas en la página.
 */
function mostrarTareas() {
    let tareasExistentes = obtenerTareas();
    let tareasContainer = document.querySelector('#tareas-container');
    tareasContainer.innerHTML = '';
    let titulo = document.createElement('h1');
    titulo.innerHTML = 'Tareas';
    tareasContainer.appendChild(titulo);
    if (tareasExistentes) {
        for (const iterator of tareasExistentes) {
            let div = document.createElement('div');
            div.setAttribute('class', 'tareas');
            div.setAttribute('id', iterator.id);
            let check = document.createElement('input');
            check.type = 'checkbox';
            check.setAttribute('id', iterator.id);
            let p = document.createElement('p');
            let desc = document.createElement('p');
            p.id = iterator.id;
            desc.id = iterator.id;
            if (iterator.completada) {
                p.style.textDecoration = 'line-through';
                desc.style.textDecoration = 'line-through';
            }
            desc.addEventListener('dblclick', function () {
                modificarDescripcion(iterator.id);

            })
            p.addEventListener('dblclick', function () {
                modificarTitulo(iterator.id);

            })
            p.setAttribute('class', 'tarea');
            desc.setAttribute('class', 'descTarea');
            p.innerHTML = iterator.titulo + ":";
            desc.innerHTML = iterator.descripcion;
            div.appendChild(check);
            div.appendChild(p);
            div.appendChild(desc);
            tareasContainer.appendChild(div);
        }
    }
}


/**
 * La función "finalizarTarea" marca una tarea como completada agregando un estilo de línea a su texto
 * y actualizando su estado en el almacenamiento local.
 */
function finalizarTarea() {
    let check = document.querySelectorAll('input[type="checkbox"]');
    let tareaFinalizada = tareas;
    for (const iterator of tareaFinalizada) {
        for (const it of check) {
            if (it.checked && it.nextElementSibling.id == iterator.id) {
                it.nextElementSibling.style.textDecoration = 'line-through';
                iterator.completada = true;
            }
        }
    }
    actualizarLocalStorage();
    mostrarTareas();
}

/**
 * La función "borrarTareas" filtra las tareas completadas, actualiza el almacenamiento local y muestra
 * las tareas restantes.
 */
function borrarTareas() {
    tareas = tareas.filter(tarea => !tarea.completada);
    actualizarLocalStorage();
    mostrarTareas();
}
/**
 * La función "obtenerTareas" recupera tareas del almacenamiento local y las devuelve como una matriz.
 * @returns el objeto JSON analizado almacenado en la clave 'Tareas' del almacenamiento local.
 */
function obtenerTareas() {
    const local = localStorage.getItem('Tareas');
    const localTareas = JSON.parse(local);
    return localTareas
}

/**
 * La función "modificarDescripcion" solicita al usuario que ingrese una nueva descripción para una
 * tarea, encuentra la tarea con el ID especificado, actualiza su descripción y luego actualiza el
 * almacenamiento local y muestra las tareas actualizadas.
 * @param idTarea - La identificación de la tarea que debe modificarse.
 */
function modificarDescripcion(idTarea) {
    const nuevaDescripcion = prompt('Ingrese la nueva descripción:');
    let tareaEncontrada = tareas.find(tarea => tarea.id === parseInt(idTarea));
    if (nuevaDescripcion === "") {
        alert('Tarea no modificada');
    } else {
        tareaEncontrada.descripcion = nuevaDescripcion;
        alert('Tarea modificada exitosamente');
    }

    actualizarLocalStorage();
    mostrarTareas();
}

/**
 * La función `modificarTitulo` solicita al usuario que ingrese un nuevo título para una tarea,
 * encuentra la tarea con el ID especificado, actualiza su título con el nuevo valor y luego actualiza
 * el almacenamiento local y muestra las tareas actualizadas.
 * @param idTarea - La identificación de la tarea que debe modificarse.
 */
function modificarTitulo(idTarea) {
    const nuevoTitulo = prompt('Ingrese la nuevo titulo:');
    let tareaEncontrada = tareas.find(tarea => tarea.id === parseInt(idTarea));
    if (nuevoTitulo === "") {
        alert('Tarea no modificada');
    } else {
        tareaEncontrada.titulo = nuevoTitulo;
        alert('Tarea modificada exitosamente');
    }
    actualizarLocalStorage();
    mostrarTareas();
}

/**
 * La función "marcarTarea" marca una tarea como completada marcando la casilla correspondiente.
 * @param numeroTarea - El parámetro "numeroTarea" es el número de la tarea que deseas marcar como
 * completada.
 */

function marcarTarea(numeroTarea) {
    let tarea = document.querySelectorAll('.tareas input[type="checkbox"]');
    if (tarea.length >= numeroTarea) {
        tarea[numeroTarea - 1].checked = true;
    }
}