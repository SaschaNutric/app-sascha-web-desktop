$(document).ready(function() {

    /* tabla parametros */
    const tablaCriterio = $('#dtCriterios').dataTable({ 
        "aoColumnDefs": [
        { "bSortable": false, "aTargets": [4] }
        ],               
        "sDom": "ftp",
        "Language": {
            "LengthMenu": "",
            "Search": "Buscar:",
            "Paginate": {
                "Previous": "Anterior",
                "Next": "Siguiente"
            },
            "emptyTable": "No se encontraron criterios",
            "zeroRecords": "No se encontraron criterios"
        }, 
            "searching" :true, 
            "ordering" :true,
            "oPaginate" : true      
    });
 
  $.ajax({
        url: 'https://api-sascha.herokuapp.com/criterios',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.map(function(criterio) {
                addRowCriterio(criterio.id_criterio, criterio.nombre, criterio.descripcion, criterio.tipo_criterio.nombre, criterio.tipo_valoracion.nombre)
                const nombre_tipo_valoracion = $('select[name="tipo_valoracion"] option:selected').text()

            })    
                
        },
        error: function(res, status, xhr) {
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
            
        }

    })

  $.ajax({
        url: 'https://api-sascha.herokuapp.com/tipovaloraciones',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.map(function(tipoValoracion) {
                let optiontipo = $(`<option value="${tipoValoracion.id_tipo_valoracion}">${tipoValoracion.nombre}</option>`)
                $('#seltipovaloracion').append(optiontipo);
            })
        },
        error: function(res, status, xhr) {
            console.log(res)
            console.log(status)
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);

        }
    })

         $('#btnAceptarCriterio').on('click', function() {

        if($('select[name=tipo_valoracion]').val() == "0"){
            $('select[name=tipo_valoracion]').css('border', '1px solid red')
            return;
        }

        if($('#txtNombreCriterio').val() == ""){
            $('#txtNombreCriterio').css('border', '1px solid red');
            return;
        }

        if($('#txtDescripcionCriterio').val() == ""){
            $('#txtDescripcionCriterio').css('border', '1px solid red');
            return;
        }
        

        if($('select[name=tipo_criterio').val() == "0"){
            $('select[name=tipo_criterio]').css('border', '1px solid red')
            return;
        }
        
         


        let Criterio = {
            nombre: $('#txtNombreCriterio').val(),
            descripcion: $('#txtDescripcionCriterio').val(),
            id_tipo_valoracion: $('select[name=tipo_valoracion]').val(),
            id_tipo_criterio: $ ('select[name=tipo_criterio]').val(),
            

        }

        $.ajax({
            url: 'https://api-sascha.herokuapp.com/criterios',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(Criterio),
            success: function(res, status, xhr) 
             {

                const criterio = res.data;
                const nombre_tipo_criterio = $('select[name="tipo_criterio"] option:selected').text()
                const nombre_tipo_valoracion = $('select[name="tipo_valoracion"] option:selected').text()
                addRowCriterio(criterio.id_criterio, criterio.nombre, criterio.descripcion, nombre_tipo_criterio, nombre_tipo_valoracion);               
                limpiarCriterio();
                mensaje('#msjAlerta', `Criterio`, 1);
            },
            error: function(res, status, xhr) {
                console.log(res)
              //  const respuesta = JSON.parse(res.responseText);
              //  mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
            }
        })

        $('#modal-agregar-valoracion').modal('hide');

    })
 $('#btnEditarCriterio').on('click', function() {

        if($('select[name=tipo_valoracion]').val() == "0"){
            $('select[name=tipo_valoracion]').css('border', '1px solid red')
            return;
        }

        if($('#txtNombreCriterio').val() == ""){
         $('#txtNombreCriterio').css('border', '1px solid red');
         return;
        }

        if($('#txtDescripcionCriterio').val() == ""){
         $('#txtDescripcionCriterio').css('border', '1px solid red');
         return;
        }

        if($('select[name=tipo_criterio').val() == "0"){
            $('select[name=tipo_criterio]').css('border', '1px solid red')
            return;
        }



    let criterio = {
            nombre: $('#txtNombreCriterio').val(),
            descripcion: $('#txtDescripcionCriterio').val(),
            id_tipo_valoracion: $('select[name=tipo_valoracion]').val(),
            id_tipo_criterio: $ ('select[name=tipo_criterio]').val(),
    }

    console.log(criterio)
    const nombre_tipo_valoracion = $('select[name="tipo_valoracion"] option:selected').text()
    const nombre_tipo_criterio = $('select[name="tipo_criterio"] option:selected').text()


    let id = $('#txtIdCriterio').val();

    if(criterio.nombre == $(`#nombreCriterio-${id}`).text() && nombre_tipo_valoracion == $(`#tipo_valoracion-${id}`).text() && criterio.descripcion == $(`#descripcionCriterio-${id}`).text() && nombre_tipo_criterio == $(`#tipo_criterio-${id}`).text() )
    {
        mensaje('#msjAlerta', ``, 4);
        $('#modal-agregar-valoracion').modal('hide');   
        return;
    }
    $.ajax({
        url: `https://api-sascha.herokuapp.com/criterio/${id}`,
        contentType: 'application/json',
        type: 'PUT',
        data: JSON.stringify(criterio),
        success: function(res, status, xhr) {
            console.log(res.data)
            let crite = res.data
            mensaje('#msjAlerta', `Criterio`, 3);

            editRowCriterio(crite.id_criterio, crite.nombre, crite.descripcion, nombre_tipo_valoracion, nombre_tipo_criterio);
        },
        error: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta',`${respuesta.data.mensaje}`, 0);

        }
    })

    $('#modal-agregar-valoracion').modal('hide');

})

});

