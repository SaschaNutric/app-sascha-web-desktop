$(document).ready(function() {
    $('#menuSascha').load('menu.html');



$('#ms_gruposAlimenticios').multiSelect();


$('#dtPlanDieta').dataTable( {
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
			"sEmptyTable": "No se encontraron planes"
		},
	} );

$('#dtComidas').dataTable( {
		"aoColumnDefs": [
		{ "bSortable": false, "aTargets": [ 1 ] }
		],
		"sDom": "ftp",
		"oLanguage": {
			"sLengthMenu": "",
			"sSearch": "Buscar:",
			"oPaginate":{
				"sPrevious": "Anterior",
				"sNext": "Siguiente"},
			"sEmptyTable": "No se encontraron comidas"
		},
	} );

$('#dtAlimentos').dataTable( {
		"aoColumnDefs": [
		{ "bSortable": false, "aTargets": [ 1 ] }
		],
		"sDom": "ftp",
		"oLanguage": {
			"sLengthMenu": "",
			"sSearch": "Buscar:",
			"oPaginate":{
				"sPrevious": "Anterior",
				"sNext": "Siguiente"},
			"sEmptyTable": "No se encontraron alimentos"
		},
	} );

$('#dtGrupoAlimenticio').dataTable( {
		"aoColumnDefs": [
		{ "bSortable": false, "aTargets": [ 2 ] }
		],
		"sDom": "ftp",
		"oLanguage": {
			"sLengthMenu": "",
			"sSearch": "Buscar:",
			"oPaginate":{
				"sPrevious": "Anterior",
				"sNext": "Siguiente"},
			"sEmptyTable": "No se encontraron grupos alimenticios"
		},
	} );

});
