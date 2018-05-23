
$(document).ready(function() {
      
    /* tabla Comentarios */
	$('#dtMotivos').dataTable({ 
		"aoColumnDefs": [
		{ "bSortable": false, "aTargets": [2] }
        ],               
        "sDom": "ftp",
        "oLanguage": {
        	"sLengthMenu": "",
        	"sSearch": "Buscar:",
            "oPaginate": {
            	"sPrevious": "Anterior",
                "sNext": "Siguiente"
            },
            "SEmptyTble": "No se encontraron medidas"
        },        
    });

    /* tabla Respuestas */
    $('#dtRespuestas').dataTable({ 
        "aoColumnDefs": [
        { "bSortable": false, "aTargets": [2] }
        ],               
        "sDom": "ftp",
        "oLanguage": {
            "sLengthMenu": "",
            "sSearch": "Buscar:",
            "oPaginate": {
                "sPrevious": "Anterior",
                "sNext": "Siguiente"
            },
            "SEmptyTble": "No se encontraron medidas"
        },        
    });

    /* tabla Valoracion */
    $('#dtCriterios').dataTable({ 
        "aoColumnDefs": [
        { "bSortable": false, "aTargets": [3] }
        ],               
        "sDom": "ftp",
        "oLanguage": {
            "sLengthMenu": "",
            "sSearch": "Buscar:",
            "oPaginate": {
                "sPrevious": "Anterior",
                "sNext": "Siguiente"
            },
            "SEmptyTble": "No se encontraron medidas"
        },        
    });

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



/* js que me realiza el get que me llena la tala de notificaciones */
/* js que me realiza el editar que me llena la tala de notificaciones */

    $('#btnEditartipoNotificacion').on('click', function() {

     if($('#txtDescripcionNotificacion').val() == ""){
        $('#txtDescripcionNotificacion').css('border', '1px solid red');
        return;
    }


    let tipoNotificaciones = {
        nombre: $('#txtNombreNotificacion').val(),
        mensaje: $('#txtDescripcionNotificacion').val()
    }
    let id = $('#txtIdTipoNotificacion').val();

    if(tipoNotificaciones.nombre == $(`#nombreNotificacion-${id}`).text() && tipoNotificaciones.mensaje == $(`#tipo_notificacion-${id}`).text())
    {
        mensaje('#msjAlerta', ``, 4);
        $('#editartipoNotificacion').modal('hide');   
        return;
    }
        $.ajax({
            url: `https://api-sascha.herokuapp.com/tiponotificaciones/${id}`,
            contentType: 'application/json',
            type: 'PUT',
            data: JSON.stringify(tipoNotificaciones),
            success: function(res, status, xhr) {
                limpiarTipoNotificacion()
                const tipoNotificaciones = res.data;
                console.log(res.data)
                mensaje('#msjAlerta',  `Tipo notificacion`, 3);
                editRowTipoNotificaciones(tipoNotificaciones.id_tipo_notificacion, tipoNotificaciones.mensaje)

            },
            error: function(res, status, xhr) {
                limpiarTipoNotificacion()
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
                
            }
        })
        $('#editartipoNotificacion').modal('hide');
    })
 /* js que me realiza el editar que me llena la tala de notificaciones */

});



 /* js que me realiza el eliminar de la tabla notificaciones */

 function abrirModalEliminarTipoNotificacion(id){
    $('#txtIdTipoNotificacionEliminar').val(id);
}

function EliminarTipoNotificacion(id){
    $.ajax({
        url: `https://api-sascha.herokuapp.com/tiponotificaciones/${id}`,
        contentType: 'application/json',
        type: 'DELETE',
        success: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            $('#dtNotificaciones').DataTable().row($(`#nombreNotificacion-${id}`).parent()).remove().draw();
            $('#txtNombreNotificacion').val('');
            mensaje('#msjAlerta', `Tipo de Notificacion`, 2);
        },
        error: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);         
        }
    })
}
 /* fin js que me realiza el eliminar de la tabla notificaciones */


 /* js que me realiza CARGAR DE CADA DATO CON SUS RESPECTIVOS BOTONES */
function addRowTipoNotificaciones(id, nombre,mensaje){
   let row = $(`<tr>
        <td id="nombreNotificacion-${id}">${nombre}</td>
        <td id="tipo_notificacion-${id}">${mensaje}</td>
        <td>
        <button onclick="editartipoNotificacion(${id})" type='button' class='edit btn  btn-transparente' data-toggle="modal" data-target="#editartipoNotificacion"  title='Editar'><i class='fa fa-pencil'></i></button>
        </td>
        </tr>
        `);
   $('#dtNotificaciones').DataTable().row.add(row).draw();
}

/*<button onclick="abrirModalEliminarTipoNotificacion(${id})" type='button' class='ver btn  btn-transparente' data-toggle='modal' data-target="#eliminarTipoNotificacion" title='Eliminar'><i class="fa fa-trash-o"></i></button>*/
 /* FIN js que me realiza CARGAR DE CADA DATO CON SUS RESPECTIVOS BOTONES */


 /*  INICIO SELECT js DEL/LOS CAMPOS QUE DESEO EDITAR */
function editRowTipoNotificaciones(id, mensaje)
{

    $(`#tipo_notificacion-${id}`).text(mensaje)

}
/* FIN SELECT js DEL/LOS CAMPOS QUE DESEO EDITAR */


/* INICIO MODAL CON IMPUT CARGADOS CON LOS DATOS QUE APARESCAN EN TABLA js  */
function editartipoNotificacion(id){
    $('#txtNombreNotificacion').val($(`#nombreNotificacion-${id}`).text());
    $('#txtIdTipoNotificacion').val(id)
    $('#txtDescripcionNotificacion').val($(`#tipo_notificacion-${id}`).text());

    $('#btnEditartipoNotificacion').css('display', 'inline');
}

/* FIN MODAL CON IMPUT CARGADOS CON LOS DATOS QUE APARESCAN EN TABLA js  */

function limpiarTipoNotificacion(){

    $('#txtNombreNotificacion').val('')
    $('#txtDescripcionNotificacion').val('')
    $('#txtIdTipoUnidad').val('')

}
