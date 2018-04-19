$(document).ready(function() {
    $('#menuSascha').load('menu.html');


	$('#dtServicios').dataTable( {
		"aoColumnDefs": [
		{ "bSortable": false, "aTargets": [ 3 ] }
		],
		"sDom": "ftp",
		"oLanguage": {
			"sZeroRecords":"No se encontraron servicios",
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