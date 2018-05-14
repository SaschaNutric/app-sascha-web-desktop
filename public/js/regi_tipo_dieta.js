$(document).ready(function() {

    const tabla = $('#dtregiTipoDieta').DataTable({ 
        "language": {
            "lengthMenu": "",
            "search": "Buscar:",
            "paginate": {
                "previous": "Anterior",
                "next": "Siguiente"
            },
            "emptyTable": "No se encontraron tipos de dieta",
            "zeroRecords": "No se encontraron tipos de dieta"
        },
        "searching": true,
        "ordering": true,
        "paging": true
    });
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/tipodietas',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.map(function(tipoDieta) {
                addRowTipoDieta(tipoDieta.id_tipo_dieta, tipoDieta.nombre)
            })

        },
        error: function(res, status, xhr) {
            console.log(res)
            const respuesta = JSON.parse(res.responseText)
            mensaje('msjAgregar', respuesta.data.mensaje, 0 );
        }
    })

    $('#btnAceptartipoDieta').on('click', function() {

        if($('#txtNombreTipoDieta').val() == ""){
            $('#txtNombreTipoDieta').css('border', '1px solid red');
            return;
        }

        let tipoDieta = {
            nombre: $('#txtNombreTipoDieta').val()
        }

        $.ajax({
            url: 'https://api-sascha.herokuapp.com/tipodietas',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(tipoDieta),
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                const tipoDieta = res.data
                addRowTipoDieta(tipoDieta.id_tipo_dieta, tipoDieta.nombre)
                limpiar()
                mensaje('#msjAgregar', 'Tipo de dieta', 1);
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                const respuesta = JSON.parse(res.responseText)
                mensaje('#msjAgregar', respuesta.data.mensaje , 1);

            }
        })
        $('#agregarTipoDieta').modal('hide')
    })

    $('#btnEditartipoDieta').on('click', function() {
        if($('#txtNombreTipoDieta').val() == ""){
            $('#txtNombreTipoDieta').css('border', '1px solid red');
            return;
        }

        let tipoDieta = {
            nombre: $('#txtNombreTipoDieta').val()
        }
        let id = $('#txtIdTipoDieta').val();


        if(tipoDieta.nombre ==  $(`#nombreDieta-${id}`).text()){
            $('#agregarTipoDieta').modal('hide');
            $('#txtNombreTipoDieta').val('')
            mensaje("#msjAgregar", '', 4)
            return;
        }

        $.ajax({
            url: `https://api-sascha.herokuapp.com/tipodieta/${id}`,
            contentType: 'application/json',
            type: 'PUT',
            data: JSON.stringify(tipoDieta),
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                editRowTipoDieta(id,tipoDieta.nombre);
                mensaje('#msjAgregar', 'Tipo de dieta', 3);
                limpiar()
            },
            error: function(res, status, xhr) {
                const respuesta = JSON.parse(res.responseText)
                mensaje('#msjAgregar', respuesta.data.mensaje, 1);
                console.log(res);
                console.log(status);
            }
        })
        $('#agregarTipoDieta').modal('hide');
    })


});


function editarTipoDieta(id){
    $('#txtNombreTipoDieta').val($(`#nombreDieta-${id}`).text());
    $('#txtIdTipoDieta').val(id);
    $('#btnAceptartipoDieta').css('display', 'none');
    $('#btnEditartipoDieta').css('display', 'inline');
}

function abrirModalEliminarTipoDieta(id){
    $('#txtIdTipoDietaEliminar').val(id);
}

function agregarTipoDieta(){

    $('#btnAceptartipoDieta').css('display', 'inline');
    $('#btnEditartipoDieta').css('display', 'none');
}
function eliminarTipoDieta(id){
    $.ajax({
        url: `https://api-sascha.herokuapp.com/tipodieta/${id}`,
        contentType: 'application/json',
        type: 'DELETE',
        success: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            mensaje('#msjAgregar', 'Tipo de Dieta', 2);
            $('#dtregiTipoDieta').DataTable().row($(`#nombreDieta-${id}`).parent()).remove().draw();
            limpiar()
        },
        error: function(res, status, xhr) {
            respuesta = JSON.parse(res.responseText)
            mensaje('#msjAgregar', respuesta.data.mensaje, 1);
            console.log(res);
            console.log(status);

        }
    })
}


function addRowTipoDieta(id, nombre){
    let row = $(`<tr>
        <td id="nombreDieta-${id}">${nombre}</td>
        <td>
        <button onclick="editarTipoDieta(${id})" type='button' class='edit btn  btn-stransparent' data-toggle="modal" data-target="#agregarTipoDieta"  title='Editar'><i class='fa fa-pencil'></i></button>
        <button onclick="abrirModalEliminarTipoDieta(${id})" type='button' class='ver btn  btn-stransparent' data-toggle='modal' data-target="#modal-confirmar-1" title='Eliminar'><i class="fa fa-trash-o"></i></button>
        </td>
        </tr>
        `);
    $('#dtregiTipoDieta').DataTable().row.add(row).draw();
}
function editRowTipoDieta(id, nombre){
    $(`#nombreDieta-${id}`).text(nombre);

}
function limpiar(){
    $('#txtNombreTipoDieta').val('');    
}
