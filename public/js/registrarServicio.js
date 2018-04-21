$(document).ready(function() {
$('#menuSascha').load('menu.html');

	$('#dtParametros').dataTable( {
		"aoColumnDefs": [
		{ "bSortable": false, "aTargets": [ 4 ] }
		],
		"sDom": "ftp",
		"oLanguage": {
			
			"sLengthMenu": "",
			"sSearch": "Buscar:",
			"oPaginate":{
				"sPrevious": "Anterior",
				"sNext": "Siguiente"
			},
			"sEmptyTable": "No se encontraron parametros"
		},
	} );
});