$(document).ready(function() {
    /* tabla tipo de unidades */
    const tablaTipoUnidad = $('#dtTipoUnidad').DataTable({ 
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
                        <button onclick="editarTipoUnidad(${tipoUnidad.id_tipo_unidad})" type='button' class='edit btn  btn-stransparent' data-toggle="modal" data-target="#agregarTipoUnidad"  title='Editar'><i class='fa fa-pencil'></i></button>
                        <button onclick="abrirModalEliminarTipoUnidad(${tipoUnidad.id_tipo_unidad})" type='button' class='ver btn  btn-stransparent' data-toggle='modal' data-target="#modal-confirmar-1" title='Eliminar'><i class="fa fa-trash-o"></i></button>
                    </td>
                </tr>
                `);
                tablaTipoUnidad.row.add(row).draw();
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
    const tablaUnidad = $('#dtUnidad').DataTable({ 
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
        "searching": true,
        "ordering": true,
        "paging": true      
    });
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/unidades',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.map(function(unidad) {
                
                let row = $(`<tr>
                    <td id="nombre-${unidad.id_unidad}">${unidad.nombre}</td>
                    <td id="abreviatura-${unidad.id_unidad}">${unidad.abreviatura}</td>
                    <td id="tipo_unidad-${unidad.id_unidad}">${unidad.tipo_unidad.nombre}</td>
                    <td>
                        <button onclick="editarUnidad(${unidad.id_unidad})" type='button' class='edit btn  btn-stransparent' data-toggle="modal" data-target="#agregarUnidad"  title='Editar'><i class='fa fa-pencil'></i></button>
                        <button onclick="abrirModalEliminarUnidad(${unidad.id_unidad})" type='button' class='ver btn  btn-stransparent' data-toggle='modal' data-target="#eliminarUnidad" title='Eliminar'><i class="fa fa-trash-o"></i></button>
                    </td>
                </tr>
                `);
                tablaUnidad.row.add(row).draw();
            })

        },
        error: function() {
            
        }
    })


    $('#btnAceptarUnidad').on('click', function() {
        console.log($('#selTipoUnidad').val())
        console.log($('select[name=tipo_unidad]').val())

        if($('#txtNombreUnidad').val() == ""){
            $('#txtNombreUnidad').css('border', '1px solid red');
            return;
        }

        if($('#txtAbreviaturaUnidad').val() == ""){
            $('#txtAbreviaturaUnidad').css('border', '1px solid red');
            return;
        }

        let Unidad = {
            nombre: $('#txtNombreUnidad').val(),
            abreviatura: $('#txtAbreviaturaUnidad').val(),
            id_tipo_unidad: $('select[name=tipo_unidad]').val()
        }

        $.ajax({
            url: 'https://api-sascha.herokuapp.com/unidades',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(Unidad),
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                $('#txtNombreUnidad').val('');
                $('#txtAbreviaturaUnidad').val('');
                document.getElementById('tipo_unidad').selectedIndex = 0
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
            }
        })

    })

    $('#btnEditarUnidad').on('click', function() {
        if($('#txtNombreUnidad').val() == ""){
            $('#txtNombreUnidad').css('border', '1px solid red');
            return;
        }

        if($('#txtAbreviaturaUnidad').val() == ""){
            $('#txtAbreviaturaUnidad').css('border', '1px solid red');
            return;
        }

        let Unidad = {
            nombre: $('#txtNombreUnidad').val(),
            abreviatura: $('#txtAbreviaturaUnidad').val(),
            id_tipo_unidad: $('select[name=tipo_unidad]').val()
        }

        let id = $('#txtIdUnidad').val();
        $.ajax({
            url: `https://api-sascha.herokuapp.com/tipounidad/${id}`,
            contentType: 'application/json',
            type: 'PUT',
            data: JSON.stringify(Unidad),
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                $('#txtNombreUnidad').val('');
                $('#txtAbreviaturaUnidad').val('');
                document.getElementById('tipo_unidad').selectedIndex = 0
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
            }
        })
    })


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

    function editarUnidad(id){
        $('#txtNombreUnidad').val($(`#nombre-${id}`).text());
        $('#txtAbreviaturaUnidad').val($(`#abreviatura-${id}`).text());
        $('select[name=tipo_unidad]').val($(`#tipo_unidad-${id}`).text());
        $('#txtIdUnidad').val(id);
        $('#btnAceptarUnidad').css('display', 'none');
        $('#btnEditarUnidad').css('display', 'inline');
    }

    function abrirModalEliminarUnidad(id){
        $('#txtIdUnidadEliminar').val(id);
    }

    function eliminarUnidad(id){
        console.log(id)
        $.ajax({
            url: `https://api-sascha.herokuapp.com/unidad/${id}`,
            contentType: 'application/json',
            type: 'DELETE',
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                $('#dtUnidad').DataTable().row($(`#nombre-${id}`).parent()).remove().draw();
                $('#txtNombreUnidad').val('');
                $('#txtAbreviaturaUnidad').val('');
                document.getElementById('tipo_unidad').selectedIndex = 0
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
            }
        })
    }