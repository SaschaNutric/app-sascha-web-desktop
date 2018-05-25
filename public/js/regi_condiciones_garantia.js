$(document).ready(function() {
    /* tabla condicones de garantia */
    const tablaCondicion = $('#dtCondicionGarantia').DataTable({
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
            "emptyTable": "No se encontraron condiciones",
            "zeroRecords": "No se encontraron condiciones"
        },
        "searching": true,
        "ordering": true,
        "paging": true
    });
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/condiciongarantias',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.map(function(condicionGarantia) {
                
                let row = $(`<tr>
                    <td id="descripcion-${condicionGarantia.id_condicion_garantia}">${condicionGarantia.descripcion}</td>
                    <td>
                        <button onclick="editarCondicionGarantia(${condicionGarantia.id_condicion_garantia})" type='button' class='edit btn  btn-stransparent' data-toggle="modal" data-target="#agregarCondicionGarantía"  title='Editar'><i class='fa fa-pencil'></i></button>
                        <button onclick="abrirModalEliminarCondicionGarantia(${condicionGarantia.id_condicion_garantia})" type='button' class='ver btn  btn-stransparent' data-toggle='modal' data-target="#modaleliminarCondicionGarantia" title='Eliminar'><i class="fa fa-trash-o"></i></button>
                    </td>
                </tr>
                `);
                tablaCondicion.row.add(row).draw();
            })

        },
        error: function() {
            
        }
    })

    $('#btnAceptar').on('click', function() {
        
        if($('#txtCondicion').val() == ""){
            $('#txtCondicion').css('border', '1px solid red');
            return;
        }

        let condicionGarantia = {
            descripcion: $('#txtCondicion').val()
        }

        $.ajax({
            url: 'https://api-sascha.herokuapp.com/condiciongarantias',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(condicionGarantia),
            success: function(res, status, xhr) {
                console.log(res);
                const condicionGarantia = res.data;
                mensaje('#msjAlerta', `Condición Garantía`, 1);
                addRowCondicionGarantia(condicionGarantia.id_condicion_garantia, condicionGarantia.descripcion);               
                limpiarCondicionGarantia();
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
            }
        })

    })

    $('#btnEditar').on('click', function() {
        if($('#txtCondicion').val() == ""){
            $('#txtCondicion').css('border', '1px solid red');
            return;
        }

        let condicionGarantia = {
            descripcion: $('#txtCondicion').val()
        }

        let id = $('#txtIdCondicion').val();

        if(condicionGarantia.descripcion == $(`#descripcion-${id}`).text()){
        mensaje('#msjAlerta', ``, 4);
        $('#agregarCondicionGarantía').modal('hide');   
        return;
        }
        $.ajax({
            url: `https://api-sascha.herokuapp.com/condiciongarantia/${id}`,
            contentType: 'application/json',
            type: 'PUT',
            data: JSON.stringify(condicionGarantia),
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                mensaje('#msjAlerta', `Condiciones de Garantia`, 3);
                editRowCondicionGarantia(id, res.data.descripcion)
                limpiarCondicionGarantia();
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta',`${respuesta.data.mensaje}`, 0);
            }
        })
    })   

});


    function agregarCondicionGarantia(){
    $('#btnAceptar').css('display', 'inline');
    $('#btnEditar').css('display', 'none');

}


    function editarCondicionGarantia(id){
        $('#txtCondicion').val($(`#descripcion-${id}`).text());
        $('#txtIdCondicion').val(id);
        $('#btnAceptar').css('display', 'none');
        $('#btnEditar').css('display', 'inline');
    }

    function abrirModalEliminarCondicionGarantia(id){
        $('#txtIdCondicionEliminar').val(id);
    }

    function eliminarCondicionGarantia(id){
        $.ajax({
            url: `https://api-sascha.herokuapp.com/condiciongarantia/${id}`,
            contentType: 'application/json',
            type: 'DELETE',
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                $('#dtCondicionGarantia').DataTable().row($(`#descripcion-${id}`).parent()).remove().draw();
                $('#txtCondicion').val('');
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
            }
        })
    }

    function limpiarCondicionGarantia(){
        $('#txtCondicion').val('')
        $('#txtIdCondicion').val('')
    }


    function addRowCondicionGarantia(id, descripcion){

        let row = $(`<tr>
            <td id="descripcion-${id}">${descripcion}</td>
            <td>
            <button onclick="editarCondicionGarantia(${id})" type='button' class='edit btn  btn-stransparent' data-toggle="modal" data-target="#agregarCondicionGarantía"  title='Editar'><i class='fa fa-pencil'></i></button>
            <button onclick="abrirModalEliminarCondicionGarantia(${id})" type='button' class='ver btn  btn-stransparent' data-toggle='modal' data-target="#modaleliminarCondicionGarantia" title='Eliminar'><i class="fa fa-trash-o"></i></button>
            </td>
            </tr>
            `);
        $('#dtCondicionGarantia').DataTable().row.add(row).draw();
    }

    function editRowCondicionGarantia(id, descripcion){        
        $(`#descripcion-${id}`).text(descripcion)
    }