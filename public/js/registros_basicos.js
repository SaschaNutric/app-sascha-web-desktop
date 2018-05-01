$(document).ready(function() {
    /* tabla tipo de unidades */
    const tabla = $('#dtTipoUnidad').DataTable({ 
        "language": {
            "lengthMenu": "",
            "search": "Buscar:",
            "paginate": {
                "previous": "Anterior",
                "next": "Siguiente"
            },
            "emptyTable": "No se encontraron tipos de unidades",
            "zeroRecords": "No se encontraron tipos de unidades"
        },
        "searching": true,
        "ordering": true,
        "paging": true
    });
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/tipounidades',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.map(function(tipoUnidad) {
                let option = $(`<option value="${tipoUnidad.id_tipo_unidad}">${tipoUnidad.nombre}</option>`)
                $('#selTipoUnidad').append(option);
                
                let row = $(`<tr>
                    <td id="nombre-${tipoUnidad.id_tipo_unidad}">${tipoUnidad.nombre}</td>
                    <td>
                        <button onclick="verTipoUnidad(${tipoUnidad.id_tipo_unidad})" type='button' class='ver btn  btn-stransparent' data-toggle="modal" data-target="#agregarTipoUnidad" title='Ver Más'><i class='fa fa-eye'></i></button>
                        <button onclick="editarTipoUnidad(${tipoUnidad.id_tipo_unidad})" type='button' class='edit btn  btn-stransparent' data-toggle="modal" data-target="#agregarTipoUnidad"  title='Editar'><i class='fa fa-pencil'></i></button>
                        <button onclick="abrirModalEliminarTipoUnidad(${tipoUnidad.id_tipo_unidad})" type='button' class='ver btn  btn-stransparent' data-toggle='modal' data-target="#modal-confirmar-1" title='Eliminar'><i class="fa fa-trash-o"></i></button>
                    </td>
                </tr>
                `);
                tabla.row.add(row).draw();
            })

        },
        error: function() {
            
        }
    })

    $('#btnAceptartipoUnidad').on('click', function() {
        
        if($('#txtNombreTipoUnidad').val() == ""){
            $('#txtNombreTipoUnidad').css('border', '1px solid red');
            return;
        }

        let tipoUnidad = {
            nombre: $('#txtNombreTipoUnidad').val()
        }

        $.ajax({
            url: 'https://api-sascha.herokuapp.com/tipounidades',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(tipoUnidad),
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                $('#txtNombreTipoUnidad').val('')
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
            }
        })

    })

    $('#btnEditartipoUnidad').on('click', function() {
        if($('#txtNombreTipoUnidad').val() == ""){
            $('#txtNombreTipoUnidad').css('border', '1px solid red');
            return;
        }

        let tipoUnidad = {
            nombre: $('#txtNombreTipoUnidad').val()
        }

        let id = $('#txtIdTipoUnidad').val();
        $.ajax({
            url: `https://api-sascha.herokuapp.com/tipounidad/${id}`,
            contentType: 'application/json',
            type: 'PUT',
            data: JSON.stringify(tipoUnidad),
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                $('#txtNombreTipoUnidad').val('')
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
            }
        })
    })



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

    $('#btnAceptarUnidad').on('click', function() {
        

        console.log($('#selTipoUnidad').val())
        console.log($('select[name=tipo_unidad]').val())

        let tipoUnidad = {
            nombre: $('#txtNombreTipoUnidad').val()
        }

        $.ajax({
            url: 'https://api-sascha.herokuapp.com/tipounidades',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(tipoUnidad),
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                $('#txtNombreTipoUnidad').val('')
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
            }
        })

    })

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

    /* tabla Comidas */
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

    /* tabla Tipos de Comidas */
    $('#dtTipoComidas').dataTable({ 
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
            "sEmptyTable": "No se encontraron tipos de comidas"
        },        
    });

    /* tabla Suplementos */
    $('#dtSuplementos').dataTable({ 
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


    /* tabla Tipo de Valoracion */
    $('#dtTipoValoracion').dataTable({ 
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
            "sEmptyTable": "No se encontraron Tipos de valoración"
        },        
    });


});

var tipo_unidad = ["Masa","Tiempo", "Longitud", "Capacidad"];     
var unidad = ["gramos","kilogramos","hora","semana", "mes","litros", "mililitros"];
var abreviatura_unidad = ["g","kg","h","semana", "mes","l", "ml"];
var tablaDieta = document.getElementById('dtPerfil');
var sel = document.getElementById('seleTipoUnidad');
if(sel != null || sel != undefined){
for(var i = 0; i < tipo_unidad.length; i++) {
    var opt = document.createElement('option');
    opt.innerHTML = tipo_unidad[i];
    opt.value = tipo_unidad[i];
    sel.appendChild(opt);}
}

    function verTipoUnidad(id){
        $('#txtNombreTipoUnidad').val($(`#nombre-${id}`).text());
        $('#txtNombreTipoUnidad').prop('disabled', 'true');
        $('#btnAceptartipoUnidad').css('display', 'none');
    }

    function editarTipoUnidad(id){
        $('#txtNombreTipoUnidad').val($(`#nombre-${id}`).text());
        $('#txtIdTipoUnidad').val(id);
        $('#btnAceptartipoUnidad').css('display', 'none');
        $('#btnEditartipoUnidad').css('display', 'inline');
    }

    function abrirModalEliminarTipoUnidad(id){
        $('#txtIdTipoUnidadEliminar').val(id);
    }

    function eliminarTipoUnidad(id){
        $.ajax({
            url: `https://api-sascha.herokuapp.com/tipounidad/${id}`,
            contentType: 'application/json',
            type: 'DELETE',
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                $('#dtTipoUnidad').DataTable().row($(`#nombre-${id}`).parent()).remove().draw();
                $('#txtNombreTipoUnidad').val('');
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
            }
        })
    }