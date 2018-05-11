var datos=[];
$(document).ready(function() {

    $('#dtPlanActividad').DataTable( {
        "aoColumnDefs": [
        { "bSortable": false, "aTargets": [ 3 ] }
        ],
        "language": {
        "lengthMenu": "",
        "search": "Buscar:",
        "paginate": {
            "previous": "Anterior",
            "next": "Siguiente"
        },
        "emptyTable": "No se encontraron planes",
        "zeroRecords": "No se encontraron planes"
        },
        "searching": true,
        "ordering": true,
        "paging": true 
    } );


	var oTable = $('#dtActividad').dataTable( {
		"aoColumnDefs": [
		{ "bSortable": false, "aTargets": [ 1 ] }
		],
		"aaSorting": [[0, 'desc']],
		"sDom": "ftp",
		"oLanguage": {
			"sSearch": "Buscar:",
			"oPaginate":{
				"sPrevious": "Anterior",
				"sNext": "Siguiente"},
			"sEmptyTable": "No se encontraron actividades"
			},



		});


	$('#seleActividades').multiSelect({
    selectableHeader: "<input type='text' class='form-control search-input' autocomplete='off' placeholder='buscar...'>",
    selectionHeader: "<input type='text' class='form-control search-input' autocomplete='off' placeholder='buscar...'>",
    afterInit: function (ms) {
        var that = this,
            $selectableSearch = that.$selectableUl.prev(),
            $selectionSearch = that.$selectionUl.prev(),
            selectableSearchString = '#' + that.$container.attr('id') + ' .ms-elem-selectable:not(.ms-selected)',
            selectionSearchString = '#' + that.$container.attr('id') + ' .ms-elem-selection.ms-selected';

        that.qs1 = $selectableSearch.quicksearch(selectableSearchString)
            .on('keydown', function (e) {
                if (e.which === 40) {
                    that.$selectableUl.focus();
                    return false;
                }
            });

        that.qs2 = $selectionSearch.quicksearch(selectionSearchString)
            .on('keydown', function (e) {
                if (e.which == 40) {
                    that.$selectionUl.focus();
                    return false;
                }
            });
    },
    afterSelect: function (values) {
        this.qs1.cache();
        this.qs2.cache();
        datos.push(values[0]);
        console.log(datos);
    },
    afterDeselect: function (values) {
        this.qs1.cache();
        this.qs2.cache();
        const index = datos.indexOf(values[0])
        if (index != -1){
            datos.splice(index,1)
        }
        console.log(datos)
    }
});

    /*Inicio de peticiones ajax */

    $.ajax({
        url: 'https://api-sascha.herokuapp.com/ejercicios',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            console.log(res);
            res.data.map(function(ejercicio) {
                let option = $(`<option value="${ejercicio.id_ejercicio}">${ejercicio.nombre}</option>`)
                $('#seleActividades').append(option);
                $('#seleActividades').multiSelect('refresh')
            })
        },
        error: function(res, status, xhr) {
            console.log(res)
            console.log(status)
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);

        }
    })

    $.ajax({
        url: 'https://api-sascha.herokuapp.com/planejercicios',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            console.log(res);
            res.data.map(function(ejercicio) {
                addRowPlan(ejercicio.id_plan_ejercicio, ejercicio.nombre, ejercicio.descripcion, ejercicio.nombre)
            })
        },
        error: function(res, status, xhr) {
            console.log(res)
            console.log(status)
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);

        }
    })

});

    function addRowPlan(id, nombre, descripcion, ejercicios) {
        let row = $(`<tr>
            <td id="nombreplan-${id}">${nombre}</td>
            <td id="descripcionplan-${id}">${descripcion}</td>
            <td id="ejercicios-${id}">${ejercicios}</td>
            <td>
            <button onclick="editarPlanSuplemento(${id})" type='button' class='edit btn  btn-transparente' data-toggle="modal" data-target="#agregarPlan"  title='Editar'><i class='fa fa-pencil'></i></button>
            <button onclick="abrirModalPlanEliminarSuplemento(${id})" type='button' class='ver btn  btn-transparente' data-toggle='modal' data-target="#eliminarSuplemento" title='Eliminar'><i class="fa fa-trash-o"></i></button>
            </td>
            </tr>
            `);
        $('#dtPlanActividad').DataTable().row.add(row).draw();
    }