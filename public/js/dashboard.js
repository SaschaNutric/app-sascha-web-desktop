$(document).ready(function() {
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

      $('#dtReclamo').DataTable({ 
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
    let dashboard = JSON.parse(localStorage.getItem('empleado')).dashboard;
      
    let fecha ={
        fecha_inicio: "2018-05-01",
        fecha_fin: "2019-05-31"
    }

    if(dashboard == 0){
        $.ajax({
            url: `https://api-sascha.herokuapp.com/agendas/empleado/dashboard/${id_empleado}`,
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(fecha),
            success: function (res, status, xhr) {
                console.log(res.data)
                let dashboard = res.data;
                let clientes_hoy = dashboard.agendas;
                $('#fecha_actual').text(fecha_actual);
                $('#VisitaDiagnostico').text(dashboard.visita_diagnostico);
                $('#VisitaControl').text(dashboard.visita_control);
                $('#misClientes').text(dashboard.clientes);
                $('#titVisitas').text('Visitas');
                if(clientes_hoy.length == 0){
                    $('#listaClientes').append(`<li>No hay visitas registradas</li>`)
                    $('#promocion').css('display', 'inline');
                }
                for(let i = 0; i < clientes_hoy.length; i++){
                    $('#listaClientes').append(`<li id="cliente-${i}">${clientes_hoy[i].horario}`+` - `+`${clientes_hoy[i].nombre_cliente}`
                           +`<a  data-toggle="dropdown" class="dropdown-toggl pull-right" style="color: white !important" href="#"><i class="fa fa-ellipsis-v"></i></a>
                        <ul class="dropdown-menu">
                        <li><a onclick="" href="visi_registrarVisita.html?id=${clientes_hoy[i].id_agenda}"><i class=" fa fa-medkit"></i>Atender</a></li>
                        <li><a onclick="registrarIncidencia(${clientes_hoy.id_agenda})" data-toggle="modal" data-target="#registrarIncidencia"><i class="fa fa-warning"></i>Registrar incidencia</a></li>
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
                        console.log("HOLAAA-----")
                        console.log(datos)
                        $.ajax({
                            url: 'https://api-sascha.herokuapp.com/cliente/visitas',
                            contentType: 'application/json',
                            type: 'POST',
                            data: JSON.stringify(datos),
                            success: function(res, status, xhr) {
                                console.log(res.data);
                                let proximoCliente = res.data;
                                $('#proximo-cliente').css('display', 'inline');
                                $('#lblServicio').css('display', 'inline');
                                $('#lblVisitas').css('display','inline');
                                $('#historialVisita').text('Historial de Visitas')
                                $('#pagination').css('display', 'inline');
                                proximoCliente.map(function(visita){
                                    $('#Visitas').text(proximoCliente.length + `/` + visita.numero_visitas)
                                    $('#cita-fecha').text(moment(visita.fecha_atencion, 'YYYY-MM-DD').format('DD-MM-YYYY'))
                                    if(visita.numero == 1){
                                        $('#cita-tipo').text('Diagnóstico')
                                    }else{$('#cita-tipo').text('Control')}
                                    $('#ulHistorialVisitas').append(`<a onclick="cargarDetalle(${visita.id_visita} ,${datos.id_orden_servicio})" data-toggle="modal" data-target="#modalDetalle">
                                    <li id="visita-${visita.numero}" style="background: #3da3cb">${moment(visita.fecha_atencion, 'YYYY-MM-DD').format('DD-MM-YYYY')}
                                    </li></a>`)
                                })
    
                            },
                            error: function(res, status, xhr) {
                                console.log(res.responseText)
                                const respuesta = JSON.parse(res.responseText);
                                $('#proximo-cliente').css('display', 'inline');
                                $('#lblServicio').css('display', 'inline');
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
    
    $.ajax({
        url: `https://api-sascha.herokuapp.com/calificacion/empleado/${id_empleado}`,
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            let promedio = Number.parseFloat(res.data.promedio? res.data.promedio:0).toFixed(2);
            $('#calificacion').text(promedio + '/5')    
        },
        error: function(res, status, xhr) {
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0); 
        }
    })
    
    }else{
        let dia = moment().day() + 1;
        $.ajax({
            url: `https://api-sascha.herokuapp.com/agendas/dashboard`,
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(fecha),
            success: function (res, status, xhr) {
                console.log(res.data)
                let dashboard = res.data;
                let clientes_hoy = dashboard.agendas;
                $('#fecha_actual').text(fecha_actual);
                $('#VisitaDiagnostico').text(dashboard.visita_diagnostico);
                $('#VisitaControl').text(dashboard.visita_control);
                $('#misClientes').text(dashboard.clientes);
                $('#titVisitas').text('Nutricionistas');
                $('#reclamos').css('display', 'inline');
                $.ajax({
                    url: 'https://api-sascha.herokuapp.com/horarioempleados',
                    contentType: 'application/json',
                    type: 'GET',
                    success: function(res, status, xhr) {
                        res.data.map(function(horario_empleado) {
                            horario_empleado.dias_laborables.map(function(horario){
                                if(horario.id_dia_laborable == dia){
                                    $('#listaClientes').append(`<li id="empleado-${horario_empleado.id_empleado}">${horario_empleado.nombre}
                                    </li>`)
                                }
                            })
                        })     
                    },
                    error: function(res, status, xhr) {
                        const respuesta = JSON.parse(res.responseText);
                        mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0); 
                    }
                })

                $.ajax({
                    url: 'https://api-sascha.herokuapp.com/reclamos',
                    contentType: 'application/json',
                    type: 'GET',
                    success: function(res, status, xhr) {
                        res.data.map(function(reclamo) {
                            $('#ulreclamo').append(`<a onclick="reclamo(${reclamo.id_reclamo}, '${reclamo.cliente}', '${reclamo.servicio}', '${reclamo.motivo}')" data-toggle="modal" data-target="#modalReclamo">
                            <li id="cliente-${reclamo.id_reclamo}" style="background: #3da3cb">${reclamo.cliente} - ${moment(reclamo.fecha, 'YYYY-MM-DD').format('DD-MM-YYYY')}
                            </li></a>`)
                        })     
                    },
                    error: function(res, status, xhr) {
                        const respuesta = JSON.parse(res.responseText);
                        mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0); 
                    }
                })
    
        },
        error: function (res, status, xhr) {
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
        }
    })
    
    $.ajax({
        url: `https://api-sascha.herokuapp.com/calificacion/dashboard`,
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            let promedio = Number.parseFloat(res.data.promedio).toFixed(2);
            $('#calificacion').text(promedio+ '/5')    
        },
        error: function(res, status, xhr) {
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0); 
        }
    })
    }
    
});