function editarCriterio(id){
    $('#txtNombreCriterio').val($(`#nombreCriterio-${id}`).text());
    $('#txtDescripcionCriterio').val($(`#descripcionCriterio-${id}`).text());
    $('#seltipovaloracion option:contains('+ $(`#tipo_valoracion-${id}`).text() + ')').prop('selected',true);
    $('#txtIdCriterio').val(id);
    $('#seltipocriterio option:contains('+ $(`#tipo_criterio-${id}`).text() + ')').prop('selected',true);
    $('#btnAceptarCriterio').css('display', 'none');
    $('#btnEditarCriterio').css('display', 'inline');
}

function abrirModalEliminarCriterio(id){
    $('#txtIdCriterioEliminar').val(id);
}

function eliminarcriterio(id){
    $.ajax({
        url: `https://api-sascha.herokuapp.com/criterio/${id}`,
        contentType: 'application/json',
        type: 'DELETE',
        success: function(res, status, xhr) {
            $('#dtCriterios').DataTable().row($(`#nombreCriterio-${id}`).parent()).remove().draw();
            $('#txtIdCriterioEliminar').val('');
            mensaje('#msjAlerta', `Criterio`, 2);

        },
        error: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            limpiarCriterio();
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);

        }
    })
}

function limpiarCriterio(){
 $('#txtNombreCriterio').val('');
 $('#txtDescripcionCriterio').val('');
 $('#txtIdCriterio').val('');
 $('#seltipovaloracion option:contains(Seleccione)').prop('selected',true);
 $('#seltipocriterio option:contains(Seleccione)').prop('selected',true);
}
   

function addRowCriterio(id, nombre, descripcion, tipo_criterio, tipo_valoracion) {
    

    let row = $(`<tr>
        <td id="nombreCriterio-${id}">${nombre}</td>
        <td id="descripcionCriterio-${id}">${descripcion}</td>
        <td id="tipo_criterio-${id}">${tipo_criterio}</td>
        <td id="tipo_valoracion-${id}">${tipo_valoracion}</td> 
        <td>
        <button onclick="editarCriterio(${id})" type='button' class='edit btn  btn-transparente' data-toggle="modal" data-target="#modal-agregar-valoracion"  
        title='Editar'><i class='fa fa-pencil'></i></button>
        <button onclick="abrirModalEliminarCriterio(${id})" type='button' class='ver btn  btn-transparente' data-toggle='modal'
         data-target="#eliminarcriterio" title='Eliminar'><i class="fa fa-trash-o"></i></button>
        </td>
        </tr>
        `);
    $('#dtCriterios').DataTable().row.add(row).draw();
}

function editRowCriterio(id, nombre, descripcion, tipo_valoracion, tipo_criterio)
{
    $(`#nombreCriterio-${id}`).text(nombre)
    $(`#descripcionCriterio-${id}`).text(descripcion)
    $(`#tipo_valoracion-${id}`).text(tipo_valoracion)
    $(`#tipo_criterio-${id}`).text(tipo_criterio)

}


function abrirAgregarCriterio(){
    $('#btnAceptarCriterio').css('display', 'inline');
    $('#btnEditarCriterio').css('display', 'none');

}