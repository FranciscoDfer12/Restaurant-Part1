const btnGuardarCliente = document.querySelector('#guardar-cliente');

//guardar la informacion
let cliente = {
    mesa: '',
    hora: '',
    pedido:[]
}

const categorias = {
    1: 'Pizzas',
    2: 'Postres',
    3: 'Jugos',
    4: 'Comida',
    5: 'Cafe',
}

btnGuardarCliente.addEventListener('click',guardarCliente);

function guardarCliente(){
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    const camposVacios = [mesa,hora].some(campo => campo == '');
    //console.log(camposVacios);

     if(camposVacios){
        //los campos estan vacios
        //mostrar el error en la ventana modal

        const existeAlerta = document.querySelector('.invalid-feedback');

        if(!existeAlerta){
            const alerta = document.createElement('div');
            alerta.classList.add('invalid-feedback','d-block','text-center');
            alerta.textContent = 'Los campos son obligatorios';
            document.querySelector('.modal-body form').appendChild(alerta);

            setTimeout(()=>{
                alerta.remove();
            },3000);
        }
    }else{
        //caso en que los campos esten llenos
        //console.log('campos llenos');
        cliente = {...cliente,mesa,hora};

        //ocultar la ventana modal
        var modalFormulario = document.querySelector('#formulario');
        var modal = bootstrap.Modal.getInstance(modalFormulario);
        modal.hide();

        mostrarSeccion();
        obtenerMenu();

    }
}   

function mostrarSeccion(){
    const secciones = document.querySelectorAll('.d-none');
    //console.log(secciones);
    secciones.forEach(seccion =>seccion.classList.remove('d-none'));
}

function obtenerMenu(){
    const url = 'http://localhost:3000/menu';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => mostrarMenu(resultado))
        .catch(error => console.log(error))
}

function mostrarMenu(menu){
    //console.log('Ingrese a mostrar')
    //console.log(menu)

    const contenido = document.querySelector('#platillos .contenido');

    menu.forEach(menu =>{
        const fila = document.createElement('div');
        fila.classList.add('row','border-top');

        const nombre = document.createElement('div');
        nombre.classList.add('col-md-4','py-3');
        nombre.textContent = menu.nombre;

        const precio = document.createElement('div');
        precio.classList.add('col-md-4','py-3');
        precio.textContent = `$${menu.precio}`;

        const categoria = document.createElement('div');
        categoria.classList.add('col-md-3','py-3');
        categoria.textContent = categorias[menu.categoria];

        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id = `producto-${menu.id}`;
        inputCantidad.classList.add('form-control');
        inputCantidad.onchange = function(){
            const cantidad = parseInt(inputCantidad.value);
            //console.log(cantidad)
            agregarOrden({...menu,cantidad});
        }

        const agregar = document.createElement('div');
        agregar.classList.add('col-md-2','py-3');
        agregar.appendChild(inputCantidad);



        fila.appendChild(nombre);
        fila.appendChild(precio);
        fila.appendChild(categoria);
        fila.appendChild(agregar);


        contenido.appendChild(fila)
    })

}

function agregarOrden(producto){
    //console.log('Ingresando agregarOrden')

    let {pedido} = cliente;

    if(producto.cantidad > 0){
        //validar que el producto existe
        if(pedido.some(item=>item.id === producto.id)){
            const pedidoActualizado = pedido.map(item=>{
                if(item.id === producto.id){
                    item.cantidad = producto.cantidad;
                }
                return item;
            });

            cliente.pedido = [...pedidoActualizado];

        }else{
            //caso que no exista el elemento
            //lo agregamos
            cliente.pedido = [...pedido,producto]
        }

    }else{

        //Cantidad es igual a 0
        const resultado = pedido.filter(item=> item.id !== producto.id);
        cliente.pedido = resultado;
    }
    limpiarHTML();

    if(cliente.pedido.length){
        actualizarResumen();
    }else{
        //mostrar pedido vacio
        mensajePedidoVacio();
    }
}

