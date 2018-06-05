$(document).ready(function() {

    const tablaSolicitud = $('#dtServicio').DataTable({ 
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

$("#btnConsultarServicio").on('click',function(){

    $('#dtServicio').DataTable().clear();
           let     id_tipo_orden = $('select[name=tipoorden]').val();
           let     id_especialidad = $('select[name=especialidad]').val();
           let     id_servicio = $('select[name=servicio]').val();
           let     id_genero =          $('select[name=genero]').val();
           let     id_estado_civil =    $('select[name=estadoCivil]').val();
           let     estado =     $('select[name=estadoOrden]').val();
           let     fecha_inicial = $('#fechaInicial').val();
           let     fecha_final = $('#fechaFinal').val();

      //    if(id_motivo == "0"){
      //      id_motivo = null;
    
       if(estado == "0"){
            estado = null;
        }
     if(id_tipo_orden == "0"){
             id_tipo_orden = null;
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
     //    if(id_rango_edad== "0"){
     //        id_rango_edad = null;
     //    }
     //    console.log(fecha_final);
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
     //        id_motivo: id_motivo,
            estado: estado,
             id_tipo_orden: id_tipo_orden,
             id_especialidad: id_especialidad,
             id_servicio: id_servicio,
             id_genero:           id_genero,
             id_estado_civil:     id_estado_civil,
     //        id_rango_edad:       id_rango_edad,
            fecha_inicial:  fecha_inicial,
            fecha_final: fecha_final
        }
        let fecha_actual = moment().format('YYYY-MM-DD');
        if(filtros.fecha_final < filtros.fecha_inicial || filtros.fecha_final > fecha_actual){
            return mensaje('#msjAlerta', 'Debe seleccionar un rango de fechas valido', 13);
        }
    $('#dtServicio').DataTable().clear();
        console.log(filtros);
         $.ajax({
            url: 'https://api-sascha.herokuapp.com/ordenservicios/reporte',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(filtros),
            success: function(res, status, xhr) {
                limpiartabla()
                if(res.data.length == 0){
                    return mensaje('#msjAlerta', 'No se encontraron registros', 14);
                }else{
                    mensaje('#msjAlerta', 'de Servicio', 8);
                    console.log(res);
                    console.log(status);
                    $('#dtServicio').DataTable().clear().draw();
                    adjuntarArchivoSQL(res.query);
                                 var cont = 0;
                     res.data.map(function(orden) {
                        console.log(orden.id_orden_servicio);
                    cont = cont + 1;
                    if(orden.estado == 1){
                        estado = "Curso";
                    }
                    if(orden.estado == 2){
                        estado = "Reclamada";
                    }
                    if(orden.estado == 3){
                        estado = "Concluida";
                    }
                   addRowReporteServicio(cont, orden.id_orden_servicio, orden.nombre_cliente, orden.nombre_servicio, orden.tipo_orden, estado, orden.fecha_emision);
                })
                }
             },
            error: function(res, status, xhr) {
               console.log(res);
                console.log(status);

            }
        })


});

function addRowReporteServicio(nro, id, cliente, servicio, orden, estado, fecha){
   let row = $(`<tr>

                             <td>${nro}</td>
                             <td>${cliente}</td>
                             <td>${servicio}</td>
                             <td>${orden}</td>
                             <td>${estado}</td>
                             <td>${moment(fecha).format('DD-MM-YYYY')}</td> 
                         </tr>
    `);
   $('#dtServicio').DataTable().row.add(row).draw();
}

function adjuntarArchivoSQL(query) {
    let btnExportar = document.getElementById('btnExportarSQL');
    btnExportar.download = 'reporte-ordenes-servicios.sql';
    btnExportar.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(query);
}

function limpiartabla() {
    let btnExportar = $('#btnExportarSQL');
    btnExportar.attr('download', '');
    btnExportar.attr('href', '');
    $('#dtServicio').DataTable().clear().draw();    
}
