$(document).ready(function() {

    const tablaCanalEscucha = $('#dtCanalEscucha').DataTable({ 
       "language": {
        "lengthMenu": "",
        "search": "Buscar:",
        "paginate": {
            "previous": "Anterior",
            "next": "Siguiente"
        },
        "emptyTable": "No se encontraron comentarios ",
        "zeroRecords": "No se encontraron comentarios con esas caracteristicas"
    },
    "searching": true,
    "ordering": true,
    "paging": true   
});

});