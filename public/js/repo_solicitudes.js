$(document).ready(function() {

    const tablaSolicitud = $('#dtSolicitud').DataTable({ 
       "language": {
        "lengthMenu": "",
        "search": "Buscar:",
        "paginate": {
            "previous": "Anterior",
            "next": "Siguiente"
        },
        "emptyTable": "No se encontraron solicitudes ",
        "zeroRecords": "No se encontraron solicitudes con esas caracteristicas"
    },
    "searching": true,
    "ordering": true,
    "paging": true   
});

});