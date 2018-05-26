
$(document).ready(function() {

    const tablaMotivo = $('#dtMotivos').DataTable({ 
       "language": {
            "lengthMenu": "",
            "search": "Buscar:",
            "paginate": {
                "previous": "Anterior",
                "next": "Siguiente"
            },
            "emptyTable": "No se encontraron Motivos",
            "zeroRecords": "No se encontraron Motivos"
        },
        "searching": true,
        "ordering": true,
        "paging": true   
    });
    /* Metodo Get Si se Puede */	

    $.ajax({
        url: 'https://api-sascha.herokuapp.com/motivos',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
        res.data.map(function(motivo) {   
        addRowTipoMotivo(motivo.id_motivo, motivo.tipo_motivo.nombre, motivo.descripcion)
                
            })

        },
        error: function(res, status, xhr) {
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
        }
    })

    $.ajax({
        url: 'https://api-sascha.herokuapp.com/tipomotivos/todos',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.map(function(tipo_motivo) {
                let option = $(`<option value="${tipo_motivo.id_tipo_motivo}">${tipo_motivo.nombre}</option> `)
                $('#selTipoMotivo').append(option);
            })
        },
        error: function(res, status, xhr) {
            console.log(res);
        }
    });



    

    $('#btnAceptarMotivo').on('click', function() {
        if($('select[name=tipo_motivo]').val() == "0"){
            $('select[name=tipo_motivo]').css('border', '1px solid red')
            return;
        }
        if($('#txtDescripcionMotivo').val() == ""){
            $('#txtDescripcionMotivo').css('border', '1px solid red');
            return;
        }
        let motivo = {
            id_tipo_motivo: $('select[name=tipo_motivo]').val(),
            descripcion: $('#txtDescripcionMotivo').val()
        }
        /* Metodo Get Si se Puede fin */


        /* Metodo Post Si se Puede */
      $.ajax({
            url: 'https://api-sascha.herokuapp.com/motivos',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(motivo),
            success: function(res, status, xhr) {
                console.log(res);
                const motivo = res.data;
                mensaje('#msjAlerta', `Motivo`, 1);
                const nombre_tipo_motivo = $('select[name="tipo_motivo"] option:selected').text()
                addRowTipoMotivo(motivo.id_motivo, nombre_tipo_motivo, motivo.descripcion)           
                limpiarMotivo();
            },
            error: function(res, status, xhr) {
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
            }
        })

       $('#agregarMensajeMotivo').modal('hide');

    })





    $('#btnEditarMotivo').on('click', function() {
        if($('select[name=tipo_motivo]').val() == "0"){
            $('select[name=tipo_motivo]').css('border', '1px solid red')
            return;
        }
        if($('#txtDescripcionMotivo').val() == ""){
            $('#txtDescripcionMotivo').css('border', '1px solid red');
            return;
        }


        let motivo = {
            id_tipo_motivo: $('select[name=tipo_motivo]').val(),
            descripcion: $('#txtDescripcionMotivo').val()
        }
        const tipoM = $('select[name="tipo_motivo"] option:selected').text()
        
        let id = $('#txtIdMotivo').val();
        
        if(tipoM == $(`#tipomotivo-${id}`).text() && motivo.descripcion== $(`#descripcion-${id}`).text()){
            mensaje('#msjAlerta', ``, 4);
            $('#agregarMensajeMotivo').modal('hide');   
            return;
        }
        /* Metodo Put Si se Puede */
        $.ajax({
            url: `https://api-sascha.herokuapp.com/motivo/${id}`,
            contentType: 'application/json',
            type: 'PUT',
            data: JSON.stringify(motivo),
            success: function(res, status, xhr) {
                console.log(motivo)
                mensaje('#msjAlerta', `Motivo`, 3);
                editRowMotivo(id, tipoM, motivo.descripcion)
                limpiarMotivo();
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta',`${respuesta.data.mensaje}`, 0);
            }
        })
        $('#agregarMensajeMotivo').modal('hide');
    });
});

function editarMotivo(id){
    $('#selTipoMotivo option:contains('+ $(`#tipomotivo-${id}`).text() + ')').prop('selected',true);
    $('#txtDescripcionMotivo').val($(`#descripcionMotivo-${id}`).text());
    $('#txtIdMotivo').val(id);
    $('#btnAceptarMotivo').css('display', 'none');
    $('#btnEditarMotivo').css('display', 'inline');
}

function agregarMotivo(){

    $('#btnAceptarMotivo').css('display', 'inline');
    $('#btnEditarMotivo').css('display', 'none');
}



function abrirModalEliminarMotivo(id){
    $('#txtIdMotivoEliminar').val(id);
}
/* Metodo Delete Si se Puede */

function eliminarMotivo(id){
    $.ajax({
        url: `https://api-sascha.herokuapp.com/motivo/${id}`,
        contentType: 'application/json',
        type: 'DELETE',
        success: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            $('#dtMotivos').DataTable().row($(`#tipomotivo-${id}`).parent()).remove().draw();
            $('#txtIdMotivoEliminar').val('');
            mensaje('#msjAlerta', `Motivo`, 2);

        },
        error: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            limpiarMotivo();
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);

        }
    })
}

function limpiarMotivo(){
 $('#selTipoMotivo option:contains(Seleccione)').prop('selected',true);
 $('#txtDescripcionMotivo').val('');
 $('#txtIdMotivo').val('');
}

function addRowTipoMotivo(id, tipo_motivo , descripcion ) {

  let row = $(`<tr>
     <td id="tipomotivo-${id}">${tipo_motivo}</td>
     <td id="descripcionMotivo-${id}">${descripcion}</td>

    <td>
        <button onclick="editarMotivo(${id})" type='button' class='edit btn  btn-transparente' data-toggle="modal" data-target="#agregarMensajeMotivo"  title='Editar'><i class='fa fa-pencil'></i></button>
        <button onclick="abrirModalEliminarMotivo(${id})" type='button' class='ver btn  btn-transparente' data-toggle='modal' data-target="#eliminarMotivo" title='Eliminar'><i class="fa fa-trash-o"></i></button>
    </td>
    </tr>
    `);
    
    $('#dtMotivos').DataTable().row.add(row).draw();


}


function editRowMotivo(id, tipo_motivo, descripcion){
    $(`#tipomotivo-${id}`).text(tipo_motivo)
    $(`#descripcionMotivo-${id}`).text(descripcion)

    

}




  



