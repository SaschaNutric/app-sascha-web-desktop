$(document).ready(function() {
/* js que me realiza el get que me llena la tala de notificaciones */
     const tablaNotificaciones = $('#dtNotificaciones').DataTable({ 
        "language": {
            "lengthMenu": "",
            "search": "Buscar:",
            "paginate": {
                "previous": "Anterior",
                "next": "Siguiente"
            },
            "emptyTable": "No se encontraron notificaciones",
            "zeroRecords": "No se encontraron notificaciones"
        },
        "searching": true,
        "ordering": true,
        "paging": true 
    });
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/tiponotificaciones',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.map(function(tipoNotificaciones)
             {
                addRowTipoNotificaciones(tipoNotificaciones.id_tipo_notificacion,tipoNotificaciones.nombre,tipoNotificaciones.mensaje)
            })

        },
        error: function(res, status, xhr) {
            console.log(res)
            console.log(status)
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);

        }
    })

});


function addRowTipoNotificaciones(id, nombre,mensaje){
   let row = $(`<tr>
        <td id="nombreNotificacion-${id}">${nombre}</td>
        <td id="tipo_notificacion-${id}">${mensaje}</td>
        <td>
        <button onclick="editarUnidad(${id})" type='button' class='edit btn  btn-transparente' data-toggle="modal" data-target="#editartipoNotificacion"  title='Editar'><i class='fa fa-pencil'></i></button>
        <button onclick="abrirModalEliminarUnidad(${id})" type='button' class='ver btn  btn-transparente' data-toggle='modal' data-target="#eliminarUnidad" title='Eliminar'><i class="fa fa-trash-o"></i></button>
        </td>
        </tr>
        `);
   $('#dtNotificaciones').DataTable().row.add(row).draw();
}

function editRowTipoNotificaciones(id, nombre){

    $(`#nombreNotificacion-${id}`).text(nombre)

}


function editartipoNotificacion(id){
    $('#txtNombreNotificacion').val($(`#nombreNotificacion-${id}`).text());
    $('#txtIdTipoNotificacion').val(id)
}