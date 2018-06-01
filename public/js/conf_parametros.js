let arregloTipoUnidades = [];

$(document).ready(function() {

    /* tabla parametros */
    const tablaParametro = $('#dtParametros').dataTable({ 
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
            "emptyTable": "No se encontraron parametros",
            "zeroRecords": "No se encontraron parametros"
        }, 
            "searching" :true, 
            "ordering" :true,
            "oPaginate" : true      
    });

         $.ajax({
        url: 'https://api-sascha.herokuapp.com/parametros',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.map(function(parametro) {
                let unidad = parametro.id_unidad
                if(unidad == null){
                    addRowParametro(parametro.id_parametro, parametro.nombre, parametro.tipo_parametro.nombre, parametro.tipo_valor , 'N/A', '0')                    
                }else{
                    addRowParametro(parametro.id_parametro, parametro.nombre, parametro.tipo_parametro.nombre, parametro.tipo_valor , parametro.unidad.nombre, parametro.unidad.tipo_unidad.nombre)
                }
            })    
                
        },
        error: function(res, status, xhr) {
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
            
        }

    })


        $.ajax({
        url: 'https://api-sascha.herokuapp.com/tipounidades',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.map(function(tipoUnidad) {
                arregloTipoUnidades.push(tipoUnidad);
                let optiontipo = $(`<option value="${tipoUnidad.id_tipo_unidad}">${tipoUnidad.nombre}</option>`)
                $('#selTipoUnidad').append(optiontipo);
            })
        },
        error: function(res, status, xhr) {
            console.log(res)
            console.log(status)
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);

        }
    })

        $.ajax({
        url: 'https://api-sascha.herokuapp.com/tipoparametros',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.map(function(tipoParametro) {
                let optiontipo = $(`<option value="${tipoParametro.id_tipo_parametro}">${tipoParametro.nombre}</option>`)
                $('#selTipoParametro').append(optiontipo);
            })
        },
        error: function(res, status, xhr) {
            console.log(res)
            console.log(status)
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);

        }
    })

    $('#selTipoValor').on('change', function(){
        const valor = $('#selTipoValor').val();
        console.log(valor)
        if(valor==1 || valor==0){
            $('#real').css('display', 'none');
            $('#selTipoUnidad').val(0);
            $('#selUnidad').val(0);
        }else if(valor==2){
            $('#real').css('display', 'inline');
            
        }
    })

    $('#btnAgregarParametro').on('click', function() {
        $('#btnAceptarParametro').css('display', 'inline');
        $('#btnEditarParametro').css('display', 'none');

    });        
         $('#btnAceptarParametro').on('click', function() {

        if($('select[name=tipo_parametro]').val() == "0"){
            $('select[name=tipo_parametro]').css('border', '1px solid red')
            return;
        }

        if($('#txtNombreParametro').val() == ""){
            $('#txtNombreParametro').css('border', '1px solid red');
            return;
        }


        if($('select[name=tipo_valor').val() == "0"){
            $('select[name=tipo_valor]').css('border', '1px solid red')
            return;
        }
        let unidad = null;
        if($('select[name=unidad]').val()!=0){
            unidad = $('select[name=unidad]').val();
        }


        let Parametro = {
            nombre: $('#txtNombreParametro').val(),
            id_tipo_parametro: $('select[name=tipo_parametro]').val(),
            id_unidad: unidad,
            tipo_valor: $('select[name=tipo_valor]').val(),

        }

        $.ajax({
            url: 'https://api-sascha.herokuapp.com/parametros',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(Parametro),
            success: function(res, status, xhr) {
                const parametro = res.data;
                mensaje('#msjAlerta', `Parametro`, 1);
                if(unidad == null){
                    addRowParametro(parametro.id_parametro, parametro.nombre, parametro.tipo_parametro.nombre, parametro.tipo_valor , 'N/A', '0')                    
                }else{
                    addRowParametro(parametro.id_parametro, parametro.nombre, parametro.tipo_parametro.nombre, parametro.tipo_valor , parametro.unidad.nombre, parametro.unidad.tipo_unidad.nombre)
                }
                limpiarParametro();
            },
            error: function(res, status, xhr) {
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
            }
        })

        $('#modal-agregar-parametro').modal('hide');

    })
         $('#btnEditarParametro').on('click', function() {

        if($('select[name=tipo_parametro]').val() == "0"){
            $('select[name=tipo_parametro]').css('border', '1px solid red')
            return;
        }
        if($('#txtNombreParametro').val() == ""){
         $('#txtNombreParametro').css('border', '1px solid red');
         return;
        }

        if($('select[name=tipo_valor').val() == "0"){
            $('select[name=tipo_valor]').css('border', '1px solid red')
            return;
        }

        let unidad = null;
        let nombre_unidad= 'N/A';
        
        if($('select[name=unidad]').val()!=0){
            unidad = $('select[name=unidad]').val();
             nombre_unidad =  $('select[name="unidad"] option:selected').text()
            
        }


    let parametro = {
            nombre: $('#txtNombreParametro').val(),
            id_tipo_parametro: $('select[name=tipo_parametro]').val(),
            id_unidad: unidad,
            tipo_valor: $('select[name=tipo_valor]').val(),
    }

    
    const nombre_tipo_valor = $('select[name="tipo_valor"] option:selected').text()
    const nombre_tipo_parametro = $('select[name="tipo_parametro"] option:selected').text()
    const nombre_tipo_unidad =  $('select[name="tipo_unidad"] option:selected').text()


    let id = $('#txtIdParametro').val();

    if(parametro.nombre == $(`#nombreParametro-${id}`).text() && nombre_tipo_parametro == $(`#tipo_parametro-${id}`).text() && nombre_unidad == $(`#unidad-${id}`).text() && nombre_tipo_valor == $(`#tipo_valor-${id}`).text() )
    {
        mensaje('#msjAlerta', ``, 4);
        $('#modal-agregar-parametro').modal('hide');   
        return;
    }
    $.ajax({
        url: `https://api-sascha.herokuapp.com/parametro/${id}`,
        contentType: 'application/json',
        type: 'PUT',
        data: JSON.stringify(parametro),
        success: function(res, status, xhr) {
            console.log(res.data)
            let param = res.data
            mensaje('#msjAlerta', `Parametro`, 3);

            editRowParametro(param.id_parametro, param.nombre, nombre_tipo_parametro, nombre_tipo_valor, nombre_unidad, nombre_tipo_unidad);
        },
        error: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta',`${respuesta.data.mensaje}`, 0);

        }
    })

    $('#modal-agregar-parametro').modal('hide');

})

    $( '#selTipoUnidad' )
    .change(function () {
    document.getElementById('selUnidad').length=1;
    var str = "";
    $( "#selTipoUnidad option:selected" ).each(function() {
      str += $( this ).val() + " ";
    });
    arregloTipoUnidades.map(function(tipounidad){
        if(tipounidad.id_tipo_unidad == str){
            tipounidad.unidades.map(function(unidad) {
                let optionunidad = $(`<option value="${unidad.id_unidad}">${unidad.nombre}</option>`)
                $('#selUnidad').append(optionunidad);
            })
        }
    })
  })

});

