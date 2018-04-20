
$(document).ready(function() {
    $('#menuSascha').load('menu.html');
    /* tabla Comentarios */
	$('#dtMotivos').dataTable({ 
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

    /* tabla Respuestas */
    $('#dtRespuestas').dataTable({ 
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

    /* tabla Valoracion */
    $('#dtCriterios').dataTable({ 
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
            "sEmpatyTable": "No se encontraron medidas"
        },        
    });


    
    /* tabla Notificacion */
    $('#dtNotificaciones').dataTable({ 
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


});