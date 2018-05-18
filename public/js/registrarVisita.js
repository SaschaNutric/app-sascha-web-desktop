
$(document).ready(function () {
    
    
    var paramstr = window.location.search.substr(1);
    var paramarr = paramstr.split("=");
    var params = {};
    params[paramarr[0]] = paramarr[1];
    const id = 14 // params['id'];

    
    $('#dtPerfil').dataTable({
        "aoColumnDefs": [
            { "bSortable": false, "aTargets": [3] }
        ],
        "sDom": "ftp",
        "oLanguage": {
            "sLengthMenu": "",
            "sSearch": "Buscar:",
            "oPaginate": {
                "sPrevious": "Anterior",
                "sNext": "Siguiente"
            },
            "sEmptyTable": "No se encontraron parametros"
        },
    });


    $('txtHoraCita').timepicker()


    if (id == undefined) {
        $('#info-visita').css('display', 'none');
        $('#error-info-visita').css('display', 'block');
    } else {
        $.ajax({
            url: `https://api-sascha.herokuapp.com/agenda/${id}`,
            type: 'GET',
            contentType: 'application/json',
            beforeSend: function () {
                $('#loadingDiv').show();
                $('#info-visita').css('display', 'none');

            },
            success: function (res, status, xhr) {
                let agenda = res.data;
                let cliente = agenda.cliente;
                console.log(cliente)
                let orden = agenda.orden_servicio;
                let servicio = orden.servicio;
                let meta = orden.meta;
                let perfil = cliente.perfil;
                let plan_dieta = servicio.plan_dieta;
                let plan_suplemento = servicio.plan_suplemento;
                let plan_ejercicio = servicio.plan_ejercicio;
                
                //Datos de la cita
                moment.locale('es')
                let fecha = moment(agenda.fecha);
                $('#cita-fecha').text(fecha.format('DD, MMMM  YYYY'));
                $('#tipo-cita').text(agenda.tipo_cita);
            
                //Datos del cliente 
                $('#cliente-nombre').text(cliente.nombre_completo);
                $('#cliente-telefono').text(cliente.telefono);
                $('#cliente-edad').text(cliente.edad);
                $('#cliente-direccion').text(cliente.direccion);

                //Datos del servicio
                let realizadas=  orden.visitas_realizadas+1
                $('#servicio-nombre').text(servicio.nombre);
                $('#servicio-avance-barra').css('width', calcularAvance(realizadas, servicio.numero_visitas));
                $('#servicio-avance-texto').text(realizadas+' de '+ servicio.numero_visitas + " visitas");
                
                $('#servicio-plan-dieta').text(plan_dieta.nombre)
                $('#servicio-plan-ejercicio').text(plan_ejercicio.nombre == null? 'No incluye' : plan_ejercicio.nombre)
                $('#servicio-plan-suplemento').text(plan_suplemento.nombre == null? 'No incluye': plan_suplemento.nombre)
                

            },
            error: function (res, status, xhr) {

            },
            complete: function () {
                $('#loadingDiv').hide();
                $('#info-visita').css('display', 'block'); 
            }
        })

    }

});




var alimentos = ["Carne", "Pollo", "Pescado", "Huevo", "Atún"];
var sel = document.getElementById('ms_alimentos');
for (var i = 0; i < alimentos.length; i++) {
    var opt = document.createElement('option');
    opt.innerHTML = alimentos[i];
    opt.value = alimentos[i];
    sel.appendChild(opt);
}


var tipo_parametro = ["Antropometrico", "Patologia", "Examen", "Condicion", "Actividad Fisica", "Alergia", "Medicamento"];
var parametro = ["Peso", "Diabetes", "Glicemia", "Fumador", "Yoga", "Maní", "Eutirox"];
var tablaDieta = document.getElementById('dtPerfil');
var sel = document.getElementById('cmbTipoParametro');
for (var i = 0; i < tipo_parametro.length; i++) {
    var opt = document.createElement('option');
    opt.innerHTML = tipo_parametro[i];
    opt.value = tipo_parametro[i];
    sel.appendChild(opt);


}



var plan = ["Desayuno", "Almuerzo", "Merienda", "Cena"];
var sel = document.getElementById('comidas');
var grupos = ["proteinas", "grasas", "frutas"];
var cantidades = ["250g", "100g", "2 unidades"];

for (var i = 0; i < plan.length; i++) {
    //creando el panel
    var panel = document.createElement('section');
    panel.setAttribute('id', 'comida-' + i);
    panel.className = 'panel';
    //creando el header del panel
    var panelHeading = document.createElement('header');
    panelHeading.className = 'panel-heading';
    panelHeading.innerHTML = plan[i];
    panelCollapsible(panelHeading);
    panel.appendChild(panelHeading);
    //creando el body del panel
    var panelBody = document.createElement('div');
    panelBody.className = 'panel-body';
    panelBody.style.display = 'none';
    crearTabla(i, grupos, cantidades, panelBody);
    panel.appendChild(panelBody);


    //agregando elementos al panel
    sel.appendChild(panel);
}


