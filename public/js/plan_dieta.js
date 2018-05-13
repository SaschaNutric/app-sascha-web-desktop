var datos=[];
$(document).ready(function() {

$('#selGruposAlimenticios').multiSelect({
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

$('#dtPlanDieta').DataTable( {
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
	
	/*Inicio de peticiones ajax */

    $.ajax({
        url: 'https://api-sascha.herokuapp.com/tipodietas',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            console.log(res);
            res.data.map(function(tipoDieta) {
                let option = $(`<option value="${tipoDieta.id_tipo_dieta}">${tipoDieta.nombre}</option>`)
                $('#selTipoDieta').append(option);
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
        url: 'https://api-sascha.herokuapp.com/comidas',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            console.log(res);
            res.data.map(function(comida) {
                let option = $(`<option value="${comida.id_comida}">${comida.nombre}</option>`)
                $('#selComidas').append(option);
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
        url: 'https://api-sascha.herokuapp.com/grupoalimenticios',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            console.log(res);
            res.data.map(function(grupoAlimenticio) {
                let option = $(`<option value="${grupoAlimenticio.id_grupo_alimenticio}">${grupoAlimenticio.nombre}</option>`)
                $('#selGruposAlimenticios').append(option);
                $('#selGruposAlimenticios').multiSelect('refresh')
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
        url: 'https://api-sascha.herokuapp.com/plandietas',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            console.log(res);
            res.data.map(function(planDieta) {
                addRowPlan(planDieta.id_plan_dieta, planDieta.nombre, planDieta.descripcion, planDieta.tipo_dieta.nombre)
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

	function addRowPlan(id, nombre, descripcion, tipo_dieta) {
        let row = $(`<tr>
            <td id="nombreplan-${id}">${nombre}</td>
            <td id="descripcionplan-${id}">${descripcion}</td>
            <td id="tipo_dieta-${id}">${tipo_dieta}</td>
            <td>
            <button onclick="editarPlan(${id})" type='button' class='edit btn  btn-transparente' title='Editar'><i class='fa fa-pencil'></i></button>
            <button onclick="abrirModalPlanEliminar(${id})" type='button' class='ver btn  btn-transparente' data-toggle='modal' data-target="#eliminarSuplemento" title='Eliminar'><i class="fa fa-trash-o"></i></button>
            </td>
            </tr>
            `);
        $('#dtPlanDieta').DataTable().row.add(row).draw();
    }

function editarPlan(id) {
    var params = {
        id_servicio: id
    }
    window.location = `conf_plan_dieta_agregar.html?id=${id}`;
}