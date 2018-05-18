$(document).ready(function() {

    const tablaRespuestas = $('#dtRespuestas').DataTable({ 
       "language": {
            "lengthMenu": "",
            "search": "Buscar:",
            "paginate": {
                "previous": "Anterior",
                "next": "Siguiente"
            },
            "emptyTable": "No se encontraron Respuestas",
            "zeroRecords": "No se encontraron Respuestas"
        },
        "searching": true,
        "ordering": true,
        "paging": true   
    });


    /* Metodo Get Si se Puede */    

    $.ajax({
        url: 'https://api-sascha.herokuapp.com/respuestas',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
        res.data.map(function(respuestas) {   
        addRowTipoRespuesta(respuestas.id_respuesta, respuestas.tipo_respuesta.nombre, respuestas.descripcion, respuestas.aprobado)
                
            })

        },
        error: function(res, status, xhr) {
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
        }
    })


    $.ajax({
        url: 'https://api-sascha.herokuapp.com/tipomotivos',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.map(function(tipo_motivo) {
                let option = $(`<option value="${tipo_motivo.id_tipo_motivo}">${tipo_motivo.nombre}</option> `)
                $('#seleTipoRespuesta').append(option);
            })
        },
        error: function(res, status, xhr) {
            console.log(res);
        }
    })

    $('#btnAceptarRespuesta').on('click', function() {
            
            if($('select[name=tipo_respuesta]').val() == "0"){
                console.log( $('#frmConfigurarRespuesta input[name=tipo_aprobado]:checked').val()); 
                $('select[name=tipo_respuesta]').css('border', '1px solid red');
                return;
            }
            if($('#txtDescripcionRespuesta').val() == ""){
                $('#txtDescripcionRespuesta').css('border', '1px solid red');
                return;
            }

            let aprobado = $('#frmConfigurarRespuesta input[name="tipo_aprobado"]:checked').val()
            if(aprobado == undefined || aprobado =='No aplica' ){ 
                aprobado=null; 
            }

            aprobado = aprobado == 'Si' ? true: false;

            let respuestas = {
                id_tipo_respuesta: $('select[name=tipo_respuesta]').val(),
                descripcion: $('#txtDescripcionRespuesta').val(),
                aprobado: aprobado 

            }

            console.log(respuestas)
            /* Metodo Get Si se Puede fin */

      $.ajax({
                url: 'https://api-sascha.herokuapp.com/respuestas',
                contentType: 'application/json',
                type: 'POST',
                data: JSON.stringify(respuestas),
                success: function(res, status, xhr) {
                    console.log(res);
                    const respuestas = res.data;
                    mensaje('#msjAlerta', `respuestas`, 1);
                    const nombre_tipo_respuesta = $('select[name="tipo_respuesta"] option:selected').text()
                    addRowTipoRespuesta(respuestas.id_tipo_respuesta, nombre_tipo_respuesta, respuestas.descripcion, respuestas.aprobado)           
                    limpiarRespuesta();
                },
                error: function(res, status, xhr) {
                    const respuesta = JSON.parse(res.responseText);
                    mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
                }
            })

          $('#modal-agregar-respuesta').modal('hide');

        })

    

        $('btnEditarRespuesta').on('click', function() {
        
            if($('select[name=tipo_respuesta]').val() == "0"){
                $('select[name=tipo_respuesta]').css('border', '1px solid red')
                return;
            }

            if($('#txtDescripcionRespuesta').val() == ""){
                $('#txtDescripcionRespuesta').css('border', '1px solid red');
                return;
            }

         

            let respuestas = {
                id_tipo_respuesta: $('select[name=tipo_respuesta]').val(),
                descripcion: $('#txtDescripcionRespuesta').val(),
                aprobado: aprobado 

            }


    
            const tipoR = $('select[name="tipo_respuesta"] option:selected').text()
            
            let id = $('#txtIdRespuesta').val();
            
            if(tipoR == $(`#tiporespuestas-${id}`).text() && respuestas.descripcion == $(`#descripcion-${id}`).text() && respuestas.aprobado == $(`#aprobado-${id}`).text()){
                mensaje('#msjAlerta', ``, 4);
                $('modal-agregar-respuesta').modal('hide');   
                return;
            }
            /* Metodo Put Si se Puede */
            $.ajax({
                url: `https://api-sascha.herokuapp.com/respuesta/${id}`,
                contentType: 'application/json',
                type: 'PUT',
                data: JSON.stringify(respuestas),
                success: function(res, status, xhr) {
                    console.log(respuestas)
                    mensaje('#msjAlerta', `Respuesta`, 3);
                    editRowRespuesta(id, tipoR, respuestas.descripcion, respuestas.aprobado)
                    limpiarRespuesta();
                },
                error: function(res, status, xhr) {
                    console.log(res);
                    console.log(status);
                    const respuesta = JSON.parse(res.responseText);
                    mensaje('#msjAlerta',`${respuesta.data.mensaje}`, 0);
                }
            })
            $('#modal-agregar-respuesta').modal('hide');
        })

});


