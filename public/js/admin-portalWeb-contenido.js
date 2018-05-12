

$(document).ready(function() {

 /* tabla Recomendaciones */
    const tablaRecomendaciones = $('#tabla-recomendacion').DataTable({ 
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
            "emptyTable": "No se encontraron Recomendaciones",
            "zeroRecords": "No se encontraron Recomendaciones"
        },
        "searching": true,
        "ordering": true,
        "paging": true
    });


 /* tabla Preguntas */
    const tablaPreguntas = $('#tabla-preguntas').DataTable({ 
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
            "emptyTable": "No se encontraron Preguntas",
            "zeroRecords": "No se encontraron Preguntas"
        },
        "searching": true,
        "ordering": true,
        "paging": true
    });

$.ajax({
        url: 'https://api-sascha.herokuapp.com/ayudas',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.map(function(ayuda) {
                addRowPregunta(ayuda.pregunta, ayuda.respuesta)
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
        url: 'https://api-sascha.herokuapp.com/contenidos',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.map(function(recomendacion) {
                addRowRecomendaciones(recomendacion.titulo, recomendacion.texto)
            })

        },
        error: function(res, status, xhr) {
            console.log(res)
            console.log(status)
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);

        }
    })


function addRowPregunta( pregunta, respuesta) {
    let row = $(`<tr>
        <td>${pregunta}</td>
        <td>${respuesta}</td>
        <td><div class="btn-group">
        <a href="#modal-editar-parametro" data-toggle="modal" class="btn btn-acciones"><i class="fa fa-pencil"></i></a>
        </div>
        <div class="btn-group">
        <a class="btn btn-acciones"><i class="fa fa-trash-o"></i></a>
        </div>
        </td>
        </tr>
        `);
    $('#tabla-preguntas').DataTable().row.add(row).draw();
}

function addRowRecomendaciones( titulo, texto) {
    let row = $(`<tr>
                        <td>${titulo}</td>
                        <td>${texto}</td>
                        <td><div class="btn-group">
                            <a href="#modal-editar-parametro" data-toggle="modal" class="btn btn-acciones"><i class="fa fa-pencil"></i></a>
                        </div>
                        <div class="btn-group">
                            <a class="btn btn-acciones"><i class="fa fa-trash-o"></i></a>
                        </div>
                    </td>
        </tr>
        `);
    $('#tabla-recomendacion').DataTable().row.add(row).draw();
}
})

 $('#guardarContenido').on('click', function() {

    let contenido = {
            titulo: $('#tituloContenido').val(),
            texto: $('#contenidoContenido').val()
        }

 $.ajax({
            url: 'https://api-sascha.herokuapp.com/contenidos',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(contenido),
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);

            }
        })
})

 $('#guardarPregunta').on('click', function() {

    let pregunta = {
            pregunta: $('#textPregunta').val(),
            respuesta: $('#textRespuesta').val()
        }

 $.ajax({
            url: 'https://api-sascha.herokuapp.com/ayudas',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(pregunta),
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                 mensaje('#msjAlerta', `Pregunta Frecuente`, 1);
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);

            }
        })

  $('#agregarPregunta').modal('hide');
})