$(document).ready(function () {
    const tabla_nutricionistas = $('#dtEstaVisitas').DataTable({
        "language": {
            "lengthMenu": "",
            "emptyTable": "No se encontraron empleados",
            "zeroRecords": "No se encontraron empleados"
        },
        "searching": false,
        "ordering": false,
        "paging": false

    })

    $('#btnLimpiar').on('click', function () {
        $('#selEspecialidad').val(0)
        $('#dpMinimo').val('')
        $('#dpMaximo').val('')
        $('#datos').hide()
        $('#graph-bar').hide()
        
        

    })

    $('#btnGenerar').on('click', function () {
        $('#dtEstaVisitas').DataTable().clear();
        if ($('#dpMinimo').val() == '' && $('#dpMaximo').val() != '' || $('#dpMinimo').val() != '' && $('#dpMaximo').val() == '') {
            mensaje('#msjAlerta', ' de fecha', 6)                        
            return;
        }
        let campos = {
            id_especialidad: $('#selEspecialidad').val() == 0 ? null : $('#selEspecialidad').val(),
            fecha_inicial: $('#dpMinimo').val() != '' ? moment($('#dpMinimo').val()).format('YYYY-MM-DD') : null,
            fecha_final: $('#dpMaximo').val() != '' ? moment($('#dpMaximo').val()).format('YYYY-MM-DD') : null

        }

        if(campos.id_especialidad == null){
            $('#especialidad').hide()
        }else{
            $('#txtEspecialidad').text($('#selEspecialidad option:selected').text());
            $('#especialidad').show()
            
        }
        
        if(campos.fecha_inicial == null){
            $('#fecha-inicio').hide()
        }else{
            $('#txtFechaInicio').text($('#dpMinimo').val());
            $('#fecha-inicio').show()
            
        }

        if(campos.fecha_final == null){
            $('#fecha-fin').hide()
        }else{
            $('#txtFechaFin').text($('#dpMaximo').val());
            $('#fecha-fin').show()
            
        }

        $.ajax({
            url: 'https://api-sascha.herokuapp.com/estadisticos/nutricionistas',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(campos),
            success: function (res, status, xhr) {
                console.log(res.data);
                console.log(status);
                let data = res.data;
                llenarTabla(data)
                mensaje('#msjAlerta', `de motivos preferidos`, 8);
            },
            error: function (res, status, xhr) {
                console.log(res);
                console.log(status);
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
            }
        })


    })

})


function llenarTabla(data) {
    $('#graph-bar').show()
    
    let grafica = []
    let total = 0;
    data.map(function (empleado) {
        console.log(empleado)
        total += Number.parseInt(empleado.cantidad_clientes)
        grafica.push({
            x: empleado.nombre_empleado,
            y: empleado.cantidad_clientes
        })

        let row = $(`<tr>
    <td >${empleado.nombre_empleado}</td>
    <td> ${empleado.cantidad_clientes}</td>
    </tr>
    `);
        $('#dtEstaVisitas').DataTable().row.add(row).draw();

    })
    llenarGrafica(grafica)
    $('#total-clientes').text(total)
    $('#datos').show()

}

function llenarGrafica(data){
    document.getElementById('graph-bar').innerHTML = '';
    Morris.Bar({
        element: 'graph-bar',
        data: data,
        xkey: 'x',
        ykeys: ['y'],
        labels: ['Cantidad de Clientes'],
        barColors: ['#cfdd3f']
    
    
    });
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

