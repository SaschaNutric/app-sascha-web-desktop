$(document).ready(function() {
    /* tabla tipo de parametros */
    const tablaTipoParametro = $('#dtEspecialidad').DataTable({ 
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
            "emptyTable": "No se encontraron especialidades",
            "zeroRecords": "No se encontraron especialidades"
        },
        "searching": true,
        "ordering": true,
        "paging": true
    });
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/especialidades',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.map(function(especialidades) {                
                addRowEspecialidad(especialidades.id_especialidad,especialidades.nombre)
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
        
        if($('#txtNombre').val() == ""){
            $('#txtNombre').css('border', '1px solid red');
            return;
        }

        let especialidad = {
            nombre: $('#txtNombre').val()
        }

        $.ajax({
            url: 'https://api-sascha.herokuapp.com/especialidades',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(especialidad),
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                console.log(res.data.id_especialidad)
                addRowEspecialidad(res.data.id_especialidad, res.data.nombre)
                limpiarEspecialidad()
                mensaje('#msjAlerta', `Especialidad`, 1);
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta',`${respuesta.data.mensaje}`, 0);
            }
        })
        $('#agregarEspecialidad').modal('hide');

    })

    $('#btnEditar').on('click', function() {
        if($('#txtNombre').val() == ""){
            $('#txtNombre').css('border', '1px solid red');
            return;
        }

        let especialidad = {
            nombre: $('#txtNombre').val()
        }

        let id = $('#txtIdEspecialidad').val();
        console.log(id)
        if(especialidad.nombre == $(`#nombre-${id}`).text()){
            $('#agregarEspecialidad').modal('hide');
            mensaje('#msjAlerta', '', 4);

            return;
        }
        $.ajax({
            url: `https://api-sascha.herokuapp.com/especialidad/${id}`,
            contentType: 'application/json',
            type: 'PUT',
            data: JSON.stringify(especialidad),
            success: function(res, status, xhr) {
                limpiarEspecialidad();
                const especialidad = res.data;
                console.log(res.data)
                mensaje('#msjAlerta',  `Especialidad`, 3);
                editRowEspecialidad(especialidad.id_especialidad, especialidad.nombre)
            },
            error: function(res, status, xhr) {
                limpiarEspecialidad();
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
            }
        })
        $('#agregarEspecialidad').modal('hide');
    })



   

});


    function editarEspecialidad(id){
        $('#txtNombre').val($(`#nombre-${id}`).text());
        $('#txtIdEspecialidad').val(id);
        $('#btnAceptar').css('display', 'none');
        $('#btnEditar').css('display', 'inline');
    }

    function agregarEspecialidad(){

    $('#btnAceptar').css('display', 'inline');
    $('#btnEditar').css('display', 'none');
}

    function abrirModalEliminarEspecialidad(id){
        $('#txtIdEspecialidadEliminar').val(id);
    }

    function eliminarEspecialidad(id){
        $.ajax({
            url: `https://api-sascha.herokuapp.com/especialidad/${id}`,
            contentType: 'application/json',
            type: 'DELETE',
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                $('#dtEspecialidad').DataTable().row($(`#nombre-${id}`).parent()).remove().draw();
                $('#txtNombre').val('');
                mensaje('#msjAlerta', `Especialidad`, 2);
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
            }
        })
    }

    function limpiarEspecialidad(){

    $('#txtNombre').val('')
    $('#txtIdEspecialidad').val('')

}
    function addRowEspecialidad(id, nombre){
        let row = $(`<tr>
            <td id="nombre-${id}">${nombre}</td>
            <td>
                <button onclick="editarEspecialidad(${id})" type='button' class='edit btn  btn-transparente' data-toggle="modal" data-target="#agregarEspecialidad"  title='Editar'><i class='fa fa-pencil'></i></button>
                <button onclick="abrirModalEliminarEspecialidad(${id})" type='button' class='ver btn  btn-transparente' data-toggle='modal' data-target="#eliminarEspecialidad" title='Eliminar'><i class="fa fa-trash-o"></i></button>
            </td>
            </tr>
            `);
       $('#dtEspecialidad').DataTable().row.add(row).draw();
    }

    function editRowEspecialidad(id, nombre){

        $(`#nombre-${id}`).text(nombre)

    }
