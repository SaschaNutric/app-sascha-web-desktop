let arreglo_Valoracion = []
$(document).ready(function() {

    /* tabla tipo criterio */
    const tablaCriterio = $('#dtCriterios').dataTable({ 
        "aoColumnDefs": [
        { "bSortable": false, "aTargets": [3] }
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
 /* fin tabla tipo criterio */


/* tabla seleccionando tipo Valoración*/
    const tablaValoracion = $('#dtCriterioTipoValoración').dataTable({ 
        "aoColumnDefs": [
        { "bSortable": false, "aTargets": [1] }
        ],               
        "sDom": "ftp",
        "Language": {
            "LengthMenu": "",
            "Search": "Buscar:",
            "Paginate": {
                "Previous": "Anterior",
                "Next": "Siguiente"
            },
            "emptyTable": "No se encontraron criterios y valoraciones asociadas",
            "zeroRecords": "No se encontraron criterios y valoraciones asociadas"
        }, 
            "searching" :true, 
            "ordering" :true,
            "oPaginate" : true      
    });
/* fin tabla seleccionando tipo Valoración*/



/*llenando tipo de criterio*/
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/tipocriterios',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.map(function(criterio) {
                let option = $(`<option value="${criterio.id_tipo_criterio}">${criterio.nombre}</option> `)
                $('#seltipocriterio').append(option);
            })
        },
        error: function(res, status, xhr) {
            console.log(res);
        }
    })
/*fin llenando tipo de criterio*/


/*comienza el cargado de la tabla tipo de criterio con valoracion */
  $.ajax({
        url: 'https://api-sascha.herokuapp.com/tipocriterios',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.map(function(criterio_valoracion) {
                addRowCriterioValoracion(criterio_valoracion.id_tipo_criterio, criterio_valoracion.nombre, criterio_valoracion.tipo_valoracion.id_tipo_valoracion

                    );
            })                   
        },
        error: function(res, status, xhr) {
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
        }
    })
 /*fin del cargado de la tabla tipo de criterio con valoracion */



/*llenando tipo de Valoraciones*/
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/tipovaloraciones',
        type: 'GET',
         async: false,
             contentType: 'application/json',
             success: function (res, status, xhr) {
                res.data.map(function(valoracion) {
                arreglo_Valoracion.push({id_tipo_valoracion: valoracion.id_tipo_valoracion,
                                valoracion: valoracion.nombre
                            })
                        })
                    },
                    error: function (res, status, xhr) {
                        alert("error!")
                    }
                })
/*fin llenando tipo de Valoraciones*/
/*comienza el cargado de la tabla tipo de criterio*/
  $.ajax({
        url: 'https://api-sascha.herokuapp.com/criterios',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.map(function(criterio) {
                addRowCriterio(criterio.id_criterio, criterio.nombre, criterio.descripcion, criterio.tipo_criterio.nombre);
            })                   
        },
        error: function(res, status, xhr) {
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
        }
    })
 /*fin del cargado de la tabla tipo de criterio*/



         $('#btnAceptarCriterio').on('click', function() {
        if($('#txtNombreCriterio').val() == "")
        {
            $('#txtNombreCriterio').css('border', '1px solid red');
            return;
        }
        if($('#txtDescripcionCriterio').val() == "")
        {
            $('#txtDescripcionCriterio').css('border', '1px solid red');
            return;
        }
        if($('select[name=tipo_criterio').val() == "0")
        {
            $('select[name=tipo_criterio]').css('border', '1px solid red')
            return;
        }
         let Criterio = {
            nombre: $('#txtNombreCriterio').val(),
            descripcion: $('#txtDescripcionCriterio').val(),
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
                addRowCriterio(criterio.id_criterio, criterio.nombre, criterio.descripcion, nombre_tipo_criterio);               
                limpiarCriterio();
                mensaje('#msjAlerta', `Criterio`, 1);
            },
            error: function(res, status, xhr) {
                console.log(res)
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
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

    if(criterio.nombre == $(`#nombreCriterio-${id}`).text() && criterio.descripcion == $(`#descripcionCriterio-${id}`).text() && nombre_tipo_criterio == $(`#tipo_criterio-${id}`).text() )
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

/*------------------------------------------------------------------------------------------------*/
 function Selvaloracion(id){

    console.log(id);
    let id_tipo_valoracion = $('#' + id).val()
    let id_tipo_criterio = id.split('-')[1];
    console.log(JSON.stringify(id_tipo_valoracion));
     $.ajax({
        url: `https://api-sascha.herokuapp.com/tipocriterio/${id_tipo_criterio}`,
        contentType: 'application/json',
        type: 'PUT',
        data: JSON.stringify({id_tipo_valoracion:id_tipo_valoracion}),
        success: function(res, status, xhr) {
            console.log(res.data)
            let crite = res.data
            mensaje('#msjAlerta', `Criterio`, 3);
        },
        error: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta',`${respuesta.data.mensaje}`, 0);
        }
    })  
}
/*-------------------------------------------------------------------------------------------*/
function createSelValoracion(id, clases, selected, element) {
    console.log('mira este valor '+id)
    let select = document.createElement("select");   
    select.setAttribute('onchange',`Selvaloracion('${id}')`); 
    select.id = id;
    select.className = clases
    let defecto = document.createElement('option');
    defecto.value = 0;
    defecto.innerHTML = "Seleccione";
    defecto.setAttribute("selected","selected")
    select.appendChild(defecto);
    arreglo_Valoracion.map(function (valoracion) {
        let option = document.createElement('option');
        option.value = valoracion.id_tipo_valoracion;
        //option.onClick= "alert('¡Has hecho clic!')";
        //option.setAttribute('onchange',"alert('¡Has hecho clic!');");
        option.innerHTML = valoracion.valoracion;
        select.appendChild(option);
    })
    console.log(selected)
    select.value = selected
    document.getElementById(element).appendChild(select)
}

function editarCriterio(id){
    $('#txtNombreCriterio').val($(`#nombreCriterio-${id}`).text());
    $('#txtDescripcionCriterio').val($(`#descripcionCriterio-${id}`).text());
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
 $('#seltipocriterio option:contains(Seleccione)').prop('selected',true);
}
   

function addRowCriterio(id, nombre, descripcion, tipo_criterio) {
    let row = $(`<tr>
        <td id="nombreCriterio-${id}">${nombre}</td>
        <td id="descripcionCriterio-${id}">${descripcion}</td>
        <td id="tipo_criterio-${id}">${tipo_criterio}</td>
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


/*funcion que hace que me cargue la pantalla en el tag de criterios*/
 function addRowCriterioValoracion(id, nombre, tipo_valoracion) {
    let row = $(`<tr>
        <td id="nombreCriterio-${id}">${nombre}</td>
        <td id='colE-${id}'>  
        </td>
        </tr>
        `);

    $('#dtCriterioTipoValoración').DataTable().row.add(row).draw();
    createSelValoracion(`selvaloracionE-${id}`, 'form-control select-Valoracion', tipo_valoracion, 'colE-' + id)
    }  
 /*fin de la funcion que hace que me cargue la pantalla en el tag de criterios*/


 /*editando el tipo de valoracion al presionar el select*/
 $('#seltipoValoracion').on('change', function () {
        $('#seltipoValoracion option:contains('+ $(`#tipo_valoracion-${id}`).text() + ')').prop('selected',true);
    })
 /* fin editando el tipo de valoracion al presionar el select*/
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