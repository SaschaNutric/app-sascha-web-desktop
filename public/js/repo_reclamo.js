$(document).ready(function() {

    const tablaReclamo = $('#dtReclamo').DataTable({ 
       "language": {
        "lengthMenu": "",
        "search": "Buscar:",
        "paginate": {
            "previous": "Anterior",
            "next": "Siguiente"
        },
        "emptyTable": "No se encontraron reclamos ",
        "zeroRecords": "No se encontraron reclamos con esas caracteristicas"
    },
    "searching": true,
    "ordering": true,
    "paging": true   
});

});

$("#btnConsultarReclamos").on('click',function(){

    $('#dtReclamo').DataTable().clear();

        let     id_motivo  = $('select[name=motivo]').val();
        let     id_respuesta = $('select[name=respuestareclamo]').val();
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
        let fecha_actual = moment().format('YYYY-MM-DD');
        if(filtros.fecha_final < filtros.fecha_inicial || filtros.fecha_final > fecha_actual){
            return mensaje('#msjAlerta', 'Debe seleccionar un rango de fechas valido', 13);
        }
        console.log(filtros);
         $.ajax({
            url: 'https://api-sascha.herokuapp.com/reclamos/reporte',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(filtros),
            success: function(res, status, xhr) {
                limpiartabla()
                if(res.data.length == 0){
                    return mensaje('#msjAlerta', 'No se encontraron registros', 14);
                }else{
                    mensaje('#msjAlerta', 'de reclamos', 8)
                    console.log(res);
                    console.log(status);
                    var cont = 0;
                     res.data.map(function(reclamo) {
                    cont = cont + 1;
                    addRowReporteReclamo(cont, reclamo.id_reclamo, reclamo.nombre_cliente, reclamo.nombre_servicio
                    , reclamo.motivo_descripcion, reclamo.respuesta_descripcion,reclamo.fecha_creacion);
                })
                }
              
            },
            error: function(res, status, xhr) {
               console.log(res);
                console.log(status);

            }
        })


});



function limpiartabla(){
    $('#dtReclamo').DataTable().clear().draw();
}


function addRowReporteReclamo(nro, id, cliente, servicio, motivo, respuesta, fecha){
   let row = $(`<tr>
                             <td>${nro}</td>
                             <td>${cliente}</td>
                             <td>${servicio}</th>
                             <td>${motivo}</td>
                             <td>${respuesta}</td>
                             <td>${moment(fecha).format('DD-MM-YYYY')}</td>
                         </tr>
    `);
   $('#dtReclamo').DataTable().row.add(row).draw();
}