function editarParametro(id){
    $('#txtNombreParametro').val($(`#nombreParametro-${id}`).text());
    $('#selTipoParametro option:contains('+ $(`#tipo_parametro-${id}`).text() + ')').prop('selected',true);
    $('#txtIdParametro').val(id);
    $('#selTipoUnidad option:contains('+ $(`#tipo_unidad-${id}`).text() + ')').prop('selected',true);
    const tipounidades = $('#selTipoUnidad option:contains('+ $(`#tipo_unidad-${id}`).text() + ')').val();
    console.log(tipounidades)
    console.log(arregloTipoUnidades)
        arregloTipoUnidades.map(function(tipounidad){
        if(tipounidad.id_tipo_unidad == tipounidades){
            $('#selUnidad').empty();
            let optiontipo = $(`<option value="0">Seleccione</option>`)
            $('#selUnidad').append(optiontipo);
            tipounidad.unidades.map(function(unidad) {
                let optionunidad = $(`<option value="${unidad.id_unidad}">${unidad.nombre}</option>`)
                $('#selUnidad').append(optionunidad);
            })
        }
        })

    $('#selUnidad option:contains('+ $(`#unidad-${id}`).text() + ')').prop('selected',true);
    $('#selTipoValor option:contains('+ $(`#tipo_valor-${id}`).text() + ')').prop('selected',true);
    const tipoValor = $('#selTipoValor option:contains('+ $(`#tipo_valor-${id}`).text() + ')').val();
    if(tipoValor ==2){
        $('#real').css('display','block')
    }
    $('#btnAceptarParametro').css('display', 'none');
    $('#btnEditarParametro').css('display', 'inline');
}

