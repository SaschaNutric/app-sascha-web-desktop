$(document).ready(function(event) {
    
    $('#btnIngresar').on('click', function() {
        if ($("#txtCorreo").val() == "" || $("#txtContraseña").val() == "") {
            if ($("#txtCorreo").val() == "") {
                $("#txtCorreo").css('border', ' 1px solid red');
                $("#span-contra").remove();
                $("input#txtCorreo").parent().append('<span id="span-contra">Ingrese correo</span>');
                $("#txtCorreo").focus(function () {
                    $("input#txtCorreo").css('border', '1px solid #ccc');
                });
            }
            if ($("#txtContraseña").val() == "") {
                $("#txtContraseña").css('border', ' 1px solid red');
                $("#span-contra").remove();
                $("input#txtContraseña").parent().append('<span id="span-contra">Ingrese contraseña</span>');
                $("#txtContraseña").focus(function () {
                    $("input#txtContraseña").css('border', '1px solid #ccc');
                });
            } 
            mensaje('#msjAlerta',``, 5);            
            return;
        }
        
        let credenciales = {
            correo:     $('#txtCorreo').val(),
            contraseña: $('#txtContraseña').val()
        }

        $.ajax({
            url: 'http://localhost:3000/login/intranet',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(credenciales),
            success: function(res, status, xhr) {
                console.log(res.data)
                localStorage.removeItem('token');             
                localStorage.removeItem('empleado');
                localStorage.setItem('empleado', JSON.stringify(res.data));
                localStorage.removeItem('sesion');
                localStorage.setItem('sesion',true);
                window.location = 'principal.html';
            },
            error: function(res, status, xhr) {
                console.log(res)
                localStorage.removeItem('sesion');
                localStorage.setItem('sesion',false);
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta',`${respuesta.data.mensaje}`, 0);
            }
        })
    })
})