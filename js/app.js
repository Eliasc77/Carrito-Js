const carrito= document.querySelector('#carrito');
const contenedorCarrito= document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');

let articulosCarrito= [];

cargarEventListeners();

function cargarEventListeners(){
    //cuando agregas un curso presionando "Agregar al Carrito"
    listaCursos.addEventListener('click', agregarCurso);

    //elimina cursos del carrito;
    carrito.addEventListener('click', eliminarCurso);


    //muestra los cursos del LocalStorage
    document.addEventListener('DOMContentLoaded', ()=>{
        articulosCarrito = JSON.parse(localStorage.getItem('carrito'))|| []
        carritoHTML();
    })

    //Vaciar el Carrito
    vaciarCarritoBtn.addEventListener('click', ()=>{
        articulosCarrito = []; //reseteamos el arreglo
        limiparHTML();
    });
}



function agregarCurso(e){
    e.preventDefault();
    if(e.target.classList.contains('agregar-carrito')){
        const cursoSeleccionado = e.target.parentElement.parentElement; 
        leerDatosCursos(cursoSeleccionado);
    }
}

//Eliminar un curso del carrito
function eliminarCurso(e){
    
    if(e.target.classList.contains('borrar-curso')){
        const cursoId = e.target.getAttribute('data-id');
        //Elimina del arreglo de articulosCarrito por el data-id
        articulosCarrito = articulosCarrito.filter( curso => curso.id !== cursoId);
        carritoHTML();// Iterar sobre el carrito y mostrar su html

    }
}



//lee el contenido del html al que le dimos click y extrae la informacion del curso
function leerDatosCursos(curso){
    //crear un objeto con el contenido del curso actual
    const infoCurso={
        imagen:curso.querySelector('img').src,
        titulo:curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }
 
    //Revisa si un elemento ya existe en el carrito
    const existe = articulosCarrito.some(curso => curso.id === infoCurso.id);
    if(existe){
        //actualizacmos la cantidad
        const cursos = articulosCarrito.map( curso =>{
            if(curso.id === infoCurso.id){
                curso.cantidad++;
                return curso;//retorna el objeto actualizado
            }else{
                return curso;//retorna los objetos q no son duplicados
            }
        });
        articulosCarrito = [...cursos];
    }else{
        articulosCarrito = [ ...articulosCarrito, infoCurso];
    }


    //agrega elementos al arreglo de carrito
    
    carritoHTML();
}   

//Muestra el Carrrito de comprasen el html

function carritoHTML(){
    //limpiar el HTML
    limiparHTML();

    //RECORRE EL CARRITO Y GENERA EL HTML

    articulosCarrito.forEach( curso => {
        const { imagen, titulo, precio, cantidad, id} = curso;
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>
                <img src='${imagen}' width='100'>  
            </td>
            <td>
                ${titulo}
            </td>
            <td>
                ${precio}
            </td>
            <td>
                ${cantidad}
            </td>

            <td>
                <a href="#" class="borrar-curso" data-id="${id}"> X </a>
            </td>
        `;

        //agrega el html del carrito en tbody
        contenedorCarrito.appendChild(row);
    });

    //Agregar el carrito de compras al storege
    sincronizarStorage();
}

function sincronizarStorage(){
    localStorage.setItem('carrito',JSON.stringify(articulosCarrito))
}

//eliminar los cursos del tbody

function limiparHTML (){

    //forma lenta
    //contenedorCarrito.innerHTML = '';

    while(contenedorCarrito.firstChild){
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}