function limpiarHTML(){
    const contenido = document.querySelector('#resumen .contenido');
    while(contenido.firstChild){
        contenido.removeChild(contenido.firstChild);
    }
}

function actualizarResumen(){
    //console.log('actualizar')

    const contenido = document.querySelector('#resumen .contenido');
    const resumen = document.createElement('div');
    resumen.classList.add('col-md-6','card','py-5','px-3','shadow');

    //mostrar la mesa
    const mesa = document.createElement('p');
    mesa.textContent = 'Mesa: ';
    mesa.classList.add('fw-bold');

    const mesaCliente = document.createElement('span');
    mesaCliente.textContent = cliente.mesa;
    mesaCliente.classList.add('fw-normal'); 
    mesa.appendChild(mesaCliente);

    //mostrar hora

    const hora = document.createElement('p');
    hora.textContent = 'Hora: ';
    hora.classList.add('fw-bold');

    const horaCliente = document.createElement('span');
    horaCliente.textContent = cliente.hora;
    horaCliente.classList.add('fw-normal'); 
    hora.appendChild(horaCliente);

    const heading = document.createElement('h3');
    heading.textContent = 'Pedidos: ';
    heading.classList.add('my-4');

    const grupo = document.createElement('ul');
    grupo.classList.add('list-group');
    
    //productos que estan en pedido

    const {pedido} = cliente;
    pedido.forEach(i=>{
        const {nombre,cantidad,precio,id} = i;
        const lista = document.createElement('li')
        lista.classList.add('list-group-item');

        const nombreP = document.createElement('h4');
        nombreP.classList.add('text-center','my-4');
        nombreP.textContent = nombre;

        const cantidadP = document.createElement('p');
        cantidadP.classList.add('fw-bold');
        cantidadP.textContent = 'Cantidad: ';

        const cantidadValor = document.createElement('span');
        cantidadValor.classList.add('fw-normal');
        cantidadValor.textContent = cantidad;

        const precioP = document.createElement('p');
        precioP.classList.add('fw-bold');
        precioP.textContent = 'Precio: ';

        const precioValor = document.createElement('span');
        precioValor.classList.add('fw-normal');
        precioValor.textContent = `$${precio}`;

        const subtotalIP = document.createElement('p');
        subtotalIP.classList.add('fw-bold');
        subtotalIP.textContent = 'Subtotal: ';

        const subtotalValor = document.createElement('span');
        subtotalValor.classList.add('fw-normal');
        subtotalValor.textContent = 4; //luego colocar funcion

        //agregar boton de eliminar
        const btnEliminar = document.createElement('button');
        btnEliminar.classList.add('btn','btn-danger');
        btnEliminar.textContent = 'Eliminar pedido';

        //hay que agregar evento al boton
        //agregar luego **

        btnEliminar.onclick = function(){
            eliminarProducto(id);
        }

        //agregamos label a los contenedores

        cantidadP.appendChild(cantidadValor);
        precioP.appendChild(precioValor);
        subtotalIP.appendChild(subtotalValor);

        lista.appendChild(nombreP);
        lista.appendChild(cantidadP);
        lista.appendChild(precioP);
        lista.appendChild(subtotalIP);
        lista.appendChild(btnEliminar);
        grupo.appendChild(lista)
    })

    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(heading);
    resumen.appendChild(grupo);
   
    contenido.appendChild(resumen);

    formularioPropinas();

}

function eliminarProducto(id){
    const {pedido} = cliente;
    cliente.pedido = pedido.filter(i=>i.id !== id);

    limpiarHTML();

    if(cliente.pedido.length){
        actualizarResumen();
    }else{
        mensajePedidoVacio();
    }


    //console.log(id);
    const productoEliminado = `#producto-${id}`;
    const inputEliminado = document.querySelector(productoEliminado);
    console.log(inputEliminado);
    inputEliminado.value = 0;
    
}

