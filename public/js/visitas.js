var Script = function () {

    $('#dtDetalle').DataTable({
        "language": {
            "lengthMenu": "",
            "search": "Buscar:",
            "paginate": {
                "previous": "Anterior",
                "next": "Siguiente"
            },
            "emptyTable": "No se encontraron detalles",
            "zeroRecords": "No se encontraron detalles"
        },
        "pageLength": 5,
        "searching": true,
        "ordering": true,
        "paging": true
    });


    $('#dtMeta').DataTable({
        "language": {
            "lengthMenu": "",
            "search": "Buscar:",
            "paginate": {
                "previous": "Anterior",
                "next": "Siguiente"
            },
            "emptyTable": "No se encontraron metas",
            "zeroRecords": "No se encontraron metas"
        },
        "searching": false,
        "ordering": false,
        "paging": false,
        "info": false
    });
    /* initialize the calendar
    -----------------------------------------------------------------*/
    let data = {
        fecha_inicio: '2018-05-01',
        fecha_fin: '2019-05-31'
    }

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'basicDay,basicWeek,month'
        },
        defaultView : 'basicDay',
        editable: false,
        droppable: false, // this allows things to be dropped onto the calendar !!!
        eventClick: function(event, jsEvent, view){
            if(event.id_visita == null){
                window.location = event.url_agenda
            }else{
                let agenda =event.agenda
                let fecha_cita = moment(event.start).format('DD, MMMM YYYY')

                console.log(event)
                $('#cliente-nombre').text(agenda.nombre_cliente)
                $('#servicio-nombre').text(agenda.nombre_servicio)
                
                $('#cita-fecha').text(fecha_cita)
                $('#cita-tipo').text(agenda.tipo_cita)

                if (agenda.id_tipo_cita == 2) {
                    if ($('#color-icono-visita').hasClass('light-green')) {
                        $('#color-icono-visita').removeClass('light-green')
                    }
                    if ($('#icono-visita').hasClass('fa-stethoscope')) {
                        $('#icono-visita').removeClass('fa-stethoscope')
                    }
                    $('#color-icono-visita').addClass('turquoise')
                    $('#icono-visita').addClass('fa-eye')
                }else{
                    if ($('#color-icono-visita').hasClass('turquoise')) {
                        $('#color-icono-visita').removeClass('turquoise')
                    }
                    if ($('#icono-visita').hasClass('fa-eye')) {
                        $('#icono-visita').removeClass('fa-eye')
                    }
                    $('#color-icono-visita').addClass('light-green')
                    $('#icono-visita').addClass('fa-stethoscope')
                }
                cargarDetalle(event.id_visita, event.id_orden_servicio)
                
                $('#modalDetalle').modal()
            }
        }
        
    });

    let events = [];
    let id_empleado = JSON.parse(localStorage.getItem('empleado')).id_empleado;
    $.ajax({
      url: `https://api-sascha.herokuapp.com/agendas/empleado/${id_empleado}`,
      contentType: 'application/json',
      type: 'POST',
      data: JSON.stringify(data),
      success: function(res, status, xhr){
        res.data.map(function(agenda) {
         let event = {
            title: agenda.horario + " - " + agenda.nombre_cliente,
            id_visita: agenda.id_visita,
            id_orden_servicio: agenda.id_orden_servicio,
            agenda: agenda,
            start: agenda.fecha_inicio,
            end: agenda.fecha_fin,
            color: (agenda.id_visita != null ? '#858580': (agenda.id_tipo_cita ==1 ?'#7ab740': '#3da3cb') ),
            url_agenda: `visi_registrarVisita.html?id=${agenda.id_agenda}`
        }
        events.push(event);
    })

        $('#calendar').fullCalendar('addEventSource', events);
    },

    error: function(res, status, xhr) {

        alert('there was an error while fetching events!');
    },
})


}();

function cargarDetalle(id, orden_servicio){
    $('#dtDetalle').DataTable().clear()
    let data ={
        id_orden_servicio: orden_servicio
    }
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/detalles/visita/'+id,
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify(data),
        success: function (res, status, xhr) {
            console.log(res.data)
            $('#visita-numero').text("#"+ res.data.numero )
            res.data.detalles.map(function (detalle) {
                let valor = detalle.valor == null ? '-':Number.parseFloat(detalle.valor).toFixed(2) + " " + detalle.unidad_abreviatura
                let row = $(`<tr>   
                <td>${detalle.tipo_parametro}</td>
                <td>${detalle.nombre}</td>
                <td>${valor}</td>
                </tr>
                `);
            $('#dtDetalle').DataTable().row.add(row).draw();
            })
            res.data.metas.map(function (meta) {
                addRowMeta( meta.parametro, meta.valor, meta.signo, meta.unidad_abreviatura);
            })

        },
        error: function (res, status, xhr) {
            const respuesta = JSON.parse(res.responseText);

        }
    })
}

function addRowMeta( parametro, valor, signo, unidad) {
    let icono = ""
    if(signo==0){
        icono = 'fa-minus'
    }else{
        icono= 'fa-plus'
    }
    let row = $(`<tr>
        <td><i class="fa ${icono}"></i> </td>   
        <td>${parametro}</td>
        <td >${valor} ${unidad}</td>
        </tr>
        `);
    $('#dtMeta').DataTable().row.add(row).draw();

}