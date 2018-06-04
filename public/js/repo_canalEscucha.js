$(document).ready(function() {

    const tablaCanalEscucha = $('#dtCanalEscucha').DataTable({ 
       "language": {
        "lengthMenu": "",
        "search": "Buscar:",
        "paginate": {
            "previous": "Anterior",
            "next": "Siguiente"
        },
        "emptyTable": "No se encontraron comentarios ",
        "zeroRecords": "No se encontraron comentarios con esas caracteristicas"
    },
    "searching": true,
    "ordering": true,
    "paging": true   
});


$( '#selContacto').on('change',(function(){
    var str = $("#selContacto").val();
    console.log(str)

     if(str==0)
        {
            $('#contactoGeneral').css('display', 'none');
        }
        else 
            $('#contactoGeneral').css('display', 'inline');

    if(str == 4){
        $.ajax({
            url: 'https://api-sascha.herokuapp.com/motivos/queja',
            contentType: 'application/json',
            type: 'GET',
            success: function(res, status, xhr) {
                console.log(res);
                res.data.map(function(queja) {
                    let option = $(`<option value="${queja.id_motivo}">${queja.descripcion}</option>`)
                    $('#selMotivoConctato').append(option);
                })
            },
            error: function(res, status, xhr) {
                console.log(res)
                console.log(status)
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
            }
        })
    }

    if(str == 5){
        $.ajax({
            url: 'https://api-sascha.herokuapp.com/motivos/sugerencia',
            contentType: 'application/json',
            type: 'GET',
            success: function(res, status, xhr) {
                console.log(res);
                res.data.map(function(sugerencia) {
                    let option = $(`<option value="${sugerencia.id_motivo}">${sugerencia.descripcion}</option>`)
                    $('#selMotivoConctato').append(option);
                })
            },
            error: function(res, status, xhr) {
                console.log(res)
                console.log(status)
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
            }
        })
    }
        
 $.ajax({
        url: 'https://api-sascha.herokuapp.com/respuestas/tipomotivo/'+str,
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            console.log(res);
            res.data.map(function(respuesta) {
                let option = $(`<option value="${respuesta.id_respuesta}">${respuesta.descripcion}</option>`)
                $('#selRespuestaContacto').append(option);
            })
        },
        error: function(res, status, xhr) {
            console.log(res)
            console.log(status)
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
        }
    })
  }))



});

$("#btnConsultarContacto").on('click',function(){

    $('#dtCanalEscucha').DataTable().clear();

        let     id_tipo_motivo = $('select[name=conctacto]').val();
        let     id_motivo  = $('select[name=motivo]').val();
        let     id_respuesta = $('select[name=respuestareclamo]').val();
        let     id_genero =          $('select[name=genero]').val();
        let     id_estado_civil =    $('select[name=estadoCivil]').val();
        let     id_rango_edad =     $('select[name=edad]').val();
        let     fecha_inicial = $('#fechaInicial').val();
        let     fecha_final = $('#fechaFinal').val();


        if(id_tipo_motivo == "0"){
            id_tipo_motivo = null;
        }
        if(id_motivo == "0"){
            id_motivo = null;
        }
        if(id_respuesta == "0"){
            id_respuesta = null;
        }
        if(id_genero== "0"){
            id_genero = null;
        }
        if(id_estado_civil== "0"){
            id_estado_civil = null;
        }
        if(id_rango_edad== "0"){
            id_rango_edad = null;
        }
        console.log(fecha_final);
                if(fecha_final.length)
        {
          fecha_final =  moment(fecha_final).format('YYYY-MM-DD');
        }
         if(fecha_inicial.length)
        {
          fecha_inicial =  moment(fecha_inicial).format('YYYY-MM-DD');
        }
        else{
            fecha_final = null;
            fecha_inicial = null;
        }


     let filtros = {
            id_tipo_motivo: id_tipo_motivo,
            id_motivo: id_motivo,
            id_respuesta: id_respuesta,
            id_genero:           id_genero,
            id_estado_civil:     id_estado_civil,
            id_rango_edad:       id_rango_edad,
            fecha_inicial:  fecha_inicial,
            fecha_final: fecha_final
        }

        console.log(filtros);
         $.ajax({
            url: 'https://api-sascha.herokuapp.com/comentarios/reporte',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(filtros),
            success: function(res, status, xhr) {
                mensaje('#msjAlerta', 'de Canal de Escucha', 8)
                console.log(res);
                console.log(status);
                var cont = 0;
                 res.data.map(function(comentario) {
                cont = cont + 1;
                addRowReporteReclamo(cont, comentario.id_comentario, comentario.nombre_cliente, comentario.tipo_motivo
                , comentario.motivo_descripcion, comentario.respuesta,comentario.fecha_creacion);
            })
              
            },
            error: function(res, status, xhr) {
               console.log(res);
                console.log(status);

            }
        })


});

$("#btnLimpiarContacto").on('click', function(){
  $('#dtCanalEscucha').DataTable().clear();
});

function limpiartabla(){
    $('#dtCanalEscucha').DataTable().clear().draw();
     $('#dtCanalEscucha').DataTable().clear();
}


function addRowReporteReclamo(nro, id, cliente, contacto, motivo, respuesta, fecha){
    let row;
    if(respuesta == null){
        row = $(`<tr>
                             <td>${nro}</td>
                             <td>${cliente}</td>
                             <td>${contacto}</th>
                             <td>${motivo}</td>
                             <td></td>
                             <td>${moment(fecha).format('DD-MM-YYYY')}</td>
                         </tr>
    `);
    }else{
        row = $(`<tr>
                                  <td>${nro}</td>
                                  <td>${cliente}</td>
                                  <td>${contacto}</th>
                                  <td>${motivo}</td>
                                  <td>${respuesta}</td>
                                  <td>${moment(fecha).format('DD-MM-YYYY')}</td>
                              </tr>
         `);
    }
   $('#dtCanalEscucha').DataTable().row.add(row).draw();
}