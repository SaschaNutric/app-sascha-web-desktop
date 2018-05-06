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
                addRowTipoUnidad(tipoUnidad.id_tipo_unidad,tipoUnidad.nombre)
            })

        },
        error: function(res, status, xhr) {
            console.log(res)
            console.log(status)
            const respuesta = JSON.parse(res.responseText);
            mensaje('alert-danger', `<strong>Error ${respuesta.data.mensaje}!</strong> Algo salió mal.`);

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
                addRowTipoUnidad(res.data.id_tipo_unidad, res.data.nombre)
                limpiarTipoUnidad()
                mensaje('alert-success', `<strong>Éxito!</strong> Tipo de Unidad agregada.`);
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                const respuesta = JSON.parse(res.responseText);
                mensaje('alert-danger', `<strong>Error ${respuesta.data.mensaje}!</strong> Algo salió mal.`);
            }
        })
        $('#agregarTipoUnidad').modal('hide');

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

        if(tipoUnidad.nombre == $(`#nombreTipo-${id}`).text()){
        $('#agregarTipoUnidad').modal('hide');
        mensaje("alert-info","<strong>Oye!</strong> No has hecho ningún cambio.")
            return;
        }
        $.ajax({
            url: `https://api-sascha.herokuapp.com/tipounidad/${id}`,
            contentType: 'application/json',
            type: 'PUT',
            data: JSON.stringify(tipoUnidad),
            success: function(res, status, xhr) {
                limpiarTipoUnidad()
                const tipoUnidad = res.data;
                console.log(res.data)
                mensaje('alert-info', '<strong>Exito!</strong> Tipo de unidad modificado.');

                editRowTipoUnidad(tipoUnidad.id_tipo_unidad, tipoUnidad.nombre)
            },
            error: function(res, status, xhr) {
                limpiarTipoUnidad()
                const respuesta = JSON.parse(res.responseText);
                mensaje('alert-danger', `<strong>Error ${respuesta.data.mensaje}!</strong> Algo salió mal.`);
                
            }
        })
        $('#agregarTipoUnidad').modal('hide');
    })



    /* tabla unidades */
    const tablaUnidad = $('#dtUnidad').DataTable({ 
   "language": {
            "lengthMenu": "",
            "search": "Buscar:",
            "paginate": {
                "previous": "Anterior",
                "next": "Siguiente"
            },
            "emptyTable": "No se encontraron unidades",
            "zeroRecords": "No se encontraron unidades"
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
                addRowUnidad(unidad.id_unidad, unidad.nombre, unidad.abreviatura, unidad.tipo_unidad.nombre)
            })

        },
        error: function(res, status, xhr) {
            const respuesta = JSON.parse(res.responseText);
            mensaje('alert-danger', `<strong>Error ${respuesta.data.mensaje}!</strong> Algo salió mal.`);

        }
    })


    $('#btnAceptarUnidad').on('click', function() {

        if($('select[name=tipo_unidad]').val() == "0"){
            $('select[name=tipo_unidad]').css('border', '1px solid red')
            return;
        }

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
                const unidad = res.data;
                mensaje('alert-success', `<strong>Éxito!</strong> Unidad agregada.`);
                const nombre_tipo_unidad = $('select[name="tipo_unidad"] option:selected').text()
                addRowUnidad(unidad.id_unidad, unidad.nombre, unidad.abreviatura, nombre_tipo_unidad);               
                limpiarUnidad();
            },
            error: function(res, status, xhr) {
                const respuesta = JSON.parse(res.responseText);
                mensaje('alert-danger', `<strong>Eror ${respuesta.data.mensaje}!</strong> No se ha podido agregar.`);
                
            }
        })

    })

    $('#btnEditarUnidad').on('click', function() {
            console.log("hola")

        if($('select[name=tipo_unidad]').val() == "0"){
            $('select[name=tipo_unidad]').css('border', '1px solid red')
            return;
        }
        if($('#txtNombreUnidad').val() == ""){
             console.log($('select[name=tipo_unidad]').val());
            $('#txtNombreUnidad').css('border', '1px solid red');
            return;
        }

        if($('#txtAbreviaturaUnidad').val() == ""){
            $('#txtAbreviaturaUnidad').css('border', '1px solid red');
            return;
        }


        let unidad = {
            nombre: $('#txtNombreUnidad').val(),
            abreviatura: $('#txtAbreviaturaUnidad').val(),
            id_tipo_unidad: $('select[name=tipo_unidad]').val()
        }

        const nombre_tipo_unidad = $('select[name="tipo_unidad"] option:selected').text()

        let id = $('#txtIdUnidad').val();

        if(unidad.nombre == $(`#nombreUnidad-${id}`).text() && unidad.abreviatura == $(`#abreviaturaUnidad-${id}`).text() && nombre_tipo_unidad == $(`#tipo_unidad-${id}`).text()){
            mensaje("alert-info","<strong>Oye!</strong> No has hecho ningún cambio.")
            return;
        }
        $.ajax({
            url: `https://api-sascha.herokuapp.com/unidad/${id}`,
            contentType: 'application/json',
            type: 'PUT',
            data: JSON.stringify(unidad),
            success: function(res, status, xhr) {
                console.log(unidad)
                mensaje('alert-info', `<strong>Éxito!</strong> Unidad modificada.`);
                editRowUnidad(id, unidad.nombre, unidad.abreviatura, nombre_tipo_unidad)
                limpiarUnidad();
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                const respuesta = JSON.parse(res.responseText);
                mensaje('alert-danger', `<strong>Error ${respuesta.data.mensaje}!</strong> Algo salió mal.`);

            }
        })

        $('#agregarUnidad').modal('hide');
    })

});

