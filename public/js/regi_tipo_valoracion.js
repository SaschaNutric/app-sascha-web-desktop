$(document).ready(function() {

    const tablaValor = $('#dtValor').DataTable({ 
     "language": {
        "lengthMenu": "",
        "search": "Buscar:",
        "paginate": {
            "previous": "Anterior",
            "next": "Siguiente"
        },
        "emptyTable": "No se encontraron tipos de valoración",
        "zeroRecords": "No se encontraron tipos de valoración"
    },
    "searching": true,
    "ordering": true,
    "paging": true   
});
    /* tabla tipo de Valoraciones */
    const tablaTipoValoracion = $('#dtTipoValoracion').DataTable({ 
        "language": {
            "lengthMenu": "",
            "search": "Buscar:",
            "paginate": {
                "previous": "Anterior",
                "next": "Siguiente"
            },
            "emptyTable": "No se encontraron valores",
            "zeroRecords": "No se encontraron valores"
        },
        "searching": true,
        "ordering": true,
        "paging": true
    });



    $.ajax({
        url: 'https://api-sascha.herokuapp.com/tipovaloraciones',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.map(function(tipoValoracion) {
                addRowEscala(tipoValoracion.id_tipo_valoracion,tipoValoracion.nombre)
            })

        },
        error: function(res, status, xhr) {
            console.log(res)
            console.log(status)
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);

        }
    })





    $('#btnAceptarEscala').on('click', function() {

        if($('#txtNombreEscala').val() == ""){
            $('#txtNombreEscala').css('border', '1px solid red');
            return;
        }

        let escala = {
            nombre: $('#txtNombreEscala').val()
        }

        $.ajax({
            url: 'https://api-sascha.herokuapp.com/tipovaloraciones',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(escala),
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                addRowEscala(res.data.id_tipo_valoracion, res.data.nombre)
                limpiarEscala()
                mensaje('#msjAlerta', `Tipo de Valoración`, 1);
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta',`${respuesta.data.mensaje}`, 0);

            }
        })
        $('#agregarTipoValoracion').modal('hide');

    })

    $('#btnEditarEscala').on('click', function() {
        if($('#txtNombreEscala').val() == ""){
            $('#txtNombreEscala').css('border', '1px solid red');
            return;
        }


        let escala = {
            nombre: $('#txtNombreEscala').val()
        }

        let id = $('#txtIdEscala').val();

        if(escala.nombre == $(`#nombreTipo-${id}`).text()){
            $('#agregarTipoValoracion').modal('hide');
            mensaje('#msjAlerta', '', 4);

            return;
        }
        $.ajax({
            url: `https://api-sascha.herokuapp.com/tipovaloracion/${id}`,
            contentType: 'application/json',
            type: 'PUT',
            data: JSON.stringify(escala),
            success: function(res, status, xhr) {
                limpiarEscala()
                const escala = res.data;
                console.log(res.data)
                mensaje('#msjAlerta',  `Tipo de Valoración`, 3);
                editRowEscala(escala.id_tipo_valoracion, escala.nombre)
            },
            error: function(res, status, xhr) {
                limpiarEscala()
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
                
            }
        })
        $('#agregarTipoValoracion').modal('hide');
    })



   


    $('#btnAceptarValor').on('click', function() {

        if($('select[name=tipo_valoracion]').val() == "0"){
            $('select[name=tipo_valoracion]').css('border', '1px solid red')
            return;
        }

        if($('#txtNombreValor').val() == ""){
            $('#txtNombreValor').css('border', '1px solid red');
            return;
        }
        
        if ($('#txtValor').val() == "") {
            $('#txtValor').css('border', '1px solid red');
            return;
        }


        let valor = {
            nombre: $('#txtNombreValor').val(),
            valor: $('#txtValor').val(),
            id_tipo_valoracion: $('select[name=tipo_valoracion]').val()        
        }

        $.ajax({
            url: 'https://api-sascha.herokuapp.com/valoraciones',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(valor),
            success: function(res, status, xhr) {
                console.log(res);
                const valor = res.data;
                mensaje('#msjAlerta', `Valor`, 1);
                const nombre_tipo_valoracion = $('select[name="tipo_valoracion"] option:selected').text()
                addRowValor(valor.id_valoracion, valor.nombre, valor.valor, nombre_tipo_valoracion);               
                limpiarValor();
                $('#agregarValor .close').click();
            },
            error: function(res, status, xhr) {
                console.log(res)
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
            }
        })

    })

    $('#btnEditarValor').on('click', function() {

        if($('select[name=tipo_valoracion]').val() == "0"){
            $('select[name=tipo_valoracion]').css('border', '1px solid red')
            return;
        }
        if($('#txtNombreValor').val() == ""){
           $('#txtNombreValor').css('border', '1px solid red');
           return;
       }
        if ($('#txtValor').val() == "") {
            $('#txtNombreValor').css('border', '1px solid red');
            return;
        }

    let valor = {
        nombre: $('#txtNombreValor').val(),
        valor: $('#txtValor').val(),
        id_tipo_valoracion: $('select[name=tipo_valoracion]').val()
    }

    const nombre_tipo_valoracion = $('select[name="tipo_valoracion"] option:selected').text()

    let id = $('#txtIdValor').val();

    if(valor.nombre == $(`#nombreValor-${id}`).text() 
        && valor.valor == $(`#valor-${id}`).text()
        && nombre_tipo_valoracion == $(`#tipo_valoracion-${id}`).text()){
        mensaje('#msjAlerta', ``, 4);
        $('#agregarValor').modal('hide');
        return;
    }
   
    $.ajax({
        url: `https://api-sascha.herokuapp.com/valoracion/${id}`,
        contentType: 'application/json',
        type: 'PUT',
        data: JSON.stringify(valor),
        success: function(res, status, xhr) {
            console.log(valor)
            mensaje('#msjAlerta', `Valor`, 3);
            editRowValor(id, valor.nombre, valor.valor, nombre_tipo_valoracion)
            limpiarValor();
        },
        error: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta',`${respuesta.data.mensaje}`, 0);

        }
    })

    $('#agregarValor').modal('hide');
})

});

