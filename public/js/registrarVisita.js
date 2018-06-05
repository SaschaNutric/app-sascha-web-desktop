let arregloTipoParametros = []
let arreglo_grupos = []
let realizadas = 0;
let id_cliente = null;
let id_tipo_cita = null;
let arreglo_frecuencias = []
let valores_viejos = []
let vv_ejercicios = []
let vv_suplementos = []
let id_orden_servicio = null;
let visita = {};
let id_visita_control = null;
let proxima = false;
let ultima = false;
let parametros = []
var paramstr = window.location.search.substr(1);
var paramarr = paramstr.split("=");
var params = {};
params[paramarr[0]] = paramarr[1];
const id_agenda = params['id'];
let meta_registrada = false;
$(document).ready(function () {

    $('#proximaVisita').on('shown.bs.modal', function () {
        $("#calendar").fullCalendar('render');
    });


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


            },
            success: function (res, status, xhr) {
                $('#info-visita').show()
                let agenda = res.data;
                let cliente = agenda.cliente;
                let orden = agenda.orden_servicio;
                let servicio = orden.servicio;
                let metas = orden.metas;
                let perfil = cliente.perfil;
                let plan_dieta = servicio.plan_dieta;
                let plan_suplemento = servicio.plan_suplemento;
                let plan_ejercicio = servicio.plan_ejercicio;
                console.log(metas)
                //Datos de la cita
                moment.locale('es')
                id_tipo_cita = agenda.id_tipo_cita
                let fecha = moment(agenda.fecha);
                id_orden_servicio = orden.id_orden_servicio
                $('#cita-fecha').text(fecha.format('DD, MMMM  YYYY'));
                $('#tipo-cita').text(agenda.tipo_cita);
                if (id_tipo_cita == 2) {
                    if ($('#color-icono-visita').hasClass('light-green')) {
                        $('#color-icono-visita').removeClass('light-green')
                    }
                    if ($('#icono-visita').hasClass('fa-stethoscope')) {
                        $('#icono-visita').removeClass('fa-stethoscope')
                    }
                    $('#color-icono-visita').addClass('turquoise')
                    $('#icono-visita').addClass('fa-eye')
                }

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

                if (realizadas >= servicio.numero_visitas) {
                    $('#btnAbrirProximaVisita').hide()
                    ultima = true;
                }
                $('#servicio-plan-dieta').text(plan_dieta.nombre)
                $('#servicio-plan-ejercicio').text(plan_ejercicio == null ? 'No incluye' : plan_ejercicio.nombre)
                $('#servicio-plan-suplemento').text(plan_suplemento == null ? 'No incluye' : plan_suplemento.nombre)

                $('#plan-dieta-nombre').text(plan_dieta.nombre)
                $('#plan-ejercicio-nombre').text(plan_ejercicio == null ? 'No incluye' : plan_ejercicio.nombre)
                $('#plan-suplemento-nombre').text(plan_suplemento == null ? 'No incluye' : plan_suplemento.nombre)

                if (plan_ejercicio == null) {
                    $("#panel-ejercicios").hide()
                }
                if (plan_suplemento == null) {
                    $("#panel-suplementos").hide()
                }
                //Metas
                if (metas.length > 0) {
                    metas.map(function (meta) {
                        addRowMeta(meta.id_parametro_meta, meta.id_tipo_parametro, meta.parametro, meta.valor_minimo, meta.signo == 0 ? 'fa-minus' : 'fa-plus')
                    })
                }

                if (agenda.id_tipo_cita == 1) {
                    //Perfil Diagnostico
                    $.ajax({
                        url: 'https://api-sascha.herokuapp.com/parametros',
                        contentType: 'application/json',
                        type: 'GET',
                        success: function (res, status, xhr) {
                            console.log(res.data)
                            let agregados = []
                            perfil.map(function (parametro_perfil) {
                                let unidad = parametro_perfil.unidad

                                agregados.push(parametro_perfil.id_parametro)
                                if (unidad == null || unidad == undefined) {
                                    addRowParametro(parametro_perfil.id_parametro, parametro_perfil.parametro, parametro_perfil.tipo_parametro, parametro_perfil.tipo_valor, '', parametro_perfil.valor, agenda.id_tipo_cita, '', true)
                                } else {
                                    addRowParametro(parametro_perfil.id_parametro, parametro_perfil.parametro, parametro_perfil.tipo_parametro, parametro_perfil.tipo_valor, parametro_perfil.unidad_abreviatura, parametro_perfil.valor, agenda.id_tipo_cita, '', true)
                                }

                            })
                            res.data.map(function (parametro) {
                                let unidad = parametro.id_unidad
                                if (agregados.indexOf(parametro.id_parametro) == -1) {
                                    if (unidad == null) {
                                        addRowParametro(parametro.id_parametro, parametro.nombre, parametro.tipo_parametro.nombre, parametro.tipo_valor, '', null, agenda.id_tipo_cita, '', false)
                                    } else {
                                        addRowParametro(parametro.id_parametro, parametro.nombre, parametro.tipo_parametro.nombre, parametro.tipo_valor, parametro.unidad.abreviatura, null, agenda.id_tipo_cita, '', false)
                                    }
                                }



                            })

                        },
                        error: function (res, status, xhr) {
                            const respuesta = JSON.parse(res.responseText);
                            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);

                        }
                    })
                } else {
                    id_visita_control = agenda.id_visita
                    console.log(id_visita_control)
                    //Perfil Control
                    if (agenda.id_tipo_cita == 2) {
                        $('#btnMeta').css('display', 'none')
                        $('#btnAgregarParametro').css('display', 'inline')
                        perfil.map(function (parametro) {
                            let unidad = parametro.unidad
                            if (unidad == null || unidad == undefined) {
                                addRowParametro(parametro.id_parametro_cliente, parametro.parametro, parametro.tipo_parametro, parametro.tipo_valor, '', parametro.valor, agenda.id_tipo_cita, parametro.id_parametro, false)
                            } else {
                                addRowParametro(parametro.id_parametro_cliente, parametro.parametro, parametro.tipo_parametro, parametro.tipo_valor, parametro.unidad_abreviatura, parametro.valor, agenda.id_tipo_cita, parametro.id_parametro, false)
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
                            addRowSuplemento(suplemento.id_suplemento, suplemento.nombre, suplemento.cantidad, suplemento.unidad_abreviatura, suplemento.frecuencia, (suplemento.id_regimen_suplemento ? suplemento.id_regimen_suplemento : ''));
                        } else {
                            addRowSuplemento(suplemento.id_suplemento, suplemento.nombre, '', suplemento.unidad_abreviatura, 0, (suplemento.id_regimen_suplemento ? suplemento.id_regimen_suplemento : ''));

                        }

                    })
                }
                //Plan Ejercicio
                if (plan_ejercicio) {
                    $('#plan_ejercicio_nombre').val(plan_ejercicio.nombre)
                    plan_ejercicio.ejercicios.map(function (ejercicio) {
                        if (ejercicio.duracion) {
                            addRowEjercicios(ejercicio.id_ejercicio, ejercicio.nombre, ejercicio.duracion, ejercicio.id_frecuencia, (ejercicio.id_regimen_ejercicio ? ejercicio.id_regimen_ejercicio : ''));
                        } else {
                            addRowEjercicios(ejercicio.id_ejercicio, ejercicio.nombre, '', 0, (ejercicio.id_regimen_ejercicio ? ejercicio.id_regimen_ejercicio : ''));
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
                // $('#info-visita').css('display', 'block');
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

    //Editar Dieta
    $('#btnEditarAlimentos').on('click', function () {
        if ($('#txtGrupoCantidad').val() == '' || $('#ms_alimentos').val() == null) {
            mensaje('#msjAgregarAlimento', '', 5);
            return
        }
        const id_comida_grupo = $('#txtGrupoAlimenticioId').val();
        const id_comida_grupo_cantidad = id_comida_grupo.replace('grupo', 'cantidad');
        const id_comida_grupo_alimentos = id_comida_grupo.replace('grupo', 'alimentos');
        const id_comida_grupo_id_alimentos = id_comida_grupo.replace('grupo', 'id_alimentos');
        const id_regimen = $('#txtIdRegimen').val();

        let cantidad = document.getElementById(id_comida_grupo_cantidad);
        let c = $('#txtGrupoCantidad').val();

        let alimentos_edit = []

        let alimentos = document.getElementById(id_comida_grupo_alimentos);
        let arreglo_alimentos = $('#ms_alimentos').val()

        let id_alimentos = document.getElementById(id_comida_grupo_id_alimentos);

        let nombre_alimento = [];
        arreglo_alimentos.map(function (alimento) {
            nombre_alimento.push($(`#ms_alimentos option[value="${alimento}"]`).text())
            alimentos_edit.push({ id_alimento: alimento })
        });

        let regimen_alimento = {
            cantidad: Number.parseInt(c),
            alimentos: alimentos_edit

        }

        $.ajax({
            url: `https://api-sascha.herokuapp.com/regimen/dieta/${id_regimen}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(regimen_alimento),

            success: function (res, status, xhr) {
                mensaje('#msjAlerta', 'Dieta ', 3)
                cantidad.innerHTML = c
                id_alimentos.innerHTML = arreglo_alimentos;
                alimentos.innerHTML = nombre_alimento.toString();
            },
            error: function (res, status, xhr) {
                const respuesta = JSON.parse(res.responseText)
                mensaje('#msjAlerta', respuesta.data.mensaje, 0);
                console.log(res)

            }

        })


        $('#agregarAlimentos').modal('hide');

    })

    //Registrar Visita
    $('#btnRegistrar').on('click', function () {
        console.log("-----id visita:")
        console.log(id_tipo_cita)
        console.log(ultima)
        if (id_tipo_cita == 2) {
            if (!ultima && !proxima) {
                mensaje('#msjAlerta', ' de Próxima Visita', 5)
                return
            }
            if (id_visita_control == null) {
                registrarVisitaControl(id_agenda)
            }
            if (id_visita_control != null) {
                window.location = 'visitas.html'
                return

            }
        }
        if (!meta_registrada) {
            mensaje("#msjAlerta", 'de la Meta', 5)
            return
        }

        let regimen_suplementos = []
        let regimen_ejercicios = []
        let regimen_dietas = []
        //Datos del perfil

        if (parametros.length == 0) {
            mensaje('#msjAlerta', 'en Perfil', 5)
            return
        }


        //Regimen-Suplemento
        let input_suplementos = document.getElementsByClassName('input-suplemento');
        let select_suplementos = document.getElementsByClassName('select-suplemento');
        for (let s = 0; s < input_suplementos.length; s++) {
            let idS = input_suplementos[s].getAttribute('id').split('-')[1]
            let cantidadS = input_suplementos[s].value
            let frecuenciaS = select_suplementos[s].value
            if (cantidadS == undefined || frecuenciaS == 0) {
                mensaje('#msjAlerta', 'en Plan de Suplemento', 5)
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
                mensaje('#msjAlerta', 'en Plan de Entrenamiento', 5)
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
            if (cantidadD == '' || alimentosD.length == 0 || cantidadD == undefined || alimentosD == undefined) {
                mensaje('#msjAlerta', 'en Dieta', 5)
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



        if ((!visita.fecha || !visita.id_bloque_horario || visita.fecha == '' || visita.id_bloque_horario == 0) && !ultima) {
            mensaje('#msjAlerta', 'de Proxima Visita', 5)
            return
        }

        console.log(visita)

        $.ajax({
            url: `https://api-sascha.herokuapp.com/visitas`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(visita),
            beforeSend: function () {
                $('#btnRegistrar').prop('disabled', true)
            },

            success: function (res, status, xhr) {
                window.location = 'visitas.html'

                console.log(res.data.mensaje)
            },
            error: function (res, status, xhr) {
                $('#btnRegistrar').prop('disabled', false)
                const respuesta = JSON.parse(res.responseText)
                mensaje('#msjAlerta', respuesta.data.mensaje, 0)
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
    //Actualizando la unidad en la meta
    $('#selParametroMeta').on('change', function () {
        const id = $('#selTipoParametroMeta').val()
        const idP = $('#selParametroMeta').val()
        console.log($('#selParametroMeta').val())
        arregloTipoParametros.map(function (tipoparametro) {
            if (tipoparametro.id_tipo_parametro == id) {
                tipoparametro.parametros.map(function (parametro) {
                    if (parametro.id_parametro == idP) {
                        $('#parametro-meta-unidad').text(parametro.unidad.abreviatura);
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
        let s = $('#selSignoMeta').val()
        let p_nombre = $('select[name="parametro_meta"] option:selected').text()

        if (tp == 0 || p == 0 || v == '' || s == null) {
            mensaje('#msjMeta', '', 5)
            return
        }

        let meta = {
            id_orden_servicio: id_orden_servicio,
            id_parametro: p,
            valor_minimo: v,
            signo: s
        }
        $.ajax({
            url: `https://api-sascha.herokuapp.com/parametrometas`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(meta),

            success: function (res, status, xhr) {
                mensaje('#msjAlerta', 'Meta', 1)
                addRowMeta(res.data.id_parametro_meta, tp, p_nombre, v, s == 0 ? 'fa-minus' : 'fa-plus')
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
        let s = $('#selSignoMeta').val()
        let p_nombre = $('select[name="parametro_meta"] option:selected').text()
        let tp_nombre = $('select[name="tipo_parametro_meta"] option:selected').text()
        if (tp == 0 || p == 0 || v == '' || s == null) {
            mensaje('#msjMeta', '', 5)
            return
        }
        id = $('#txtIdMeta').val()
        let meta = {
            id_orden_servicio: id_orden_servicio,
            id_parametro: p,
            valor_minimo: v,
            signo: s
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
        if (id_visita_control == null) {
            registrarVisitaControl(id_agenda)
        }

        let tp = $('#selTipoParametro').val()
        let p = $('#selParametro').val()
        let v = $('#txtValorParametro').val()
        let u = $('#parametro-unidad').text();
        let tv = u == '' ? 1 : 2;
        let p_nombre = $('select[name="parametro"] option:selected').text()
        let tp_nombre = $('select[name="tipo_parametro"] option:selected').text()

        if (tp == 0 || p == 0 || (tv == 2 && v == '')) {
            mensaje('#msjAlerta', '', 5)
            return
        }

        let para_clie = {
            id_visita: id_visita_control,
            id_cliente: id_cliente,
            id_parametro: p,
            valor: v == '' ? null : v
        }

        $.ajax({
            url: `https://api-sascha.herokuapp.com/parametroclientes`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(para_clie),

            success: function (res, status, xhr) {
                mensaje('#msjAlerta', 'Parametro', 1)
                addRowParametro(res.data.id_parametro_cliente, p_nombre, tp_nombre, tv, u, v, 2, false)
                console.log(res.data.mensaje)
                limpiarAgregarParametro()
                $('#agregarParametro').modal('hide')
            },
            error: function (res, status, xhr) {
                console.log(res)
                const respuesta = JSON.parse(res.responseText)
                mensaje('#msjAlerta', respuesta.data.mensaje, 0);

            }
        })

    })
    $('#btnAbrirProximaVisita').on('click', function () {
        if (proxima) {
            $('#proximaVisita').modal('hide');
            mensaje('#msjAgregar', 'Ya has registrado una próxima visita', 14);

        }
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
        if (id_tipo_cita == 2) {
            visita.id_tipo_cita = 2
            $.ajax({
                url: `https://api-sascha.herokuapp.com/agendas/proximacita`,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(visita),

                success: function (res, status, xhr) {
                    mensaje('#msjAlerta', 'Proxima cita', 1)
                    proxima = true
                    console.log(res.data.mensaje)
                },
                error: function (res, status, xhr) {
                    console.log(res)

                }
            })




        }

        $('#proximaVisita').modal('hide');

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
    document.getElementById('selParametroMeta').length = 1
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
        + "<th width='30%' style= 'max-width = 30px !important'>Alimentos</th>"
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
        alimentos.style = "word-break: break-all"
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
        editar.innerHTML = `<a id='editar-${id}-${grupo.id_grupo_alimenticio}' class='btn btn-white' onclick='agregarAlimentos(${id},${grupo.id_grupo_alimenticio},${grupo.id_regimen_dieta})' data-toggle='modal' href='#agregarAlimentos'><i class='fa fa-pencil' /> </a>`
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
//----------------------------------------- PLAN DE EJERCICIOS ----------------------------------------------------------
function addRowEjercicios(id, ejercicio, cantidad, frecuencia, id_regimen) {
    let row = $(`<tr>
    <td id="ejercicio-${id}">${ejercicio}</td>
    <td class='text-center'>
    <input class='form-control input-ejercicio' id='cantidadE-${id}' type="number" min="0" value='${cantidad}'> min
    </td>
    <td id='colE-${id}'>  
    </td>
    <td style='display: ${id_tipo_cita == 2 ? 'block' : 'none'}'>
    <button id='editarEjercicio-${id}' onclick="editarEjercicio(${id})" type='button' class='btn  btn-white'   title='Editar'><i class='fa fa-pencil'></i></button>            
    <a style='display:none' id='confirmarEjercicio-${id}' class='btn btn-white' onclick='confirmarEjercicio(${id}, ${id_regimen})'><i class='fa fa-save' /> </a>
    <a style='display:none' id='cancelarEjercicio-${id}' class='btn btn-white' onclick='cancelarEjercicio(${id})'><i class='fa fa-times' /> </a>
    </td>
    </tr>`);

    $('#dtEjercicios').DataTable().row.add(row).draw();
    createSelFrecuencia('selFrecuenciaE-' + id, 'form-control select-ejercicio', frecuencia, 'colE-' + id)
    if (id_tipo_cita == 2) {
        $('#acciones-e').show()
        $(`#cantidadE-${id}`).prop('disabled', true);
        $(`#selFrecuenciaE-${id}`).prop('disabled', true);

    }
}

function editarEjercicio(id) {
    $(`#editarEjercicio-${id}`).hide()
    $(`#confirmarEjercicio-${id}`).show()
    $(`#cancelarEjercicio-${id}`).show()

    vv_ejercicios.push({
        id_ejercicio: id,
        id_frecuencia: $(`#selFrecuenciaE-${id}`).val(),
        duracion: $(`#cantidadE-${id}`).val()
    })

    $(`#cantidadE-${id}`).prop('disabled', false);
    $(`#selFrecuenciaE-${id}`).prop('disabled', false);

}

function cancelarEjercicio(id) {
    let index = -1;
    for (let i = 0; i < vv_ejercicios.length; i++) {
        if (vv_ejercicios[i].id_ejercicio == id) {
            index = i;
            $(`#cantidadE-${id}`).val(vv_ejercicios[i].duracion)
            $(`#cantidadE-${id}`).prop('disabled', true)
            $(`#selFrecuenciaE-${id}`).val(vv_ejercicios[i].id_frecuencia)
            $(`#selFrecuenciaE-${id}`).prop('disabled', true)

        }
    }
    if (index != -1) {
        vv_ejercicios.splice(index, 1)

    }

    $(`#editarEjercicio-${id}`).show()
    $(`#confirmarEjercicio-${id}`).hide()
    $(`#cancelarEjercicio-${id}`).hide()
}

function confirmarEjercicio(id, id_regimen) {
    if (id_regimen == '') {
        mensaje('#msjAlerta', 'No se encontro el regimen', 0)
        return
    }
    if ($(`#cantidadE-${id}`).val() == '' || $(`#selFrecuenciaE-${id}`).val() == 0) {
        mensaje('#msjAlerta', '', 5)
        return
    }

    $(`#editarEjercicio-${id}`).show()
    $(`#confirmarEjercicio-${id}`).hide()
    $(`#cancelarEjercicio-${id}`).hide()

    $(`#cantidadE-${id}`).prop('disabled', true);
    $(`#selFrecuenciaE-${id}`).prop('disabled', true);

    let ejercicio = {
        id_frecuencia: Number.parseInt($(`#selFrecuenciaE-${id}`).val()),
        duracion: Number.parseInt($(`#cantidadE-${id}`).val())
    }

    $.ajax({
        url: `https://api-sascha.herokuapp.com/regimen/ejercicio/${id_regimen}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(ejercicio),

        success: function (res, status, xhr) {
            mensaje('#msjAlerta', 'Ejercicio ', 3)
        },
        error: function (res, status, xhr) {
            const respuesta = JSON.parse(res.responseText)
            mensaje('#msjAlerta', respuesta.data.mensaje, 0);
            console.log(res)

        }

    })
}
//------------------------------------------ PLAN DE SUPLEMENTOS ------------------------------------------------------
function addRowSuplemento(id, suplemento, cantidad, unidad, frecuencia, id_regimen) {
    let row = $(`<tr>
        <td id="suplemento-${id}">${suplemento}</td>
        <td class='text-center'>
        <input class='form-control input-suplemento' id='cantidad-${id}' type="number" min="0" value='${cantidad}'> ${unidad}
        </td>
        <td id='colS-${id}'>
        </td>
        <td style='display: ${id_tipo_cita == 2 ? 'block' : 'none'}'>
        <button id='editarSuplemento-${id}' onclick="editarSuplemento(${id})" type='button' class='btn  btn-white'   title='Editar'><i class='fa fa-pencil'></i></button>            
        <a style='display:none' id='confirmarSuplemento-${id}' class='btn btn-white' onclick='confirmarSuplemento(${id}, ${id_regimen})'><i class='fa fa-save' /> </a>
        <a style='display:none' id='cancelarSuplemento-${id}' class='btn btn-white' onclick='cancelarSuplemento(${id})'><i class='fa fa-times' /> </a>
        </td>
        </tr>
        `);
    $('#dtSuplementos').DataTable().row.add(row).draw();

    createSelFrecuencia('selFrecuencia-' + id, 'form-control select-suplemento', frecuencia, 'colS-' + id)

    if (id_tipo_cita == 2) {
        $('#acciones-s').show()
        $(`#cantidad-${id}`).prop('disabled', true);
        $(`#selFrecuencia-${id}`).prop('disabled', true);

    }
}

function editarSuplemento(id) {
    $(`#editarSuplemento-${id}`).hide()
    $(`#confirmarSuplemento-${id}`).show()
    $(`#cancelarSuplemento-${id}`).show()

    vv_suplementos.push({
        id_suplemento: id,
        id_frecuencia: $(`#selFrecuencia-${id}`).val(),
        cantidad: $(`#cantidad-${id}`).val()
    })

    $(`#cantidad-${id}`).prop('disabled', false);
    $(`#selFrecuencia-${id}`).prop('disabled', false);

}

function cancelarSuplemento(id) {
    let index = -1;
    for (let i = 0; i < vv_suplementos.length; i++) {
        if (vv_suplementos[i].id_suplemento == id) {
            index = i;
            $(`#cantidad-${id}`).val(vv_suplementos[i].cantidad)
            $(`#cantidad-${id}`).prop('disabled', true)
            $(`#selFrecuencia-${id}`).val(vv_suplementos[i].id_frecuencia)
            $(`#selFrecuencia-${id}`).prop('disabled', true)

        }
    }
    if (index != -1) {

        vv_suplementos.splice(index, 1)
    }

    $(`#editarSuplemento-${id}`).show()
    $(`#confirmarSuplemento-${id}`).hide()
    $(`#cancelarSuplemento-${id}`).hide()
}

function confirmarSuplemento(id, id_regimen) {
    if (id_regimen == '') {
        mensaje('#msjAlerta', 'No se encontro el regimen', 0)
        return
    }
    if ($(`#cantidad-${id}`).val() == '' || $(`#selFrecuencia-${id}`).val() == 0) {
        mensaje('#msjAlerta', '', 5)
        return
    }

    $(`#editarSuplemento-${id}`).show()
    $(`#confirmarSuplemento-${id}`).hide()
    $(`#cancelarSuplemento-${id}`).hide()

    $(`#cantidad-${id}`).prop('disabled', true);
    $(`#selFrecuencia-${id}`).prop('disabled', true);

    let suplemento = {
        id_frecuencia: Number.parseInt($(`#selFrecuencia-${id}`).val()),
        cantidad: Number.parseInt($(`#cantidad-${id}`).val())
    }

    $.ajax({
        url: `https://api-sascha.herokuapp.com/regimen/suplemento/${id_regimen}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(suplemento),

        success: function (res, status, xhr) {
            mensaje('#msjAlerta', 'Suplemento ', 3)
        },
        error: function (res, status, xhr) {
            const respuesta = JSON.parse(res.responseText)
            mensaje('#msjAlerta', respuesta.data.mensaje, 0);
            console.log(res)

        }

    })
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

function addRowParametro(id, nombre, tipo_parametro, tipo_valor, unidad, valorP, tipo_cita, id_parametro, es_perfil) {
    let valor = '';
    if (tipo_valor === 2) {
        valor = `<input id='real-${id}' type="number" min="0" class='form-control txtValor' style='width: 70%' value='${valorP == null ? '' : Number.parseFloat(valorP).toFixed(2)}' ><span> ${unidad}</span>`
    }
    let row = $(`<tr>
        <td id="tipo_parametro-${id}">${tipo_parametro}</td>
        <td id="nombreParametro-${id}">${nombre}</td>
        <td class='text-center' id="tipo_valor-${id}">${valor}</td>
        <td ${tipo_cita == 1 ? '' : 'hidden'}>
        <input style="display: ${es_perfil ? 'none' : 'inline'}" onchange='perfil(${id})' id='parametro-${id}' class="chk-perfil" type="checkbox" > 
        </td>
        <td ${tipo_cita == 2 ? '' : 'hidden'}>
        <a style='display: ${tipo_valor == 1 ? 'none' : 'inline'}' id='editarParametro-${id}' class='btn btn-white' onclick='editarParametro(${id})'><i class='fa fa-pencil' /> </a>
        <a id='eliminarParametro-${id}' class='btn btn-white' onclick='eliminarParametro(${id})'><i class='fa fa-trash' /> </a>
        <a style='display:none' id='confirmarParametro-${id}' class='btn btn-white' onclick='confirmarParametro(${id})'><i class='fa fa-save' /> </a>
        <a style='display:none' id='cancelarParametro-${id}' class='btn btn-white' onclick='cancelarParametro(${id})'><i class='fa fa-times' /> </a>
        </td>
        <td hidden id="id_parametro-${id}">${id_parametro}</td>
        </tr>
        `);
    $('#dtPerfil').DataTable().row.add(row).draw();
    if (es_perfil) {
        $(`#real-${id}`).prop('disabled', true)

    }
    if (tipo_cita == 2) {
        $(`#real-${id}`).prop('disabled', true)
        $(`#thEditar`).css('display', 'inline')
    }


}

function eliminarParametro(id) {

    if (id == undefined) {
        return
    }
    $.ajax({
        url: `https://api-sascha.herokuapp.com/parametrocliente/${id}`,
        type: 'DELETE',
        contentType: 'application/json',
        success: function (res, status, xhr) {
            mensaje('#msjAlerta', 'Parametro del perfil', 2)
            $('#dtPerfil').DataTable().row($(`#nombreParametro-${id}`).parent()).remove().draw();


        },
        error: function (res, status, xhr) {
            const respuesta = JSON.parse(res.responseText)
            mensaje('#msjAlerta', respuesta.data.mensaje, 0);
            console.log(res)

        }
    })
}
function confirmarParametro(id) {
    if (!proxima && !ultima) {
        mensaje('#msjAlerta', 'de Proxima Visita', 5)
        return
    }
    let index = -1
    for (let i = 0; i < valores_viejos.length; i++) {
        if (valores_viejos[i].id == id) {
            index = i;
        }
    }
    if (index != -1) {
        valores_viejos.splice(index, 1);

    }
    let valor = $(`#real-${id}`).val()

    if (valor == '' || valor == undefined) {
        mensaje("#msjAlerta", "en el valor de parametro", 5)
        return
    }
    if (id_tipo_cita == 2) {
        let id_parametro = $(`#id_parametro`).text()
        if (id_visita_control == null) {
            registrarVisitaControl(id_agenda)
        }
        let parametro = {
            id_parametro: id_parametro,
            valor: valor,
            id_visita: id_visita_control,
            id_orden_servicio: id_orden_servicio
        }
        $.ajax({
            url: `https://api-sascha.herokuapp.com/parametrocliente/${id}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(parametro),

            success: function (res, status, xhr) {
                mensaje('#msjAlerta', 'Parametro del perfil', 3)

            },
            error: function (res, status, xhr) {
                const respuesta = JSON.parse(res.responseText)
                mensaje('#msjAlerta', respuesta.data.mensaje, 0);
                console.log(res)

            }
        })
    }
    $(`#editarParametro-${id}`).css('display', 'block')
    $(`#eliminarParametro-${id}`).css('display', 'block')

    $(`#confirmarParametro-${id}`).css('display', 'none')
    $(`#cancelarParametro-${id}`).css('display', 'none')

    if (document.getElementById('real-' + id)) {
        $(`#real-${id}`).prop('disabled', true)
    }
}


function perfil(id) {
    if ($(`#parametro-${id}`).attr('checked')) {
        console.log('Agregando ========>')
        let id_parametro = $(`#parametro-${id}`).attr('id').split('-')[1]
        let valor = $('#real-' + id_parametro).val();
        if (valor == '') {
            mensaje('#msjAlerta', 'para el valor del parametro', 5)
            $(`#parametro-${id}`).attr('checked', false)
            return
        }
        parametros.push(
            {
                id_parametro: Number.parseInt(id_parametro),
                id_cliente: id_cliente,
                valor: valor == undefined ? null : Number.parseInt(valor)
            }
        )
        console.log(parametros)
    } else {
        console.log('Quitando =========>')
        let index = -1
        for (let i = 0; i < parametros.length; i++) {
            if (parametros[i].id_parametro == $(`#parametro-${id}`).attr('id').split('-')[1]) {
                index = i;
            }
        }
        if (index != -1) {
            parametros.splice(index, 1)
        }
        console.log(parametros)

    }

}



function editarParametro(id) {
    if (!proxima && !ultima) {
        mensaje('#msjAlerta', 'de Proxima Visita', 5)
        return
    }
    valores_viejos.push({
        id: id,
        valor: $(`#real-${id}`).val(),
    })
    $(`#editarParametro-${id}`).css('display', 'none')
    $(`#eliminarParametro-${id}`).css('display', 'none')

    $(`#confirmarParametro-${id}`).css('display', 'inline')
    $(`#cancelarParametro-${id}`).css('display', 'inline')

    if (document.getElementById('real-' + id)) {
        $(`#real-${id}`).prop('disabled', false)
    }
}

function cancelarParametro(id) {
    let index = -1;
    for (let i = 0; i < valores_viejos.length; i++) {
        if (valores_viejos[i].id == id) {
            index = i;
            if (valores_viejos[i].valor) {
                $(`#real-${id}`).val(valores_viejos[i].valor)
                $(`#real-${id}`).prop('disabled', true)

            }
        }
    }
    if (index != -1) {
        valores_viejos.splice(index, 1)

    }
    $(`#editarParametro-${id}`).css('display', 'inline')
    $(`#eliminarParametro-${id}`).css('display', 'inline')

    $(`#confirmarParametro-${id}`).css('display', 'none')
    $(`#cancelarParametro-${id}`).css('display', 'none')

}

function agregarAlimentos(comida, grupo, id_regimen) {
    if (id_tipo_cita == 2) {
        $('#btnEditarAlimentos').show()
        $('#btnAceptarAlimentos').hide()

    }
    resetMultiSelect()
    const id = `grupo-${comida}-${grupo}`
    const nombre = document.getElementById(id).innerHTML.trim()
    const unidad = document.getElementById(`unidad-${comida}-${grupo}`).innerHTML.trim();
    const cantidad = document.getElementById(`cantidad-${comida}-${grupo}`).innerHTML.trim();

    $('#txtGrupoAlimenticioId').val(id);
    $('#txtGrupoAlimenticio').val(nombre);
    $('#grupo-unidad').text(unidad);
    $('#txtGrupoCantidad').val(cantidad);
    $('#txtIdRegimen').val(id_regimen);


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

function addRowMeta(id, tipo_parametro, parametro, valor, signo) {
    meta_registrada = true;

    let row = $(`<tr>
        <td hidden id="metaTP-${id}">${tipo_parametro}</td> 
        <td id="metaS-${id}" ><i class="fa ${signo}"></i> </td>   
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
    $('#selTipoParametroMeta').val($(`#metaTP-${id}`).text());
    let tp = $('#selTipoParametroMeta').val()
    console.log(tp)
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




function cargarAgenda() {
    let fecha_cita = $('#cita-fecha').text()
    fecha_cita = moment(fecha_cita)
    document.getElementById('selHoraCita').length = 1
    $('#calendar').fullCalendar('destroy')

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
    let id_empleado = JSON.parse(localStorage.getItem('empleado')).id_empleado;

    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: ''
        },
        defaultView: 'month',
        editable: false,
        droppable: false, // this allows things to be dropped onto the calendar !!!
        dayClick: function (date, jsEvent, view) {
            let fecha = moment(date).format('DD-MM-YYYY')
            let dia = moment(date).day()

            if (moment(date).isAfter(fecha_cita)) {
                document.getElementById('selHoraCita').length = 1
                let horario = {
                    id_empleado: id_empleado,
                    id_dia_laborable: dia
                }
                $.ajax({
                    url: `https://api-sascha.herokuapp.com/horarioporempleadoydia`,
                    contentType: 'application/json',
                    type: 'POST',
                    data: JSON.stringify(horario),
                    success: function (res, status, xhr) {
                        $('#txtFechaCita').val(fecha)
                        res.data.bloques_horarios.map(function (bloque) {
                            if (bloque.id_bloque_horario) {
                                let option = $(`<option value="${bloque.id_bloque_horario}">${bloque.hora_inicio.substr(0, 5)}-${bloque.hora_fin.substr(0, 5)}</option>`)
                                $('#selHoraCita').append(option);
                            }
                        })
                    },
                    error: function (res, status, xhr) {
                        console.log(res)
                        const respuesta = JSON.parse(res.responseText);
                        mensaje('#msjProximaVisita', respuesta.data.mensaje, 0)

                    },
                })

            } else {
                mensaje('#msjProximaVisita', 'La fecha de la visita debe ser mayor a la de la visita actual.', 14)
                $('#txtFechaCita').val('')
            }
        }

    });

    let events = [];
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

}


function registrarVisitaControl(id_agenda) {
    if (id_tipo_cita != 2) {
        return
    }

    let visita_control = {
        id_agenda: Number.parseInt(id_agenda),
        numero: realizadas,
        fecha_atencion: moment().format('YYYY-MM-DD')
    }
    console.log(visita_control)

    $.ajax({
        url: `https://api-sascha.herokuapp.com/visitascontrol`,
        type: 'POST',
        async: false,
        contentType: 'application/json',
        data: JSON.stringify(visita_control),
        success: function (res, status, xhr) {
            id_visita_control = res.data.id_visita
            console.log(res.data.mensaje)
        },
        error: function (res, status, xhr) {
            console.log(res)

        }
    })


}


function abrirAgregarParametro() {
    if (id_tipo_cita == 2) {
        if (!proxima && !ultima) {
            mensaje('#msjAlerta', 'de Proxima Visita', 5)
            return
        }
    }
    $('#agregarParametro').modal('show')
}