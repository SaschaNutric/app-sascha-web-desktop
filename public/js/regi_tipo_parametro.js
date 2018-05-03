$(document).ready(function() {
    /* tabla tipo de parametros */
    const tablaTipoParametro = $('#dtregiTipoParametros').DataTable({ 
        "aoColumnDefs": [
        { "bSortable": false, "aTargets": [1] }
        ],
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
                addRowTipoParametro(tipoParametro.id_tipo_parametro,tipoParametro.nombre)
            })

        },
        error: function(res, status, xhr) {
            console.log(res)
            console.log(status)
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);

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
                addRowTipoParametro(res.data.id_tipo_parametro, res.data.nombre)
                limpiarTipoParametro()
                mensaje('#msjAlerta', `Tipo Parametro`, 1);
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta',`${respuesta.data.mensaje}`, 0);
            }
        })
        $('#agregarTipoParametro').modal('hide');

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

        if(tipoParametro.nombre == $(`#nombre-${id}`).text()){
            $('#agregarTipoParametro').modal('hide');
            mensaje('#msjAlerta', '', 4);

            return;
        }
        $.ajax({
            url: `https://api-sascha.herokuapp.com/tipoparametro/${id}`,
            contentType: 'application/json',
            type: 'PUT',
            data: JSON.stringify(tipoParametro),
            success: function(res, status, xhr) {
                limpiarTipoParametro()
                const tipoParametro = res.data;
                console.log(res.data)
                mensaje('#msjAlerta',  `Tipo Parametro`, 3);
                editRowTipoParametro(tipoParametro.id_tipo_parametro, tipoParametro.nombre)
            },
            error: function(res, status, xhr) {
                limpiarTipoParametro()
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
            }
        })
        $('#agregarTipoParametro').modal('hide');
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
                mensaje('#msjAlerta', `Tipo Parametro`, 2);
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
            }
        })
    }

    function limpiarTipoParametro(){

    $('#txtNombreTipoParametro').val('')
    $('#txtIdTipoParametro').val('')

}
    function addRowTipoParametro(id, nombre){
        let row = $(`<tr>
            <td id="nombre-${id}">${nombre}</td>
            <td>
            <button onclick="editarTipoParametro(${id})" type='button' class='edit btn  btn-transparente' data-toggle="modal" data-target="#agregarTipoParametro"  title='Editar'><i class='fa fa-pencil'></i></button>
            <button onclick="abrirModalEliminarTipoParametro(${id})" type='button' class='ver btn  btn-transparente' data-toggle='modal' data-target="#eliminarTipoParametro" title='Eliminar'><i class="fa fa-trash-o"></i></button>
            </td>
            </tr>
            `);
       $('#dtregiTipoParametros').DataTable().row.add(row).draw();
    }

    function editRowTipoParametro(id, nombre){

        $(`#nombre-${id}`).text(nombre)

    }
