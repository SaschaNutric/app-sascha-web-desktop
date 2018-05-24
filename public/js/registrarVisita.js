
let arregloTipoParametros = []
let arreglo_grupos = []
let realizadas = 0;
let id_cliente = null;
let id_tipo_cita = null;
let arreglo_frecuencias = []
let valores_viejos = []
let id_orden_servicio = null;
let visita = {};
$(document).ready(function () {

    $('#proximaVisita').on('shown.bs.modal', function () {
        $("#calendar").fullCalendar('render');
    });

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


    $('#dtMeta').DataTable({
        "language": {
            "lengthMenu": "",
            "search": "Buscar:",
            "paginate": {
                "previous": "Anterior",
                "next": "Siguiente"
            },
            "emptyTable": "No se encontraron metas",
            "zeroRecords": "No se encontraron metas"
        },
        "searching": false,
        "ordering": false,
        "paging": false
    });




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
                let metas = orden.metas;
                let perfil = cliente.perfil;
                let plan_dieta = servicio.plan_dieta;
                let plan_suplemento = servicio.plan_suplemento;
                let plan_ejercicio = servicio.plan_ejercicio;

                // agenda.id_tipo_cita = 2 //BORRAAAAR
                //Datos de la cita
                moment.locale('es')
                id_tipo_cita = agenda.id_tipo_cita
                let fecha = moment(agenda.fecha);
                id_orden_servicio = orden.id_orden_servicio
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

                //Metas
                if (metas.length > 0) {
                    metas.map(function (meta) {
                        addRowMeta(meta.id_parametro_meta, meta.tipo_parametro, meta.parametro, meta.valor_minimo)
                    })
                }

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
                } else {
                    //Perfil Control
                    if (agenda.id_tipo_cita == 2) {
                        $('#btnMeta').css('display', 'none')
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

                }
                //Plan Dieta
                $('#plan_dieta_nombre').val(plan_dieta.nombre)
                if (plan_dieta.comidas.length != 0) {
                    plan_dieta.comidas.map(function (comida) {
                        crearPanelesDieta(comida.id_comida, comida)
                    })

                }

                //Frecuencias
                $.ajax({
                    url: `https://api-sascha.herokuapp.com/frecuencias`,
                    type: 'GET',
                    async: false,
                    contentType: 'application/json',
                    success: function (res, status, xhr) {
                        const frecuencias = res.data;
                        frecuencias.map(function (frecuencia) {
                            arreglo_frecuencias.push({
                                id_frecuencia: frecuencia.id_frecuencia,
                                frecuencia: frecuencia.frecuencia
                            })
                        })
                    },
                    error: function (res, status, xhr) {
                        alert("error!")
                    }
                })
                //Plan Suplemento
                if (plan_suplemento) {
                    $('#plan_suplemento_nombre').val(plan_suplemento.nombre)
                    plan_suplemento.suplementos.map(function (suplemento) {
                        if (suplemento.cantidad) {
                            addRowSuplemento(suplemento.id_suplemento, suplemento.nombre, suplemento.cantidad, suplemento.unidad_abreviatura, suplemento.frecuencia);
                        } else {
                            addRowSuplemento(suplemento.id_suplemento, suplemento.nombre, '', suplemento.unidad_abreviatura, 0);

                        }

                    })
                }
                //Plan Ejercicio
                if (plan_ejercicio) {
                    $('#plan_ejercicio_nombre').val(plan_ejercicio.nombre)
                    plan_ejercicio.ejercicios.map(function (ejercicio) {
                        if (ejercicio.duracion) {
                            addRowEjercicios(ejercicio.id_ejercicio, ejercicio.nombre, ejercicio.duracion, ejercicio.id_frecuencia);
                        } else {
                            addRowEjercicios(ejercicio.id_ejercicio, ejercicio.nombre, '', 0);
                        }

                    })
                }
            },
            error: function (res, status, xhr) {
                $('#loadingDiv').hide();                
                $('#info-visita').css('display', 'none');
                $('#error-info-visita').css('display', 'block');
                console.log(res)
            },
            complete: function () {
                $('#loadingDiv').hide();
                $('#info-visita').css('display', 'block');
            }
        })

    }

    //Agregar alimentos a la dieta
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
//Registrar Visita
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
            if(cantidadD == '' || alimentosD.length == 0 ||cantidadD == undefined || alimentosD == undefined){
                    mensaje('#msjAlerta', '', 5)
                    return
                
            }
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


        visita.id_agenda = Number.parseInt(id_agenda)
        visita.id_tipo_cita = id_tipo_cita
        visita.perfil = parametros
        visita.regimen_suplementos = regimen_suplementos
        visita.regimen_ejercicios = regimen_ejercicios
        visita.fecha_atencion = moment().format('YYYY-MM-DD')
        visita.numero = Number.parseInt(realizadas)
        visita.regimen_dietas = regimen_dietas



        if (!visita.id_empleado) {
            mensaje('#msjAlerta', '', 5)

            return
        }

        console.log(visita)

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
    //Llenando los bloques horarios para la proxima visita
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/bloquehorarios',
        contentType: 'application/json',
        type: 'GET',
        success: function (res, status, xhr) {
            res.data.map(function (bloque) {
                let option = $(`<option value="${bloque.id_bloque_horario}">${bloque.hora_inicio.substr(0, 5)}-${bloque.hora_fin.substr(0, 5)}</option>`)
                $('#selHoraCita').append(option);
            })
        },
        error: function (res, status, xhr) {
            console.log(res)
        }
    });

    $.ajax({
        url: 'https://api-sascha.herokuapp.com/tipoparametros',
        contentType: 'application/json',
        type: 'GET',
        success: function (res, status, xhr) {
            res.data.map(function (tipo_parametro) {
                arregloTipoParametros.push(tipo_parametro);
                let option = $(`<option value="${tipo_parametro.id_tipo_parametro}">${tipo_parametro.nombre}</option>`)
                let optionMeta = $(`<option value="${tipo_parametro.id_tipo_parametro}">${tipo_parametro.nombre}</option>`)

                $('#selTipoParametro').append(option);
                $('#selTipoParametroMeta').append(optionMeta);
            })
        },
        error: function (res, status, xhr) {
            console.log(res)
        }
    });
    //Llenando el combo dependiente parametro
    $('#selTipoParametro').on('change', function () {
        document.getElementById('selParametro').length = 1;
        var str = "";
        $("#selTipoParametro option:selected").each(function () {
            str += $(this).val() + " ";
        });
        arregloTipoParametros.map(function (tipoparametro) {
            if (tipoparametro.id_tipo_parametro == str) {
                tipoparametro.parametros.map(function (parametro) {
                    let option = $(`<option value="${parametro.id_parametro}">${parametro.nombre}</option>`)
                    $('#selParametro').append(option);
                })
            }
        })

    })
    $('#selTipoParametroMeta').on('change', function () {
        document.getElementById('selParametroMeta').length = 1;
        let str = $("#selTipoParametroMeta").val()
        arregloTipoParametros.map(function (tipoparametro) {
            if (tipoparametro.id_tipo_parametro == str) {
                tipoparametro.parametros.map(function (parametro) {
                    if (parametro.tipo_valor == 2) {
                        let option = $(`<option value="${parametro.id_parametro}">${parametro.nombre}</option>`)
                        $('#selParametroMeta').append(option);
                    }
                })
            }
        })

    })
    //Ocultando valor
    $('#selParametro').on('change', function () {
        const id = $('#selTipoParametro').val()
        const idP = $('#selParametro').val()
        console.log($('#selParametro').val())
        arregloTipoParametros.map(function (tipoparametro) {
            if (tipoparametro.id_tipo_parametro == id) {
                tipoparametro.parametros.map(function (parametro) {
                    if (parametro.id_parametro == idP) {
                        console.log(parametro)
                        if (parametro.tipo_valor == 1) {
                            $('#valores').css('display', 'none')
                            $('#txtValorParametro').val('')
                            $('#parametro-unidad').text('');

                        } else {
                            if (parametro.tipo_valor == 2) {
                                $('#valores').css('display', 'inline')
                                $('#parametro-unidad').text(parametro.unidad.abreviatura);
                            }
                        }
                    }
                })
            }
        })

    })

    //Agregar meta
    $('#btnMeta').on('click', function () {
        $('#btnAceptarMeta').css('display', 'inline')
        $('#btnEditarMeta').css('display', 'none')

    })

    $('#btnAceptarMeta').on('click', function () {
        let tp = $('#selTipoParametroMeta').val()
        let p = $('#selParametroMeta').val()
        let v = $('#txtValorMeta').val()
        let p_nombre = $('select[name="parametro_meta"] option:selected').text()

        if (tp == 0 || p == 0 || v == '') {
            mensaje('#msjMeta', '', 5)
            return
        }

        let meta = {
            id_orden_servicio: id_orden_servicio,
            id_parametro: p,
            valor_minimo: v
        }
        $.ajax({
            url: `https://api-sascha.herokuapp.com/parametrometas`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(meta),

            success: function (res, status, xhr) {
                mensaje('#msjAlerta', 'Meta', 1)
                addRowMeta(res.data.id_parametro_meta, tp, p_nombre, v)

                console.log(res.data.mensaje)
            },
            error: function (res, status, xhr) {
                const respuesta = JSON.parse(res.responseText)
                mensaje('#msjAlerta', respuesta.data.mensaje, 0);
                console.log(res)

            }
        })
        limpiarDefinirMeta()
        $('#definirMeta').modal('hide')

    })
    //Editar Meta
    $('#btnEditarMeta').on('click', function () {
        let tp = $('#selTipoParametroMeta').val()
        let p = $('#selParametroMeta').val()
        let v = $('#txtValorMeta').val()
        let p_nombre = $('select[name="parametro_meta"] option:selected').text()
        let tp_nombre = $('select[name="tipo_parametro_meta"] option:selected').text()
        if (tp == 0 || p == 0 || v == '') {
            mensaje('#msjMeta', '', 5)
            return
        }
        id = $('#txtIdMeta').val()
        let meta = {
            id_orden_servicio: id_orden_servicio,
            id_parametro: p,
            valor_minimo: v
        }
        $.ajax({
            url: `https://api-sascha.herokuapp.com/parametrometa/${id}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(meta),

            success: function (res, status, xhr) {
                mensaje('#msjAlerta', 'Meta', 3)
                editRowMeta(id, tp_nombre, p_nombre, v)

                console.log(res.data.mensaje)
            },
            error: function (res, status, xhr) {
                const respuesta = JSON.parse(res.responseText)
                mensaje('#msjAlerta', respuesta.data.mensaje, 0);
                console.log(res)

            }
        })
        limpiarDefinirMeta()
        $('#definirMeta').modal('hide')
    })

    //Agregar Parametro
    $('#btnAceptarParametro').on('click', function () {
        let tp = $('#selTipoParametro').val()
        let p = $('#selParametro').val()
        let v = $('#txtValorParametro').val()
        let u = $('#parametro-unidad').text();
        let tv = u == '' ? 1 : 2;
        let p_nombre = $('select[name="parametro"] option:selected').text()
        let tp_nombre = $('select[name="tipo_parametro"] option:selected').text()

        if (tp == 0 || p == 0 || (tv == 2 && v == '')) {
            mensaje('#msjMeta', '', 5)
            return
        }

        //ajax
        //Aqui hay que reemplazar p por el id del parametro_cliente que regrese el ajax
        addRowParametro(p, p_nombre, tp_nombre, tv, u, v, 2)
        $('#agregarParametro').modal('hide')

    })

    $('#btnProximaVisita').on('click', function () {
        if ($('#txtFechaCita').val() == '' || $('#selHoraCita').val() == 0) {
            mensaje('#msjProximaVisita', '', 5)
            return
        }


        let fecha = moment($('#txtFechaCita').val(), 'DD-MM-YYYY')

        let id_empleado = JSON.parse(localStorage.getItem('empleado')).id_empleado;



        visita.id_empleado = id_empleado
        visita.id_cliente = id_cliente
        visita.fecha = moment(fecha).format('YYYY-MM-DD')
        visita.id_bloque_horario = Number.parseInt($('#selHoraCita').val())
        visita.id_orden_servicio = id_orden_servicio


        console.log(visita)
    })




});

function limpiarAgregarParametro() {
    $('#selTipoParametro').val(0)
    $('#selParametro').val(0)
    $('#txtValorParametro').val("")
    $('#parametro-unidad').text("");
    $('#valores').css('display', 'none')
}
function limpiarDefinirMeta() {

    $('#selTipoParametroMeta').val(0)
    $('#selParametroMeta').val(0)
    $('#txtValorMeta').val('')
}

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
        let arreglo_alimentos_id = []
        let arreglo_alimentos_nombre = []
        if (grupo.alimentos) {
            grupo.alimentos.map(function (al) {
                arreglo_alimentos_id.push(al.id_alimento)
                arreglo_alimentos_nombre.push(al.nombre)
            })
        }
        grupo_alimenticio.innerHTML = `<span id='grupo-${id}-${grupo.id_grupo_alimenticio}' > ${grupo.nombre} </span>`;
        cant.innerHTML = `<span id='cantidad-${id}-${grupo.id_grupo_alimenticio}' class='cantidad-dieta'> ${grupo.cantidad ? grupo.cantidad : ''}  </span>`;
        unidad.innerHTML = `<span id='unidad-${id}-${grupo.id_grupo_alimenticio}' >${grupo.unidad_abreviatura}</span>`;
        alimentos.innerHTML = `<span id='alimentos-${id}-${grupo.id_grupo_alimenticio}' > ${arreglo_alimentos_nombre}</span>`;
        editar.innerHTML = `<a id='editar-${id}-${grupo.id_grupo_alimenticio}' class='btn btn-white' onclick='agregarAlimentos(${id},${grupo.id_grupo_alimenticio})' data-toggle='modal' href='#agregarAlimentos'><i class='fa fa-pencil' /> </a>`
        id_alimentos.style.display = 'none';
        id_alimentos.innerHTML = `<span id='id_alimentos-${id}-${grupo.id_grupo_alimenticio}' class='id-alimentos-dieta' > ${arreglo_alimentos_id}</span>`;
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
        format: 'dd-mm-yyyy'
    });
    $('.dpYears').datepicker();
    $('.dpMonths').datepicker();
    $('.dpDays').datepicker();


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
        <td id='colE-${id}'>  
        </td>
        </tr>
        `);
    $('#dtEjercicios').DataTable().row.add(row).draw();

    createSelFrecuencia('selFrecuenciaE-' + id, 'form-control select-ejercicio', frecuencia, 'colE-' + id)
}

function addRowSuplemento(id, suplemento, cantidad, unidad, frecuencia) {
    let row = $(`<tr>
        <td id="suplemento-${id}">${suplemento}</td>
        <td class='text-center'>
        <input class='form-control input-suplemento' id='cantidad-${id}' type="number" value='${cantidad}'> ${unidad}
        </td>
        <td id='colS-${id}'>
        
        </td>
        </tr>
        `);
    $('#dtSuplementos').DataTable().row.add(row).draw();

    createSelFrecuencia('selFrecuencia-' + id, 'form-control select-suplemento', frecuencia, 'colS-' + id)
}
function createSelFrecuencia(id, clases, selected, element) {
    let select = document.createElement("select");
    select.id = id;
    select.className = clases
    let defecto = document.createElement('option');
    defecto.value = 0;
    defecto.innerHTML = "Seleccione";
    select.appendChild(defecto);
    arreglo_frecuencias.map(function (frecuencia) {
        let option = document.createElement('option');
        option.value = frecuencia.id_frecuencia;
        option.innerHTML = frecuencia.frecuencia;
        select.appendChild(option);
    })
    select.value = selected
    document.getElementById(element).appendChild(select)
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
        <td ${tipo_cita == 1 ? '' : 'hidden'}>
        <input id='parametro-${id}' type="checkbox" > 
        </td>
        <td ${tipo_cita == 2 ? '' : 'hidden'}>
        <a style='display: ${tipo_valor == 1 ? 'none' : 'inline'}' id='editarParametro-${id}' class='btn btn-white' onclick='editarParametro(${id})'><i class='fa fa-pencil' /> </a>
        <a id='eliminarParametro-${id}' class='btn btn-white' onclick='eliminarParametro(${id})'><i class='fa fa-trash' /> </a>
        
        <a style='display:none' id='confirmarParametro-${id}' class='btn btn-white' onclick='confirmarParametro(${id})'><i class='fa fa-save' /> </a>
        <a style='display:none' id='cancelarParametro-${id}' class='btn btn-white' onclick='cancelarParametro(${id})'><i class='fa fa-times' /> </a>
        </td>
        </tr>
        `);
    $('#dtPerfil').DataTable().row.add(row).draw();

    $(`#parametro-${id}`).iCheck({
        checkboxClass: 'icheckbox_flat-green',
        radioClass: 'iradio_flat-green',
    });

    if (tipo_cita == 2) {
        $(`#real-${id}`).prop('disabled', true)
        $(`#thEditar`).css('display', 'inline')
    }


}

