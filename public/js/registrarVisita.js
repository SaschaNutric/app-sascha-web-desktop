let arreglo_grupos = []
let realizadas = 0;
let id_cliente = null;
let id_tipo_cita = null;
$(document).ready(function () {


    var paramstr = window.location.search.substr(1);
    var paramarr = paramstr.split("=");
    var params = {};
    params[paramarr[0]] = paramarr[1];
    const id_agenda = params['id'];

    $('#dtSuplementos').DataTable({
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

    $('#dtEjercicios').DataTable({
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


    $('#dtPerfil').DataTable({
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
            "emptyTable": "No se encontraron parametros",
            "zeroRecords": "No se encontraron parametros"
        },
        "searching": true,
        "ordering": true,
        "paging": true
    });


    $('txtHoraCita').timepicker()


    if (id_agenda == undefined) {
        $('#info-visita').css('display', 'none');
        $('#error-info-visita').css('display', 'block');
    } else {
        $.ajax({
            url: `https://api-sascha.herokuapp.com/agenda/${id_agenda}`,
            type: 'GET',
            async: false,
            contentType: 'application/json',
            beforeSend: function () {
                $('#loadingDiv').show();
                $('#info-visita').css('display', 'none');

            },
            success: function (res, status, xhr) {
                let agenda = res.data;
                let cliente = agenda.cliente;
                let orden = agenda.orden_servicio;
                let servicio = orden.servicio;
                let meta = orden.meta;
                let perfil = cliente.perfil;
                let plan_dieta = servicio.plan_dieta;
                let plan_suplemento = servicio.plan_suplemento;
                let plan_ejercicio = servicio.plan_ejercicio;

                //Datos de la cita
                moment.locale('es')
                id_tipo_cita = agenda.id_tipo_cita
                let fecha = moment(agenda.fecha);
                $('#cita-fecha').text(fecha.format('DD, MMMM  YYYY'));
                $('#tipo-cita').text(agenda.tipo_cita);

                //Datos del cliente 
                id_cliente = cliente.id_cliente
                $('#cliente-nombre').text(cliente.nombre_completo);
                $('#cliente-telefono').text(cliente.telefono);
                $('#cliente-edad').text(cliente.edad);
                $('#cliente-direccion').text(cliente.direccion);

                //Datos del servicio
                realizadas = Number.parseInt(orden.visitas_realizadas) + 1
                $('#servicio-nombre').text(servicio.nombre);
                $('#servicio-avance-barra').css('width', calcularAvance(realizadas, servicio.numero_visitas));
                $('#servicio-avance-texto').text(realizadas + ' de ' + servicio.numero_visitas + " visitas");

                $('#servicio-plan-dieta').text(plan_dieta.nombre)
                $('#servicio-plan-ejercicio').text(plan_ejercicio.nombre == null ? 'No incluye' : plan_ejercicio.nombre)
                $('#servicio-plan-suplemento').text(plan_suplemento.nombre == null ? 'No incluye' : plan_suplemento.nombre)

                $('#plan-dieta-nombre').text(plan_dieta.nombre)
                $('#plan-ejercicio-nombre').text(plan_ejercicio.nombre == null ? 'No incluye' : plan_ejercicio.nombre)
                $('#plan-suplemento-nombre').text(plan_suplemento.nombre == null ? 'No incluye' : plan_suplemento.nombre)

                if (agenda.id_tipo_cita == 1) {
                    //Perfil Diagnostico
                    $.ajax({
                        url: 'https://api-sascha.herokuapp.com/parametros',
                        contentType: 'application/json',
                        type: 'GET',
                        success: function (res, status, xhr) {
                            res.data.map(function (parametro) {
                                let unidad = parametro.id_unidad
                                if (unidad == null) {
                                    addRowParametro(parametro.id_parametro, parametro.nombre, parametro.tipo_parametro.nombre, parametro.tipo_valor, '', null, agenda.id_tipo_cita)
                                } else {
                                    addRowParametro(parametro.id_parametro, parametro.nombre, parametro.tipo_parametro.nombre, parametro.tipo_valor, parametro.unidad.abreviatura, null, agenda.id_tipo_cita)
                                }
                            })

                        },
                        error: function (res, status, xhr) {
                            const respuesta = JSON.parse(res.responseText);
                            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);

                        }
                    })
                    //Plan Dieta
                    $('#plan_dieta_nombre').val(plan_dieta.nombre)
                    if (plan_dieta.comidas.length != 0) {
                        plan_dieta.comidas.map(function (comida) {
                            crearPanelesDieta(comida.id_comida, comida)
                        })

                    }
                    //Plan Suplemento
                    if (plan_suplemento) {
                        $('#plan_suplemento_nombre').val(plan_suplemento.nombre)
                        plan_suplemento.suplementos.map(function (suplemento) {
                            addRowSuplemento(suplemento.id_suplemento, suplemento.nombre, '', suplemento.unidad_abreviatura, '');

                        })
                    }

                    //Plan Ejercicio
                    if (plan_ejercicio) {
                        $('#plan_ejercicio_nombre').val(plan_ejercicio.nombre)
                        plan_ejercicio.ejercicios.map(function (ejercicio) {
                            addRowEjercicios(ejercicio.id_ejercicio, ejercicio.nombre, '', '');

                        })
                    }
                } else {
                    //Perfil
                    if (agenda.id_tipo_cita == 2) {
                        $('#btnAgregarParametro').css('display', 'inline')
                        perfil.map(function (parametro) {
                            let unidad = parametro.unidad
                            if (unidad == null || unidad == undefined) {
                                addRowParametro(parametro.id_parametro_cliente, parametro.parametro, parametro.tipo_parametro, parametro.tipo_valor, '', parametro.valor, agenda.id_tipo_cita)
                            } else {
                                addRowParametro(parametro.id_parametro_cliente, parametro.parametro, parametro.tipo_parametro, parametro.tipo_valor, parametro.unidad_abreviatura, parametro.valor, agenda.id_tipo_cita)
                            }
                        })
                    }
                    //Plan Dieta

                    //Plan Suplemento

                    //Plan Ejercicio
                }

                //Frecuencias
                $.ajax({
                    url: `https://api-sascha.herokuapp.com/frecuencias`,
                    type: 'GET',
                    contentType: 'application/json',
                    success: function (res, status, xhr) {
                        const frecuencias = res.data;
                        frecuencias.map(function (frecuencia) {
                            //Frecuencias de suplementos
                            let select_suplementos = document.getElementsByClassName('select-suplemento');
                            for (let s = 0; s < select_suplementos.length; s++) {
                                let selectE = select_suplementos[s];
                                let optionE = document.createElement('option');
                                optionE.value = frecuencia.id_frecuencia;
                                optionE.innerHTML = frecuencia.frecuencia;
                                selectE.appendChild(optionE);
                            }
                            //Frecuencias de ejercicios
                            let select_ejercicios = document.getElementsByClassName('select-ejercicio');
                            for (let e = 0; e < select_ejercicios.length; e++) {
                                let selectS = select_ejercicios[e];
                                let optionS = document.createElement('option');
                                optionS.value = frecuencia.id_frecuencia;
                                optionS.innerHTML = frecuencia.frecuencia;
                                selectS.appendChild(optionS);
                            }
                        })
                    },
                    error: function (res, status, xhr) {
                        alert("error!")
                    }

                })

            },
            error: function (res, status, xhr) {
                console.log(res)
            },
            complete: function () {
                $('#loadingDiv').hide();
                $('#info-visita').css('display', 'block');
            }
        })

    }

    $('#btnAceptarAlimentos').on('click', function () {
        if ($('#txtGrupoCantidad').val() == '' || $('#ms_alimentos').val() == null) {
            mensaje('#msjAgregarAlimento', '', 5);
            return
        }
        const id_comida_grupo = $('#txtGrupoAlimenticioId').val();
        const id_comida_grupo_cantidad = id_comida_grupo.replace('grupo', 'cantidad');
        const id_comida_grupo_alimentos = id_comida_grupo.replace('grupo', 'alimentos');
        const id_comida_grupo_id_alimentos = id_comida_grupo.replace('grupo', 'id_alimentos');

        let cantidad = document.getElementById(id_comida_grupo_cantidad);
        cantidad.innerHTML = $('#txtGrupoCantidad').val();


        let alimentos = document.getElementById(id_comida_grupo_alimentos);
        let arreglo_alimentos = $('#ms_alimentos').val()

        let id_alimentos = document.getElementById(id_comida_grupo_id_alimentos);
        id_alimentos.innerHTML = arreglo_alimentos;

        let nombre_alimento = [];
        arreglo_alimentos.map(function (alimento) {
            nombre_alimento.push($(`#ms_alimentos option[value="${alimento}"]`).text())

        });

        alimentos.innerHTML = nombre_alimento.toString();

        $('#agregarAlimentos').modal('hide');

    })

    $('#btnRegistrar').on('click', function () {
        let parametros = []
        let regimen_suplementos = []
        let regimen_ejercicios = []
        let regimen_dietas = []
        //Datos del perfil
        let parametro_perfil = document.getElementsByClassName('icheckbox_flat-green checked');
        for (let i = 0; i < parametro_perfil.length; i++) {
            let id_parametro = parametro_perfil[i].firstChild.getAttribute('id').split('-')[1];
            let valor = $('#real-' + id_parametro).val();
            if (valor == '') {
                mensaje('#msjAlerta', '', 5)
                return
            }
            parametros.push(
                {
                    id_parametro: Number.parseInt(id_parametro),
                    id_cliente: id_cliente,
                    valor: valor == undefined ? null : Number.parseInt(valor)
                }
            )
        }
        //Regimen-Suplemento
        let input_suplementos = document.getElementsByClassName('input-suplemento');
        let select_suplementos = document.getElementsByClassName('select-suplemento');
        for (let s = 0; s < input_suplementos.length; s++) {
            let idS = input_suplementos[s].getAttribute('id').split('-')[1]
            let cantidadS = input_suplementos[s].value
            let frecuenciaS = select_suplementos[s].value
            if (cantidadS == undefined || frecuenciaS == 0) {
                mensaje('#msjAlerta', '', 5)
                return
            }
            regimen_suplementos.push({
                id_suplemento: Number.parseInt(idS),
                id_cliente: id_cliente,
                cantidad: Number.parseInt(cantidadS),
                id_frecuencia: Number.parseInt(frecuenciaS)
            })
        }
        //Regimen-Ejercicios
        let input_ejercicios = document.getElementsByClassName('input-ejercicio');
        let select_ejercicios = document.getElementsByClassName('select-ejercicio');
        for (let e = 0; e < input_ejercicios.length; e++) {
            let idE = input_ejercicios[e].getAttribute('id').split('-')[1]
            let cantidadE = input_ejercicios[e].value
            let frecuenciaE = select_ejercicios[e].value
            if (cantidadE == undefined || frecuenciaE == 0) {
                mensaje('#msjAlerta', '', 5)
                return
            }
            regimen_ejercicios.push({
                id_ejercicio: Number.parseInt(idE),
                id_cliente: id_cliente,
                duracion: Number.parseInt(cantidadE),
                id_tiempo: 1,
                id_frecuencia: Number.parseInt(frecuenciaE)
            })
        }
        //Regimen - Dieta

        let cantidad_dieta = document.getElementsByClassName('cantidad-dieta');
        let id_alimentos_dieta = document.getElementsByClassName('id-alimentos-dieta');
        for (let d = 0; d < cantidad_dieta.length; d++) {
            let alimentos = []
            let cantidadD = cantidad_dieta[d].innerHTML;
            let alimentosD = id_alimentos_dieta[d].innerHTML.split(',');
            alimentosD.map(function (aliD) {
                alimentos.push({
                    id_alimento: Number.parseInt(aliD)
                })
            })
            let id_detalle_plan_dieta = cantidad_dieta[d].parentElement.parentElement.id.split('-')[1]
            regimen_dietas.push({
                id_detalle_plan_dieta: Number.parseInt(id_detalle_plan_dieta),
                id_cliente: id_cliente,
                cantidad: Number.parseInt(cantidadD),
                alimentos: alimentos
            })

        }


        let visita = {
            id_agenda: Number.parseInt(id_agenda),
            id_tipo_cita: id_tipo_cita,
            perfil: parametros,
            regimen_suplementos: regimen_suplementos,
            regimen_ejercicios: regimen_ejercicios,
            fecha_atencion: moment().format('YYYY-MM-DD'),
            numero: Number.parseInt(realizadas),
            regimen_dietas: regimen_dietas

        }
        console.log(JSON.stringify(visita))

        $.ajax({
            url: `https://api-sascha.herokuapp.com/visitas`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(visita),

            success: function (res, status, xhr) {
                alert("LO LOGRAMOS AMIGOS")
                console.log(res.data.mensaje)
            },
            error: function (res, status, xhr) {
                alert("error!")
                console.log(res)

            }
        })
    })

    $.ajax({
        url: `https://api-sascha.herokuapp.com/grupoalimenticios`,
        type: 'GET',
        async: false,
        contentType: 'application/json',
        success: function (res, status, xhr) {
            const grupos = res.data;
            grupos.map(function (grupo) {
                arreglo_grupos.push(grupo)
            })
        },
        error: function (res, status, xhr) {
            alert("error!")
        }

    })

});


function crearPanelesDieta(i, comida) {
    //creando el panel
    var panel = document.createElement('section');
    panel.className = 'panel';
    //creando el header del panel
    var panelHeading = document.createElement('header');
    panelHeading.className = 'panel-heading';
    panelHeading.innerHTML = comida.nombre;
    panelCollapsible(panelHeading);
    panel.appendChild(panelHeading);
    //creando el body del panel
    var panelBody = document.createElement('div');
    panelBody.className = 'panel-body';
    panelBody.style.display = 'none';
    crearTabla(i, comida.grupos_alimenticios, panelBody);
    panel.appendChild(panelBody);

    let body = document.getElementById('comidas');
    body.appendChild(panel)
}

function crearTabla(id, grupos, body) {
    var tabla = document.createElement('table');
    tabla.className = 'display table table-bordered table-striped';
    tabla.id = "dtComida-" + id;
    tabla.innerHTML = "<thead>"
        + "<tr>"
        + "<th width='25%'>Grupo Alimenticio</th>"
        + "<th width='25%'>Cantidad</th>"
        + "<th width='10%'>Unidad</th>"
        + "<th width='30%'>Alimentos</th>"
        + "<th width='10%'>Editar</th>"
        + "<th hidden></th>"
        + "</tr>"
        + "</thead>";

    body.appendChild(tabla);

    grupos.map(function (grupo) {
        let row = tabla.insertRow(1);
        row.id = 'planDieta-' + grupo.id_detalle_plan_dieta;
        let grupo_alimenticio = row.insertCell(0);
        let cant = row.insertCell(1);
        let unidad = row.insertCell(2);
        let alimentos = row.insertCell(3);
        let editar = row.insertCell(4);
        let id_alimentos = row.insertCell(5);

        grupo_alimenticio.innerHTML = `<span id='grupo-${id}-${grupo.id_grupo_alimenticio}' > ${grupo.nombre} </span>`;
        cant.innerHTML = `<span id='cantidad-${id}-${grupo.id_grupo_alimenticio}' class='cantidad-dieta'></span>`;
        unidad.innerHTML = `<span id='unidad-${id}-${grupo.id_grupo_alimenticio}' >${grupo.unidad_abreviatura}</span>`;
        alimentos.innerHTML = `<span id='alimentos-${id}-${grupo.id_grupo_alimenticio}' ></span>`;
        editar.innerHTML = `<a id='editar-${id}-${grupo.id_grupo_alimenticio}' class='btn btn-white' onclick='agregarAlimentos(${id},${grupo.id_grupo_alimenticio})' data-toggle='modal' href='#agregarAlimentos'><i class='fa fa-pencil' /> </a>`
        id_alimentos.style.display = 'none';
        id_alimentos.innerHTML = `<span id='id_alimentos-${id}-${grupo.id_grupo_alimenticio}' class='id-alimentos-dieta' ></span>`;
    })

}


function panelCollapsible(prueba) {
    var collapse = document.createElement('span');
    collapse.className = 'tools pull-right';
    var chevron = document.createElement('a');
    chevron.setAttribute('href', '#')
    chevron.className = 'fa fa-chevron-up';
    collapse.appendChild(chevron);
    prueba.appendChild(collapse);
}



$('#ms_alimentos').multiSelect({
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
    afterSelect: function () {
        this.qs1.cache();
        this.qs2.cache();
    },
    afterDeselect: function () {
        this.qs1.cache();
        this.qs2.cache();
    }
});



//date picker start

$(function () {
    window.prettyPrint && prettyPrint();
    $('.default-date-picker').datepicker({
        format: 'mm-dd-yyyy'
    });
    $('.dpYears').datepicker();
    $('.dpMonths').datepicker();

    // disabling dates
    var nowTemp = new Date();
    var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);

    var checkin = $('.dpd1').datepicker({
        onRender: function (date) {
            return date.valueOf() < now.valueOf() ? 'disabled' : '';
        }
    }).on('changeDate', function (ev) {
        if (ev.date.valueOf() > checkout.date.valueOf()) {
            var newDate = new Date(ev.date)
            newDate.setDate(newDate.getDate() + 1);
            checkout.setValue(newDate);
        }
        checkin.hide();
        $('.dpd2')[0].focus();
    }).data('datepicker');
    var checkout = $('.dpd2').datepicker({
        onRender: function (date) {
            return date.valueOf() <= checkin.date.valueOf() ? 'disabled' : '';
        }
    }).on('changeDate', function (ev) {
        checkout.hide();
    }).data('datepicker');
});

//date picker end

function calcularAvance(realizadas, total) {
    let porc = realizadas * 100 / total
    return porc + '%'

}

function addRowEjercicios(id, ejercicio, cantidad, frecuencia) {
    let row = $(`<tr>
        <td id="ejercicio-${id}">${ejercicio}</td>
        <td class='text-center'>
        <input class='form-control input-ejercicio' id='cantidadE-${id}' type="number" value='${cantidad}'>
        </td>
        <td>
        <select id='selFrecuenciaE-${id}' class='form-control select-ejercicio' >
        <option value='0' > Seleccione </option>
        </select>
        </td>
        </tr>
        `);
    $('#dtEjercicios').DataTable().row.add(row).draw();

}

function addRowSuplemento(id, suplemento, cantidad, unidad, frecuencia) {
    let row = $(`<tr>
        <td id="suplemento-${id}">${suplemento}</td>
        <td class='text-center'>
        <input class='form-control input-suplemento' id='cantidad-${id}' type="number" value='${cantidad}'> ${unidad}
        </td>
        <td>
        <select id='selFrecuencia-${id}' class='form-control select-suplemento' >
        <option value='0' > Seleccione </option>
        </select>
        </td>
        </tr>
        `);
    $('#dtSuplementos').DataTable().row.add(row).draw();

}

function addRowParametro(id, nombre, tipo_parametro, tipo_valor, unidad, valorP, tipo_cita) {
    let valor = '';
    if (tipo_valor === 2) {
        valor = `<input id='real-${id}' type="number" class='form-control txtValor' style='width: 80%' value='${valorP == null ? '' : valorP}' ><span> ${unidad}</span>`
    }
    let row = $(`<tr>
        <td id="tipo_parametro-${id}">${tipo_parametro}</td>
        <td id="nombreParametro-${id}">${nombre}</td>
        <td class='text-center' id="tipo_valor-${id}">${valor}</td>
        <td>
        <input id='parametro-${id}' type="checkbox" > 
        </td>
        </tr>
        `);
    $('#dtPerfil').DataTable().row.add(row).draw();

    $(`#parametro-${id}`).iCheck({
        checkboxClass: 'icheckbox_flat-green',
        radioClass: 'iradio_flat-green',
    });

    if (tipo_cita == 2) {
        $(`#parametro-${id}`).iCheck('check')
    }


}

function agregarAlimentos(comida, grupo) {

    resetMultiSelect()
    const id = `grupo-${comida}-${grupo}`
    const nombre = document.getElementById(id).innerHTML
    const unidad = document.getElementById(`unidad-${comida}-${grupo}`).innerHTML;
    const cantidad = document.getElementById(`cantidad-${comida}-${grupo}`).innerHTML;

    $('#txtGrupoAlimenticioId').val(id);
    $('#txtGrupoAlimenticio').val(nombre);
    $('#grupo-unidad').text(unidad);
    $('#txtGrupoCantidad').val(cantidad);

    arreglo_grupos.map(function (grupoA) {
        if (grupoA.id_grupo_alimenticio == grupo) {
            const alimentos = grupoA.alimentos;
            alimentos.map(function (alimento) {
                let option = $(`<option value= '${alimento.id_alimento}'>${alimento.nombre}</option>`)
                $('#ms_alimentos').append(option)

            })
        }

    })
    $('#ms_alimentos').multiSelect('refresh');
    const id_alimentos = document.getElementById(`id_alimentos-${comida}-${grupo}`).innerHTML.split(',');
    $('#ms_alimentos').multiSelect('select', id_alimentos);

}

function resetMultiSelect() {
    $('#txtGrupoAlimenticioId').val('')
    $('#txtGrupoAlimenticio').val('')
    $('#txtGrupoCantidad').val('')
    $('#ms_alimentos').empty();
    $('#ms_alimentos').multiSelect('refresh')

}