function mensajePedidoVacio(){
    const contenido = document.querySelector("#resumen .contenido");
    const texto = document.createElement('p');
    texto.classList.add('text-center');
    texto.textContent = 'Debes agregar productos al pedido';

    contenido.appendChild(texto);
}

function formularioPropinas(){
    const contenido = document.querySelector('#resumen .contenido');
    const formulario = document.createElement('div');
    formulario.classList.add('col-md-6','formulario');

    const heading = document.createElement('h3');
    heading.classList.add('my-4');
    heading.textContent = 'Propina';

    //propina al 5%
    const box5 = document.createElement('input');
    box5.type = 'radio';
    box5.name = 'propina';
    box5.value = '5';
    box5.classList.add('form-check-inpt');
    //console.log('llamando a calcular propina');
    box5.onclick = calcularPropina;

    const label5 = document.createElement('label');
    label5.textContent = '5%';
    label5.classList.add('form-check-label');

    const div5 = document.createElement('div');
    div5.classList.add('form-check');

    //propina al 10%
    const box10 = document.createElement('input');
    box10.type = 'radio';
    box10.name = 'propina';
    box10.value = '10';
    box10.classList.add('form-check-inpt');
    //console.log('llamando a calcular propina');
    box10.onclick = calcularPropina;
    
    const label10 = document.createElement('label');
    label10.textContent = '10%';
    label10.classList.add('form-check-label');
    
    const div10 = document.createElement('div');
    div10.classList.add('form-check');
    
    div5.appendChild(box5);
    div5.appendChild(label5);
    div10.appendChild(box10);
    div10.appendChild(label10);

    formulario.appendChild(div5);
    formulario.appendChild(div10);
    contenido.appendChild(formulario);
}

function calcularPropina(){
    //console.log('calcular propina')

    const radioSeleccionado =  document.querySelector('[name="propina"]:checked').value;
    //console.log(radioSeleccionado);

    const {pedido} = cliente;
    let subtotal = 0;

    pedido.forEach(i=>{
        subtotal += i.cantidad * i.precio;
        //console.log(subtotal1);
    })

    const divTotales = document.createElement('div');
    divTotales.classList.add('total-pagar');


    //Calcular propina
    const propina = (subtotal*parseInt(radioSeleccionado))/100;
    //console.log(propina1)
    const total = propina + subtotal;
    //console.log(total)

    //mostrar subtotal
    const subtotalParrafo = document.createElement('p');
    subtotalParrafo.classList.add('fs-3','fs-bold');
    subtotalParrafo.textContent = 'Subtotal Consumo: ';

    const subtotalP = document.createElement('span');
    subtotalP.classList.add('fs-nomral');
    subtotalP.textContent = `$${subtotal}`;
    subtotalParrafo.appendChild(subtotalP);

    const propinaParrafo = document.createElement('span');
    propinaParrafo.classList.add('fw-normal');
    propinaParrafo.textContent = 'Propina';

    const propinaP = document.createElement('span');
    propinaP.classList.add('fw-normal');
    propinaP.textContent = `$${propina}`;
    propinaParrafo.appendChild(propinaP);

    //total
    const totalParrafo = document.createElement('p');
    totalParrafo.classList.add('fs-3','fw-bold');
    totalParrafo.textContent = 'Total a pagar';
    
    const totalp = document.createElement('p');
    totalp.classList.add('fs-normal');
    totalp.textContent = `$${total}`;
    totalParrafo.appendChild(totalp);
    
    const totalPagarDiv = document.querySelector('.total-pagar');
    if(totalPagarDiv){
        totalPagarDiv.remove();
    }

    divTotales.appendChild(subtotalParrafo);
    divTotales.appendChild(propinaParrafo);
    divTotales.appendChild(totalParrafo);

    const formulario = document.querySelector('.formulario');
    formulario.appendChild(divTotales);
}

