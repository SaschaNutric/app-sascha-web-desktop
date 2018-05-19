let arregloTipoUnidades = [];

$(document).ready(function() {
    /* tabla Grupos Alimenticios */
    
    const tablaSuplementos = $('#dtSuplementos').DataTable({ 
        "aoColumnDefs": [
        { "bSortable": false, "aTargets": [3] }
        ],
        "language": {
            "lengthMenu": "",
            "search": "Buscar:",
            "paginate": {
                "previous": "Anterior",
                "next": "Siguiente"
            },
            "emptyTable": "No se encontraron suplementos",
            "zeroRecords": "No se encontraron suplementos"
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
            console.log(res);
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
        url: 'https://api-sascha.herokuapp.com/suplementos',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            console.log(res);
            res.data.map(function(suplemento) {
                addRowSuplemento(suplemento.id_suplemento, suplemento.nombre, suplemento.id_unidad, suplemento.unidad.nombre)
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

        if($('select[name=tipo_unidad]').val() == "0"){
            $('select[name=tipo_unidad]').css('border', '1px solid red')
            return;
        }

        if($('select[name=unidad]').val() == "0"){
            $('select[name=unidad]').css('border', '1px solid red')
            return;
        }

        let suplemento = {
            nombre: $('#txtNombre').val(),
            id_unidad: $('select[name=unidad]').val()
        }

        const nombre_tipo_unidad = $('select[name="tipo_unidad"] option:selected').text()
        const nombre_unidad = $('select[name="unidad"] option:selected').text()

        $.ajax({
            url: 'https://api-sascha.herokuapp.com/suplementos',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(suplemento),
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                addRowSuplemento(res.data.id_suplemento, res.data.nombre, nombre_tipo_unidad, nombre_unidad)
                limpiarSuplemento();
                mensaje('#msjAlerta', `Suplemento`, 1);
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta',`${respuesta.data.mensaje}`, 0);
            }
        })
        $('#agregarSuplemento').modal('hide');

    })

    $('#btnEditar').on('click', function() {

        if($('#txtNombre').val() == ""){
            $('#txtNombre').css('border', '1px solid red');
            return;
        }

        if($('select[name=unidad]').val() == "0"){
            $('select[name=unidad]').css('border', '1px solid red')
            return;
        }

        if($('select[name=tipo_unidad]').val() == "0"){
            $('select[name=tipo_unidad]').css('border', '1px solid red')
            return;
        }

        let suplemento = {
            nombre: $('#txtNombre').val(),
            id_unidad: $('select[name=unidad]').val()
        }

        const nombre_tipo_unidad = $('select[name="tipo_unidad"] option:selected').text()
        const nombre_unidad = $('select[name="unidad"] option:selected').text()

        let id = $('#txtIdSuplemento').val();

        if(suplemento.nombre == $(`#nombresuplemento-${id}`).text() && nombre_tipo_unidad == $(`#tipo_unidad-${id}`).text() && nombre_unidad == $(`#unidad-${id}`).text()){
            mensaje('#msjAlerta', ``, 4);
            $('#agregarSuplemento').modal('hide');
            return;
        }
        $.ajax({
            url: `https://api-sascha.herokuapp.com/suplemento/${id}`,
            contentType: 'application/json',
            type: 'PUT',
            data: JSON.stringify(suplemento),
            success: function(res, status, xhr) {
                console.log(suplemento);
                mensaje('#msjAlerta', `Suplemento`, 3);
                console.log(res.data)
                editRowSuplemento(id, suplemento.nombre, nombre_tipo_unidad, nombre_unidad)
                limpiarSuplemento();
            },
            error: function(res, status, xhr) {
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta',`${respuesta.data.mensaje}`, 0);
                
            }
        })
        $('#agregarSuplemento').modal('hide');
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

function limpiarSuplemento(){
    $('#txtNombre').val('');
    $('#txtIdSuplemento').val('');
    $('#selTipoUnidad option:contains(Seleccione)').prop('selected',true);
    $('#selUnidad option:contains(Seleccione)').prop('selected',true);
}

function addRowSuplemento(id, nombre, tipo_unidad, unidad) {
    let row = $(`<tr>
        <td id="nombresuplemento-${id}">${nombre}</td>
        <td id="tipo_unidad-${id}" style="display:none;">${tipo_unidad}</td>
        <td id="unidad-${id}">${unidad}</td>
        <td>
        <button onclick="editarSuplemento(${id})" type='button' class='edit btn  btn-transparente' data-toggle="modal" data-target="#agregarSuplemento"  title='Editar'><i class='fa fa-pencil'></i></button>
        <button onclick="abrirModalEliminarSuplemento(${id})" type='button' class='ver btn  btn-transparente' data-toggle='modal' data-target="#eliminarSuplemento" title='Eliminar'><i class="fa fa-trash-o"></i></button>
        </td>
        </tr>
        `);
    $('#dtSuplementos').DataTable().row.add(row).draw();
}

function editarSuplemento(id){
    $('#txtNombre').val($(`#nombresuplemento-${id}`).text());
    $('#selTipoUnidad option:contains('+ $(`#tipo_unidad-${id}`).text() + ')').prop('selected',true);
    const tipounidades = $('#selTipoUnidad option:contains('+ $(`#tipo_unidad-${id}`).text() + ')').val();
    arregloTipoUnidades.map(function(tipounidad){
        if(tipounidad.id_tipo_unidad == tipounidades){
            tipounidad.unidades.map(function(unidad) {
                let optionunidad = $(`<option value="${unidad.id_unidad}">${unidad.nombre}</option>`)
                $('#selUnidad').append(optionunidad);
            })
        }
    })
    $('#selUnidad option:contains('+ $(`#unidad-${id}`).text() + ')').prop('selected',true);
    $('#txtIdSuplemento').val(id);
    $('#btnAceptar').css('display', 'none');
    $('#btnEditar').css('display', 'inline');
}

function editRowSuplemento(id, nombre, tipo_unidad, unidad){
    $(`#nombresuplemento-${id}`).text(nombre)
    $(`#tipo_unidad-${id}`).text(tipo_unidad)
    $(`#unidad-${id}`).text(unidad)
}

function abrirModalEliminarSuplemento(id){
    $('#txtIdSuplementoEliminar').val(id);
}

function eliminarSuplemento(id){
    $.ajax({
        url: `https://api-sascha.herokuapp.com/suplemento/${id}`,
        contentType: 'application/json',
        type: 'DELETE',
        success: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            $('#dtSuplementos').DataTable().row($(`#nombresuplemento-${id}`).parent()).remove().draw();
            $('#txtIdSuplemento').val('');
            mensaje('#msjAlerta', `Suplemento`, 2);

        },
        error: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta',`${respuesta.data.mensaje}`, 0);
        }
    })
}
function agregarSuplemento(){
   $('#btnAceptar').css('display', 'inline');
   $('#btnEditar').css('display', 'none');

}
