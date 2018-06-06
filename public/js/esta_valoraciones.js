
$(document).ready(function () {
    $('#btnLimpiar').on('click', function () {
        $('#selTipoCriterio').val(0)
        $('#selEspecialidad').val(0)        
        $('#selservicio').val(0)
        $('#dpMinimo').val('')
        $('#dpMaximo').val('')
        $('#datos').hide()
        $('#graph-bar').hide()
    })
    $('#btnGenerar').on('click', function () {
        if ($('#dpMinimo').val() == '' && $('#dpMaximo').val() != '' || $('#dpMinimo').val() != '' && $('#dpMaximo').val() == '') {
            mensaje('#msjAlerta', ' de fecha', 6)
            return;
        }

        if ($('#selTipoCriterio').val() == 0) {
            mensaje('#msjAlerta', 'Por favor seleccione un tipo de criterio', 14)
            return
        }

        let campos = {
            id_tipo_criterio: $('#selTipoCriterio').val() == 0 ? null : $('#selTipoCriterio').val(),
            id_servicio: $('#selservicio').val() == 0 ? null : $('#selservicio').val(),
            id_especialidad: $('#selEspecialidad').val() == 0 ? null : $('#selEspecialidad').val(),
            fecha_inicial: $('#dpMinimo').val() != '' ? moment($('#dpMinimo').val()).format('YYYY-MM-DD') : null,
            fecha_final: $('#dpMaximo').val() != '' ? moment($('#dpMaximo').val()).format('YYYY-MM-DD') : null

        }

         mostrarFiltros(campos);

        $.ajax({
            url: 'https://api-sascha.herokuapp.com/estadisticos/valoraciones',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(campos),
            success: function (res, status, xhr) {
                console.log(res);
                console.log(status);
                let data = res.data;
                crearTabla(data)
                mensaje('#msjAlerta', `de valoraciones`, 8);
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

function crearTabla(criterios) {
    var tabla = document.createElement('table');
    tabla.className = 'display table table-bordered table-striped';
    tabla.id = "dtValoracion";
    let head = document.createElement('thead');
    let tr = document.createElement('tr');
    tr.innerHTML = `<th> Criterio </th>`;
    let cabecera = []
    let cuerpo = []
    let grafica = []
    for (criterio in criterios) {
        let g = {}
        g['x'] = criterio
        let valores = []
        let valoraciones = criterios[criterio]
        console.log(valoraciones)
        for (valoracion in valoraciones) {
            if (cabecera.indexOf(valoracion) == -1) {
                cabecera.push(valoracion)
            }
            g[valoracion] = valoraciones[valoracion]
            valores.push(valoraciones[valoracion])
        }
        grafica.push(g)
        cuerpo.push({ nombre: criterio, valores: valores })
    }
    cabecera.map(function (item) {
        tr.innerHTML += `<th> ${item} </th>`;
    })
    head.appendChild(tr);
    tabla.appendChild(head);
    let body = document.getElementById('tabla-valoracion')
    body.innerHTML = ''
    body.appendChild(tabla)
    llenarGrafica(cabecera, grafica)
    llenarTabla(cuerpo, tabla)

}

function llenarGrafica(cabecera, grafica) {
    document.getElementById('graph-bar').innerHTML = ""
    $('#graph-bar').show()    
    
    Morris.Bar({
        element: 'graph-bar',
        data: grafica,
        xkey: 'x',
        ykeys: cabecera,
        labels: cabecera,

    });
}

function llenarTabla(data, tabla) {
let total = 0
    data.map(function (criterio) {
        let row = tabla.insertRow(1)
        let nombre = row.insertCell(0);
        nombre.innerHTML = `<td>${criterio.nombre}</td>`
        for (let i = 1; i <= criterio.valores.length; i++) {
            total += Number.parseInt(criterio.valores[i-1])
            let valor = row.insertCell(i)
            valor.innerHTML = `<td>${criterio.valores[i - 1]}</td>`
        }

    })

    $('#total').text(total)
    $('#datos').show()    

}

function mostrarFiltros(campos) {

    if (campos.id_especialidad != null) { $('#especialidad').show(); $('#txtEspecialidad').text($('#selEspecialidad option:selected').text()); $('#servicios').show() } else {
        $('#especialidad').hide();
    }
    if (campos.id_servicio != null) { $('#servicio').show(); $('#txtServicio').text($('#selservicio option:selected').text()); $('#servicios').show() } else {
        $('#servicio').hide()
    }

    if (campos.id_tipo_criterio != null) { $('#tipo-criterio').show(); $('#txtTipoCriterio').text($('#selTipoCriterio option:selected').text()); } else {
        $('#tipo-criterio').hide();
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


