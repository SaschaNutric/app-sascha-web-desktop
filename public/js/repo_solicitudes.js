$(document).ready(function() {

    const tablaSolicitud = $('#dtSolicitud').DataTable({ 
       "language": {
        "lengthMenu": "",
        "search": "Buscar:",
        "paginate": {
            "previous": "Anterior",
            "next": "Siguiente"
        },
        "emptyTable": "No se encontraron solicitudes ",
        "zeroRecords": "No se encontraron solicitudes con esas caracteristicas"
    },
    "searching": true,
    "ordering": true,
    "paging": true   
});

});

$("#btnConsultarSolicitudes").on('click',function(){

    $('#dtSolicitud').DataTable().clear();

        let     id_motivo  = $('select[name=motivo]').val();
        let     id_respuesta = $('select[name=respuesta]').val();
        let     id_especialidad = $('select[name=especialidad]').val();
        let     id_servicio = $('select[name=servicio]').val();
        let     id_genero =          $('select[name=genero]').val();
        let     id_estado_civil =    $('select[name=estadoCivil]').val();
        let     id_rango_edad =     $('select[name=edad]').val();
        let     fecha_inicial = $('#fechaInicial').val();
        let     fecha_final = $('#fechaFinal').val();



         if(id_motivo == "0"){
            id_motivo = null;
        }
        if(id_respuesta == "0"){
            id_respuesta = null;
        }
        if(id_especialidad == "0"){
            id_especialidad = null;
        }
        if(id_servicio == "0"){
            id_servicio = null;
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
            id_motivo: id_motivo,
            id_respuesta: id_respuesta,
            id_especialidad: id_especialidad,
            id_servicio: id_servicio,
            id_genero:           id_genero,
            id_estado_civil:     id_estado_civil,
            id_rango_edad:       id_rango_edad,
            fecha_inicial:  fecha_inicial,
            fecha_final: fecha_final
        }

        console.log(filtros);
         $.ajax({
            url: 'https://api-sascha.herokuapp.com/solicitudes/reporte',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(filtros),
            success: function(res, status, xhr) {
                mensaje('#msjAlerta', 'de solicitudes', 8)
                console.log(res);
                console.log(status);
                        var cont = 0;
                 res.data.map(function(solicitud) {
                cont = cont + 1;
                addRowReporteSolicitud(cont, solicitud.id_solicitud_servicio, solicitud.nombre_cliente, solicitud.nombre_servicio
, solicitud.fecha_creacion, solicitud.respuesta);
            })
              
            },
            error: function(res, status, xhr) {
               console.log(res);
                console.log(status);

            }
        })


});

$("#btnLimpiarSolicitud").on('click', function(){
  $('#dtSolicitud').DataTable().clear();
});

function limpiartabla(){
    $('#dtSolicitud').DataTable().clear().draw();
     $('#dtSolicitud').DataTable().clear();
}


function addRowReporteSolicitud(nro, id, cliente, servicio, fecha, respuesta){
   let row = $(`<tr>
                             <td>${nro}</td>
                             <td>${cliente}</td>
                             <td>${servicio}</th>
                             <td>${moment(fecha).format('DD-MM-YYYY')}</td>
                             <td>${respuesta}</td>
                         </tr>
    `);
   $('#dtSolicitud').DataTable().row.add(row).draw();
}