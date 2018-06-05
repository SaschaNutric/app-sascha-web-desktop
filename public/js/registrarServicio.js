let registrado = null;
let arregloTipoParametros = [];
$(document).ready(function () {

    //Valores seleccionados en el multiselect
    //Declaracion del multiselect de condiciones de garantia
    $('#ms_condiciones').multiSelect({
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

        },
        afterDeselect: function (values) {
            this.qs1.cache();
            this.qs2.cache();

        }
    });

    //Llena el multiselect de condiciones de garantia
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/condiciongarantias',
        contentType: 'application/json',
        type: 'GET',
        success: function (res, status, xhr) {
            res.data.map(function (condicion) {
                let option = $(`<option value="${condicion.id_condicion_garantia}">${condicion.descripcion}</option>`)
                $('#ms_condiciones').append(option);
                $('#ms_condiciones').multiSelect('refresh');
            })

        },
        error: function (res, status, xhr) {
            console.log(res)
        }
    });

    //Lena el select de especialidad
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/especialidades',
        contentType: 'application/json',
        type: 'GET',
        success: function (res, status, xhr) {
            res.data.map(function (especialidad) {
                let option = $(`<option value="${especialidad.id_especialidad}">${especialidad.nombre}</option>`)
                $('#selEspecialidad').append(option);
            })

        },
        error: function (res, status, xhr) {
            console.log(res)
        }
    });

    //Lena el select de plan de dieta
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/plandietas',
        contentType: 'application/json',
        type: 'GET',
        success: function (res, status, xhr) {
            res.data.map(function (dieta) {
                let option = $(`<option value="${dieta.id_plan_dieta}">${dieta.nombre}</option>`)
                $('#selPlanDieta').append(option);
            })

        },
        error: function (res, status, xhr) {
            console.log(res)
        }
    });

    //Lena el select de plan de ejercicios
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/planejercicios',
        contentType: 'application/json',
        type: 'GET',
        success: function (res, status, xhr) {
            res.data.map(function (planE) {
                let option = $(`<option value="${planE.id_plan_ejercicio}">${planE.nombre}</option>`)
                $('#selPlanEjercicio').append(option);
            })

        },
        error: function (res, status, xhr) {
            console.log(res)
        }
    });
    //Lena el select de plan de suplementos
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/plansuplementos',
        contentType: 'application/json',
        type: 'GET',
        success: function (res, status, xhr) {
            res.data.map(function (planS) {
                let option = $(`<option value="${planS.id_plan_suplemento}">${planS.nombre}</option>`)
                $('#selPlanSuplemento').append(option);
            })

        },
        error: function (res, status, xhr) {
            console.log(res)
        }
    });
    //Lena el select de Tipo de Parametros
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/tipoparametros',
        contentType: 'application/json',
        type: 'GET',
        success: function (res, status, xhr) {
            res.data.map(function (tipo_parametro) {
                arregloTipoParametros.push(tipo_parametro);
                let option = $(`<option value="${tipo_parametro.id_tipo_parametro}">${tipo_parametro.nombre}</option>`)
                $('#selTipoParametro').append(option);

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

    //Ocultando valor minimo y maximo 
    $('#selParametro').on('change', function () {
        const id = $('#selTipoParametro').val()
        const idP = $('#selParametro').val()
        console.log($('#selParametro').val())
        arregloTipoParametros.map(function (tipoparametro) {
            if (tipoparametro.id_tipo_parametro == id) {
                tipoparametro.parametros.map(function (parametro) {
                    if (parametro.id_parametro == idP) {
                        if (parametro.tipo_valor == 1) {
                            $('#valores').css('display', 'none')
                            $('#txtMaximo').val('')
                            $('#txtMinimo').val('')


                        } else {
                            if (parametro.tipo_valor == 2) {
                                $('#valores').css('display', 'inline')
                                $('#txtUnidadMin').text(parametro.unidad.abreviatura);
                                $('#txtUnidadMax').text(parametro.unidad.abreviatura);


                            }
                        }
                    }
                })
            }
        })

    })


    //Busqueda del id del servicio a editar
    var paramstr = window.location.search.substr(1);
    var paramarr = paramstr.split("=");
    var params = {};
    params[paramarr[0]] = paramarr[1];
    const id = params['id'];
    let oldServicio = {};

    //Lena el formulario con informacion del servicio a editar
    if (id != undefined) {
        $('#btnGuardar').css('display', 'inline');
        $('#btnRegistrar').css('display', 'none');
        

        $('#btnGuardarCondicion').css('display', 'none');
        $('#btnEditarCondicion').css('display', 'inline');

        $('#ms_condiciones').empty()
        $('#ms_condiciones').multiSelect('refresh');

        $('#selPlanDieta').prop('disabled',true)
        $('#selPlanEjercicio').prop('disabled',true)
        $('#selPlanSuplemento').prop('disabled',true)
        

        $.ajax({
            url: 'https://api-sascha.herokuapp.com/servicio/' + id,
            contentType: 'application/json',
            type: 'GET',
            success: function (res, status, xhr) {
                let servicio = res.data;
                oldServicio = servicio;
                registrado = servicio.id_servicio;
                $('#txtNombre').val(servicio.nombre);
                $('#txtDescripcion').val(servicio.descripcion);
                $('#txtPrecio').val(servicio.precio);
                $('#selPlanDieta').val(servicio.plan_dieta.id_plan_dieta);
                if (servicio.plan_suplemento != null) {
                    $('#selPlanSuplemento').val(servicio.plan_suplemento.id_plan_suplemento);
                }
                if (servicio.plan_ejercicio != null) {
                    $('#selPlanEjercicio').val(servicio.plan_ejercicio.id_plan_ejercicio);
                }
                $('#txtDuracion').val(servicio.numero_visitas);
                $('#selEspecialidad').val(servicio.especialidad.id_especialidad);
                $('#imgServicio').attr("src", servicio.url_imagen);

                servicio.parametros.map(function (parametro) {
                    addRowParametro(parametro.id_parametro_servicio, parametro.nombre, parametro)
                })
                let options = []
                servicio.condiciones_garantia.map(function (condicion) {
                    options.push(condicion.id_condicion_garantia.toString());
                })
                console.log(options)
                $('#ms_condiciones').multiSelect('select', options);


            },
            error: function (res, status, xhr) {
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
            }
        });



    }


    //Inicializa la tabla de parametros
    const tablaParametro = $('#dtParametros').DataTable({
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

    function validate() {
        let validate = true;
        let servicio = {
            nombre: $('#txtNombre').val(),
            descripcion: $('#txtDescripcion').val(),
            precio: $('#txtPrecio').val(),
            planDieta: $('#selPlanDieta').val(),
            especialidad: $('#selEspecialidad').val(),
            duracion: $('#txtDuracion').val()
        }

        if (servicio.nombre == '' || servicio.descripcion == '' || servicio.planDieta == 0 || servicio.especialidad == 0 || servicio.duracion == '') {
            validate = false;
        }

        return validate;
    }

    //Agregar nuevo servicio
    $('#btnRegistrar').on('click', function () {

        if (!validate()) {
            console.log($('#ms_condiciones').val())
            mensaje('#msjAlerta', '', 5);
            return;
        }
        let servicio = {
            nombre: $('#txtNombre').val(),
            descripcion: $('#txtDescripcion').val(),
            precio: $('#txtPrecio').val(),
            id_plan_dieta: $('#selPlanDieta').val(),
            id_plan_ejercicio: $('#selPlanEjercicio').val(),
            id_plan_suplemento: $('#selPlanSuplemento').val(),
            id_especialidad: $('#selEspecialidad').val(),
            numero_visitas: $('#txtDuracion').val()

        }


        var file_data = $("#fileServicio").prop("files")[0];   // Getting the properties of file from file field
        var form_data = new FormData();                  // Creating object of FormData class
        form_data.append('nombre', servicio.nombre);
        form_data.append('descripcion', servicio.descripcion);
        form_data.append('precio', servicio.precio);
        form_data.append('id_plan_dieta', servicio.id_plan_dieta);
        if (servicio.id_plan_suplemento != "null") {
            form_data.append('id_plan_suplemento', servicio.id_plan_suplemento);
        }
        if (servicio.id_plan_ejercicio != "null") {
            form_data.append('id_plan_ejercicio', servicio.id_plan_ejercicio);
        }
        form_data.append('id_especialidad', servicio.id_especialidad);
        form_data.append('numero_visitas', servicio.numero_visitas);
        form_data.append('imagen', file_data);

        $.ajax({
            url: "https://api-sascha.herokuapp.com/servicios",
            cache: false,
            contentType: false,
            processData: false,
            method: 'POST',
            type: 'POST',
            data: form_data,                         // Setting the data attribute of ajax with file_data
            success: function (res, status, xhr) {
                const serv = res.data;
                console.log(res.data)
                $('#btnRegistrar').css('display', 'none')
                $('#btnCancelarServ').text('Cerrar')

                registrado = res.data.data.id_servicio;
                mensaje('#msjAlerta', 'Servicio', 1);
            },
            error: function (res, status, xhr) {
                console.log(res);
                console.log(status);
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
            }
        })
    });

    //Editar servicio existente
    $('#btnGuardar').on('click', function () {
        if (!validate()) {
            mensaje('#msjAlerta', '', 5);
            return;
        }
        let servicio = {
            nombre: $('#txtNombre').val(),
            descripcion: $('#txtDescripcion').val(),
            precio: $('#txtPrecio').val(),
            id_plan_dieta: $('#selPlanDieta').val() == 'null' ? null : $('#selPlanDieta').val(),
            id_plan_ejercicio: $('#selPlanEjercicio').val() == 'null' ? null : $('#selPlanEjercicio').val(),
            id_plan_suplemento: $('#selPlanSuplemento').val() == 'null' ? null : $('#selPlanSuplemento').val(),
            id_especialidad: $('#selEspecialidad').val() == 'null' ? null : $('#selEspecialidad').val(),
            numero_visitas: $('#txtDuracion').val(),

        }

        const div = document.getElementsByClassName('fileupload-preview')[0]
        let url_imagen = ''
        if (div.firstChild != null) {
            url_imagen = div.firstChild.src
        }

        console.log(servicio)
        if (oldServicio.nombre == servicio.nombre && oldServicio.descripcion == servicio.descripcion && oldServicio.plan_dieta.id_plan_dieta == servicio.id_plan_dieta && oldServicio.plan_suplemento.id_plan_suplemento == servicio.id_plan_suplemento && oldServicio.plan_ejercicio.id_plan_ejercicio == servicio.id_plan_ejercicio && oldServicio.especialidad.id_especialidad == servicio.id_especialidad && oldServicio.numero_visitas == servicio.numero_visitas && url_imagen == '') {
            mensaje('#msjAlerta', '', 4);
            return;

        }
        console.log(servicio)
        var file_data = $("#fileServicio").prop("files")[0];   // Getting the properties of file from file field
        var form_data = new FormData();                  // Creating object of FormData class
        form_data.append('nombre', servicio.nombre);
        form_data.append('descripcion', servicio.descripcion);
        form_data.append('precio', servicio.precio);
        form_data.append('id_plan_dieta', servicio.id_plan_dieta);
        form_data.append('id_plan_suplemento', servicio.id_plan_suplemento);
        form_data.append('id_plan_ejercicio', servicio.id_plan_ejercicio);
        form_data.append('id_especialidad', servicio.id_especialidad);
        form_data.append('numero_visitas', servicio.numero_visitas);
        if (url_imagen != '') {
            form_data.append('imagen', file_data);
        }

        $.ajax({
            url: "https://api-sascha.herokuapp.com/servicio/" + id,
            cache: false,
            contentType: false,
            processData: false,
            method: 'PUT',
            type: 'PUT',
            data: form_data,                         // Setting the data attribute of ajax with file_data
            success: function (res, status, xhr) {
                console.log(res)
                verServicios()
            },
            error: function (res, status, xhr) {
                console.log(res);
                console.log(status);
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
            }
        })



    });
    //Abrir modal parametro
    $('#agregarParametro').on('click', function () {
        if (registrado == null) {
            mensaje('#msjAlerta', 'Servicio', 7);
            return;
        }
        $('#modalParametro').modal('show');

    });

    //Agregar Parametro
    $('#btn-regis').on('click', function () {
        let vm = vM = null;
        if ($('#txtMaximo').val() != '') {
            vM = $('#txtMaximo').val();
        }
        if ($('#txtMinimo').val() != '') {
            vm = $('#txtMinimo').val();
        }

        if (vm != null && vM != null) {
            if (vM <= vm) {
                mensaje('#msjParametro', 'de valores', 6)
                return;
            }

        }

        let parametro_servicio = {
            id_servicio: registrado,
            id_parametro: $('#selParametro').val(),
            valor_minimo: vm,
            valor_maximo: vM
        }


        $.ajax({
            url: "https://api-sascha.herokuapp.com/parametroservicios",
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(parametro_servicio),                         // Setting the data attribute of ajax with file_data
            success: function (res, status, xhr) {
                console.log(res)
                const serv = res.data;
                const nombre_parametro = $('select[name="parametro"] option:selected').text();
                addRowParametro(serv.id_parametro_servicio, nombre_parametro, parametro_servicio);
                mensaje('#msjAlerta', 'Característica', 1);
                $('#modalParametro').modal('hide');
                limpiarModalParametro();
            },
            error: function (res, status, xhr) {
                console.log(res);
                console.log(status);
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
            }
        })

    })


    $('#btnGuardarCondicion').on('click', function () {
        if (registrado == null) {
            mensaje('#msjAlerta', 'Servicio', 7);
            return;
        }
        if ($('#ms_condiciones').val() == null) {
            mensaje('#msjAlerta', '', 5);
            return
        }
        let condiciones = []
        const valores = $('#ms_condiciones').val()
        valores.map(function (id) {
            condiciones.push({
                id_condicion_garantia: id
            })

        })
        const data = {
            condiciones: condiciones,
            id_servicio: registrado
        }
        console.log(data)
        $.ajax({
            url: "https://api-sascha.herokuapp.com/garantias",
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(data),                         // Setting the data attribute of ajax with file_data
            success: function (res, status, xhr) {
                console.log(res)
                mensaje('#msjAlerta', 'Garantia', 1);
                $('#btnGuardarCondicion').prop('disabled', true)
            },
            error: function (res, status, xhr) {
                console.log(res);
                console.log(status);
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
            }
        })
    })



    $('#btnEditarCondicion').on('click', function () {
        if (registrado == null) {
            mensaje('#msjAlerta', 'Servicio', 7);
            return;
        }
        if ($('#ms_condiciones').val() == null) {
            mensaje('#msjAlerta', '', 5);
            return
        }
        let condiciones = []
        const valores = $('#ms_condiciones').val()
        valores.map(function (id) {
            condiciones.push({
                id_condicion_garantia: id
            })

        })
        const data = {
            condiciones: condiciones,
        }
        console.log(data)
        $.ajax({
            url: `https://api-sascha.herokuapp.com/servicio/${registrado}/garantias`,
            contentType: 'application/json',
            type: 'PUT',
            data: JSON.stringify(data),                         // Setting the data attribute of ajax with file_data
            success: function (res, status, xhr) {
                console.log(res)
                mensaje('#msjAlerta', 'Garantia', 1);
                $('#btnEditarCondicion').prop('disabled', true)
            },
            error: function (res, status, xhr) {
                console.log(res);
                console.log(status);
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
            }
        })
    })


});

function verServicios() {
    window.location = 'conf_servicios.html';
}
function limpiarModalParametro() {
    $('#txtMaximo').val('');
    $('#txtMinimo').val('');
    $('#selTipoParametro option:contains(Seleccione)').prop('selected', true);
    document.getElementById('selParametro').length = 1;
    $('#valores').css('display', 'none');

}



function addRowParametro(id, nombre_parametro, ps) {
    let vm = ps.valor_minimo;
    let vM = ps.valor_maximo;
    if (vm == null) {
        vm = 'N/A'
    }
    if (vM == null) {
        vM = 'N/A'
    }

    let row = $(`<tr>
    <td id="parametro-${id}">${nombre_parametro}</td>
    <td id="minimo-${id}">${vm}</td>
    <td id="maximo-${id}">${vM}</td>
    <td>
    <button onclick="abrirModalEliminarParametro(${id})" type='button' class='ver btn  btn-stransparent' data-toggle='modal' data-target="#eliminarParametro" title='Eliminar'><i class="fa fa-trash-o"></i></button>
    </td>
    </tr>
    `);
    $('#dtParametros').DataTable().row.add(row).draw();

}

function abrirModalEliminarParametro(id) {
    $('#txtIdParametroEliminar').val(id);
}

function eliminarParametro(id) {
    $.ajax({
        url: `https://api-sascha.herokuapp.com/parametroservicio/${id}`,
        contentType: 'application/json',
        type: 'DELETE',
        success: function (res, status, xhr) {
            console.log(res);
            console.log(status);
            $('#dtParametros').DataTable().row($(`#parametro-${id}`).parent()).remove().draw();
            $('#txtIdParametroEliminar').val('');
            mensaje('#msjAlerta', `Parametro`, 2);

        },
        error: function (res, status, xhr) {
            console.log(res);
            console.log(status);
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
        }
    })
}