let cont_visita_diagnostico = 0;
let cont_visita_control = 0;
$(document).ready(function() {
    const tabla = $('#dtVisitaDiagnostico').DataTable({ 
          "language": {
              "lengthMenu": "",
              "search": "Buscar:",
              "paginate": {
                  "previous": "Anterior",
                  "next": "Siguiente"
              },
              "emptyTable": "No hay Visitas Diagnosticos",
              "zeroRecords": "No hay Visitas Diagnosticos"
          },
          "searching": true,
          "ordering": true,
          "paging": true
      });
  
});

$(document).ready(function() {
    const tabla = $('#dtVisitaControl').DataTable({ 
          "language": {
              "lengthMenu": "",
              "search": "Buscar:",
              "paginate": {
                  "previous": "Anterior",
                  "next": "Siguiente"
              },
              "emptyTable": "No hay Visitas de Control",
              "zeroRecords": "No hay Visitas de Control"
          },
          "searching": true,
          "ordering": true,
          "paging": true
      });
  
  
});

$(document).ready(function() {
    const tabla = $('#dtMisClientes').DataTable({ 
          "language": {
              "lengthMenu": "",
              "search": "Buscar:",
              "paginate": {
                  "previous": "Anterior",
                  "next": "Siguiente"
              },
              "emptyTable": "No Tienes Clientes",
              "zeroRecords": "No Tienes Clientes"
          },
          "searching": true,
          "ordering": true,
          "paging": true
      });
  
  
});

// Carga  los datos en la tabla Visitas Diagnosticos
function cargarModalVisitasD() {
      
    $('#dtVisitaDiagnostico').DataTable().clear();
    let events = [];
    let id_empleado = JSON.parse(localStorage.getItem('empleado')).id_empleado;
    let fecha ={
        fecha_inicio: "2018-05-01",
        fecha_fin: "2019-05-31"
    }
    $.ajax({
        url: `https://api-sascha.herokuapp.com/agendas/empleado/${id_empleado}`,
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify(fecha),
        success: function (res, status, xhr) {
            console.log(res.data)

            res.data.map(function (visita_diagnostico) {
                if(visita_diagnostico.id_tipo_cita == 1 && visita_diagnostico.id_visita == null){
                
          let row = $(`<tr>
                <td id="cliente-${visita_diagnostico.id_agenda}">${visita_diagnostico.nombre_cliente}</td>
                <td id="fecha_inicio-${visita_diagnostico.id_agenda}">${moment(visita_diagnostico.fecha_inicio).format('DD-MM-YYYY')}</td>
                <td id="servicio-${visita_diagnostico.id_agenda}">${visita_diagnostico.nombre_servicio}</td>
                </tr>
                `);
               
                $('#dtVisitaDiagnostico').DataTable().row.add(row).draw();
          }
            
        })

    },
    error: function (res, status, xhr) {
        const respuesta = JSON.parse(res.responseText);
        mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
    }
})
}

// Carga  los datos en la tabla Visitas de Control
function cargarModalVisitasC() {
      
    $('#dtVisitaControl').DataTable().clear();
    let events = [];
    let id_empleado = JSON.parse(localStorage.getItem('empleado')).id_empleado;
    let fecha ={
        fecha_inicio: "2018-05-01",
        fecha_fin: "2019-05-31"
    }
    $.ajax({
        url: `https://api-sascha.herokuapp.com/agendas/empleado/${id_empleado}`,
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify(fecha),
        success: function (res, status, xhr) {
            console.log(res.data)

            res.data.map(function (visita_control) {
                if(visita_control.id_tipo_cita == 2 && visita_control.id_visita == null){
                
          let row = $(`<tr>
                <td id="cliente-${visita_control.id_agenda}">${visita_control.nombre_cliente}</td>
                <td id="fecha_inicio-${visita_control.id_agenda}">${moment(visita_control.fecha_inicio).format('DD-MM-YYYY')}</td>
                <td id="servicio-${visita_control.id_agenda}">${visita_control.nombre_servicio}</td>
                </tr>
                `);
               
                $('#dtVisitaControl').DataTable().row.add(row).draw();
          }
            
        })

    },
    error: function (res, status, xhr) {
        const respuesta = JSON.parse(res.responseText);
        mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
    }
})
}


