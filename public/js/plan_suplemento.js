var valor=[];
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
        valor.push(values[0]);
        console.log(valor);
    },
    afterDeselect: function (values) {
        this.qs1.cache();
        this.qs2.cache();
        const index = valor.indexOf(values[0])
        if (index != -1){
            valor.splice(index,1)
        }
        console.log(valor)
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
        url: 'http://localhost:5000/plansuplementos',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            console.log(res);
            res.data.map(function(plan) {
                addRowPlan(plan.id_plan_suplemento, plan.nombre, plan.descripcion, plan.suplementos)
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

        if(valor.length == 0){
            $('select[name=suplemento]').css('border', '1px solid red')
            return;
        }

        console.log(valor);
        let suplementos = [];
        valor.map(function(val) {
            suplementos.push({
                id_suplemento: val
            })
        })
        let planSuplemento = {
            nombre: $('#txtNombre').val(),
            descripcion: $('#txtDescripcion').val(),
            suplementos: suplementos
        }

        $.ajax({
            url: 'http://localhost:5000/plansuplementos',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(planSuplemento),
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                let suplementos = [];
                res.data.suplementos.map(function(suplemento) {
                    suplementos.push({ 
                        id_suplemento: suplemento,
                        nombre: $(`option[value="${suplemento}"]`).text()
                    })
                });
                
                addRowPlan(res.data.id_plan_suplemento, res.data.nombre, res.data.descripcion, suplementos)
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
            <td id="suplementos-${id}">${
                suplementos.map(function (suplemento) {
                    return suplemento.nombre;
                })
            }</td>
            <td>
            <button onclick="abrirModalPlanEliminarSuplemento(${id})" type='button' class='ver btn  btn-transparente' data-toggle='modal' data-target="#eliminarPlan" title='Eliminar'><i class="fa fa-trash-o"></i></button>
            </td>
            </tr>
            `);
        $('#dtPlanSuplemento').DataTable().row.add(row).draw();
    }

    function eliminarPlan(id) {
        $.ajax({
            url: `https://api-sascha.herokuapp.com/plansuplemento/${id}`,
            contentType: 'application/json',
            type: 'DELETE',
            success: function (res, status, xhr) {
                console.log(res);
                console.log(status);
                $('#dtPlanSuplemento').DataTable().row($(`#nombreplansuplemento-${id}`).parent()).remove().draw();
                $('#txtIdPlanSuplementoEliminar').val('');
                mensaje('#msjAlerta', `Plan de Suplemento`, 2);
            },
            error: function (res, status, xhr) {
                console.log(res);
                console.log(status);
                limpiarPlanSuplemento();
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
            }
        })
    }

    function abrirModalPlanEliminarSuplemento(id) {
        $('#txtIdPlanSuplementoEliminar').val(id);
    }

    function limpiarPlanSuplemento(){
        $('#txtNombre').val('');
        $('#txtDescripcion').val('');
        $('#txtIdSuplemento').val('');
        // document.getElementById('ms_suplementos').length = 0;
        // $('#ms_suplementos option:selected').prop('selected', false);
        $('#ms_suplementos').multiSelect('deselect_all');
        valor=[];
    }