function editarParametro(id) {

    valores_viejos.push({
        id: id,
        valor: $(`#real-${id}`).val(),
    })
    $(`#editarParametro-${id}`).css('display', 'none')
    $(`#eliminarParametro-${id}`).css('display', 'none')

    $(`#confirmarParametro-${id}`).css('display', 'inline')
    $(`#cancelarParametro-${id}`).css('display', 'inline')

    $(`#parametro-${id}`).iCheck('enable')
    if (document.getElementById('real-' + id)) {
        $(`#real-${id}`).prop('disabled', false)
    }
}

function cancelarParametro(id) {
    let index;
    for (let i = 0; i < valores_viejos.length; i++) {
        if (valores_viejos[i].id == id) {
            index = i;
            if (valores_viejos[i].valor) {
                $(`#real-${id}`).val(valores_viejos[i].valor)
                $(`#real-${id}`).prop('disabled', true)

            }
        }
    }
    valores_viejos.splice(index, 1)
    $(`#editarParametro-${id}`).css('display', 'inline')
    $(`#eliminarParametro-${id}`).css('display', 'inline')

    $(`#confirmarParametro-${id}`).css('display', 'none')
    $(`#cancelarParametro-${id}`).css('display', 'none')

}

function agregarAlimentos(comida, grupo) {

    resetMultiSelect()
    const id = `grupo-${comida}-${grupo}`
    const nombre = document.getElementById(id).innerHTML.trim()
    const unidad = document.getElementById(`unidad-${comida}-${grupo}`).innerHTML.trim();
    const cantidad = document.getElementById(`cantidad-${comida}-${grupo}`).innerHTML.trim();

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
    const id_alimentos = document.getElementById(`id_alimentos-${comida}-${grupo}`).innerHTML.trim().split(',');
    $('#ms_alimentos').multiSelect('select', id_alimentos);

}