//detalle de visitas
function cargarDetalle(id, orden_servicio){
    $('#dtDetalle').DataTable().clear()
    console.log(orden_servicio)
    let dato ={
        id_orden_servicio: orden_servicio
    }
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/detalles/visita/'+id,
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify(dato),
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


function reclamo(id,cliente,servicio,motivo){
    console.log('yes')
    $('#txtCliente').val(cliente);
    $('#txtServicio').val(servicio);
    $('#txtMotivo').val(motivo);
}

function reenviarpromocion(){
    window.location='ofertasYPromocionesReenviar.html';
}

// Carga  los datos en la tabla Visitas Diagnosticos
function cargarModalVisitasD() {
      
    $('#dtVisitaDiagnostico').DataTable().clear();
    let id_empleado = JSON.parse(localStorage.getItem('empleado')).id_empleado;
    let dashboard = JSON.parse(localStorage.getItem('empleado')).dashboard;
    let fecha ={
        fecha_inicio: "2018-05-01",
        fecha_fin: "2019-05-31"
    }
    if(dashboard == 0){
        $('#dtVisitaDiagnostico').DataTable().column(3).visible(false);
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
                    <td id="cliente-${visita_diagnostico.id_agenda}" style="width: 26%">${visita_diagnostico.nombre_cliente}</td>
                    <td id="fecha_inicio-${visita_diagnostico.id_agenda}" style="width: 20%">${moment(visita_diagnostico.fecha_inicio).format('DD-MM-YYYY')}</td>
                    <td id="servicio-${visita_diagnostico.id_agenda}" style="width: 24%">${visita_diagnostico.nombre_servicio}</td>
                    <td style="width: 0%"></td>
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
    }else{
        $.ajax({
            url: `https://api-sascha.herokuapp.com/agendas/dashboard`,
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(fecha),
            success: function (res, status, xhr) {
                console.log(res.data)
                res.data.agendas.map(function (visita_diagnostico) {
                    if(visita_diagnostico.id_tipo_cita == 1 && visita_diagnostico.id_visita == null){
                
              let row = $(`<tr>
                    <td id="cliente-${visita_diagnostico.id_agenda}">${visita_diagnostico.nombre_cliente}</td>
                    <td id="fecha_inicio-${visita_diagnostico.id_agenda}">${moment(visita_diagnostico.fecha_inicio).format('DD-MM-YYYY')}</td>
                    <td id="servicio-${visita_diagnostico.id_agenda}">${visita_diagnostico.nombre_servicio}</td>
                    <td id="empleado-${visita_diagnostico.id_agenda}">${visita_diagnostico.nombre_empleado}</td>
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
}

// Carga  los datos en la tabla Visitas de Control
function cargarModalVisitasC() {
      
    $('#dtVisitaControl').DataTable().clear();
    $('#dtMeta').DataTable().clear()
    
    let id_empleado = JSON.parse(localStorage.getItem('empleado')).id_empleado;
    let dashboard = JSON.parse(localStorage.getItem('empleado')).dashboard;
    let fecha ={
        fecha_inicio: "2018-05-01",
        fecha_fin: "2019-05-31"
    }
    if(dashboard == 0){
        $('#dtVisitaControl').DataTable().column(3).visible(false);
        $.ajax({
            url: `https://api-sascha.herokuapp.com/agendas/empleado/${id_empleado}`,
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(fecha),
            success: function (res, status, xhr) {
                res.data.map(function (visita_control) {
                    if(visita_control.id_tipo_cita == 2 && visita_control.id_visita == null){
                        let row = $(`<tr>
                                <td id="cliente-${visita_control.id_agenda}" style="width: 26%">${visita_control.nombre_cliente}</td>
                                <td id="fecha_inicio-${visita_control.id_agenda}" style="width: 20%">${moment(visita_control.fecha_inicio).format('DD-MM-YYYY')}</td>
                                <td id="servicio-${visita_control.id_agenda}" style="width: 24%">${visita_control.nombre_servicio}</td>
                                <td style="width: 0%"></td>
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
    }else{
        $.ajax({
            url: `https://api-sascha.herokuapp.com/agendas/dashboard`,
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(fecha),
            success: function (res, status, xhr) {
                res.data.agendas.map(function (visita_control) {
                    if(visita_control.id_tipo_cita == 2 && visita_control.id_visita == null){
                        let row = $(`<tr>
                                <td id="cliente-${visita_control.id_agenda}">${visita_control.nombre_cliente}</td>
                                <td id="fecha_inicio-${visita_control.id_agenda}">${moment(visita_control.fecha_inicio).format('DD-MM-YYYY')}</td>
                                <td id="servicio-${visita_control.id_agenda}">${visita_control.nombre_servicio}</td>
                                <td id="empleado-${visita_control.id_agenda}">${visita_control.nombre_empleado}</td>
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
}


// Carga  los datos en la tabla Mis Clientes
function cargarModalMisClientes() {
      
    $('#dtMisClientes').DataTable().clear();
    let events = [];
    let id_empleado = JSON.parse(localStorage.getItem('empleado')).id_empleado;
    let dashboard = JSON.parse(localStorage.getItem('empleado')).dashboard;
    let fecha ={
        fecha_inicio: "2018-05-01",
        fecha_fin: "2019-05-31"
    }
    if(dashboard == 0){
        $('#dtMisClientes').DataTable().column(3).visible(false);
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
                    <td id="cliente-${visita_clientes.id_agenda}" style="width: 26%">${visita_clientes.nombre_cliente}</td>
                    <td id="fecha_inicio-${visita_clientes.id_agenda}" style="width: 20%">${moment(visita_clientes.fecha_inicio).format('DD-MM-YYYY')}</td>
                    <td id="servicio-${visita_clientes.id_agenda}" style="width: 24%">${visita_clientes.nombre_servicio}</td>
                    <td style="width: 0%"></td>
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

    }else{
        $.ajax({
            url: `https://api-sascha.herokuapp.com/agendas/dashboard`,
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(fecha),
            success: function (res, status, xhr) {
                console.log(res.data)
    
                res.data.agendas.map(function (visita_clientes) {
                    if( visita_clientes.id_visita == null){
                    
              let row = $(`<tr>
                    <td id="cliente-${visita_clientes.id_agenda}">${visita_clientes.nombre_cliente}</td>
                    <td id="fecha_inicio-${visita_clientes.id_agenda}">${moment(visita_clientes.fecha_inicio).format('DD-MM-YYYY')}</td>
                    <td id="servicio-${visita_clientes.id_agenda}">${visita_clientes.nombre_servicio}</td>
                    <td id="empleado-${visita_clientes.id_agenda}">${visita_clientes.nombre_empleado}</td>
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

