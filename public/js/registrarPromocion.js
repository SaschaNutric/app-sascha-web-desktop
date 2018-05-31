let registrado = null;

   //Busqueda del id de la promocion a editar
   var paramstr = window.location.search.substr(1);
   var paramarr = paramstr.split("?");
   let prueba = {}
   paramarr.map(function(param){
    let p = param.split('=')
    prueba[p[0]] = p[1]
   })
   const id = prueba['id'];
   const url = prueba['url'];
   let oldPromocion = {};

$(document).ready(function() {
    const tablaparametros = $('#dtParametros').DataTable({
        "language": {
            "lengthMenu": "",
            "search": "Buscar:",
            "paginate": {
                "previous": "Anterior",
                "next": "Siguiente"
            },
            "emptyTable": "No se encontraron Ofertas y Promociones",
            "zeroRecords": "No se encontraron Ofertas y Promociones"
        },
        "searching": true,
        "ordering": true,
        "paging": true
    });

    
//////////////////TAP DE INFORMACION BASICA/////////////////

    // Carga el Combo del servicio
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/servicios',
        contentType: 'application/json',
        type: 'GET',
        async: false,
        success: function (res, status, xhr) {
            res.data.map(function (servicio) {
                let option = $(`<option value="${servicio.id_servicio}">${servicio.nombre}</option>`)
                $('#selServicios').append(option);

            })
        },
        error: function (res, status, xhr) {
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);

        }
    })

// Carga el Combo del Estado civil
$.ajax({
    url: 'https://api-sascha.herokuapp.com/estadociviles',
    contentType: 'application/json',
    type: 'GET',
    success: function(res, status, xhr) {
        res.data.map(function(estado_civil) {
            let option = $(`<option value="${estado_civil.id_estado_civil}">${estado_civil.nombre}</option>`)
            $('#selEstadoCivil').append(option);
            
        })

    },
    error: function(res, status, xhr) {
        const respuesta = JSON.parse(res.responseText);
        mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
        
    }
})
// Carga el Combo del Rango de Edad
$.ajax({
    url: 'https://api-sascha.herokuapp.com/rangoedades',
    contentType: 'application/json',
    type: 'GET',
    async: false,
    success: function(res, status, xhr) {
        res.data.map(function(rango_edad) {
            let option = $(`<option value="${rango_edad.id_rango_edad}">${rango_edad.nombre}</option>`)
            $('#selRangoEdad').append(option);
            
        })

    },
    error: function(res, status, xhr) {
        const respuesta = JSON.parse(res.responseText);
        mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
        
    }
})
 
