$(document).ready(function () {

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
    success: function (res, status, xhr) {
      console.log(res.data);
      res.data.map(function (comentario) {
        let respuesta = '';
        let mensaje = comentario.mensaje || '';
        if (comentario.id_respuesta == null) {
          addRowTipoComentario(

            comentario.id_comentario,
            comentario.fecha_creacion,
            comentario.cliente.nombres + " " + comentario.cliente.apellidos,
            comentario.motivo.tipo_motivo.id_tipo_motivo,
            comentario.motivo.tipo_motivo.nombre,
            comentario.motivo.descripcion,
            comentario.contenido,
            mensaje

          );

        }

      })
    },
    error: function (res, status, xhr) {
      const respuesta = JSON.parse(res.responseText);
      mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
    }
  });

  $('#btnEnviar').on('click', function () {
    if ($('#selRespuesta').val() === "0") {
      console.log("POLICE")
      console.log($('select[name=selRespuesta]').val());
      $('select[name=selRespuesta]').css('border', '1px solid red')
        mensaje('#msjAlertaModal', ``, 5);

      return;
    }
    let comentario = {
      id_respuesta: $('select[name=selRespuesta]').val(),
      mensaje: $('#txtMensaje').val()
    }
    const descripcion_respuesta = $('select[name="selRespuesta"] option:selected').text()
    let id = $('#txtIdComunicacion').val();


    $.ajax({
      url: `https://api-sascha.herokuapp.com/comentario/${id}`,
      contentType: 'application/json',
      type: 'PUT',
      data: JSON.stringify(comentario),
      success: function (res, status, xhr) {
        mensaje('#msjAlerta', `Exito`, 16);
        $('#dt2canalescucha').DataTable().row($(`#tipo_motivo-${id}`).parent()).remove().draw()
        limpiar();
        $('#modal-enviar-respuesta').modal('hide')
      },
      error: function (res, status, xhr) {
        console.log(res);
        console.log(status);
        const respuesta = JSON.parse(res.responseText);
        mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
      }
    });
  });

});

function addRowTipoComentario(id, fecha_creacion, cliente, id_tipo_motivo, tipo_motivo, motivo, contenido, respuesta, mensaje) {
  let row = $(`<tr>
                  <td id="fecha_creacion-${id}">${moment(fecha_creacion, 'YYYY-MM-DD, h:mm:ss a').format('DD-MM-YYYY')}</td>
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
function editarComunicacion(id, id_tipo_motivo) {
  document.getElementById('selRespuesta').length = 1;
  $.ajax({
    url: `https://api-sascha.herokuapp.com/respuestas/tipomotivo/${id_tipo_motivo}`,
    contentType: 'application/json',
    type: 'GET',
    success: function (res, status, xhr) {
      res.data.map(function (respuesta_tipo) {
        let option = $(`<option value="${respuesta_tipo.id_respuesta}">
          ${respuesta_tipo.descripcion}</option> `);
        $('#selRespuesta').append(option);
      })
    },
    error: function (res, status, xhr) {
      console.log(res);
    }
  });
  $('#txtIdComunicacion').val(id);
  $('#selRespuesta option:contains(' + $(`#respuesta-${id}`).text() + ')').prop('selected', true);
  $('#txtCliente').val($(`#cliente-${id}`).text());
  $('#txtMotivo').val($(`#motivo-${id}`).text());
  $('#txtComentario').val($(`#contenido-${id}`).text());
  $('#txtMensaje').val($(`#mensaje-${id}`).text());
  $('#btnCancelar').css('display', 'none');
  $('#btnEnviar').css('display', 'inline');
}
function refressRowTipoComentario(id, respuesta, mensaje) {
  $(`#respuesta-${id}`).text(respuesta)
  $(`#mensaje-${id}`).text(mensaje)
}
function limpiar() {
  $('#txtIdComunicacion').val('');
  $('#selRespuesta option:contains(Seleccione)').prop('selected', true);
  $('#txtCliente').val('');
  $('#txtMotivo').val('');
  $('#txtComentario').val('');
  $('#txtMensaje').val('');
}
function validate() {
    let validate = true;
    let ofertaRespuesta = {
        nombre: $('#txtCliente').val(),
        servicio: $('#txtMotivo').val(),
        descripcion: $('#txtComentario').val(),
        descuento: $('#txtMensaje').val(),
    }
    if (ofertaPromo.nombre == '' || ofertaPromo.servicio == 0 || ofertaPromo.descripcion == '' || ofertaPromo.descuento == '' || ofertaPromo.valido_desde == '' || ofertaPromo.valido_hasta == '' || ofertaPromo.estado_civil == 0 || ofertaPromo.rango_edad == 0 || ofertaPromo.genero == 0 ) {
        validate = false;
    }

    return validate;
}