function verEscala(id){
    $('#txtNombreEscala').val($(`#nombreTipo-${id}`).text());
    $('#txtNombreEscala').prop('disabled', 'true');
    $('#btnAceptarEscala').css('display', 'none');
}

function editarEscala(id){
    $('#txtNombreEscala').val($(`#nombreTipo-${id}`).text());
    $('#txtIdEscala').val(id);
    $('#btnAceptarEscala').css('display', 'none');
    $('#btnEditarEscala').css('display', 'inline');
}

function agregarEscala(){
    $('#btnAceptarEscala').css('display', 'inline');
    $('#btnEditarEscala').css('display', 'none');
}

function abrirModalEliminarEscala(id){
    $('#txtIdEscalaEliminar').val(id);
}

function eliminarEscala(id){
    $.ajax({
        url: `https://api-sascha.herokuapp.com/tipovaloracion/${id}`,
        contentType: 'application/json',
        type: 'DELETE',
        success: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            $('#dtTipoValoracion').DataTable().row($(`#nombreTipo-${id}`).parent()).remove().draw();
            $('#txtNombreEscala').val('');
            mensaje('#msjAlerta', `Tipo de Valoración`, 2);


        },
        error: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            const respuesta = JSON.parse(res.responseText);

            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
            
        }
    })
}

function editarValor(id){
    $('#txtNombreValor').val($(`#nombreValor-${id}`).text());
    $('#txtValor').val($(`#valor-${id}`).text());    
    $('#selTipoValoracion option:contains('+ $(`#tipo_valoracion-${id}`).text() + ')').prop('selected',true);
    $('#txtIdValor').val(id);
    $('#btnAceptarValor').css('display', 'none');
    $('#btnEditarValor').css('display', 'inline');
}