function expandir(id) {
    var child = id.firstChild;
    var parent = id.parentElement;
    if ($(child).hasClass('fa-plus')) {
        $(child).removeClass('fa-plus').addClass('fa-minus');


    } else {
        $(child).removeClass('fa-minus').addClass('fa-plus');
    }
    console.log(child);

}
function crearTabla(id, grupos, cantidades, body) {
    var tabla = document.createElement('table');
    tabla.className = 'display table table-bordered table-striped';
    tabla.id = "comida" + id;
    tabla.innerHTML = "<thead>"
        + "<tr>"
        + "<th class='hidden-phone' width='25%'>Grupo Alimenticio</th>"
        + "<th class='hidden-phone' width='15%'>Cantidad</th>"
        + "<th class='hidden-phone' width='50%'>Alimentos</th>"
        + "<th class='hidden-phone' width='10%'>Editar</th>"
        + "</tr>"
        + "</thead>";
    for (var i = 0; i < grupos.length; i++) {
        var x = tabla.insertRow(1);
        var grupo = x.insertCell(0);
        var cant = x.insertCell(1);
        var alim = x.insertCell(2);
        var editar = x.insertCell(3);


        editar.innerHTML = "<a id='btn" + i + tabla.id + "'  class='btn btn-white' data-toggle='modal' href='#agregarAlimentos' ><i class='fa fa-pencil'/></a>";
        grupo.innerHTML = grupos[i];
        cant.innerHTML = cantidades[i];
        for (var j = 0; j < alimentos.length; j++) {
            alim.innerHTML += alimentos[j] + ', ';
        }

    }

    body.appendChild(tabla);



}


var tablaS = document.getElementById('dtSuplementos');
var suplementos = ['Vitamina C', 'Vitamina B12', 'Calcio'];
var f = ['1 vez al dia', '2 veces al dia', '3 veces al dia'];

//llenar la tabla de suplementos
for (var i = 0; i < suplementos.length; i++) {
    var row = tablaS.insertRow(1);
    var suplemento = row.insertCell(0);
    var cant = row.insertCell(1);
    var frecuencia = row.insertCell(2);

    suplemento.innerHTML = suplementos[i];
    cant.innerHTML = "<input type='number' class='form-control' id='txtSuplementos" + i + "'/>";
    frecuencia.innerHTML = "<select class='form-control' id='cmbFrecuenciaS" + i + "'></select>";

    var cmb = document.getElementById('cmbFrecuenciaS' + i);
    for (var j = 0; j < f.length; j++) {
        var optS = document.createElement('option');
        optS.innerHTML = f[j];
        cmb.appendChild(optS);
    }
}
//llenar la tabla de ejercicios

var tablaE = document.getElementById('dtEjercicios');
var ejercicios = ['Cardio', 'Pesas', 'Estiramiento'];
for (var k = 0; k < ejercicios.length; k++) {
    var row = tablaE.insertRow(1);
    var ejercicio = row.insertCell(0);
    var cant = row.insertCell(1);
    var frecuencia = row.insertCell(2);

    ejercicio.innerHTML = ejercicios[k];
    cant.innerHTML = "<input type='number' class='form-control' id='txtSuplementos" + k + "'/>";
    frecuencia.innerHTML = "<select class='form-control' id='cmbFrecuenciaE" + k + "'></select>";

    var cmbE = document.getElementById('cmbFrecuenciaE' + k);
    for (var p = 0; p < f.length; p++) {
        var optE = document.createElement('option');
        optE.innerHTML = f[p];
        cmbE.appendChild(optE);
    }
}


$(document).on('click', '#hidden-table-info tbody td img', function () {
    var nTr = $(this).parents('tr')[0];
    if (oTable.fnIsOpen(nTr)) {
        /* This row is already open - close it */
        this.src = "images/details_open.png";
        oTable.fnClose(nTr);
    }
    else {
        /* Open this row */
        this.src = "images/details_close.png";
        oTable.fnOpen(nTr, fnFormatDetails(oTable, nTr), 'details');
    }
});


function panelCollapsible(prueba) {
    var collapse = document.createElement('span');
    collapse.className = 'tools pull-right';
    var chevron = document.createElement('a');
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


//datetime picker start

$(".form_datetime").datetimepicker({ format: 'yyyy-mm-dd hh:ii' });

$(".form_datetime-component").datetimepicker({
    format: "dd MM yyyy"
});

$(".form_datetime-adv").datetimepicker({
    format: "dd mm yyyy",
    autoclose: true,
    todayBtn: true,
    startDate: "2013-02-14",
    minuteStep: 10
});

$(".form_datetime-meridian").datetimepicker({
    format: "dd mm yyyy",
    showMeridian: true,
    autoclose: true,
    todayBtn: true
});

//datetime picker end


function calcularAvance(realizadas, total){
    let porc = realizadas * 100 / total
    return porc + '%'

}