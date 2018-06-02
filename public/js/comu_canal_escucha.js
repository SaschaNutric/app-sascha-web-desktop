$(document).ready(function() {

tablaComentario = $('#dt2canalescucha').DataTable({ 
        "aoColumnDefs": [
        { "bSortable": false, "aTargets": [5] }
        ],
       "language": {
        "lengthMenu": "",
        "search": "Buscar:",
        "paginate": {
            "previous": "Anterior",
            "next": "Siguiente"
        },
        "emptyTable": "No se encontraron unidades",
        "zeroRecords": "No se encontraron unidades"
    },
    "searching": true,
    "ordering": true,
    "paging": true   
});

  $.ajax({
    url: 'https://api-sascha.herokuapp.com/comentarios',
    contentType: 'application/json',
    type: 'GET',
    success: function(res, status, xhr) {
    console.log(res.data);
    res.data.map(function(comentario) { 
      let respuesta = '';
      let mensaje = comentario.mensaje || '';
      if (comentario.id_respuesta != null) respuesta = comentario.respuesta.descripcion;

      addRowTipoComentario(
        
        comentario.id_comentario,
        comentario.fecha_creacion,
        comentario.cliente.nombres+" "+comentario.cliente.apellidos,
        comentario.motivo.tipo_motivo.id_tipo_motivo,
        comentario.motivo.tipo_motivo.nombre, 
        comentario.motivo.descripcion,
        comentario.contenido,
        mensaje
         
      );                
    })
  },
  error: function(res, status, xhr) {
    const respuesta = JSON.parse(res.responseText);
      mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
    }
  });

   /* url: 'https://api-sascha.herokuapp.com/comentarios',
    contentType: 'application/json',
    type: 'GET',
    success: function(res, status, xhr) {
    console.log(res.data);
    res.data.map(function(comentario) { 
      let respuesta = '';
      let mensaje = comentario.mensaje || '';
      if (comentario.id_respuesta != null) respuesta = comentario.respuesta.descripcion;

              let addRowTipoComentario  let row = $(`<tr>
                  <td id="fecha_creacion-${comentario.id}">${moment('comentario.fecha_creacion','YYYY-MM-DD, h:mm:ss a').format('DD-MM-YYYY, h:mm:ss a')}</td>
                  <td id="cliente-${comentario.id}">${comentario.cliente}</td>
                  <td id="tipo_motivo-${comentario.id}">${comentario.tipo_motivo}</td>
                  <td id="motivo-${comentario.id}">${comentario.motivo}</td>
                  <td id="contenido-${comentario.id}">${comentario.contenido}</td>
                  <td>
                    <button onclick="editarComunicacion(${comentario.id}, ${comentario.id_tipo_motivo})" type='button' class='edit btn  btn-transparente' data-toggle="modal" data-target="#modal-enviar-respuesta"  title='Editar'>
                    <i class='fa fa-pencil'></i>
                    </button>
                  </td>
              </tr>
    `);
    $('#dt2canalescucha').DataTable().row.add(row).draw()
            })

        },
        error: function (res, status, xhr) {
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
        }
    })

*/



  $('#btnEnviar').on('click', function() {
    if($('select[name=selRespuesta]').val() == "0"){
      $('select[name=selRespuesta]').css('border', '1px solid red')
      return;
    }
    if($('#txtComentario').val() == ""){
      $('#txtComentario').css('border', '1px solid red');
      return;
    }
    if($('#txtMensaje').val() == ""){
      $('#txtMensaje').css('border', '1px solid red');
      return;
    }
    
    let comentario = {
      id_respuesta: $('select[name=selRespuesta]').val(),
      mensaje: $('#txtMensaje').val()
    }

    const descripcion_respuesta =  $('select[name="selRespuesta"] option:selected').text()

    let id = $('#txtIdComunicacion').val();

    if(descripcion_respuesta == $(`#respuesta-${id}`).text() &&  $('#txtMensaje').val().text == $(`#mensaje-${id}`).text())
    {
        mensaje('#msjAlerta', ``, 4);
        $('#modal-enviar-respuesta').modal('hide');   
        return;
    }

    $.ajax({
      url: `https://api-sascha.herokuapp.com/comentario/${id}`,
      contentType: 'application/json',
      type: 'PUT',
      data: JSON.stringify(comentario),
      success: function(res, status, xhr) {
        mensaje('#msjAlerta', `Motivo`, 3);
        refressRowTipoComentario(
        id, 
        descripcion_respuesta,
        comentario.mensaje
      );                
        
        limpiar();
      },
      error: function(res, status, xhr) {
        console.log(res);
        console.log(status);
        const respuesta = JSON.parse(res.responseText);
        mensaje('#msjAlerta',`${respuesta.data.mensaje}`, 0);
      }
    });
  });

});

function  addRowTipoComentario(id, fecha_creacion, cliente, id_tipo_motivo,tipo_motivo, motivo, contenido, respuesta, mensaje ) {
  let row = $(`<tr>
                  <td id="fecha_creacion-${id}">${moment(fecha_creacion,'YYYY-MM-DD, h:mm:ss a').format('DD-MM-YYYY')}</td>
                  <td id="cliente-${id}">${cliente}</td>
                  <td id="tipo_motivo-${id}">${tipo_motivo}</td>
                  <td id="motivo-${id}">${motivo}</td>
                  <td id="contenido-${id}">${contenido}</td>
                  <td>
                    <button onclick="editarComunicacion(${id}, ${id_tipo_motivo})" type='button' class='edit btn  btn-transparente' data-toggle="modal" data-target="#modal-enviar-respuesta"  title='Responder comentario'>
                    <i class='fa fa-comment'></i>
                    </button>
                  </td>
              </tr>
    `);
    $('#dt2canalescucha').DataTable().row.add(row).draw();
}
function editarComunicacion(id, id_tipo_motivo){
  document.getElementById('selRespuesta').length = 1;
  $.ajax({
    url: `https://api-sascha.herokuapp.com/respuestas/tipomotivo/${id_tipo_motivo}`,
    contentType: 'application/json',
    type: 'GET',
    success: function(res, status, xhr) {
      res.data.map(function(respuesta_tipo) {
        let option = $(`<option value="${respuesta_tipo.id_respuesta}">
          ${respuesta_tipo.descripcion}</option> `);
        $('#selRespuesta').append(option);
      })
    },
    error: function(res, status, xhr) {
      console.log(res);
    }
  });
  $('#txtIdComunicacion').val(id);
  $('#selRespuesta option:contains('+ $(`#respuesta-${id}`).text() + ')').prop('selected',true);
  $('#txtCliente').val($(`#cliente-${id}`).text());
  $('#txtComentario').val($(`#contenido-${id}`).text());
  $('#txtMensaje').val($(`#mensaje-${id}`).text());
  $('#btnCancelar').css('display', 'none');
  $('#btnEnviar').css('display', 'inline');
}

function refressRowTipoComentario(id, respuesta, mensaje){
  $(`#respuesta-${id}`).text(respuesta)
  $(`#mensaje-${id}`).text(mensaje)
}

function limpiar(){
  $('#txtIdComunicacion').val('');
  $('#selRespuesta option:contains(Seleccione)').prop('selected',true);
  $('#txtCliente').val('');
  $('#txtComentario').val('');
  $('#txtMensaje').val('');

}