function agregarValor(){
    $('#btnAceptarValor').css('display', 'inline');
    $('#btnEditarValor').css('display', 'none');
}
function abrirModalEliminarValor(id){
    $('#txtIdValorEliminar').val(id);
}

function eliminarValor(id){
    $.ajax({
        url: `https://api-sascha.herokuapp.com/valoracion/${id}`,
        contentType: 'application/json',
        type: 'DELETE',
        success: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            $('#dtValor').DataTable().row($(`#nombreValor-${id}`).parent()).remove().draw();
            $('#txtIdValorEliminar').val('');
            mensaje('#msjAlerta', `Valor`, 2);

        },
        error: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            limpiarValor();
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);

        }
    })
}

function limpiarValor(){
   $('#txtNombreValor').val('');
   $('#txtValor').val('');   
   $('#txtIdValor').val('');
   $('#selTipoValoracion option:contains(Seleccione)').prop('selected',true);
}

function limpiarEscala(){

    $('#txtNombreEscala').val('')
    $('#txtIdEscala').val('')

}


function addRowEscala(id, nombre){
 let row = $(`<tr>
    <td id="nombreTipo-${id}">${nombre}</td>
    <td>
    <button onclick="editarEscala(${id})" type='button' class='edit btn  btn-transparente' data-toggle="modal" data-target="#agregarTipoValoracion"  title='Editar'><i class='fa fa-pencil'></i></button>
    <button onclick="abrirModalEliminarEscala(${id})" type='button' class='ver btn  btn-transparente' data-toggle='modal' data-target="#modal-confirmar-1" title='Eliminar'><i class="fa fa-trash-o"></i></button>
    </td>
    </tr>
    `);
 $('#dtTipoValoracion').DataTable().row.add(row).draw();
}

function addRowValor(id, nombre, valor, tipo_valoracion) {
    let row = $(`<tr>
        <td id="nombreValor-${id}">${nombre}</td>
        <td id="valor-${id}">${valor}</td>        
        <td id="tipo_valoracion-${id}">${tipo_valoracion}</td>
        <td>
        <button onclick="editarValor(${id})" type='button' class='edit btn  btn-transparente' data-toggle="modal" data-target="#agregarValor"  title='Editar'><i class='fa fa-pencil'></i></button>
        <button onclick="abrirModalEliminarValor(${id})" type='button' class='ver btn  btn-transparente' data-toggle='modal' data-target="#eliminarValor" title='Eliminar'><i class="fa fa-trash-o"></i></button>
        </td>
        </tr>
        `);
    $('#dtValor').DataTable().row.add(row).draw();
}
function editRowEscala(id, nombre){

    $(`#nombreTipo-${id}`).text(nombre)

}

function editRowValor(id, nombre, valor, tipo_valoracion){
    $(`#nombreValor-${id}`).text(nombre)
    $(`#valor-${id}`).text(valor)    
    $(`#tipo_valoracion-${id}`).text(tipo_valoracion)
}


function cargarValores(){
    document.getElementById('selTipoValoracion').length = 1;
 $.ajax({
        url: 'https://api-sascha.herokuapp.com/tipovaloraciones',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.map(function(escala) {
                let option = $(`<option value="${escala.id_tipo_valoracion}">${escala.nombre}</option>`)
                $('#selTipoValoracion').append(option);
            })

        },
        error: function(res, status, xhr) {

        }
    })
     /* tabla Valores */
    $('#dtValor').DataTable().clear();
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/valoraciones',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.map(function(valor) {
                addRowValor(valor.id_valoracion, valor.nombre, valor.valor, valor.tipo_valoracion.nombre)
            })

        },
        error: function(res, status, xhr) {
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
            
        }
    })
}