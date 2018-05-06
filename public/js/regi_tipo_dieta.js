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

            let row = $(`<tr>
                <td id="nombre-${tipoDieta.id_tipo_dieta}">${tipoDieta.nombre}</td>
                <td>
                <button onclick="editarTipoDieta(${tipoDieta.id_tipo_dieta})" type='button' class='edit btn  btn-stransparent' data-toggle="modal" data-target="#agregarTipoDieta"  title='Editar'><i class='fa fa-pencil'></i></button>
                <button onclick="abrirModalEliminarTipoDieta(${tipoDieta.id_tipo_dieta})" type='button' class='ver btn  btn-stransparent' data-toggle='modal' data-target="#modal-confirmar-1" title='Eliminar'><i class="fa fa-trash-o"></i></button>
                </td>
                </tr>
                `);
            tabla.row.add(row).draw();
        })

    },
    error: function() {
        mensaje('alert-danger', `<strong>Error ${status}!</strong> Algo salió mal.`);
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
            $('#txtNombreTipoDieta').val('');
            let row = $(`<tr>
                <td id="nombre-${res.data.id_tipo_dieta}">${res.data.nombre}</td>
                <td>
                <button onclick="editarTipoDieta(${res.data.id_tipo_dieta})" type='button' class='edit btn  btn-stransparent' data-toggle="modal" data-target="#agregarTipoDieta"  title='Editar'><i class='fa fa-pencil'></i></button>
                <button onclick="abrirModalEliminarTipoDieta(${res.data.id_tipo_dieta})" type='button' class='ver btn  btn-stransparent' data-toggle='modal' data-target="#modal-confirmar-1" title='Eliminar'><i class="fa fa-trash-o"></i></button>
                </td>
                </tr>
                `);
            $('#dtregiTipoDieta').DataTable().row.add(row).draw();
            mensaje('alert-success', '<strong>Exito!</strong> Tipo de dieta agregado.');
        },
        error: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            mensaje('alert-danger', `<strong>Error ${status}!</strong> Algo salió mal.`);

        }
    })

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
    $.ajax({
        url: `https://api-sascha.herokuapp.com/tipodieta/${id}`,
        contentType: 'application/json',
        type: 'PUT',
        data: JSON.stringify(tipoDieta),
        success: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            $('#txtNombreTipoDieta').val('')
            mensaje('alert-info', '<strong>Exito!</strong> Tipo de dieta modificado.');
        },
        error: function(res, status, xhr) {
            mensaje('alert-danger', `<strong>Error ${status}!</strong> Algo salió mal.`);
            console.log(res);
            console.log(status);
        }
    })
})

 
 });


    function editarTipoDieta(id){
        $('#txtNombreTipoDieta').val($(`#nombre-${id}`).text());
        $('#txtIdTipoDieta').val(id);
        $('#btnAceptartipoDieta').css('display', 'none');
        $('#btnEditartipoDieta').css('display', 'inline');
    }

    function abrirModalEliminarTipoDieta(id){
        $('#txtIdTipoDietaEliminar').val(id);
        console.log(id)
    }

    function eliminarTipoDieta(id){
        console.log(id)
        $.ajax({
            url: `https://api-sascha.herokuapp.com/tipodieta/${id}`,
            contentType: 'application/json',
            type: 'DELETE',
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                mensaje('alert-info', '<strong>Exito!</strong> Tipo de dieta eliminado.');
                $('#dtregiTipoDieta').DataTable().row($(`#nombre-${id}`).parent()).remove().draw();
                $('#txtNombreTipoDieta').val('');
            },
            error: function(res, status, xhr) {
                mensaje('alert-danger', `<strong>Error ${status}!</strong> Algo salió mal.`);
                console.log(res);
                console.log(status);
                
            }
        })
    }

    function mensaje(tipo, texto){
        $('#msjAgregar').addClass(tipo);
        $('#msjAgregar').append(texto);
        $('#msjAgregar').css('display', 'block');


    }