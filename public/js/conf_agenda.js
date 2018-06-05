var valor=[];
$(document).ready(function() 
{
 $('#dtAgendaNutricionista').dataTable({
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
            "emptyTable": "No se encontraron Nutricionistas",
            "zeroRecords": "No se encontraron Nutricionistas"
        },
        "searching": true,
        "ordering": true,
        "paging": true
    } );
 /**/
       
    $('#btnAceptarEmpleado').on('click', function() {

        if($('select[name=empleadoNutricionista]').val() == "0")
        {
            $('select[name=empleadoNutricionista]').css('border', '1px solid red')
            return;
        }

         if($('select[name=diasLaborables]').val() == "-1")
        {
            $('select[name=diasLaborables]').css('border', '1px solid red')
            return;
        }

         if($('select[name=bloques_hora]').val() == "0")
        {
            $('select[name=bloques_hora]').css('border', '1px solid red')
            return;
        }
          console.log(valor);
        // Convierte el arreglo de ids en un arreglo de objetos JSON. Ej. { id_bloque_horario: id }

        let horarios = [];
        valor.map(function(val) {
            horarios.push({
                id_bloque_horario: Number.parseInt(val)
            })
        })

        let horarioempleados = {
            id_empleado: Number.parseInt($('select[name="empleadoNutricionista"]').val()),
            id_dia_laborable: Number.parseInt($('select[name="diasLaborables"]').val()),
            bloques_horarios: horarios
        }
        console.log(horarioempleados);
        console.log(JSON.stringify(horarioempleados));
        $.ajax({
            url: 'https://api-sascha.herokuapp.com/horarioempleados',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(horarioempleados),
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                let data = res.data;
                let id = `${data.empleado.id_empleado}${data.dia_laborable.id_dia_laborable}`;
                $('#dtAgendaNutricionista').DataTable().row($(`#id_horario-${id}`)).remove().draw();
                addRowHorario(id, data.empleado.nombre_completo, data.dia_laborable.dia, data.bloques_horarios)
                
                limpiarHorario();
                mensaje('#msjAlerta', `horario Empleado`, 1);
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta',`${respuesta.data.mensaje}`, 0);
            }
        })
        $('#agregarNutricionista').modal('hide');
    })
      /**/

 /* Multiselect de Suplementos */
    $('#ms_bloqueshora').multiSelect({
     selectableHeader: "<input type='text' class='form-control search-input' autocomplete='off' placeholder='buscar...'>",
    selectionHeader: "<input type='text' class='form-control search-input' autocomplete='off' placeholder='buscar...'>",
    afterInit: function (ms) {
        var that = this,
            $selectableSearch = that.$selectableUl.prev(),
            $selectionSearch = that.$selectionUl.prev(),
            selectableSearchString = '#' + that.$container.attr('id') + ' .ms-elem-selectable:not(.ms-selected)',
            selectionSearchString = '#' + that.$container.attr('id') + ' .ms-elem-selection.ms-selected';

        that.qs1 = $selectableSearch.quicksearch(selectableSearchString)
            .on('keydown', function (e) {
                if (e.which === 40) {
                    that.$selectableUl.focus();
                    return false;
                }
            });

        that.qs2 = $selectionSearch.quicksearch(selectionSearchString)
            .on('keydown', function (e) {
                if (e.which == 40) {
                    that.$selectionUl.focus();
                    return false;
                }
            });
    },
    afterSelect: function (values) {
        this.qs1.cache();
        this.qs2.cache();
       valor.push(values[0]);
        console.log(valor);
    },
    afterDeselect: function (values) {
        this.qs1.cache();
        this.qs2.cache();
        const index = valor.indexOf(values[0])
        if (index != -1){
            valor.splice(index,1)
        }
        console.log(valor)
    }
});
    /*fin multiselect */

 

    
 /*Inicio de peticiones ajax para llenar el multiselect*/

    $.ajax({
        url: 'https://api-sascha.herokuapp.com/bloquehorarios',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            console.log(res);
            res.data.map(function(horas) {
                let option = $(`<option value="${horas.id_bloque_horario}">${horas.hora_inicio}</option>`)
                $('#ms_bloqueshora').append(option);
                $('#ms_bloqueshora').multiSelect('refresh')
            })
        },
        error: function(res, status, xhr) {
            console.log(res)
            console.log(status)
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
        }
    })
      /*fin Inicio de peticiones ajax para llenar el multiselect*/
 });

   $.ajax({
        url: 'https://api-sascha.herokuapp.com/empleados',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.map(function(empleadoUsuario) {
                let option = $(`<option value="${empleadoUsuario.id_empleado}">${empleadoUsuario.nombres}</option>`)
                $('#selEmpleado').append(option);
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
        url: 'https://api-sascha.herokuapp.com/dialaborables',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.map(function(dialaborable) {
                let option = $(`<option value="${dialaborable.id_dia_laborable}">${dialaborable.dia}</option>`)
                $('#selDias').append(option);
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
        url: 'http://api-sascha.herokuapp.com/horarioempleados',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            console.log(res);
            res.data.map(function(empleado) {
                empleado.dias_laborables.map(function(dia) {
                    addRowHorario(`${empleado.id_empleado}${dia.id_dia_laborable}`,empleado.nombre, dia.dia, dia.bloques_horarios)
                })
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
        url: 'https://api-sascha.herokuapp.com/bloquehorarios',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            console.log(res);
            res.data.map(function(bloquesHorario) {
                let option = $(`<option value="${bloquesHorario.id_bloque_horario}">${bloquesHorario.nombre}</option>`)
                $('#ms_suplementos').append(option);
                $('#ms_suplementos').multiSelect('refresh')
            })
        },
        error: function(res, status, xhr) {
            console.log(res)
            console.log(status)
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);

        }
    })

 function addRowHorario(id, empleado, dias, horarios) {
        let row = $(`<tr id="id_horario-${id}">
            <td id="id_empleado-${id}">${empleado}</td>
            <td id="id_dia_laborable-${id}">${dias}</td>
            <td id="id_bloque_horario-${id}">${
                horarios.map(function (bloques_hora) {
                    return bloques_hora.hora_inicio;
                })
            }
            </td>
            <td>
            <button onclick="abrirModalEliminarPlanSuplemento(${id})" type='button' class='ver btn  btn-stransparent' data-toggle='modal' data-target="#eliminarPlan" title='Eliminar'><i class="fa fa-trash-o"></i></button>
            </td>
            </tr>`);
        $('#dtAgendaNutricionista').DataTable().row.add(row).draw();
    }
     function addRowEmpleado(id, nombres, dialaborable)
     {
      $(`#nombre_empleado-${id}`).text(nombres)
      $(`#dia_laborable-${id}`).text(dialaborable)
     }


 function limpiarHorario(){
        $('#selEmpleado option:contains(Seleccione)').prop('selected',true);
        $('#selDias option:contains(Seleccione)').prop('selected',true);
        $('#ms_bloqueshora').multiSelect('deselect_all');
        valor=[];
    }