var valor=[];
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

        
        /* multiselect de ejercicios */
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
    /*fin multiselect de ejercicios */

    /*Inicio de peticiones ajax */
    /*llena el multiselect de ejercicios*/
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
    /*llena la tabla de los planes de ejercicios */
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/planejercicios',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            console.log(res);
            res.data.map(function(plan) {
                addRowPlan(plan.id_plan_ejercicio, plan.nombre, plan.descripcion, plan.ejercicios)
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

        console.log(valor);
        // Convierte el arreglo de ids en un arreglo de objetos JSON. Ej. { id_ejercicio: id }
        let ejercicios = [];
        valor.map(function(val) {
            ejercicios.push({
                id_ejercicio: val
            })
        })
        let planActividad = {
            nombre: $('#txtNombre').val(),
            descripcion: $('#txtDescripcion').val(),
            ejercicios: ejercicios
            //ejercicios: $('select[name=ejercicios]').val()
        }
        console.log(planActividad);
        $.ajax({
            url: 'https://api-sascha.herokuapp.com/planejercicios',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(planActividad),
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                // Busca en el multiselect el nombre de los suplementos
                // y crea arreglo de objetos JSON Ej. { id_suplemento: 1, nombre: "Vitamina" }
                let ejercicios = [];
                res.data.ejercicios.map(function(ejercicio) {
                    ejercicios.push({ 
                        id_ejercicio: ejercicio,
                        nombre: $(`option[value="${ejercicio}"]`).text()
                    })
                });
                
                addRowPlan(res.data.id_plan_ejercicio, res.data.nombre, res.data.descripcion, ejercicios)
                limpiarPlan();
                mensaje('#msjAlerta', `Plan de Entrenamiento`, 1);
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


        let planActividad = {
            nombre: $('#txtNombre').val(),
            descripcion: $('#txtDescripcion').val(),
        }


        let id = $('#txtIdEjercicio').val();

        if(planActividad.nombre == $(`#nombreplan-${id}`).text() && planActividad.descripcion == $(`#descripcionplan-${id}`).text()){
            mensaje('#msjAlerta', ``, 4);
            $('#agregarPlan').modal('hide');   
            return;
        }
        $.ajax({
            url: `https://api-sascha.herokuapp.com/planejercicio/${id}`,
            contentType: 'application/json',
            type: 'PUT',
            data: JSON.stringify(planActividad),
            success: function(res, status, xhr) {
                console.log(planActividad)
                mensaje('#msjAlerta', `Plan de Suplemento`, 3);
                editRowPlan(id, planActividad.nombre, planActividad.descripcion)
                limpiarPlan();
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

    /* agrega una nueva fila en la tabla de planes */
    function addRowPlan(id, nombre, descripcion, ejercicios) {
        let row = $(`<tr>
            <td id="nombreplan-${id}">${nombre}</td>
            <td id="descripcionplan-${id}">${descripcion}</td>
            <td id="ejercicios-${id}">${
                ejercicios.map(function (ejercicio) {
                    return ejercicio.nombre;
                })
            }</td>
            <td>
            <button onclick="editarPlan(${id})" type='button' class='edit btn  btn-transparente' data-toggle="modal" data-target="#agregarPlan"  title='Editar'><i class='fa fa-pencil'></i></button>
            <button onclick="abrirModalEliminarPlan(${id})" type='button' class='ver btn  btn-transparente' data-toggle='modal' data-target="#eliminarPlan" title='Eliminar'><i class="fa fa-trash-o"></i></button>
            </td>
            </tr>
            `);
        $('#dtPlanActividad').DataTable().row.add(row).draw();
    }

    function eliminarPlan(id) {
        $.ajax({
            url: `https://api-sascha.herokuapp.com/planejercicio/${id}`,
            contentType: 'application/json',
            type: 'DELETE',
            success: function (res, status, xhr) {
                console.log(res);
                console.log(status);
                $('#dtPlanActividad').DataTable().row($(`#nombreplan-${id}`).parent()).remove().draw();
                $('#txtIdPlanEliminar').val('');
                mensaje('#msjAlerta', `Plan de Entrenamiento`, 2);
            },
            error: function (res, status, xhr) {
                console.log(res);
                console.log(status);
                limpiarPlan();
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
            }
        })
    }

    function abrirModalEliminarPlan(id) {
        $('#txtIdPlanEliminar').val(id);
    }

    function limpiarPlan(){
        $('#txtNombre').val('');
        $('#txtDescripcion').val('');
        $('#txtIdEjercicio').val('');
        $('#seleActividades').multiSelect('deselect_all');
        valor=[];
    }

    function editarPlan(id){
        console.log(id);
        $('#txtNombre').val($(`#nombreplan-${id}`).text());
        $('#txtDescripcion').val($(`#descripcionplan-${id}`).text());
        $('#multiselectejercicios').css('display','none');
        $('#btnAceptar').css('display', 'none');
        $('#btnEditar').css('display', 'inline');
    }

    function editRowPlan(id, nombre, descripcion){
        $(`#nombreplan-${id}`).text(nombre);
        $(`#descripcionplan-${id}`).text(descripcion);
    }

    function agregarPlan(){
        $('#btnAceptar').css('display', 'inline');
        $('#btnEditar').css('display', 'none');
        $('#multiselectejercicios').css('display','inline');
    }