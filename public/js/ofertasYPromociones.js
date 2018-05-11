$(document).ready(function() {
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

    // Carga el las promociones en la tabla
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/promociones',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            console.log(res.data)
            res.data.map(function(promocion) {
                let row = $(`<tr>
                    <td id="nombre-${promocion.id_promocion}">${promocion.nombre}</td>
                    <td id="servicio-${promocion.id_promocion}">${promocion.servicio.nombre}</td>
                    <td id="descripcion-${promocion.id_promocion}">${promocion.descripcion}</td>
                    <td id="descuento-${promocion.id_promocion}">${promocion.descuento}</td>
                    <td id="valido_desde-${promocion.id_promocion}">${promocion.valido_desde}</td>
                    <td id="valido_hasta-${promocion.id_promocion}">${promocion.valido_hasta}</td>
                </tr>
                `);
                tabla.row.add(row).draw();
            })

        },
        error: function() {
            
        }
    })





});