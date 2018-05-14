$(document).ready(function() {

    const tablaReclamo = $('#dtReclamo').DataTable({ 
       "language": {
        "lengthMenu": "",
        "search": "Buscar:",
        "paginate": {
            "previous": "Anterior",
            "next": "Siguiente"
        },
        "emptyTable": "No se encontraron reclamos ",
        "zeroRecords": "No se encontraron reclamos con esas caracteristicas"
    },
    "searching": true,
    "ordering": true,
    "paging": true   
});

});