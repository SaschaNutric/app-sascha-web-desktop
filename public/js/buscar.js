$ (document).ready(function(){
    $('#dtvisita').dataTable({
        "aoColumnDefs": [
        { "bSortable": false, "aTargets": [ 3 ] }
        ],
        "sDom": "ftp",
        "oLanguage": {
            "sLengthMenu": "",
            "sSearch": "Buscar:",
            "oPaginate":{
                "sPrevious": "Anterior",
                "sNext": "Siguiente"},
            "sEmptyTable": "No se encontraron visitas"
                 },
              } );

    $('#dtreclamos').dataTable({
        "aoColumnDefs": [
        { "bSortable": false, "aTargets": [ 4 ] }
        ],
        "sDom": "ftp",
        "oLanguage": {
            "sLengthMenu": "",
            "sSearch": "Buscar:",
            "oPaginate":{
                "sPrevious": "Anterior",
                "sNext": "Siguiente"},
            "sEmptyTable": "No se encontraron reclamos"
                 },
              } );

    $('#dtcanalescucha').dataTable({
        "aoColumnDefs": [
        { "bSortable": false, "aTargets": [ 5 ] }
        ],
        "sDom": "ftp",
        "oLanguage": {
            "sLengthMenu": "",
            "sSearch": "Buscar:",
            "oPaginate":{
                "sPrevious": "Anterior",
                "sNext": "Siguiente"},
            "sEmptyTable": "No se encontraron datos"
                 },
              } );

    $('#tofertapromociones').dataTable({
        "aoColumnDefs": [
        { "bSortable": false, "aTargets": [ 4 ] }
        ],
        "sDom": "ftp",
        "oLanguage": {
            "sLengthMenu": "",
            "sSearch": "Buscar:",
            "oPaginate":{
                "sPrevious": "Anterior",
                "sNext": "Siguiente"},
            "sEmptyTable": "No se encontraron ofertas"
                 },
              } );
});