// Carga  los datos en la tabla Mis Clientes
function cargarModalMisClientes() {
      
    $('#dtMisClientes').DataTable().clear();
    let events = [];
    let id_empleado = JSON.parse(localStorage.getItem('empleado')).id_empleado;
    let fecha ={
        fecha_inicio: "2018-05-01",
        fecha_fin: "2019-05-31"
    }
    $.ajax({
        url: `https://api-sascha.herokuapp.com/agendas/empleado/${id_empleado}`,
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify(fecha),
        success: function (res, status, xhr) {
            console.log(res.data)

            res.data.map(function (visita_clientes) {
                if( visita_clientes.id_visita == null){
                
          let row = $(`<tr>
                <td id="cliente-${visita_clientes.id_agenda}">${visita_clientes.nombre_cliente}</td>
                <td id="fecha_inicio-${visita_clientes.id_agenda}">${moment(visita_clientes.fecha_inicio).format('DD-MM-YYYY')}</td>
                <td id="servicio-${visita_clientes.id_agenda}">${visita_clientes.nombre_servicio}</td>
                </tr>
                `);
               
                $('#dtMisClientes').DataTable().row.add(row).draw();
          }
            
        })

    },
    error: function (res, status, xhr) {
        const respuesta = JSON.parse(res.responseText);
        mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
    }
})
}
////////////////////////////////////////////////////////////////////7

(function ($) {
    "use strict";
    $(document).ready(function () {
        if ($.fn.plot) {

            var d1 = [
            [0, 0],
            [1, 10],
            [2, 14],
            [3, 20],
            [4, 13],
            [5, 9]
            ];
            var data = ([{
                label: "Para",
                data: d1,
                lines: {
                    show: true,
                    fill: true,
                    lineWidth: 2,
                    fillColor: {
                        colors: ["rgba(255,255,255,.1)", "rgba(160,220,220,.8)"]
                    }
                }
            }]);
            var options = {
                grid: {
                    backgroundColor: {
                        colors: ["#fff", "#fff"]
                    },
                    borderWidth: 0,
                    borderColor: "#f0f0f0",
                    margin: 0,
                    minBorderMargin: 0,
                    labelMargin: 20,
                    hoverable: true,
                    clickable: true
                },
                // Tooltip
                tooltip: true,
                tooltipOpts: {
                    content: "Clientes: %y",
                    shifts: {
                        x: -60,
                        y: 25
                    },
                    defaultTheme: false
                },

                legend: {
                    labelBoxBorderColor: "#ccc",
                    show: false,
                    noColumns: 0
                },
                series: {
                    stack: true,
                    shadowSize: 0,
                    highlightColor: 'rgba(30,120,120,.5)'

                },
                xaxis: {
                    tickLength: 0,
                    tickDecimals: 0,
                    show: true,
                    ticks: [[1, "Lu"], [2, "Mar"], [3, "Mie"], [4,"Jue"], [5,"Vie"]],
                    min: 1,

                    font: {

                        style: "normal",


                        color: "#666666"
                    }
                },
                yaxis: {
                    ticks: 3,
                    tickDecimals: 0,
                    show: true,
                    tickColor: "#f0f0f0",
                    font: {

                        style: "normal",


                        color: "#666666"
                    }
                },
                points: {
                    show: true,
                    radius: 2,
                    symbol: "circle"
                },
                colors: ["#87cfcb", "#48a9a7"]
            };
            var plot = $.plot($("#clientes-semanales"), data, options);

        }
        /*==Slim Scroll ==*/
        if ($.fn.slimScroll) {
            $('.event-list').slimscroll({
                height: '305px',
                wheelStep: 20
            });
        }

    $(document).on('click', '.event-close', function () {
        $(this).closest("li").remove();
        return false;
    });

    $('.stat-tab .stat-btn').click(function () {

        $(this).addClass('active');
        $(this).siblings('.btn').removeClass('active');

    });


    /*Calendar*/
    $(function () {
        $('.evnt-input').keypress(function (e) {
            var p = e.which;
            var inText = $('.evnt-input').val();
            if (p == 13) {
                if (inText == "") {
                    alert('Empty Field');
                } else {
                    $('<li>' + inText + '<a href="#" class="event-close"> <i class="ico-close2"></i> </a> </li>').appendTo('.event-list');
                }
                $(this).val('');
                $('.event-list').scrollTo('100%', '100%', {
                    easing: 'swing'
                });
                return false;
                e.epreventDefault();
                e.stopPropagation();
            }
        });
    });

});


})(jQuery);
