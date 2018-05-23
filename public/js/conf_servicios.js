$(document).ready(function () {

    const tabla = $('#dtServicios').DataTable({
        "language": {
            "lengthMenu": "",
            "search": "Buscar:",
            "paginate": {
                "previous": "Anterior",
                "next": "Siguiente"
            },
            "emptyTable": "No se encontraron servicios",
            "zeroRecords": "No se encontraron servicios"
        },
        "searching": true,
        "ordering": true,
        "paging": true
    });


    $.ajax({
        url: 'https://api-sascha.herokuapp.com/servicios',
        contentType: 'application/json',
        type: 'GET',
        success: function (res, status, xhr) {
            res.data.map(function (servicio) {

                let planE = servicio.plan_ejercicio;
                let planS = servicio.plan_suplemento;
                if (planE == null) { planE = 'No Aplica' } else { planE = servicio.plan_ejercicio.nombre }
                if (planS == null) { planS = 'No Aplica' } else { planS = servicio.plan_suplemento.nombre }
                let row = $(`<tr>
                    <td id="nombre-${servicio.id_servicio}">${servicio.nombre}</td>
                    <td id="especialidad-${servicio.id_servicio}">${servicio.especialidad.nombre}</td>
                    <td id="duracion-${servicio.id_servicio}">${servicio.numero_visitas} visitas </td>
                    <td id="precio-${servicio.id_servicio}">${servicio.precio} Bs.</td>
                    <td style="display: none" id="planDieta-${servicio.id_servicio}">${servicio.plan_dieta.nombre}  </td>
                    <td style="display: none" id="imagen-${servicio.id_servicio}">${servicio.url_imagen}  </td>
                    <td style="display: none" id="descipcion-${servicio.id_servicio}">${servicio.descripcion}  </td>
                    <td style="display: none" id="planEjercicio-${servicio.id_servicio}">${planE}</td>
                    <td style="display: none" id="planSuplemento-${servicio.id_servicio}">${planS}</td>
                    <td>
                    <a onclick="verServicio(${servicio.id_servicio})"  class='ver btn  btn-stransparent' data-toggle='modal' data-target="#verServicio" title='Ver Más'><i class='fa fa-eye'></i></a>
                    <a onclick="editarServicio(${servicio.id_servicio})"  class='edit btn  btn-stransparent' title='Editar'><i class='fa fa-pencil'></i></a>
                    <button onclick="abrirModalEliminarServicio(${servicio.id_servicio})" type="button" class='ver btn  btn-stransparent' data-toggle='modal' data-target="#modal-confirmar" title='Eliminar'><i class="fa fa-trash-o"></i></button>
                    </td>
                    </tr>
                    `);
                tabla.row.add(row).draw();
            })
        },
        error: function (res, status, xhr) {
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
        }
    })
});


function verServicio(id) {
    $('#txtNombre').val($(`#nombre-${id}`).text());
    $('#txtDescripcion').val($(`#descipcion-${id}`).text());
    $('#txtPrecio').val($(`#precio-${id}`).text());
    $('#txtPlanDieta').val($(`#planDieta-${id}`).text());
    $('#txtPlanSuplemento').val($(`#planSuplemento-${id}`).text());
    $('#txtPlanEntrenamiento').val($(`#planEjercicio-${id}`).text());
    $('#txtDuracion').val($(`#duracion-${id}`).text());
    $('#txtEspecialidad').val($(`#especialidad-${id}`).text());
    $('#imgServicio').attr("src", $(`#imagen-${id}`).text());
}

function editarServicio(id) {
    var params = {
        id_servicio: id
    }
    window.location = `serv_registrarServicio.html?id=${id}`;
}

function abrirModalEliminarServicio(id) {
    $('#txtIdServicioEliminar').val(id);

}

function eliminarServicio(id) {
    $.ajax({
        url: `https://api-sascha.herokuapp.com/servicio/${id}`,
        contentType: 'application/json',
        type: 'DELETE',
        success: function (res, status, xhr) {
            $('#dtServicios').DataTable().row($(`#nombre-${id}`).parent()).remove().draw();
            mensaje('#msjAlerta', `Servicio`, 2);


        },
        error: function (res, status, xhr) {
            console.log(res);
            console.log(status);
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);

        }
    })
}