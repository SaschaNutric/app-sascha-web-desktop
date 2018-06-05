


$(document).ready(function () {

    const tablaReclamo = $('#dtReclamos').DataTable({
        "language": {
            "lengthMenu": "",
            "emptyTable": "No se encontraron motivos",
            "zeroRecords": "No se encontraron motivos"
        },
        "searching": false,
        "ordering": false,
        "paging": false
    });

    $('#btnLimpiar').on('click', function () {
limpiar()

    })

    $('#btnGenerar').on('click', function () {
        $('#dtReclamos').DataTable().clear();
        if ($('#dpMinimo').val() == '' && $('#dpMaximo').val() != '' || $('#dpMinimo').val() != '' && $('#dpMaximo').val() == '') {
            mensaje('#msjAlerta', ' de fecha', 6)
            return;
        }
        let campos = {
            id_genero: $('#selGenero').val() == 0 ? null : $('#selGenero').val(),
            id_empleado: $('#selEmpleado').val() == 0 ? null : $('#selEmpleado').val(),
            id_estado_civil: $('#selEdoCivil').val() == 0 ? null : $('#selEdoCivil').val(),
            id_rango_edad: $('#selRangoEdad').val() == 0 ? null : $('#selRangoEdad').val(),
            id_servicio: $('#selservicio').val() == 0 ? null : $('#selservicio').val(),
            id_especialidad: $('#selEspecialidad').val() == 0 ? null : $('#selEspecialidad').val(),
            fecha_inicial: $('#dpMinimo').val() != '' ? moment($('#dpMinimo').val()).format('YYYY-MM-DD') : null,
            fecha_final: $('#dpMaximo').val() != '' ? moment($('#dpMaximo').val()).format('YYYY-MM-DD') : null

        }

        mostrarFiltros(campos);

        $.ajax({
            url: 'https://api-sascha.herokuapp.com/estadisticos/reclamos',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(campos),
            success: function (res, status, xhr) {
                console.log(res);
                console.log(status);
                let data = res.data;
                if(data.rows.length ==0){
                    mensaje('#msjAlerta', 'No hay datos que mostrar', 14)
                    limpiar()
                    return
                }
                llenarTabla(data)
                mensaje('#msjAlerta', `de reclamos`, 8);
            },
            error: function (res, status, xhr) {
                console.log(res);
                console.log(status);
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
            }
        })



    })

});

function limpiar(){
    $('#selGenero').val(0)
    $('#selEdoCivil').val(0)
    $('#selRangoEdad').val(0)
    $('#selEmpleado').val(0)
    $('#selservicio').val(0)
    $('#selEspecialidad').val(0)
    $('#dpMinimo').val('')
    $('#dpMaximo').val('')
    $('#datos').hide()
    $('#graph-bar').hide()


}

function llenarGrafica(data) {
    $('#graph-bar').show()
    document.getElementById('graph-bar').innerHTML = ''

    Morris.Bar({
        element: 'graph-bar',
        data: data,
        xkey: 'x',
        ykeys: ['y', 'z'],
        labels: ['Aprobados', 'Rechazados'],
        barColors: ['#7ab740', '#858580'],
        stacked: 'true',


    });

}

function llenarTabla(data) {
    let grafica = []
    let total = 0;
    data.rows.map(function (motivo) {
        total += Number.parseInt(motivo.aprobados) + Number.parseInt(motivo.rechazados)
        grafica.push({ x: motivo.motivo_descripcion, y: motivo.aprobados, z: motivo.rechazados })

        let row = $(`<tr>
    <td >${motivo.motivo_descripcion}</td>
    <td> ${motivo.aprobados}</td>
    <td> ${motivo.rechazados}</td>    
    </tr>
    `);
        $('#dtReclamos').DataTable().row.add(row).draw();

    })
    llenarGrafica(grafica)
    $('#total').text(total)
    $('#datos').show()

}


function mostrarFiltros(campos) {

    if (campos.id_especialidad != null) { $('#especialidad').show(); $('#txtEspecialidad').text($('#selEspecialidad option:selected').text()); $('#servicios').show() } else {
        $('#especialidad').hide();
    }
    if (campos.id_empleado != null) { $('#empleado').show(); $('#txtEmpleado').text($('#selEmpleado option:selected').text()); $('#servicios').show() } else {
        $('#empleado').hide();
    }
    if (campos.id_servicio != null) { $('#servicio').show(); $('#txtServicio').text($('#selservicio option:selected').text()); $('#servicios').show() } else {
        $('#servicio').hide()
    }

    if (campos.id_rango_edad != null) { $('#rango-edad').show(); $('#txtRangoEdad').text($('#selRangoEdad option:selected').text()); $('#cliente').show() } else {
        $('#rango-edad').hide()
    }
    if (campos.id_estado_civil != null) { $('#estado-civil').show(); $('#txtEstadoCivil').text($('#selEdoCivil option:selected').text()); $('#cliente').show() } else {
        $('#estado-civil').hide()
    }
    if (campos.id_genero != null) { $('#genero').show(); $('#txtGenero').text($('#selGenero option:selected').text()); $('#cliente').show() } else {
        $('#genero').hide()
    }

    if (campos.fecha_inicial != null) { $('#fecha-inicio').show(); $('#txtFechaInicio').text(moment($('#dpMinimo').val()).format('DD-MM-YYYY')) } else {
        $('#fecha-inicio').hide()
    }
    if (campos.fecha_final != null) { $('#fecha-fin').show(); $('#txtFechaFin').text(moment($('#dpMaximo').val()).format('DD-MM-YYYY')) } else {
        $('#fecha-fin').hide()
    }

}



$(function () {
    window.prettyPrint && prettyPrint();
    $('.default-date-picker').datepicker({
        format: 'mm-dd-yyyy'
    });
    $('.dpYears').datepicker();
    $('.dpMonths').datepicker();


    var startDate = new Date(2012, 1, 20);
    var endDate = new Date(2012, 1, 25);
    $('.dp4').datepicker()
        .on('changeDate', function (ev) {
            if (ev.date.valueOf() > endDate.valueOf()) {
                $('.alert').show().find('strong').text('The start date can not be greater then the end date');
            } else {
                $('.alert').hide();
                startDate = new Date(ev.date);
                $('#startDate').text($('.dp4').data('date'));
            }
            $('.dp4').datepicker('hide');
        });
    $('.dp5').datepicker()
        .on('changeDate', function (ev) {
            if (ev.date.valueOf() < startDate.valueOf()) {
                $('.alert').show().find('strong').text('The end date can not be less then the start date');
            } else {
                $('.alert').hide();
                endDate = new Date(ev.date);
                $('.endDate').text($('.dp5').data('date'));
            }
            $('.dp5').datepicker('hide');
        });

    // disabling dates
    var nowTemp = new Date();
    var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);

    var checkin = $('.dpd1').datepicker({
        onRender: function (date) {
            return date.valueOf() < now.valueOf() ? 'disabled' : '';
        }
    }).on('changeDate', function (ev) {
        if (ev.date.valueOf() > checkout.date.valueOf()) {
            var newDate = new Date(ev.date)
            newDate.setDate(newDate.getDate() + 1);
            checkout.setValue(newDate);
        }
        checkin.hide();
        $('.dpd2')[0].focus();
    }).data('datepicker');
    var checkout = $('.dpd2').datepicker({
        onRender: function (date) {
            return date.valueOf() <= checkin.date.valueOf() ? 'disabled' : '';
        }
    }).on('changeDate', function (ev) {
        checkout.hide();
    }).data('datepicker');
});