function abrirModalEliminarParametro(id){
    $('#txtIdParametroEliminar').val(id);
}

function eliminarParametro(id){
    $.ajax({
        url: `https://api-sascha.herokuapp.com/parametro/${id}`,
        contentType: 'application/json',
        type: 'DELETE',
        success: function(res, status, xhr) {
            $('#dtParametros').DataTable().row($(`#nombreParametro-${id}`).parent()).remove().draw();
            $('#txtIdParametroEliminar').val('');
            mensaje('#msjAlerta', `Parametro`, 2);

        },
        error: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            limpiarParametro();
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);

        }
    })
}

function limpiarParametro(){
    $('#txtNombreParametro').val('');
    $('#txtIdParametro').val('');
    $('#selTipoParametro option:contains(Seleccione)').prop('selected',true);
    $('#selTipoUnidad option:contains(Seleccione)').prop('selected',true);
    $('#selUnidad option:contains(Seleccione)').prop('selected',true);
    $('#selTipoValor option:contains(Seleccione)').prop('selected',true);
    $('#real').css('display','none')
}

function addRowParametro(id, nombre, tipo_parametro, tipo_valor, unidad, tipo_unidad) {
    let valor= '';
    if(tipo_valor===1){
        valor='Nominal'
    }else{
        if(tipo_valor===2){
            valor = 'Real'
        }
    }

    let row = $(`<tr>
        <td id="nombreParametro-${id}">${nombre}</td>
        <td id="tipo_parametro-${id}">${tipo_parametro}</td>
        <td id="tipo_valor-${id}">${valor}</td>
        <td id="unidad-${id}">${unidad}</td>
        <td style= 'display:none' id="tipo_unidad-${id}">${tipo_unidad}</td> 
        <td>
        <button onclick="editarParametro(${id})" type='button' class='edit btn  btn-transparente' data-toggle="modal" data-target="#modal-agregar-parametro"  
        title='Editar'><i class='fa fa-pencil'></i></button>
        <button onclick="abrirModalEliminarParametro(${id})" type='button' class='ver btn  btn-transparente' data-toggle='modal'
         data-target="#eliminarParametro" title='Eliminar'><i class="fa fa-trash-o"></i></button>
        </td>
        </tr>
        `);
    $('#dtParametros').DataTable().row.add(row).draw();
}

function editRowParametro(id, nombre, tipo_parametro, tipo_valor, unidad, tipo_unidad){
    $(`#nombreParametro-${id}`).text(nombre)
    $(`#tipo_parametro-${id}`).text(tipo_parametro)
    $(`#tipo_valor-${id}`).text(tipo_valor)
    $(`#tipo_unidad-${id}`).text(tipo_unidad)
    $(`#unidad-${id}`).text(unidad)

}

 