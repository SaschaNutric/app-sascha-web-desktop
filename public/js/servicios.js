$(document).ready(function() {
      


	$('#dtServicios').dataTable( {
		"aoColumnDefs": [
		{ "bSortable": false, "aTargets": [ 3 ] }
		],
		"sDom": "ftp",
		"oLanguage": {
			
			"sLengthMenu": "",
			"sSearch": "Buscar:",
			"oPaginate":{
				"sPrevious": "Anterior",
				"sNext": "Siguiente"
			},
			"sEmptyTable": "No se encontraron servicios"
		},
	} );
});