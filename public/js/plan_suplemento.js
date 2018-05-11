var datos=[];
$(document).ready(function() {

	$('#dtPlanSuplemento').DataTable( {
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


	var oTable = $('#dtSuplemento').dataTable( {
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
			"sEmptyTable": "No se encontraron suplementos"
			},
		});

    /* Multiselect de Suplementos */
    $('#ms_suplementos').multiSelect({
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
    /*fin multiselect */

    /*Inicio de peticiones ajax */

    $.ajax({
        url: 'https://api-sascha.herokuapp.com/suplementos',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            console.log(res);
            res.data.map(function(suplemento) {
                let option = $(`<option value="${suplemento.id_suplemento}">${suplemento.nombre}</option>`)
                $('#ms_suplementos').append(option);
                $('#ms_suplementos').multiSelect('refresh')
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
        url: 'https://api-sascha.herokuapp.com/plansuplementos',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            console.log(res);
            res.data.map(function(suplemento) {
                addRowPlan(suplemento.id_suplemento, suplemento.nombre, suplemento.descripcion, suplemento.nombre)
            })
        },
        error: function(res, status, xhr) {
            console.log(res)
            console.log(status)
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);

        }
    })

    
    

    $('#btnAceptar').on('click', function() {

        if($('#txtNombre').val() == ""){
            $('#txtNombre').css('border', '1px solid red');
            return;
        }

        if($('#txtDescripcion').val() == ""){
            $('#txtDescripcion').css('border', '1px solid red');
            return;
        }

        if(datos.length == 0){
            $('select[name=suplemento]').css('border', '1px solid red')
            return;
        }

        let planSuplemento = {
            nombre: $('#txtNombre').val(),
            descripcion: $('#txtDescripcion').val()
        }

        $.ajax({
            url: 'https://api-sascha.herokuapp.com/plansuplementos',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(planSuplemento),
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                addRowPlan(res.data.id_plan_suplemento, res.data.nombre, res.data.descripcion,res.data.nombre)
                limpiarPlanSuplemento();
                mensaje('#msjAlerta', `Plan Suplemento`, 1);
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta',`${respuesta.data.mensaje}`, 0);
            }
        })
        $('#agregarPlan').modal('hide');

    })

});

    function addRowPlan(id, nombre, descripcion, suplementos) {
        let row = $(`<tr>
            <td id="nombreplansuplemento-${id}">${nombre}</td>
            <td id="descripcionplansuplemento-${id}">${descripcion}</td>
            <td id="suplementos-${id}">${suplementos}</td>
            <td>
            <button onclick="editarPlanSuplemento(${id})" type='button' class='edit btn  btn-transparente' data-toggle="modal" data-target="#agregarPlan"  title='Editar'><i class='fa fa-pencil'></i></button>
            <button onclick="abrirModalPlanEliminarSuplemento(${id})" type='button' class='ver btn  btn-transparente' data-toggle='modal' data-target="#eliminarSuplemento" title='Eliminar'><i class="fa fa-trash-o"></i></button>
            </td>
            </tr>
            `);
        $('#dtPlanSuplemento').DataTable().row.add(row).draw();
    }

    function limpiarPlanSuplemento(){
        $('#txtNombre').val('');
        $('#txtDescripcion').val('');
        $('#txtIdSuplemento').val('');
        $('#ms_suplementos').multiSelect('refresh');
        datos=[];
    }