function verTipoUnidad(id){
    $('#txtNombreTipoUnidad').val($(`#nombreTipo-${id}`).text());
    $('#txtNombreTipoUnidad').prop('disabled', 'true');
    $('#btnAceptartipoUnidad').css('display', 'none');
}

function editarTipoUnidad(id){
    $('#txtNombreTipoUnidad').val($(`#nombreTipo-${id}`).text());
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
            $('#dtTipoUnidad').DataTable().row($(`#nombreTipo-${id}`).parent()).remove().draw();
            $('#txtNombreTipoUnidad').val('');
            mensaje('alert-info', `<strong>Éxito!</strong> Tipo de Unidad eliminada.`);

        },
        error: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            const respuesta = JSON.parse(res.responseText);
            mensaje('alert-danger', `<strong>Error ${respuesta.data.mensaje}!</strong> Algo salió mal.`);

        }
    })
}

function editarUnidad(id){
    $('#txtNombreUnidad').val($(`#nombreUnidad-${id}`).text());
    $('#txtAbreviaturaUnidad').val($(`#abreviatura-${id}`).text());
    $('#selTipoUnidad option:contains('+ $(`#tipo_unidad-${id}`).text() + ')').prop('selected',true);
    $('#txtIdUnidad').val(id);
    $('#btnAceptarUnidad').css('display', 'none');
    $('#btnEditarUnidad').css('display', 'inline');
}

function abrirModalEliminarUnidad(id){
    $('#txtIdUnidadEliminar').val(id);
}

function eliminarUnidad(id){
    $.ajax({
        url: `https://api-sascha.herokuapp.com/unidad/${id}`,
        contentType: 'application/json',
        type: 'DELETE',
        success: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            $('#dtUnidad').DataTable().row($(`#nombreUnidad-${id}`).parent()).remove().draw();
            $('#txtIdUnidadEliminar').val('');
            mensaje('alert-info', `<strong>Éxito!</strong> Unidad eliminada.`);

        },
        error: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            limpiarUnidad();
            const respuesta = JSON.parse(res.responseText);
            mensaje('alert-danger', `<strong>Error ${respuesta.data.mensaje}!</strong> Algo salió mal.`);

        }
    })
}

function limpiarUnidad(){
 $('#txtNombreUnidad').val('');
 $('#txtIdUnidad').val('');
 $('#txtAbreviaturaUnidad').val('');
 $('#selTipoUnidad option:contains(Seleccione)').prop('selected',true);
}

function limpiarTipoUnidad(){

    $('#txtNombreTipoUnidad').val('')
    $('#txtIdTipoUnidad').val('')

}

function mensaje(tipo, texto){
    $('#msjAgregar').addClass(tipo);
    $('#msjAgregar').html(texto );
    $('#msjAgregar').css('display', 'block');
    $(".alert").delay(3000).slideUp(200, function() {
        $('#msjAgregar').css('display', 'none');
    });



}

function addRowTipoUnidad(id, nombre){
   let row = $(`<tr>
    <td id="nombreTipo-${id}">${nombre}</td>
    <td>
    <button onclick="editarTipoUnidad(${id})" type='button' class='edit btn  btn-transparente' data-toggle="modal" data-target="#agregarTipoUnidad"  title='Editar'><i class='fa fa-pencil'></i></button>
    <button onclick="abrirModalEliminarTipoUnidad(${id})" type='button' class='ver btn  btn-transparente' data-toggle='modal' data-target="#modal-confirmar-1" title='Eliminar'><i class="fa fa-trash-o"></i></button>
    </td>
    </tr>
    `);
   $('#dtTipoUnidad').DataTable().row.add(row).draw();
}

function addRowUnidad(id, nombre, abrev, tipo_unidad) {
    let row = $(`<tr>
        <td id="nombreUnidad-${id}">${nombre}</td>
        <td id="abreviatura-${id}">${abrev}</td>
        <td id="tipo_unidad-${id}">${tipo_unidad}</td>
        <td>
        <button onclick="editarUnidad(${id})" type='button' class='edit btn  btn-transparente' data-toggle="modal" data-target="#agregarUnidad"  title='Editar'><i class='fa fa-pencil'></i></button>
        <button onclick="abrirModalEliminarUnidad(${id})" type='button' class='ver btn  btn-transparente' data-toggle='modal' data-target="#eliminarUnidad" title='Eliminar'><i class="fa fa-trash-o"></i></button>
        </td>
        </tr>
        `);
    $('#dtUnidad').DataTable().row.add(row).draw();
}
function editRowTipoUnidad(id, nombre){

    $(`#nombreTipo-${id}`).text(nombre)

}

function editRowUnidad(id, nombre, abrev, tipo_unidad){
    console.log("entrooooooo")
    $(`#nombreUnidad-${id}`).text(nombre)
    $(`#abreviatura-${id}`).text(abrev)
    $(`#tipo_unidad-${id}`).text(tipo_unidad)


}