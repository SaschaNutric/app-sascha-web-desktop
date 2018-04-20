

$(document).ready(function() {
    $('#menuSascha').load('menu.html');
    /* tabla medidas */
	$('#dtConfUnidadMedida').dataTable({ 
		"aoColumnDefs": [
		{ "bSortable": false, "aTargets": [2] }
        ],               
        "sDom": "ftp",
        "oLanguage": {
        	"sLengthMenu": "",
        	"sSearch": "Buscar:",
            "oPaginate": {
            	"sPrevious": "Anterior",
                "sNext": "Siguiente"
            },
            "sEmpatyTable": "No se encontraron medidas"
        },        
    });


    /* tabla Tiempo */
    $('#dtConfUnidadTiempo').dataTable({ 
        "aoColumnDefs": [
        { "bSortable": false, "aTargets": [1] }
        ],               
        "sDom": "ftp",
        "oLanguage": {
            "sLengthMenu": "",
            "sSearch": "Buscar:",
            "oPaginate": {
                "sPrevious": "Anterior",
                "sNext": "Siguiente"
            },
            "sEmpatyTable": "No se encontraron tiempos"
        },        
    });


    /* tabla tipo de parametros */
    $('#dtConfPerfilTipoParamatros').dataTable({ 
        "aoColumnDefs": [
        { "bSortable": false, "aTargets": [1] }
        ],               
        "sDom": "ftp",
        "oLanguage": {
            "sLengthMenu": "",
            "sSearch": "Buscar:",
            "oPaginate": {
                "sPrevious": "Anterior",
                "sNext": "Siguiente"
            },
            "sEmpatyTable": "No se encontraron tipos de parametros"
        },        
    });


    /* tabla parametros */
    $('#dtConfPerfilParamatros').dataTable({ 
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
            "sEmpatyTable": "No se encontraron parametros"
        },        
    });
});