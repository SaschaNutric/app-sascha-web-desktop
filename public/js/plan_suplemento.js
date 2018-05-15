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
        url: 'https://api-sascha.herokuapp.com/plansuplementos',
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
        // Convierte el arreglo de ids en un arreglo de objetos JSON. Ej. { id_suplemento: id }
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
            //suplementos: $('select[name=suplemento]').val()
        }
        console.log(planSuplemento);
        $.ajax({
            url: 'https://api-sascha.herokuapp.com/plansuplementos',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(planSuplemento),
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                // Busca en el multiselect el nombre de los suplementos
                // y crea arreglo de objetos JSON Ej. { id_suplemento: 1, nombre: "Vitamina" }
                let suplementos = [];
                res.data.suplementos.map(function(suplemento) {
                    suplementos.push({ 
                        id_suplemento: suplemento,
                        nombre: $(`option[value="${suplemento}"]`).text()
                    })
                });
                
                addRowPlan(res.data.id_plan_suplemento, res.data.nombre, res.data.descripcion, suplementos)
                limpiarPlanSuplemento();
                mensaje('#msjAlerta', `Plan de Suplementos`, 1);
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

    $('#btnEditar').on('click', function() {

        if($('#txtNombre').val() == ""){
            $('#txtNombre').css('border', '1px solid red');
            return;
        }

        if($('#txtDescripcion').val() == ""){
            $('#txtDescripcion').css('border', '1px solid red');
            return;
        }


        let planSuplemento = {
            nombre: $('#txtNombre').val(),
            descripcion: $('#txtDescripcion').val(),
        }
        let id = $('#txtIdSuplemento').val();

        if(planSuplemento.nombre == $(`#nombreplansuplemento-${id}`).text() && planSuplemento.descripcion == $(`#descripcionplansuplemento-${id}`).text()){
            mensaje('#msjAlerta', ``, 4);
            $('#agregarPlan').modal('hide');   
            return;
        }
        console.log(id);
        $.ajax({
            url: `https://api-sascha.herokuapp.com/plansuplemento/${id}`,
            contentType: 'application/json',
            type: 'PUT',
            data: JSON.stringify(planSuplemento),
            success: function(res, status, xhr) {
                console.log(planSuplemento)
                mensaje('#msjAlerta', `Plan de Suplemento`, 3);
                editRowPlan(id, planSuplemento.nombre, planSuplemento.descripcion)
                limpiarPlanSuplemento();
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
            <button onclick="editarPlan(${id})" type='button' class='edit btn  btn-transparente' data-toggle="modal" data-target="#agregarPlan"  title='Editar'><i class='fa fa-pencil'></i></button>
            <button onclick="abrirModalEliminarPlanSuplemento(${id})" type='button' class='ver btn  btn-transparente' data-toggle='modal' data-target="#eliminarPlan" title='Eliminar'><i class="fa fa-trash-o"></i></button>
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

    function abrirModalEliminarPlanSuplemento(id) {
        $('#txtIdPlanSuplementoEliminar').val(id);
    }

    function limpiarPlanSuplemento(){
        $('#txtNombre').val('');
        $('#txtDescripcion').val('');
        $('#txtIdSuplemento').val('');
        $('#ms_suplementos').multiSelect('deselect_all');
        valor=[];
    }

    function editarPlan(id){
        /*let prueba = $(`#suplementos-${id}`).text();
        console.log("suplementos: ", prueba);
        let nom_suplementos = prueba.split(",");
        console.log(nom_suplementos);
        valor.map(function(suplementos){
            nom_suplementos.map(function(nombre){
                if(suplementos.nombre == nombre){
                    console.log(suplementos.id_suplemento);
                    $('#ms_suplementos').multiSelect('select', ['suplementos.id_suplemento']);
                }
            })
        })*/
        console.log(id);
        $('#txtNombre').val($(`#nombreplansuplemento-${id}`).text());
        $('#txtDescripcion').val($(`#descripcionplansuplemento-${id}`).text());
        $('#txtIdSuplemento').val(id);
        $('#multiselectSuplementos').css('display','none');
        $('#btnAceptar').css('display', 'none');
        $('#btnEditar').css('display', 'inline');
    }

    function editRowPlan(id, nombre, descripcion){
        $(`#nombreplansuplemento-${id}`).text(nombre);
        $(`#descripcionplansuplemento-${id}`).text(descripcion);
    }

    function agregarPlan(){
        $('#btnAceptar').css('display', 'inline');
        $('#btnEditar').css('display', 'none');
        $('#multiselectSuplementos').css('display','inline');
    }