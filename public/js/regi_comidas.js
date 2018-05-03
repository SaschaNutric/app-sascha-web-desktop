$(document).ready(function() {

    const tablaComida = $('#dtComidas').DataTable({ 
       "language": {
        "lengthMenu": "",
        "search": "Buscar:",
        "paginate": {
            "previous": "Anterior",
            "next": "Siguiente"
        },
        "emptyTable": "No se encontraron comidas",
        "zeroRecords": "No se encontraron comidas"
    },
    "searching": true,
    "ordering": true,
    "paging": true   
});
    
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/comidas',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.map(function(comida) {
                addRowComida(comida.id_comida,comida.nombre)
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

        if($('#txtNombreComida').val() == ""){
            $('#txtNombreComida').css('border', '1px solid red');
            return;
        }

        let comida = {
            nombre: $('#txtNombreComida').val()
        }

        $.ajax({
            url: 'https://api-sascha.herokuapp.com/comidas',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(comida),
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                addRowComida(res.data.id_comida, res.data.nombre)
                limpiarComida()
                mensaje('#msjAlerta', `Comida`, 1);
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta',`${respuesta.data.mensaje}`, 0);

            }
        })
        $('#agregarComida').modal('hide');

    })

    $('#btnEditar').on('click', function() {
        if($('#txtNombreComida').val() == ""){
            $('#txtNombreComida').css('border', '1px solid red');
            return;
        }


        let comida = {
            nombre: $('#txtNombreComida').val()
        }

        let id = $('#txtIdComida').val();

        if(comida.nombre == $(`#nombre-${id}`).text()){
            $('#agregarComida').modal('hide');
            mensaje('#msjAlerta', '', 4);

            return;
        }
        $.ajax({
            url: `https://api-sascha.herokuapp.com/comida/${id}`,
            contentType: 'application/json',
            type: 'PUT',
            data: JSON.stringify(comida),
            success: function(res, status, xhr) {
                limpiarComida()
                const comida = res.data;
                console.log(res.data)
                mensaje('#msjAlerta',  `Comida`, 3);
                editRowComida(comida.id_comida, comida.nombre)
            },
            error: function(res, status, xhr) {
                limpiarComida()
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
                
            }
        })
        $('#agregarComida').modal('hide');
    })

});


function editarComida(id){
    $('#txtNombreComida').val($(`#nombre-${id}`).text());
    $('#txtIdComida').val(id);
    $('#btnAceptar').css('display', 'none');
    $('#btnEditar').css('display', 'inline');
}

function abrirModalEliminarComida(id){
    $('#txtIdComidaEliminar').val(id);
}

function eliminarComida(id){
    $.ajax({
        url: `https://api-sascha.herokuapp.com/comida/${id}`,
        contentType: 'application/json',
        type: 'DELETE',
        success: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            $('#dtComidas').DataTable().row($(`#nombre-${id}`).parent()).remove().draw();
            $('#txtNombreComida').val('');
            mensaje('#msjAlerta', `Comida`, 2);


        },
        error: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            const respuesta = JSON.parse(res.responseText);

            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
            
        }
    })
}


function limpiarComida(){

    $('#txtNombreComida').val('')
    $('#txtIdComida').val('')

}


function addRowComida(id, nombre){
   let row = $(`<tr>
    <td id="nombre-${id}">${nombre}</td>
    <td>
    <button onclick="editarComida(${id})" type='button' class='edit btn  btn-transparente' data-toggle="modal" data-target="#agregarComida"  title='Editar'><i class='fa fa-pencil'></i></button>
    <button onclick="abrirModalEliminarComida(${id})" type='button' class='ver btn  btn-transparente' data-toggle='modal' data-target="#eliminarComida" title='Eliminar'><i class="fa fa-trash-o"></i></button>
    </td>
    </tr>
    `);
   $('#dtComidas').DataTable().row.add(row).draw();
}

function editRowComida(id, nombre){

    $(`#nombre-${id}`).text(nombre)

}
