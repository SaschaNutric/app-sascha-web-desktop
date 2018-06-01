$(document).ready(function() {
    $('#dtVisitaDiagnostico').DataTable({ 
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
  
    $('#dtVisitaControl').DataTable({ 
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
  
    $('#dtMisClientes').DataTable({ 
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

    let fecha_actual = moment().format('DD-MM-YYYY');
    let hora_actual = moment('hh:mm');


    let id_empleado = JSON.parse(localStorage.getItem('empleado')).id_empleado;
    let fecha ={
        fecha_inicio: "2018-05-01",
        fecha_fin: "2019-05-31"
    }
    $.ajax({
        url: `https://api-sascha.herokuapp.com/agendas/empleado/dashboard/${id_empleado}`,
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify(fecha),
        success: function (res, status, xhr) {
            console.log(res.data)
            let dashboard = res.data;
            let clientes_hoy = dashboard.agendas;
            console.log(fecha_actual)
            $('#fecha_actual').text(fecha_actual);
            $('#VisitaDiagnostico').text(dashboard.visita_diagnostico);
            $('#VisitaControl').text(dashboard.visita_control);
            $('#misClientes').text(dashboard.clientes);

            for(let i = 0; i < clientes_hoy.length; i++){
                $('#listaClientes').append(`<li id="cliente-${i}">${clientes_hoy[i].horario}`+` - `+`${clientes_hoy[i].nombre_cliente}`
                       +`<a  data-toggle="dropdown" class="dropdown-toggl pull-right" style="color: white !important" href="#"><i class="fa fa-ellipsis-v"></i></a>
                    <ul class="dropdown-menu">
                    <li><a onclick="" href="visi_registrarVisita.html?id=${clientes_hoy[i].id_agenda}"><i class=" fa fa-medkit"></i>Atender</a></li>
                    <li><a href="#"><i class="fa fa-warning"></i>Registrar incidencia</a></li>
                    </ul>
                </li>`)
                if(i==0){
                    $('#nombre-cliente').text(clientes_hoy[i].nombre_cliente);
                    $('#servicio-cliente').text(clientes_hoy[i].nombre_servicio);
                    $('#cliente-nombre').text(clientes_hoy[i].nombre_cliente)
                    $('#servicio-nombre').text(clientes_hoy[i].nombre_servicio)
                
                

                    let datos = {
                        id_cliente: clientes_hoy[i].id_cliente,
                        id_orden_servicio: clientes_hoy[i].id_orden_servicio
                    }

                    $.ajax({
                        url: 'https://api-sascha.herokuapp.com/cliente/visitas',
                        contentType: 'application/json',
                        type: 'POST',
                        data: JSON.stringify(datos),
                        success: function(res, status, xhr) {
                            console.log(res.data);
                            let proximoCliente = res.data;
                            $('#historialVisita').text('Historial de Visitas')
                            proximoCliente.map(function(visita){
                                $('#cita-fecha').text(visita.fecha_atencion)
                                $('#cita-tipo').text(visita.numero)
                                $('#ulHistorialVisitas').append(`<li id="visita-${visita.numero}">${visita.fecha_atencion}
                                    <a onclick="cargardetalle(${visita.id_visita})" data-toggle="modal" data-target="#modalDetalle"></a>
                                </li>`)
                            })

                        },
                        error: function(res, status, xhr) {
                            console.log(res.responseText)
                            const respuesta = JSON.parse(res.responseText);
                            if(res.responseText == '{"error":true,"data":{"mensaje":"Aun no tiene visitas registradas"}}'){
                                $('#historialVisita').text('Aún no tiene visitas registradas')
                            }
                            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
                        }
                    })
                }
            }

    },
    error: function (res, status, xhr) {
        const respuesta = JSON.parse(res.responseText);
        mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
    }
})

});


//detalle de visitas
function cargarDetalle(id){
    $('#dtDetalle').DataTable().clear()
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/detalles/visita/'+id,
        contentType: 'application/json',
        type: 'GET',
        success: function (res, status, xhr) {
            $('#visita-numero').text("#"+ res.data.numero )
            res.data.detalles.map(function (detalle) {
                let valor = detalle.valor == null ? '-': detalle.valor + " " + detalle.unidad_abreviatura
                let row = $(`<tr>   
                <td>${detalle.tipo_parametro}</td>
                <td>${detalle.nombre}</td>
                <td>${valor}</td>
                </tr>
                `);
            $('#dtDetalle').DataTable().row.add(row).draw();
            })

        },
        error: function (res, status, xhr) {
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);

        }
    })
}

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

    $(document).ready(function () {
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