function resetMultiSelect() {
    $('#txtGrupoAlimenticioId').val('')
    $('#txtGrupoAlimenticio').val('')
    $('#txtGrupoCantidad').val('')
    $('#ms_alimentos').empty();
    $('#ms_alimentos').multiSelect('refresh')

}

function addRowMeta(id, tipo_parametro, parametro, valor) {
    let row = $(`<tr>
        <td hidden id="metaTP-${id}">${tipo_parametro}</td>    
        <td id="metaP-${id}">${parametro}</td>
        <td id="metaV-${id}">${valor}</td>
        <td style='display: ${id_tipo_cita == 1 ? 'block' : 'none'}'>
        <button onclick="editarMeta(${id})" type='button' class='btn  btn-white' data-toggle="modal" data-target="#definirMeta"  title='Editar'><i class='fa fa-pencil'></i></button>
        <button onclick="eliminarMeta(${id})" type='button' class='btn  btn-white' data-toggle='modal' data-target="#eliminarMeta" title='Eliminar'><i class="fa fa-trash-o"></i></button>  
        </td>
        </tr>
        `);
    $('#dtMeta').DataTable().row.add(row).draw();

}

function editRowMeta(id, tipo_parametro, parametro, valor) {

    $(`#metaTP-${id}`).text(tipo_parametro)
    $(`#metaP-${id}`).text(parametro)
    $(`#metaV-${id}`).text(valor)
}

