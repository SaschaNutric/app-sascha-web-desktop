$(document).ready(function (event) {
    let empleado = JSON.parse(localStorage.getItem('empleado'));
    $('span#username').text(empleado.nombres + ' ' + empleado.apellidos);

    $('#btnCerrarSesion').on('click', function(event) {
        localStorage.removeItem('empleado');
        localStorage.removeItem('token');
        console.log('holaaaaaaaa')
        window.location = 'index.html'; 
    })
})