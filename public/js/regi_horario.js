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
                
                let row = $(`<tr>
                    <td id="hora_inicio-${bloqueHorario.id_bloque_horario}">${bloqueHorario.hora_inicio}</td>
                    <td id="hora_fin-${bloqueHorario.id_bloque_horario}">${bloqueHorario.hora_fin}</td>
                    <td>
                        <button onclick="editarCondicionGarantia(${bloqueHorario.id_bloque_horario})" type='button' class='edit btn  btn-stransparent' data-toggle="modal" data-target="#agregarCondicionGarantía"  title='Editar'><i class='fa fa-pencil'></i></button>
                        <button onclick="abrirModalEliminarCondicionGarantia(${bloqueHorario.id_bloque_horario})" type='button' class='ver btn  btn-stransparent' data-toggle='modal' data-target="#eliminarBloqueHorario" title='Eliminar'><i class="fa fa-trash-o"></i></button>
                    </td>
                </tr>
                `);
                tablaBloqueHorario.row.add(row).draw();
            })

        },
        error: function() {
            
        }
    })

    $('#btnAceptar').on('click', function() {
        
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
                console.log(status);
                $('#txtHoraInicio').val('');
                $('#txtHoraFin').val('')
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
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
        $.ajax({
            url: `https://api-sascha.herokuapp.com/condiciongarantia/${id}`,
            contentType: 'application/json',
            type: 'PUT',
            data: JSON.stringify(bloqueHorario),
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                $('#txtHoraInicio').val(''),
                $('#txtHoraFin').val('')
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
            }
        })
    })   

});


    function editarCondicionGarantia(id){
        $('#txtHoraInicio').val($(`#hora_inicio-${id}`).text());
        $('#txtHoraFin').val($(`#hora_fin-${id}`).text());
        $('#txtIdBloqueHorario').val(id);
        $('#btnAceptar').css('display', 'none');
        $('#btnEditar').css('display', 'inline');
    }

    function abrirModalEliminarCondicionGarantia(id){
        $('#txtIdBloqueHorarioEliminar').val(id);
    }

    function eliminarCondicionGarantia(id){
        $.ajax({
            url: `https://api-sascha.herokuapp.com/condiciongarantia/${id}`,
            contentType: 'application/json',
            type: 'DELETE',
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                $('#dtBloqueHorario').DataTable().row($(`#descripcion-${id}`).parent()).remove().draw();
                $('#txtHoraInicio').val('');
                $('#txtHoraFin').val('');
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
            }
        })
    }

    function mensaje(tipo, texto){
        $('#msjAgregarBloqueHorario').addClass(tipo);
        $('#msjAgregarBloqueHorario').append(texto);
        $('#msjAgregarBloqueHorario').css('display', 'block');
    }