function editarMeta(id) {
    $('#btnAceptarMeta').css('display', 'none')
    $('#btnEditarMeta').css('display', 'inline')
    $('#txtIdMeta').val(id)
    $('#selTipoParametroMeta option:contains(' + $(`#metaTP-${id}`).text() + ')').prop('selected', true);
    let tp = $('#selTipoParametroMeta').val()
    document.getElementById('selParametroMeta').length = 1;
    arregloTipoParametros.map(function (tipoparametro) {
        if (tipoparametro.id_tipo_parametro == tp) {
            tipoparametro.parametros.map(function (parametro) {
                if (parametro.tipo_valor == 2) {
                    let option = $(`<option value="${parametro.id_parametro}">${parametro.nombre}</option>`)
                    $('#selParametroMeta').append(option);
                }
            })
        }
    })
    $('#selParametroMeta option:contains(' + $(`#metaP-${id}`).text() + ')').prop('selected', true);
    $('#txtValorMeta').val(Number.parseInt($(`#metaV-${id}`).text()))


}

function eliminarMeta(id) {
    $.ajax({
        url: `https://api-sascha.herokuapp.com/parametrometa/${id}`,
        type: 'DELETE',
        contentType: 'application/json',

        success: function (res, status, xhr) {
            mensaje('#msjAlerta', 'Meta', 2)
            $('#dtMeta').DataTable().row($(`#metaP-${id}`).parent()).remove().draw();

            console.log(res.data.mensaje)
        },
        error: function (res, status, xhr) {
            const respuesta = JSON.parse(res.responseText)
            mensaje('#msjAlerta', respuesta.data.mensaje, 0);
            console.log(res)

        }
    })
}

