$(document).ready(function() {
      
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
        success: function(res, status, xhr) {
            res.data.map(function(servicio) {   

                let row = $(`<tr>
                    <td id="nombre-${servicio.id_servicio}">${servicio.nombre}</td>
                    <td>${servicio.id_especialidad}</td>
                    <td>${servicio.nro_visitas}</td>
                    <td>${servicio.precio} ${precio.unidad}</td>
                    <td>
                        <a onclick="verTipoUnidad(${servicio.id_servicio})"  class='ver btn  btn-stransparent' href="serv_registrarServicio.html" title='Ver Más'><i class='fa fa-eye'></i></a>
                        <a onclick="editarTipoUnidad(${servicio.id_servicio})"  class='edit btn  btn-stransparent' href="serv_registrarServicio.html"  title='Editar'><i class='fa fa-pencil'></i></a>
                        <button onclick="abrirModalEliminarTipoUnidad(${servicio.id_servicio})" type="button" class='ver btn  btn-stransparent' data-toggle='modal' data-target="#modal-confirmar" title='Eliminar'><i class="fa fa-trash-o"></i></button>
                    </td>
                </tr>
                `);
                tabla.row.add(row).draw();
            })

        },
        error: function() {
            
        }
    })




});