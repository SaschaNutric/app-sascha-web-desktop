$(document).ready(function() {
    /* tabla tipo de parametros */
    const tablaTipoParametro = $('#dtregiTipoParametros').DataTable({ 
        "language": {
            "lengthMenu": "",
            "search": "Buscar:",
            "paginate": {
                "previous": "Anterior",
                "next": "Siguiente"
            },
            "emptyTable": "No se encontraron tipos de parametros",
            "zeroRecords": "No se encontraron tipos de parametros"
        },
        "searching": true,
        "ordering": true,
        "paging": true
    });
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/tipoparametros',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.map(function(tipoParametro) {
                
                let row = $(`<tr>
                    <td id="nombre-${tipoParametro.id_tipo_parametro}">${tipoParametro.nombre}</td>
                    <td>
                        <button onclick="editarTipoParametro(${tipoParametro.id_tipo_parametro})" type='button' class='edit btn  btn-stransparent' data-toggle="modal" data-target="#agregarTipoParametro"  title='Editar'><i class='fa fa-pencil'></i></button>
                        <button onclick="abrirModalEliminarTipoParametro(${tipoParametro.id_tipo_parametro})" type='button' class='ver btn  btn-stransparent' data-toggle='modal' data-target="#eliminarTipoParametro" title='Eliminar'><i class="fa fa-trash-o"></i></button>
                    </td>
                </tr>
                `);
                tablaTipoParametro.row.add(row).draw();
            })

        },
        error: function() {
            
        }
    })

    $('#btnAceptar').on('click', function() {
        
        if($('#txtNombreTipoParametro').val() == ""){
            $('#txtNombreTipoParametro').css('border', '1px solid red');
            return;
        }

        let tipoParametro = {
            nombre: $('#txtNombreTipoParametro').val()
        }

        $.ajax({
            url: 'https://api-sascha.herokuapp.com/tipoparametros',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(tipoParametro),
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                $('#txtNombreTipoParametro').val('')
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
            }
        })

    })

    $('#btnEditar').on('click', function() {
        if($('#txtNombreTipoParametro').val() == ""){
            $('#txtNombreTipoParametro').css('border', '1px solid red');
            return;
        }

        let tipoParametro = {
            nombre: $('#txtNombreTipoParametro').val()
        }

        let id = $('#txtIdTipoParametro').val();
        $.ajax({
            url: `https://api-sascha.herokuapp.com/tipoparametro/${id}`,
            contentType: 'application/json',
            type: 'PUT',
            data: JSON.stringify(tipoParametro),
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                $('#txtNombreTipoParametro').val('')
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
            }
        })
    })



   

});


    function editarTipoParametro(id){
        $('#txtNombreTipoParametro').val($(`#nombre-${id}`).text());
        $('#txtIdTipoParametro').val(id);
        $('#btnAceptar').css('display', 'none');
        $('#btnEditar').css('display', 'inline');
    }

    function abrirModalEliminarTipoParametro(id){
        $('#txtIdTipoParametroEliminar').val(id);
    }

    function eliminarTipoParametro(id){
        $.ajax({
            url: `https://api-sascha.herokuapp.com/tipoparametro/${id}`,
            contentType: 'application/json',
            type: 'DELETE',
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                $('#dtregiTipoParametros').DataTable().row($(`#nombre-${id}`).parent()).remove().draw();
                $('#txtNombreTipoParametro').val('');
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
            }
        })
    }