// Carga el Combo del Genero
$.ajax({
    url: 'https://api-sascha.herokuapp.com/generos',
    contentType: 'application/json',
    type: 'GET',
    success: function(res, status, xhr) {
        res.data.map(function(genero) {
            let option = $(`<option value="${genero.id_genero}">${genero.nombre}</option>`)
            $('#selGenero').append(option);
            
        })

    },
    error: function(res, status, xhr) {
        const respuesta = JSON.parse(res.responseText);
        mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
        
    }
})


 

    //Llena el formulario con informacion de la a editar
    if (id != undefined) {
        $('#btnGuardar').css('display', 'inline');
        $('#btnRegistrar').css('display', 'none');

        $.ajax({
            url: 'https://api-sascha.herokuapp.com/promocion/' + id,
            contentType: 'application/json',
            type: 'GET',
            async: false,
            success: function (res, status, xhr) {
                let promocion = res.data;
                registrado = promocion.id_promocion;
                $('#txtNombrePromo').val(promocion.nombre);
                $('#selServicios').val(promocion.id_servicio);
                console.log('serv: ' + promocion.id_servicio)
                $('#txtDescripcionPromo').val(promocion.descripcion);
                $('#txtDescuento').val(promocion.descuento);
                $('#dpValidoDesde').val(promocion.valido_desde);
                $('#dpValidoHasta').val(promocion.valido_hasta);
                $('#selselEstadoCivil').val(promocion.id_estado_civil);
                $('#selRangoEdad').val(promocion.id_rango_edad);
                $('#selGenero').val(promocion.id_genero);
                $('#imgPromocion').attr("src", promocion.url_imagen);
                promocion.parametros.map(function(parametro){
                    addRowParametro(parametro.id_parametro_promocion, parametro.nombre, parametro)
                })
            },
            
            error: function (res, status, xhr) {
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
            }
        });

        $('#btnGuardar').on('click', function () {
            if (!validate()) {
                mensaje('#msjAlerta', '', 5);
                return;
            }
            let promocion = {
                nombre: $('#txtNombrePromo').val(),
                id_servicio: $('#selServicios').val()== 'null' ? null : $('#selServicios').val(),
                descripcion: $('#txtDescripcionPromo').val(),
                descuento: $('#txtDescuento').val(),
                valido_desde: moment($('#dpValidoDesde').val()).format('YYYY-MM-DD'),
                valido_hasta: moment($('#dpValidoHasta').val(),'DD-MM-YYYY').format('YYYY-MM-DD'),
                id_estado_civil: $('#selEstadoCivil').val()=='null'? null : $('#selEstadoCivil').val(),
                id_rango_edad:$('#selRangoEdad').val()== 'null' ? null : $('#selRangoEdad').val(),
                id_genero: $('#selGenero').val()== 'null' ? null : $('#selGenero').val(),
            }
            const div = document.getElementsByClassName('fileupload-preview')[0]
            let url_imagen = ''
            if (div.firstChild != null) {
                url_imagen = div.firstChild.src
            }
           // console.log(promocion)
        if (oldPromocion.nombre == promocion.nombre && oldPromocion.servicio == promocion.servicio && oldPromocion.descripcion == promocion.descripcion && oldPromocion.descuento == promocion.descuento && oldPromocion.valido_desde == promocion.valido_desde && oldPromocion.valido_hasta == promocion.valido_hasta && oldPromocion.estado_civil == promocion.estado_civil && oldPromocion.rango_edad == promocion.rango_edad && oldPromocion.genero == promocion.genero && url_imagen == '') {
            mensaje('#msjAlerta', '', 4);
            return;

        }
        
        var file_data = $("#filePromocion").prop("files")[0];   // Getting the properties of file from file field
        var form_data = new FormData();                  // Creating object of FormData class
        form_data.append('nombre', promocion.nombre);
        form_data.append('id_servicio', promocion.id_servicio);
        form_data.append('descripcion', promocion.descripcion);
        form_data.append('descuento', promocion.descuento);
        form_data.append('valido_desde', promocion.valido_desde);
        form_data.append('valido_hasta', promocion.valido_hasta);
        form_data.append('estato_civil', promocion.estado_civil);
        form_data.append('rango_edad', promocion.rango_edad);
        form_data.append('genero', promocion.genero);
        if (url_imagen != '') {
            form_data.append('imagen', file_data);
        }
        console.log(promocion)

            $.ajax({
                url: "https://api-sascha.herokuapp.com/promocion/" + id,
                cache: false,
                contentType: false,
                processData: false,
                method: 'PUT',
                type: 'PUT',
                data: form_data,    
                success: function (res, status, xhr) {
                    console.log(res.data)
                    limpiarCampos();
                
                },
                error: function (res, status, xhr) {
                    const respuesta = JSON.parse(res.responseText);
                    mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
                }
            })

        });
    }     
     
   
//Agregar nuevo promocion
//if (id != undefined) {
  //  $('#btnGuardar').css('display', 'none');
  //  $('#btnRegistrar').css('display', 'none');
   // $('#btnCerrar')

