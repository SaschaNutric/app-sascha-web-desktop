$(document).ready(function() {
document.getElementById('selRoles').length = 1;
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/roles',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.map(function(rol) {
                let option = $(`<option value="${rol.id_rol}">${rol.nombre}</option>`)
                $('#selRoles').append(option);
                option = $(`<option value="${rol.id_rol}">${rol.nombre}</option>`)
                $('#selRoles1').append(option);
            })

        },
        error: function(res, status, xhr) {

        }
       })

   /* tabla Usuarios */
    const tablaUsuarios = $('#dtUsuarios').DataTable({ 
        "aoColumnDefs": [
        { "bSortable": false, "aTargets": [2] }
        ],
       "language": {
        "lengthMenu": "",
        "search": "Buscar:",
        "paginate": {
            "previous": "Anterior",
            "next": "Siguiente"
        },
        "emptyTable": "No se encontraron usuarios",
        "zeroRecords": "No se encontraron usuarios"
    },
    "searching": true,
    "ordering": true,
    "paging": true   
    });

    $.ajax({
        url: 'https://api-sascha.herokuapp.com/usuarios/empleados',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.map(function(usuarios) {
            addRowUsuarios(usuarios.id_usuario, usuarios.nombres, usuarios.rol ? usuarios.rol.nombre : 'No posee')
            })
            console.log(res)
            console.log(status)
        },
        error: function() {
            console.log(res)
            console.log(status)
        }
    })
});
    $("#btnRegistrar").on('click', function() {   
        if(ValidarUsuario()){
            let usuario = {
                id_empleado: $('#txtIdEmpleado').val(),
                correo: $('#txtCorreoNuevo').val(),
                id_rol: $('select[name=selRoles]').val(),
                contraseña: $('#txtContrasena').val()
            }

            $.ajax({
                url: 'https://api-sascha.herokuapp.com/usuarios',
                contentType: 'application/json',
                type: 'POST',
                data: JSON.stringify(usuario),
                success: function(res, status, xhr) {                              
                    console.log(res);
                    console.log(status);
                    const emp = res.data 
                    limpiarEmpleado()
                    mensaje('#msjAlerta', `Usuario`, 1);
                    addRowUsuarios(emp.id_usuario, emp.empleado.nombres, $('select[name="selRoles"] option:selected').text());
                    $('#agregarUsuario .close').click();
                },
                error: function(res, status, xhr) {
                    console.log(res);
                    console.log(status);
                }
            })
        };
    })

    $("#btnEditar").on('click', function() {
        if($('#selRoles1').val()==0){
            mensaje('#msjAlertaE', `Cedula`, 5);
            $('#selRoles1').css('border', '1px solid red');
            return;
        }
        else{
             $('#selRoles1').css('border', '1px solid gray');
        }
        let id=$('#txtIdUsuario').val();
        if($('select[name="selRoles1"] option:selected').text() == $(`#rol-${id}`).text()){
            mensaje('#msjAlerta',``,4);
            $('#editarUsuario').modal('hide');
            return;
        }

        let usuario = {
            id_rol: $('select[name=selRoles1]').val(),
        }
        $.ajax({
            url: `https://api-sascha.herokuapp.com/usuario/${id}`,
            contentType: 'application/json',
            type: 'PUT',
            data: JSON.stringify(usuario),
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                editRowUsuario(id, $('select[name="selRoles1"] option:selected').text())
                $('#editarUsuario .close').click();
                mensaje('#msjAlerta',  `Usuario`, 3);
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
            }
        })
    })

    $("#btnBuscar").on('click', function() {
        if($('#txtCedula').val() == ""){
            $('#txtCedula').css('border', '1px solid red');
            mensaje('#msjAlertaA', `Cedula`, 5);
            return;
        }
        cargarEmpleado($('#txtCedula').val())
    })

    $("#btnSi").on('click', function() {


    })


    function editRowUsuario(id, rol){
        $(`#rol-${id}`).text(rol);
    }

      function addRowUsuarios(id, nombre, rol){
        let row = $(`<tr>
            <td id="nombre-${id}">${nombre}</td>
            <td id="rol-${id}">${rol}</td>                    
            <td>
                <button onclick="editarUsuarios(${id})" type='button' class='edit btn  btn-stransparent' data-toggle="modal" data-target="#editarUsuario"  title='Editar'><i class='fa fa-pencil'></i></button>
                <button onclick="abrirModalEliminarUsuarios(${id})" type='button' class='ver btn  btn-stransparent' data-toggle='modal' data-target="#eliminarUsuario" title='Eliminar'><i class="fa fa-trash-o"></i></button>
            </td>
        </tr>`);
        $('#dtUsuarios').DataTable().row.add(row).draw();
    }

    function editarUsuarios(id){
        $('#txtNombreE').val($(`#nombre-${id}`).text());
        $('#txtIdUsuario').val(id);
        $('#selRoles1 option:contains('+ $(`#rol-${id}`).text() + ')').prop('selected',true);
    }

    function abrirModalEliminarUsuarios(id){
        $('#txtIdUsuarioEliminar').val(id);
        $('#txtNombreU').val($(`#nombre-${id}`).text())
    }
    
    function limpiarEmpleado(){
        $('#grupoEmpleado').css('display', 'none');
        $('#txtCedula').val('');
        $('#txtNombreNuevo').val('');
        $('#txtCorreoNuevo').val('');
    }

    function ValidarUsuario(){
        if($('#selRoles').val()==0){
            mensaje('#msjAlertaA', `Cedula`, 5);
            $('#selRoles').css('border', '1px solid red');
            return false;
        }
        else{
             $('#selRoles').css('border', '1px solid gray');
        }
        if($('#txtContrasena').val() == ""){
            $('#txtContrasena').css('border', '1px solid red');
            mensaje('#msjAlertaA', `Cedula`, 5);
            return false;
        }
        else{
             $('#txtContrasena').css('border', '1px solid gray');
        }
        if($('#txtRepContrasena').val() == ""){
            $('#txtRepContrasena').css('border', '1px solid red');
            mensaje('#msjAlertaA', `Cedula`, 5);
            return false;
        }
        else{
             $('#txtRepContrasena').css('border', '1px solid gray');
        }
        
        if($('#txtContrasena').val() != $('#txtRepContrasena').val()){
            $('#txtRepContrasena').css('border', '1px solid red');
            $('#txtContrasena').css('border', '1px solid red');            
            mensaje('#msjAlertaA', `Cedula`, 12);  
            return false;
        }
        else
        {
            $('#txtRepContrasena').css('border', '1px solid gray');
            $('#txtContrasena').css('border', '1px solid gray');
        }
        
        if($('#txtContrasena').val().length < 8){
            $('#txtContrasena').css('border', '1px solid red');
            mensaje('#msjAlertaA', `Cedula`, 11);
            return false;
        }
        else{
             $('#txtContrasena').css('border', '1px solid gray');
        }
        return true;
    }

    function cargarEmpleado(ced){
        let cedu = {
            cedula: "V-"+ ced
        }
        console.log("V-"+ ced)
        $.ajax({
        url: 'https://api-sascha.herokuapp.com/empleado/cedula',
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify(cedu),
        success: function(res, status, xhr) {  
            $('#txtNombreNuevo').val(res.data.nombres)
            $('#txtCorreoNuevo').val(res.data.correo)
            $('#txtIdEmpleado').val(res.data.id_empleado)
            $('#grupoEmpleado').css('display', 'inline');
        },
        error: function(res, status, xhr) {
            mensaje('#msjAlertaA',`Empleado`, 10)
        }
    })
    }

    function eliminarUsuario(id){
        $.ajax({
            url: `https://api-sascha.herokuapp.com/usuario/${id}`,
            contentType: 'application/json',
            type: 'DELETE',
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                mensaje('#msjAlerta',  `Usuario`, 2);
                $('#dtUsuarios').DataTable().row($(`#nombre-${id}`).parent()).remove().draw();
                $('#eliminarUsuario .close').click();
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
            }
        })
    }
