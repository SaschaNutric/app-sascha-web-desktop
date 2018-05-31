$(document).ready(function () {
    /* tabla de ofertas y promociones */
    const tabla = $('#dtofertapromociones').DataTable({
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

    // Carga  las promociones en la tabla 
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/promociones',
        contentType: 'application/json',
        type: 'GET',
        success: function (res, status, xhr) {
            res.data.map(function (promocion) {
                let row = $(`<tr>
                
                    <td id="nombre-${promocion.id_promocion}">${promocion.nombre}</td>
                    <td id="servicio-${promocion.id_promocion}">${promocion.servicio.nombre}</td>
                    <td id="descripcion-${promocion.id_promocion}">${promocion.descripcion}</td>
                    <td id="descuento-${promocion.id_promocion}">${promocion.descuento}</td>
                    <td id="valido_desde-${promocion.id_promocion}">${moment(promocion.valido_desde,'YYYY-MM-DD').format('DD-MM-YYYY')} </td>
                    <td id="valido_hasta-${promocion.id_promocion}">${moment(promocion.valido_hasta,'YYYY-MM-DD').format('DD-MM-YYYY')} </td>
                    <td>
                        <a onclick="editarPromo(${promocion.id_promocion})"  class='edit btn  btn-stransparent' title='Editar'><i class='fa fa-pencil'></i></a>
                        
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

  
    $('#btnAceptarPromo').on('click', function () {

        if ($('#txtNombrePromo').val() == "") {
            $('#txtNombrePromo').css('border', '1px solid red');
            return;
        }
        if ($('#selServicios').val() == "") {
            $('#selServicios').css('border', '1px solid red');
            return;
        }

        if ($('#txtDescripcionPromo').val() == "") {
            $('#txtDescripcionPromo').css('border', '1px solid red');
            return;
        }
        if ($('#txtDescuento').val() == "") {
            $('#txtDescuento').css('border', '1px solid red');
            return;
        }
        if ($('#selEstadoCivil').val() == "") {
            $('#selEstadoCivil').css('border', '1px solid red');
            return;
        }
        if ($('#selRangoEdad').val() == "") {
            $('#selRangoEdad').css('border', '1px solid red');
            return;
        } 
        if ($('#selGenero').val() == "") {
            $('#selGenero').css('border', '1px solid red');
            return;
        }
        if ($('#dpValidoDesde').val() == "") {
            $('#dpValidoDesde').css('border', '1px solid red');
            return;
        }
        if ($('#dpValidoHasta').val() == "") {
            $('#dpValidoHasta').css('border', '1px solid red');
            return;
        }
        if ($('#dpValidoDesde').val() == "") {
            $('#dpValidoDesde').css('border', '1px solid red');
            return;
        }
        if ($('#dpValidoHasta').val() == "") {
            $('#dpValidoHasta').css('border', '1px solid red');
            return;
        }

        let ofertaPromo = {
            nombre: $('#txtNombrePromo').val(),
            id_servicio: $('#selServicios').val(),
            descripcion: $('#txtDescripcionPromo').val(),
            descuento: $('#txtDescuento').val(),
            id_estado_civil: $('#selEstadoCivil').val(),
            id_rango_edad: $('#selRangoEdad').val(),
            id_genero: $('#selGenero').val(),
            valido_desde: $('#dpValidoDesde').val(),
            valido_hasta: $('#dpValidoHasta').val()
        }

        let id = $('#txtIdPromo').val();
        $.ajax({
            url: `https://api-sascha.herokuapp.com/promociones/`,
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(ofertaPromo),
            success: function (res, status, xhr) {
                $('#txtNombrePromo').val('');
                document.getElementById('selServicios').selectedIndex = 0
                $('#txtDescripcionPromo').val('');
                $('#txtDescuento').val('');
                document.getElementById('selEstadoCivil').selectedIndex = 0
                document.getElementById('selRangoEdad').selectedIndex = 0
                document.getElementById('selGenero').selectedIndex = 0
                $('#dpValidoDesde').val('');
                $('#dpValidoHasta').val('');
                
            },
            error: function (res, status, xhr) {
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
            }
        })

})



});



//LLeva a la pantalla de Reenviar Promocion luego de haber editado una
function editarPromo(id) {

    var params = {
        id_promocion: id
    }

    window.location = `ofer_registrarPromocion.html?id=${id}?url=ofertasYPromocionesReenviar.html`;
}

function abrirModalEliminarPromo(id) {
    $('#txtIdPromoEliminar').val(id);
}

function eliminarPromo(id) {
    $.ajax({
        url: `https://api-sascha.herokuapp.com/promocion/${id}`,
        contentType: 'application/json',
        type: 'DELETE',
        success: function (res, status, xhr) {
            $('#dtofertapromociones').DataTable().row($(`#nombre-${id}`).parent()).remove().draw();
            $('#txtIdPromoEliminar').val('');
            mensaje('#msjAlerta', `Promocion`, 2);

        },
        error: function (res, status, xhr) {
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
        }
    })
}

function validate() {
    let validate = true;
    let ofertaPromo = {
        nombre: $('#txtNombrePromo').val(),
        servicio: $('#selServicios').val(),
        descripcion: $('#txtDescripcionPromo').val(),
        descuento: $('#txtDescuento').val(),
        estado_civil: $('#selEstadoCivil').val(),
        rango_edad: $('#selRangoEdad').val(),
        genero: $('#selGenero').val(),
        valido_desde: $('#dpValidoDesde').val(),
        valido_hasta: $('#dpValidoHasta').val(),
    }
    if (ofertaPromo.nombre == '' || ofertaPromo.servicio == 0 || ofertaPromo.descripcion == '' || ofertaPromo.descuento == '' || ofertaPromo.valido_desde == '' || ofertaPromo.valido_hasta == '' || ofertaPromo.estado_civil == 0 || ofertaPromo.rango_edad == 0 || ofertaPromo.genero == 0 ) {
        validate = false;
    }

    return validate;
}