$('#btnRegistrar').on('click', function () {

    if (!validate()) {
        mensaje('#msjAlerta', '', 5);
        return;
    }

    const valido_desde = $('#dpValidoDesde').val();
    const valido_hasta = $('#dpValidoHasta').val();
    let promocion = {
        nombre: $('#txtNombrePromo').val(),
        descripcion: $('#txtDescripcionPromo').val(),
        descuento: $('#txtDescuento').val(),
        id_servicio: $('#selServicios').val(),
        id_rango_edad: $('#selRangoEdad').val(),
        id_genero: $('#selGenero').val(),
        id_estado_civil: $('#selEstadoCivil').val(),
        valido_desde: valido_desde.split("-").reverse().join("-"),
        valido_hasta: valido_hasta.split("-").reverse().join("-"),

    }

    console.log(promocion)
    var file_data = $("#filePromocion").prop("files")[0];   // Getting the properties of file from file field
    var form_data = new FormData();                  // Creating object of FormData class
    form_data.append('nombre', promocion.nombre);
    form_data.append('descripcion', promocion.descripcion);
    form_data.append('descuento', promocion.descuento);
    form_data.append('id_servicio', promocion.id_servicio);
    form_data.append('valido_desde', promocion.valido_desde);
    form_data.append('valido_hasta', promocion.valido_hasta);
    if (promocion.id_estado_civil != "null") {
        form_data.append('id_estado_civil', promocion.id_estado_civil);
    }
    if (promocion.id_rango_edad != "null") {
        form_data.append('id_rango_edad', promocion.id_rango_edad);
    }
    if (promocion.id_genero != "null") {
        form_data.append('id_genero', promocion.id_genero);
    }
    form_data.append('imagen', file_data);

    $.ajax({
        url: "https://api-sascha.herokuapp.com/promociones",
        cache: false,
        contentType: false,
        processData: false,
        method: 'POST',
        type: 'POST',
        data: form_data,                         // Setting the data attribute of ajax with file_data
        success: function (res, status, xhr) {
            console.log(res)
            const serv = res.data;
            registrado = serv.id_promocion;
            mensaje('#msjAlerta', 'Servicio', 1);
            limpiarCampos();
        },
        error: function (res, status, xhr) {
            console.log(res);
            console.log(status);
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
        }
    })
});


});


function verpromocion(){
    
    window.location= url;
}


function limpiarCampos() {
    $('#txtNombrePromo').val('');
    $('#txtDescripcionPromo').val('');
    $('#txtDescuento').val('');
    document.getElementById("selServicios").length=1;
    document.getElementById("selEstadoCivil").length=1;
    document.getElementById("selRangoEdad").length=1;
    document.getElementById("selGenero").length=1;
    $('#dpValidoDesde').val('');
    $('#dpValidoHasta').val('');
    $('#imgPromocion').attr('src', 'http://www.placehold.it/400x300/EFEFEF/AAAAAA&amp;text=Agregar+imagen');
   
}

//////////////////TAP DE CARACTERISTICAS//////////////////


/// empieza el modal de Registar Tipo de parametro segun un parametro 

let arregloTipoParametros = [];
$(document).ready(function () {

 
    
    //Llena el select de Tipo de Parametros 
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
                tipoparametro.parametros.map(function (parametro_promo) {
                    let option = $(`<option value="${parametro_promo.id_parametro}">${parametro_promo.nombre}</option>`)
                    $('#selParametro').append(option);
                })
            }
        })

    })
    //Ocultando valor minimo y maximo 
    $('#selParametro').on('change', function () {
        const id = $('#selTipoParametro').val()
        const idP = $('#selParametro').val()

        arregloTipoParametros.map(function (tipoparametro) {
            if (tipoparametro.id_tipo_parametro == id) {
                tipoparametro.parametros.map(function (parametro_promo) {
                    if (parametro_promo.id_parametro == idP) {
                        console.log(parametro_promo)
                        if (parametro_promo.tipo_valor == 1) {
                            $('#valores').css('display', 'none')
                            $('#txtMaximo').val('')
                            $('#txtMinimo').val('')


                        } else {
                            if (parametro_promo.tipo_valor == 2) {
                                $('#valores').css('display', 'inline')
                                $('#txtUnidadMin').text(parametro_promo.unidad.abreviatura);
                                $('#txtUnidadMax').text(parametro_promo.unidad.abreviatura);


                            }
                        }
                    }
                })
            }
        })

    })
