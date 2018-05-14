$(document).ready(function() {
    /* tabla tipo de contacto */
    const tablaTipoContacto = $('#dtTipoContacto').DataTable({ 
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
            "emptyTable": "No se encontraron tipos de contacto",
            "zeroRecords": "No se encontraron tipos de contacto"
        },
        "searching": true,
        "ordering": true,
        "paging": true
    });
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/tipomotivos/canalescucha',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.map(function(contacto) {                
                addRowTipoContacto(contacto.id_tipo_motivo,contacto.nombre)
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
        
        if($('#txtNombreTipoContacto').val() == ""){
            $('#txtNombreTipoContacto').css('border', '1px solid red');
            return;
        }

        let tipoContacto = {
            nombre: $('#txtNombreTipoContacto').val(),
        }

        $.ajax({
            url: 'https://api-sascha.herokuapp.com/tipomotivos',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(tipoContacto),
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                addRowTipoContacto(res.data.id_tipo_motivo, res.data.nombre)
                limpiarTipoContacto()
                mensaje('#msjAlerta', `Tipo Contacto`, 1);
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta',`${respuesta.data.mensaje}`, 0);
            }
        })
        $('#agregarTipoContacto').modal('hide');

    })

    $('#btnEditar').on('click', function() {
        if($('#txtNombreTipoContacto').val() == ""){
            $('#txtNombreTipoContacto').css('border', '1px solid red');
            return;
        }

        let tipoContacto = {
            nombre: $('#txtNombreTipoContacto').val()
        }

        let id = $('#txtIdTipoContacto').val();

        if(tipoContacto.nombre == $(`#nombre-${id}`).text()){
            $('#agregarTipoContacto').modal('hide');
            mensaje('#msjAlerta', '', 4);

            return;
        }
        $.ajax({
            url: `https://api-sascha.herokuapp.com/tipomotivo/${id}`,
            contentType: 'application/json',
            type: 'PUT',
            data: JSON.stringify(tipoContacto),
            success: function(res, status, xhr) {
                limpiarTipoContacto()
                const tipoContacto = res.data;
                console.log(res.data)
                mensaje('#msjAlerta',  `Tipo Contacto`, 3);
                editRowTipoContacto(tipoContacto.id_tipo_motivo, tipoContacto.nombre)
            },
            error: function(res, status, xhr) {
                limpiarTipoContacto()
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
            }
        })
        $('#agregarTipoContacto').modal('hide');
    })



   

});


    function editarTipoContacto(id){
        $('#txtNombreTipoContacto').val($(`#nombre-${id}`).text());
        $('#txtIdTipoContacto').val(id);
        $('#btnAceptar').css('display', 'none');
        $('#btnEditar').css('display', 'inline');
    }
    function agregarTipoContacto(){

    $('#btnAceptar').css('display', 'inline');
    $('#btnEditar').css('display', 'none');
}

    function abrirModalEliminarTipoContacto(id){
        $('#txtIdTipoContactoEliminar').val(id);
    }

    function eliminarTipoContacto(id){
        $.ajax({
            url: `https://api-sascha.herokuapp.com/tipomotivo/${id}`,
            contentType: 'application/json',
            type: 'DELETE',
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                $('#dtTipoContacto').DataTable().row($(`#nombre-${id}`).parent()).remove().draw();
                $('#txtNombreTipoContacto').val('');
                mensaje('#msjAlerta', `Tipo Contacto`, 2);
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
            }
        })
    }

    function limpiarTipoContacto(){

    $('#txtNombreTipoContacto').val('')
    $('#txtIdTipoContacto').val('')

}
    function addRowTipoContacto(id, nombre){
        let row = $(`<tr>
            <td id="nombre-${id}">${nombre}</td>
            <td>
            <button onclick="editarTipoContacto(${id})" type='button' class='edit btn  btn-transparente' data-toggle="modal" data-target="#agregarTipoContacto"  title='Editar'><i class='fa fa-pencil'></i></button>
            <button onclick="abrirModalEliminarTipoContacto(${id})" type='button' class='ver btn  btn-transparente' data-toggle='modal' data-target="#eliminarTipoContacto" title='Eliminar'><i class="fa fa-trash-o"></i></button>
            </td>
            </tr>
            `);
       $('#dtTipoContacto').DataTable().row.add(row).draw();
    }

    function editRowTipoContacto(id, nombre){

        $(`#nombre-${id}`).text(nombre)

    }
