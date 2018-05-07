$(document).ready(function() {
    /* tabla tipo de parametros */
    const tablaCondicion = $('#dtCondicionGarantia').DataTable({ 
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
                console.log(status);
                $('#txtCondicion').val('')
                let row = $(`<tr>
                    <td id="descripcion-${res.data.id_condicion_garantia}">${res.data.descripcion}</td>
                    <td>
                        <button onclick="editarCondicionGarantia(${res.data.id_condicion_garantia})" type='button' class='edit btn  btn-stransparent' data-toggle="modal" data-target="#agregarCondicionGarantía"  title='Editar'><i class='fa fa-pencil'></i></button>
                        <button onclick="abrirModalEliminarCondicionGarantia(${res.data.id_condicion_garantia})" type='button' class='ver btn  btn-stransparent' data-toggle='modal' data-target="#modaleliminarCondicionGarantia" title='Eliminar'><i class="fa fa-trash-o"></i></button>
                    </td>
                </tr>
                `);
                $('#dtregiTipoDieta').DataTable().row.add(row).draw();
                mensaje('alert-success', '<strong>Exito!</strong> Condición de Garantía agregada.');
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                mensaje('alert-danger', `<strong>Error ${status}!</strong> Algo salió mal.`);
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
        $.ajax({
            url: `https://api-sascha.herokuapp.com/condiciongarantia/${id}`,
            contentType: 'application/json',
            type: 'PUT',
            data: JSON.stringify(condicionGarantia),
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                $('#txtCondicion').val('')
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
            }
        })
    })   

});


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

    function mensaje(tipo, texto){
        $('#msjAgregar').addClass(tipo);
        $('#msjAgregar').append(texto);
        $('#msjAgregar').css('display', 'block');
    }