$(document).ready(function() {

    $('#txtHoraInicio').timepicker({
        minuteStep: 1,
        appendWidgetTo: 'body',
        showSeconds: true,
        showMeridian: false,
        defaultTime: false
    });
    $('#txtHoraFin').timepicker({
        minuteStep: 1,
        appendWidgetTo: 'body',
        showSeconds: true,
        showMeridian: false,
        defaultTime: false
    });
    /* tabla de Bloque Horario */
    const tablaBloqueHorario = $('#dtBloqueHorario').DataTable({ 
        "aoColumnDefs": [
        { "bSortable": false, "aTargets": [2] }
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
        url: 'https://api-sascha.herokuapp.com/bloquehorarios',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.map(function(bloqueHorario) {
                addRowHorario(bloqueHorario.id_bloque_horario, bloqueHorario.hora_inicio, bloqueHorario.hora_fin)
            })

        },
        error: function(res, status, xhr) {
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
            
        }
    })

    $('#btnAceptar').on('click', function() {
        
        if($('#txtHoraInicio').val() == ""){
            $('#txtHoraInicio').css('border', '1px solid red');
            return;
        }
        if($('#txtHoraFin').val() == ""){
            $('#txtHoraFin').css('border', '1px solid red');
            return;
        }

        if ($('#txtHoraInicio').val() >= $('#txtHoraFin').val()){
            mensaje('#msjAlerta', `Bloque Horario`, 5);
            limpiarHorario();
            return;
        }

        let bloqueHorario = {
            hora_inicio: $('#txtHoraInicio').val(),
            hora_fin: $('#txtHoraFin').val()
        }
        console.log(bloqueHorario);

        $.ajax({
            url: 'https://api-sascha.herokuapp.com/bloquehorarios',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(bloqueHorario),
            success: function(res, status, xhr) {
                console.log(res);
                const bloqueHorario = res.data;
                mensaje('#msjAlerta', `Bloque Horario`, 1);
                addRowHorario(bloqueHorario.id_bloque_horario, bloqueHorario.hora_inicio, bloqueHorario.hora_fin);               
                limpiarHorario();
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
        if($('#txtHoraInicio').val() == ""){
            $('#txtCondicion').css('border', '1px solid red');
            return;
        }
        if($('#txtHoraFin').val() == ""){
            $('#txtCondicion').css('border', '1px solid red');
            return;
        }

        let bloqueHorario = {
            hora_inicio: $('#txtHoraInicio').val(),
            hora_fin: $('#txtHoraFin')
        }

        let id = $('#txtIdBloqueHorario').val();
        if(bloqueHorario.hora_inicio == $(`#hora_inicio-${id}`).text() && bloqueHorario.hora_fin == $(`#hora_fin-${id}`).text()){
        mensaje('#msjAlerta', ``, 4);
        $('#agregarBloqueHorario').modal('hide');   
        return;
        }

        $.ajax({
            url: `https://api-sascha.herokuapp.com/bloquehorario/${id}`,
            contentType: 'application/json',
            type: 'PUT',
            data: JSON.stringify(bloqueHorario),
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                mensaje('#msjAlerta', `Bloque Horario`, 3);
                editRowHorario(id, bloqueHorario.hora_inicio, bloqueHorario.hora_fin)
                limpiarHorario();
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


    function editarHorario(id){
        $('#txtHoraInicio').timepicker('setTime', $(`#hora_inicio-${id}`).text());
        $('#txtHoraFin').timepicker('setTime', $(`#hora_fin-${id}`).text());
        $('#txtIdBloqueHorario').val(id);
        $('#btnAceptar').css('display', 'none');
        $('#btnEditar').css('display', 'inline');

    }

    function abrirModalEliminarHorario(id){
        $('#txtIdBloqueHorarioEliminar').val(id);
    }

    function eliminarHorario(id){
        $.ajax({
            url: `https://api-sascha.herokuapp.com/bloquehorario/${id}`,
            contentType: 'application/json',
            type: 'DELETE',
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                $('#dtBloqueHorario').DataTable().row($(`#descripcion-${id}`).parent()).remove().draw();
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
            }
        })
    }

   
    function limpiarHorario(){
        $('#txtHoraInicio').timepicker('setTime', '00:00:00');
        $('#txtHoraFin').timepicker('defaultTime', '00:00:00');
        $('#txtHoraInicio').val('')
        $('#txtHoraFin').val('')
        $('#txtIdBloqueHorario').val('')
    }


    function addRowHorario(id, hora_inicio, hora_fin){

        let row = $(`<tr>
            <td id="hora_inicio-${id}">${hora_inicio}</td>
            <td id="hora_fin-${id}">${hora_fin}</td>
            <td>
                <button onclick="editarHorario(${id})" type='button' class='edit btn  btn-stransparent' data-toggle="modal" data-target="#agregarBloqueHorario"  title='Editar'><i class='fa fa-pencil'></i></button>
                <button onclick="abrirModalEliminarHorario(${id})" type='button' class='ver btn  btn-stransparent' data-toggle='modal' data-target="#eliminarBloqueHorario" title='Eliminar'><i class="fa fa-trash-o"></i></button>
            </td>
        </tr>
        `);
        $('#dtBloqueHorario').DataTable().row.add(row).draw();
    }

    function editRowHorario(id, hora_inicio, hora_fin){        
        $(`#hora_fin-${id}`).text(hora_fin)
        $(`#hora_inicio-${id}`).text(hora_inicio)
    }
