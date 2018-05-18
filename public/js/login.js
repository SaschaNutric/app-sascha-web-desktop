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
            return;
        }
        
        let credenciales = {
            correo:     $('#txtCorreo').val(),
            contraseña: $('#txtContraseña').val()
        }

        $.ajax({
            url: 'http://localhost:5000/login/intranet',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(credenciales),
            success: function(res, status, xhr) {
                console.log(res.data)
                localStorage.removeItem('token');             
                localStorage.removeItem('empleado');
                localStorage.setItem('empleado', JSON.stringify(res.data));
                window.location = 'principal.html';
            },
            error: function(res, status, xhr) {
                console.log(res)
            }
        })
    })
})