let Script = function () {
    /* initialize the calendar
      -----------------------------------------------------------------*/
    let data = {
        fecha_inicio: '2018-05-01',
        fecha_fin: '2019-05-31'
    }

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            right: ''
        },
        defaultView: 'month',
        editable: false,
        droppable: false, // this allows things to be dropped onto the calendar !!!
        dayClick: function (date, jsEvent, view) {
            $('#txtFechaCita').val(moment(date).format('DD-MM-YYYY'))
        }

    });

    let events = [];
    let id_empleado = JSON.parse(localStorage.getItem('empleado')).id_empleado;
    $.ajax({
        url: `https://api-sascha.herokuapp.com/agendas/empleado/${id_empleado}`,
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify(data),
        success: function (res, status, xhr) {
            res.data.map(function (agenda) {
                let event = {
                    title: agenda.horario + " - " + agenda.nombre_cliente,
                    start: agenda.fecha_inicio,
                    end: agenda.fecha_fin,
                    color: (agenda.id_tipo_cita == 1 ? '#7ab740' : '#3da3cb')
                }
                events.push(event);
            })
            console.log(events)
            $('#calendar').fullCalendar('addEventSource', events);
        },

        error: function (res, status, xhr) {
            alert('there was an error while fetching events!');
        },
    })

}();