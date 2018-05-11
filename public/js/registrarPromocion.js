$(document).ready(function() {
    /* tabla de ofertas y promociones */
   /* const tabla = $('#dtofertapromociones').DataTable({ 
        "language": {
            "lengthMenu": "",
            "search": "Buscar:",
            "paginate": {
                "previous": "Anterior",
                "next": "Siguiente"
            },
            "emptyTable": "No se encontraron Ofertas y Promociones",
            "zeroRecords": "No se encontraron Ofertas y Promociones"
        },
        "searching": true,
        "ordering": true,
        "paging": true
    });
*/
    // Carga el Combo del servicio
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/servicios',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            console.log(res.data)
            res.data.map(function(servicio) {
                let option = $(`<option value="${servicio.id_servicio}">${servicio.nombre}</option>`)
                $('#selServicios').append(option);
                
            })

        },
        error: function() {
            
        }
    })
     

// Guarda informacion basica de la promocion
    $('#btnRegistrar').on('click', function() {
      

        if($('#txtNombrePromo').val() == ""){
            $('#txtNombrePromo').css('border', '1px solid red');
            return;
        }
        if($('#selServicios').val() == "")
        {
            $('#selServicios').css('border', '1px solid red');
            return;
        }

        if($('#txtDescripcionPromo').val() == "") {
            $('#txtDescripcionPromo').css('border', '1px solid red');
            return;
        }
        if($('#txtDescuento').val() == ""){
            $('#txtDescuento').css('border', '1px solid red');
            return;
        }
        if($('#dpValidoDesde').val() == ""){
            $('#dpValidoDesde').css('border', '1px solid red');
            return;
        }
        if($('#dpValidoHasta').val() == ""){
            $('#dpValidoHasta').css('border', '1px solid red');
            return;
        }

        let ofertaPromo= {
            nombre: $('#txtNombrePromo').val(),
            id_servicio: $('#selServicios').val(),
            descripcion: $('#txtDescripcionPromo').val(),
            descuento: $('#txtDescuento').val(),
            valido_desde: $('#dpValidoDesde').val(),
            valido_hasta: $('#dpValidoHasta').val()
        }
        console.log(ofertaPromo)

        $.ajax({
            url: 'https://api-sascha.herokuapp.com/promociones',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(ofertaPromo),
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                $('#txtNombrePromo').val('');
                $('#selServicios').val('');
                $('#txtDescripcionPromo').val('');
                $('#txtDescuento').val('');
                $('#dpValidoDesde').val('');
                $('#dpValidoHasta').val('');
                document.getElementById('promocion').selectedIndex = 0
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
            }
        })

    })





});




//////////////////////////////////////////////////////////



$(document).ready(function() {
  

	$('#dtParametros').dataTable( {
		"aoColumnDefs": [
		{ "bSortable": false, "aTargets": [ 2 ] }
		],
		"sDom": "ftp",
		"oLanguage": {
			
			"sLengthMenu": "",
			"sSearch": "Buscar:",
			"oPaginate":{
				"sPrevious": "Anterior",
				"sNext": "Siguiente"
			},
			"sEmptyTable": "No se encontraron roles"
		},
	} );
});

//date picker start

$(function(){
    window.prettyPrint && prettyPrint();
    $('.default-date-picker').datepicker({
        format: 'mm-dd-yyyy'
    });
    $('.dpYears').datepicker();
    $('.dpMonths').datepicker();


    var startDate = new Date(2012,1,20);
    var endDate = new Date(2012,1,25);
    $('.dp4').datepicker()
        .on('changeDate', function(ev){
            if (ev.date.valueOf() > endDate.valueOf()){
                $('.alert').show().find('strong').text('The start date can not be greater then the end date');
            } else {
                $('.alert').hide();
                startDate = new Date(ev.date);
                $('#startDate').text($('.dp4').data('date'));
            }
            $('.dp4').datepicker('hide');
        });
    $('.dp5').datepicker()
        .on('changeDate', function(ev){
            if (ev.date.valueOf() < startDate.valueOf()){
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
        onRender: function(date) {
            return date.valueOf() < now.valueOf() ? 'disabled' : '';
        }
    }).on('changeDate', function(ev) {
            if (ev.date.valueOf() > checkout.date.valueOf()) {
                var newDate = new Date(ev.date)
                newDate.setDate(newDate.getDate() + 1);
                checkout.setValue(newDate);
            }
            checkin.hide();
            $('.dpd2')[0].focus();
        }).data('datepicker');
    var checkout = $('.dpd2').datepicker({
        onRender: function(date) {
            return date.valueOf() <= checkin.date.valueOf() ? 'disabled' : '';
        }
    }).on('changeDate', function(ev) {
            checkout.hide();
        }).data('datepicker');
});

//date picker end
//datetime picker start
