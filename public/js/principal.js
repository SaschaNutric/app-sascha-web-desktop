$(document).ready(function (event) {
    let empleado = JSON.parse(localStorage.getItem('empleado'));

    let usuario = empleado.usuario
    let menu = usuario.rol.funcionalidades
    console.log(menu)
    console.log(usuario)

    if(!usuario.rol || usuario.rol == null){
        alert("no tienes acceso a la intranet")
        window.location.replace('index.htmtl')
    }
    
    $('span#username').text(empleado.nombres + ' ' + empleado.apellidos);






    $('#btnCerrarSesion').on('click', function(event) {
        localStorage.removeItem('empleado');
        localStorage.removeItem('token');
        window.location = 'index.html'; 
    })
})