function editarRespuesta(id){
    console.log('|' + $(`#tiporespuestas-${id}`).text().trim() + '|')
    console.log($(`#aprobado-${id}`).text())
    $('#seleTipoRespuesta option:contains('+ $(`#tiporespuestas-${id}`).text().trim() + ')').prop('selected',true);
    $('#txtDescripcionRespuesta').val($(`#descripcion-${id}`).text());
    $('input[name="tipo_aprobado"][value="' + $(`#aprobado-${id}`).text().trim() + '"]').prop('checked', true);
    $('#txtIdRespuesta').val(id);
    $('#btnAceptarRespuesta').css('display', 'none');
    $('#btnEditarRespuesta').css('display', 'inline');
}


function agregarRespuesta(){

    $('#btnEditarRespuesta').css('display', 'inline');
    $('#btnAceptarRespuesta').css('display', 'none');
}


function abrirModalEliminarRespuesta(id){
    $('#txtIdRespuestaEliminar').val(id);
}


function eliminarRespuesta(id){
    $.ajax({
        url: `https://api-sascha.herokuapp.com/respuesta/${id}`,
        contentType: 'application/json',
        type: 'DELETE',
        success: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            $('#dtRespuestas').DataTable().row($(`#tiporespuestas-${id}`).parent()).remove().draw();
            $('#txtIdRespuestaEliminar').val('');
            mensaje('#msjAlerta', `Respuestas`, 2);

        },
        error: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            limpiarRespuesta();
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);

        }
    })
}

function  limpiarRespuesta(){
 $('#seleTipoRespuesta option:contains(Seleccione)').prop('selected',true);
 $('#txtDescripcionRespuesta').val('');
    $('#txtIdRespuesta').val('');
}




function addRowTipoRespuesta(id, tipo_respuesta , descripcion, aprobado) {
 
 let TextoAprobado = aprobado == null ? "No aplica" : (aprobado ? "Si": "No")
  let row = $(`<tr>
     <td id="tiporespuestas-${id}">${tipo_respuesta}</td>
     <td id="descripcion-${id}">${descripcion}</td>
     <td id="aprobado-${id}" >${TextoAprobado}</td> 

    <td>
    <button onclick="editarRespuesta(${id})" type='button' class='edit btn  btn-transparente' data-toggle="modal" data-target="#modal-agregar-respuesta"  title='Editar'><i class='fa fa-pencil'></i></button>
    <button onclick="abrirModalEliminarRespuesta(${id})" type='button' class='ver btn  btn-transparente' data-toggle='modal' data-target="#eliminarRespuesta" title='Eliminar'><i class="fa fa-trash-o"></i></button>
    </td>
    </tr>
    `);
    
    $('#dtRespuestas').DataTable().row.add(row).draw();


}


function editRowRespuesta(id, tipo_respuesta, descripcion, aprobado){
    $(`#tiporespuestas-${id}`).text(tipo_respuesta)
    $(`#descripcion-${id}`).text(descripcion)
    $('#frmConfigurarRespuesta input[name=tipo_aprobado]:checked').val($(`#aprobado-${id}`).text());
  



}


