$(document).ready(function() {
      
    /* tabla tipo de unidades */
	$('#dtTipoUnidad').dataTable({ 
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
            "sEmptyTable": "No se encontraron tipos de unidades"
        },        
    });

    /* tabla unidades */
    $('#dtUnidad').dataTable({ 
        "aoColumnDefs": [
        { "bSortable": false, "aTargets": [1,3] }
        ],               
        "sDom": "ftp",
        "oLanguage": {
            "sLengthMenu": "",
            "sSearch": "Buscar:",
            "oPaginate": {
                "sPrevious": "Anterior",
                "sNext": "Siguiente"
            },
            "sEmptyTable": "No se encontraron unidades"
        },        
    });

    /* tabla tipo de parametros */
    $('#dtregiTipoParametros').dataTable({ 
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
            "sEmptyTable": "No se encontraron tipos de parametros"
        },        
    });

    /* tabla Grupos Alimenticios */
    $('#dtGruposAlimenticios').dataTable({ 
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
            "sEmptyTable": "No se encontraron grupos alimenticios"
        },        
    });

    /* tabla Alimentos */
    $('#dtAlimentos').dataTable({ 
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
            "sEmptyTable": "No se encontraron alimentos"
        },        
    });

    /* tabla Suplementos */
    $('#dtSuplementos').dataTable({ 
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
            "sEmptyTable": "No se encontraron suplementos"
        },        
    });

    /* tabla Ejercicios */
    $('#dtEjercicios').dataTable({ 
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
            "sEmptyTable": "No se encontraron ejercicios"
        },        
    });

    /* tabla Condiciones de garantía */
    $('#dtCondicionGarantia').dataTable({ 
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
            "sEmptyTable": "No se encontraron condiciones"
        },        
    });

    /* tabla Dias Laborables */
    $('#dtDiasLaborables').dataTable({ 
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
            "sEmptyTable": "No se encontraron días laborables"
        },        
    });

    /* tabla Bloque Horario */
    $('#dtBloqueHorario').dataTable({ 
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
            "sEmptyTable": "No se encontraron bloques horarios"
        },        
    });

    /* tabla Crietrios de Valoracion */
    $('#dtCriterioValoracion').dataTable({ 
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
            "sEmptyTable": "No se encontraron bloques horarios"
        },        
    });
});

var tipo_unidad = ["Masa","Tiempo", "Longitud", "Capacidad"];     
var unidad = ["gramos","kilogramos","hora","semana", "mes","litros", "mililitros"];
var abreviatura_unidad = ["g","kg","h","semana", "mes","l", "ml"];
var tablaDieta = document.getElementById('dtPerfil');
var sel = document.getElementById('seleTipoUnidad');
for(var i = 0; i < tipo_unidad.length; i++) {
    var opt = document.createElement('option');
    opt.innerHTML = tipo_unidad[i];
    opt.value = tipo_unidad[i];
    sel.appendChild(opt);
}