//Abrir modal parametro
$('#agregarParametroPromo').on('click', function () {
    if (registrado = null) { // para probar sin la validacion hay que agregar "!"
        mensaje('#msjAlerta', 'Servicio', 7);
        return;
    }
    $('#modalParametroPromo').modal('show');

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
            mensaje('#msjAlerta', '', 6)
            return;
        }

    }

    let parametro_promo = {
        id_promocion: registrado,
        id_parametro: $('#selParametro').val(),
        valor_minimo: vm,
        valor_maximo: vM
    }


    $.ajax({
        url: "https://api-sascha.herokuapp.com/parametropromociones",
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify(parametro_promo),          // Setting the data attribute of ajax with file_data
        success: function (res, status, xhr) {
            console.log(res)
            const promo = res.data;
        const nombre_parametro = $('select[name="parametro"] option:selected').text()
            
            addRowParametro(promo.id_parametro_promocion,nombre_parametro, parametro_promo );
            mensaje('#msjAlerta', 'Característica', 1);
            $('#modalParametroPromo').modal('hide');
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

});


function limpiarModalParametro() {
    $('#txtMaximo').val('');
    $('#txtMinimo').val('');
    $('#selTipoParametro option:contains(Seleccione)').prop('selected', true);
    document.getElementById('selParametro').length = 1;
    $('#valores').css('display', 'none');

}

function abrirModalEliminarParametro(id) {
    $('#txtIdEliminarParametro').val(id);
}

function eliminarParametro(id) {
    $.ajax({
        url: `https://api-sascha.herokuapp.com/parametropromocion/${id}`,
        contentType: 'application/json',
        type: 'DELETE',
        success: function (res, status, xhr) {
            $('#dtParametros').DataTable().row($(`#parametro-${id}`).parent()).remove().draw();
            $('#txtIdEliminarParametro').val('');
            mensaje('#msjAlerta', `Parametro`, 2);

        },
        error: function (res, status, xhr) {
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
        }
    })
}

//////////////////////////////////////////////////////////



function addRowParametro(id, nombre_parametro, ps){
    let vm = ps.valor_minimo;
    let vM = ps.valor_maximo;
    if(vm == null ){
        vm = 'N/A'
    }
    if(vM == null){
        vM = 'N/A'
    }
    let row = $(`<tr>
    <td id="parametro-${id}">${nombre_parametro}</td>
    <td id="minimo-${id}">${vm}</td>
    <td id="maximo-${id}">${vM}</td>
    <td>
    <button onclick="abrirModalEliminarParametro(${id})" type='button' class='ver btn  btn-stransparent' data-toggle='modal' data-target="#modal-confirmar" title='Eliminar'><i class="fa fa-trash-o"></i></button>
    </td>
    </tr>
    `);
$('#dtParametros').DataTable().row.add(row).draw();

}
//date picker start

$(function(){
    window.prettyPrint && prettyPrint();
    $('.default-date-picker').datepicker({
        format: 'mm-dd-yyyy'
    });
    $('.dpYears').datepicker();
    $('.dpMonths').datepicker();


    var startDate = new Date(2012,1,20);
    var endDate = new Date(2012,1,25);
    $('.dp4').datepicker()
        .on('changeDate', function(ev){
            if (ev.date.valueOf() > endDate.valueOf()){
                $('.alert').show().find('strong').text('The start date can not be greater then the end date');
            } else {
                $('.alert').hide();
                startDate = new Date(ev.date);
                $('#startDate').text($('.dp4').data('date'));
            }
            $('.dp4').datepicker('hide');
        });
    $('.dp5').datepicker()
        .on('changeDate', function(ev){
            if (ev.date.valueOf() < startDate.valueOf()){
                $('.alert').show().find('strong').text('The end date can not be less then the start date');
            } else {
                $('.alert').hide();
                endDate = new Date(ev.date);
                $('.endDate').text($('.dp5').data('date'));
            }
            $('.dp5').datepicker('hide');
        });

    // disabling dates
    var nowTemp = new Date();
    var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);

    var checkin = $('.dpd1').datepicker({
        onRender: function(date) {
            return date.valueOf() < now.valueOf() ? 'disabled' : '';
        }
    }).on('changeDate', function(ev) {
            if (ev.date.valueOf() > checkout.date.valueOf()) {
                var newDate = new Date(ev.date)
                newDate.setDate(newDate.getDate() + 1);
                checkout.setValue(newDate);
            }
            checkin.hide();
            $('.dpd2')[0].focus();
        }).data('datepicker');
    var checkout = $('.dpd2').datepicker({
        onRender: function(date) {
            return date.valueOf() <= checkin.date.valueOf() ? 'disabled' : '';
        }
    }).on('changeDate', function(ev) {
            checkout.hide();
        }).data('datepicker');
});

//date picker end
//datetime picker start
