$(document).ready(function() {
    const tablaVisitas = $('#dtVisitas').DataTable({
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
         "emptyTable": "No se encontraron visitas",
         "zeroRecords": "No se encontraron visitas"
     },
     "searching": true,
     "ordering": true,
     "paging": true   
 });

 $.ajax({
    url: 'https://api-sascha.herokuapp.com/tipomotivos/incidencia',
    contentType: 'application/json',
    type: 'GET',
    success: function(res, status, xhr) {
        res.data.motivos.map(function(motivos) {
            let option = $(`<option value="${motivos.id_motivo}">${motivos.descripcion}</option>`)
            $('#selMotivo').append(option);
        })
    },
    error: function(res, status, xhr) {
        console.log(res)
        console.log(status)
        const respuesta = JSON.parse(res.responseText);
        mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);

    }
 })

 $('#btnBuscar').on('click', function() {
    $('#dtVisitas').DataTable().rows().remove().draw();
    var fecha = $('#dtpFechaIncidencia').val();
    var date = fecha.split("-").reverse().join("-");
    console.log(date);
    /* var fecha_actual = moment().format('YYYY-MM-DD');
    var d = fecha_actual.getDate();
    var m = fecha_actual.getMonth()+1;
    var y = fecha_actual.getFullYear();
    fecha = y+'-0'+m+'-'+d;
    console.log(fecha_actual) */

    /* if(date < fecha){
        return mensaje('#msjAlerta', `Debe elegir una fecha mayor o igual a la actual`, 13);
        console.log('mensajeeee')
    } */
    
    let data = {
        fecha_inicio: date,
        fecha_fin: date
    }

    let id_empleado = JSON.parse(localStorage.getItem('empleado')).id_empleado;
    $.ajax({
      url: `https://api-sascha.herokuapp.com/agendas/empleado/${id_empleado}`,
      contentType: 'application/json',
      type: 'POST',
      data: JSON.stringify(data),
      success: function(res, status, xhr){
          console.log(res.data);
        res.data.map(function(agenda) {
        let row = $(`<tr>
            <td id="horario-${agenda.id_agenda}">${agenda.horario}</td>
            <td id="idCita-${agenda.id_agenda}" style="display: none;">${agenda.id_cita}</td>
            <td id="cliente-${agenda.id_agenda}">${agenda.nombre_cliente}</td>
            <td id="servicio-${agenda.id_agenda}">${agenda.nombre_servicio}</td>
            <td id="tipo_visita-${agenda.id_agenda}">${agenda.tipo_cita}</td>
            <td>
                <button onclick="registrarIncidencia(${agenda.id_agenda})" type='button' class='edit btn  btn-transparente' data-toggle="modal" data-target="#registrarIncidencia"  title='Registrar'><i class='fa fa-warning'></i></button>
            </td>
         </tr>
         `);
        $('#dtVisitas').DataTable().row.add(row).draw();
        
    })
    },

    error: function(res, status, xhr) {

        alert('there was an error while fetching events!');
    },
})

})

$('#btnRegistrar').on('click', function() {
    if($('select[name=motivo]').val() == "0"){
        mensaje('#msjAlerta2', ``, 5);
        return;
    }
    if($('#txtDescipcion').val() == ''){
        mensaje('#msjAlerta2', ``, 5);
        return;
    }
    
    let incidencia = {
        id_tipo_incidencia: "2",
        id_motivo: $('select[name=motivo]').val(),
        descripcion: $('#txtDescipcion').val(),
        id_cita: $('#txtIdCita').val(),
        id_agenda: $('#txtIdAgenda').val()
    }
    
    console.log(incidencia)
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/incidencias',
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify(incidencia),
        success: function(res, status, xhr) {
            console.log(res);
            $('#dtVisitas').DataTable().row($(`#cliente-${incidencia.id_agenda}`).parent()).remove().draw();            
            mensaje('#msjAlerta', `Incidencia`, 1);
            $('#registrarIncidencia').modal('hide');
        },
        error: function(res, status, xhr) {
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
        }
    })

    

})
 

});

//date picker start
$(function(){
    window.prettyPrint && prettyPrint();
    $('.dpYears').datepicker();
});


//date picker end


var Script = function () {
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth()+1;
        var y = date.getFullYear();
        fecha = y+'-0'+m+'-'+d;

        var date = fecha.split("-").reverse().join("-");
        $('#dtpFechaIncidencia').val(date);

        
        let data = {
            fecha_inicio: fecha,
            fecha_fin: fecha
        }

        let id_empleado = JSON.parse(localStorage.getItem('empleado')).id_empleado;
        $.ajax({
          url: `https://api-sascha.herokuapp.com/agendas/empleado/${id_empleado}`,
          contentType: 'application/json',
          type: 'POST',
          data: JSON.stringify(data),
          success: function(res, status, xhr){
            
            res.data.map(function(agenda) {
            let row = $(`<tr>
                <td id="horario-${agenda.id_agenda}">${agenda.horario}</td>
                <td id="idCita-${agenda.id_agenda}" style="display: none;">${agenda.id_cita}</td>
                <td id="cliente-${agenda.id_agenda}">${agenda.nombre_cliente}</td>
                <td id="servicio-${agenda.id_agenda}">${agenda.nombre_servicio}</td>
                <td id="tipo_visita-${agenda.id_agenda}">${agenda.tipo_cita}</td>
                <td>
                    <button onclick="registrarIncidencia(${agenda.id_agenda})" type='button' class='edit btn  btn-transparente' data-toggle="modal" data-target="#registrarIncidencia"  title='Registrar'><i class='fa fa-warning'></i></button>
                </td>
             </tr>
             `);
            $('#dtVisitas').DataTable().row.add(row).draw();     
        })
        },
    
        error: function(res, status, xhr) {
    
            alert('there was an error while fetching events!');
        },
    })

}();

function registrarIncidencia(id){
    $('#txtIdCita').val($(`#idCita-${id}`).text());
    $('#txtIdAgenda').val(id);
}