var Script = function () {

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
            start: agenda.fecha_inicio,
            end: agenda.fecha_fin,
            color: (agenda.id_tipo_cita ==1 ? '#7ab740': '#3da3cb'),
            url: `visi_registrarVisita.html?id=${agenda.id_agenda}`
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