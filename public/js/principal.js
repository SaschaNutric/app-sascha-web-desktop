if(!localStorage.sesion) {
    window.location.replace("index.html");
}
$(document).ready(function (event) {
    
    let empleado = JSON.parse(localStorage.getItem('empleado'));
    $('span#username').text(empleado.nombres + ' ' + empleado.apellidos);

    $('#btnCerrarSesion').on('click', function(event) {
        localStorage.removeItem('empleado');
        localStorage.removeItem('token');
        localStorage.removeItem('sesion');
        localStorage.setItem('sesion',false);
        window.location = 'index.html'; 
    })
})