

$(document).ready(function() {

    /* tabla parametros */
    $('#dtParametros').dataTable({ 
        "aoColumnDefs": [
        { "bSortable": false, "aTargets": [4] }
        ],               
        "sDom": "ftp",
        "oLanguage": {
            "sLengthMenu": "",
            "sSearch": "Buscar:",
            "oPaginate": {
                "sPrevious": "Anterior",
                "sNext": "Siguiente"
            },
            "SEmptyTble": "No se encontraron parametros"
        },        
    });
});