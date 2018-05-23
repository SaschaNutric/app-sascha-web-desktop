$(document).ready(function() {

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
    /* llena el select de los tipos de dietas */
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/tipodietas',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
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
        url: 'https://api-sascha.herokuapp.com/plandietas',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
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
            <button onclick="abrirModalEliminarPlan(${id})" type='button' class='ver btn  btn-transparente' data-toggle='modal' data-target="#eliminarPlan" title='Eliminar'><i class="fa fa-trash-o"></i></button>
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

function abrirModalEliminarPlan(id){
    $('#txtIdPlanEliminar').val(id);
}

function eliminarPlan(id){
    console.log(id);
    $.ajax({
        url: `https://api-sascha.herokuapp.com/plandieta/${id}`,
        contentType: 'application/json',
        type: 'DELETE',
        success: function(res, status, xhr) {
            $('#dtPlanDieta').DataTable().row($(`#nombreplan-${id}`).parent()).remove().draw();
            mensaje('#msjAlerta', `Plan de Dieta`, 2);
        },
        error: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
            
        }
    })
}