$(document).ready(function() {

    const tablaEjercicio = $('#dtEjercicios').DataTable({ 
        "aoColumnDefs": [
        { "bSortable": false, "aTargets": [1] }
        ],
       "language": {
        "lengthMenu": "",
        "search": "Buscar:",
        "paginate": {
            "previous": "Anterior",
            "next": "Siguiente"
        },
        "emptyTable": "No se encontraron ejercicios",
        "zeroRecords": "No se encontraron ejercicios"
    },
    "searching": true,
    "ordering": true,
    "paging": true   
});
    
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/ejercicios',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.map(function(ejercicio) {
                addRowEjercicio(ejercicio.id_ejercicio,ejercicio.nombre)
            })

        },
        error: function(res, status, xhr) {
            console.log(res)
            console.log(status)
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);

        }
    })

    $('#btnAceptar').on('click', function() {

        if($('#txtNombreEjercicio').val() == ""){
            $('#txtNombreEjercicio').css('border', '1px solid red');
            return;
        }

        let ejercicio = {
            nombre: $('#txtNombreEjercicio').val()
        }

        $.ajax({
            url: 'https://api-sascha.herokuapp.com/ejercicios',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(ejercicio),
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                addRowEjercicio(res.data.id_ejercicio, res.data.nombre)
                limpiarEjercicio()
                mensaje('#msjAlerta', `Ejercicio`, 1);
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta',`${respuesta.data.mensaje}`, 0);

            }
        })
        $('#agregarEjercicio').modal('hide');

    })

    $('#btnEditar').on('click', function() {
        if($('#txtNombreEjercicio').val() == ""){
            $('#txtNombreEjercicio').css('border', '1px solid red');
            return;
        }


        let ejercicio = {
            nombre: $('#txtNombreEjercicio').val()
        }

        let id = $('#txtIdEjercicio').val();

        if(ejercicio.nombre == $(`#nombre-${id}`).text()){
            $('#agregarEjercicio').modal('hide');
            mensaje('#msjAlerta', '', 4);

            return;
        }
        $.ajax({
            url: `https://api-sascha.herokuapp.com/ejercicio/${id}`,
            contentType: 'application/json',
            type: 'PUT',
            data: JSON.stringify(ejercicio),
            success: function(res, status, xhr) {
                limpiarEjercicio()
                const ejercicio = res.data;
                console.log(res.data)
                mensaje('#msjAlerta',  `Ejercicio`, 3);
                editRowEjercicio(ejercicio.id_ejercicio, ejercicio.nombre)
            },
            error: function(res, status, xhr) {
                limpiarEjercicio()
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
                
            }
        })
        $('#agregarEjercicio').modal('hide');
    })

});


function editarEjercicio(id){
    $('#txtNombreEjercicio').val($(`#nombre-${id}`).text());
    $('#txtIdEjercicio').val(id);
    $('#btnAceptar').css('display', 'none');
    $('#btnEditar').css('display', 'inline');
}

function abrirModalEliminarEjercicio(id){
    $('#txtIdEjercicioEliminar').val(id);
}

function eliminarEjercicio(id){
    $.ajax({
        url: `https://api-sascha.herokuapp.com/ejercicio/${id}`,
        contentType: 'application/json',
        type: 'DELETE',
        success: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            $('#dtEjercicios').DataTable().row($(`#nombre-${id}`).parent()).remove().draw();
            $('#txtNombreEjercicio').val('');
            mensaje('#msjAlerta', `Ejercicio`, 2);


        },
        error: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
            
        }
    })
}


function limpiarEjercicio(){

    $('#txtNombreEjercicio').val('')
    $('#txtIdEjercicio').val('')

}


function addRowEjercicio(id, nombre){
   let row = $(`<tr>
    <td id="nombre-${id}">${nombre}</td>
    <td>
    <button onclick="editarEjercicio(${id})" type='button' class='edit btn  btn-transparente' data-toggle="modal" data-target="#agregarEjercicio"  title='Editar'><i class='fa fa-pencil'></i></button>
    <button onclick="abrirModalEliminarEjercicio(${id})" type='button' class='ver btn  btn-transparente' data-toggle='modal' data-target="#eliminarEjercicio" title='Eliminar'><i class="fa fa-trash-o"></i></button>
    </td>
    </tr>
    `);
   $('#dtEjercicios').DataTable().row.add(row).draw();
}

function editRowEjercicio(id, nombre){

    $(`#nombre-${id}`).text(nombre)

}
