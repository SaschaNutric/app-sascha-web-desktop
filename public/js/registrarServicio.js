$(document).ready(function() {
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
        success: function(res, status, xhr) {
            res.data.map(function(condicion) {
                let option = $(`<option value="${condicion.id_condicion_garantia}">${condicion.descripcion}</option>`)
                $('#ms_condiciones').append(option);
                $('#ms_condiciones').multiSelect('refresh');
            })

        },
        error: function(res, status, xhr) {
            console.log(res)
        }
    });

//Lena el select de especialidad
$.ajax({
    url: 'https://api-sascha.herokuapp.com/especialidades',
    contentType: 'application/json',
    type: 'GET',
    success: function(res, status, xhr) {
        res.data.map(function(especialidad) {
            let option = $(`<option value="${especialidad.id_especialidad}">${especialidad.nombre}</option>`)
            $('#selEspecialidad').append(option);
        })

    },
    error: function(res, status, xhr) {
        console.log(res)
    }
});

//Lena el select de plan de dieta
$.ajax({
    url: 'https://api-sascha.herokuapp.com/plandietas',
    contentType: 'application/json',
    type: 'GET',
    success: function(res, status, xhr) {
        res.data.map(function(dieta) {
            let option = $(`<option value="${dieta.id_plan_dieta}">${dieta.nombre}</option>`)
            $('#selPlanDieta').append(option);
        })

    },
    error: function(res, status, xhr) {
        console.log(res)
    }
});

//Lena el select de plan de ejercicios
$.ajax({
    url: 'https://api-sascha.herokuapp.com/planejercicios',
    contentType: 'application/json',
    type: 'GET',
    success: function(res, status, xhr) {
        res.data.map(function(planE) {
            let option = $(`<option value="${planE.id_plan_ejercicio}">${planE.nombre}</option>`)
            $('#selPlanEjercicio').append(option);
        })

    },
    error: function(res, status, xhr) {
        console.log(res)
    }
});
//Lena el select de plan de suplementos
$.ajax({
    url: 'https://api-sascha.herokuapp.com/plansuplementos',
    contentType: 'application/json',
    type: 'GET',
    success: function(res, status, xhr) {
        res.data.map(function(planS) {
            let option = $(`<option value="${planS.id_plan_suplemento}">${planS.nombre}</option>`)
            $('#selPlanSuplemento').append(option);
        })

    },
    error: function(res, status, xhr) {
        console.log(res)
    }
});
//Lena el select de precios
$.ajax({
    url: 'https://api-sascha.herokuapp.com/precios',
    contentType: 'application/json',
    type: 'GET',
    success: function(res, status, xhr) {
        res.data.map(function(precio) {
            let option = $(`<option value="${precio.id_precio}">${precio.valor}</option>`)
            $('#selPrecio').append(option);
        })

    },
    error: function(res, status, xhr) {
        console.log(res)
    }
});
//Busqueda del id del servicio a editar
var paramstr = window.location.search.substr(1);
var paramarr = paramstr.split ("=");
var params = {};
params[paramarr[0]] = paramarr[1];
const id = params['id'];
let oldServicio = {};

//Lena el formulario con informacion del servicio a editar
if(id!=undefined){
    $('#btnGuardar').css('display', 'inline');
    $('#btnRegistrar').css('display', 'none');
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/servicio/'+id,
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            let servicio = res.data;
            oldServicio = servicio;
            $('#txtNombre').val( servicio.nombre);
            $('#txtDescripcion').val(servicio.descripcion);
            $('#selPrecio').val( servicio.id_precio);
            $('#selPlanDieta').val(servicio.id_plan_dieta);
            $('#selPlanSuplemento').val(servicio.id_plan_suplemento);
            $('#selPlanEjercicio').val(servicio.id_plan_ejercicio);
            $('#txtDuracion').val(servicio.numero_visitas);
            $('#selEspecialidad').val(servicio.id_especialidad);
            $('#imgServicio').attr("src", servicio.url_imagen);

        },
        error: function(res, status, xhr) {
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
        }
    });
}

//Inicializa la tabla de parametros
$('#dtParametros').dataTable( {
  "aoColumnDefs": [
  { "bSortable": false, "aTargets": [ 4 ] }
  ],
  "sDom": "ftp",
  "oLanguage": {

   "sLengthMenu": "",
   "sSearch": "Buscar:",
   "oPaginate":{
    "sPrevious": "Anterior",
    "sNext": "Siguiente"
},
"sEmptyTable": "No se encontraron parametros"
},
} );

function validate(){
    let validate = true;
    let servicio = {
        nombre: $('#txtNombre').val(),
        descripcion: $('#txtDescripcion').val(),
        precio: $('#txtPrecio').val(),
        planDieta: $('#selPlanDieta').val(),
        especialidad:$('#selEspecialidad').val(),
        duracion: $('#txtDuracion').val()
    }

    if(servicio.nombre == '' || servicio.descripcion == '' || servicio.precio == '' || servicio.planDieta == 0 || servicio.especialidad == 0 || servicio.duracion == ''){
        validate = false;
    }

    return validate;
}


$('#btnRegistrar').on('click', function() {
    if(!validate()){
        console.log($('#ms_condiciones').val())
        mensaje('#msjAlerta', '', 5);
        return;
    }
    let servicio = {
        nombre: $('#txtNombre').val(),
        descripcion: $('#txtDescripcion').val(),
        id_precio: 3,
        id_plan_dieta: $('#selPlanDieta').val(),
        id_plan_ejercicio: $('#selPlanEjercicio').val(),
        id_plan_suplemento: $('#selPlanSuplemento').val(),
        id_especialidad:$('#selEspecialidad').val(),
        numero_visitas: $('#txtDuracion').val()

    }


    var file_data = $("#fileServicio").prop("files")[0];   // Getting the properties of file from file field
    var form_data = new FormData();                  // Creating object of FormData class
    form_data.append('nombre', servicio.nombre);
    form_data.append('descripcion', servicio.descripcion);
    form_data.append('id_precio', servicio.id_precio);
    form_data.append('id_plan_dieta', servicio.id_plan_dieta);
    if(servicio.id_plan_suplemento != "null"){
        form_data.append('id_plan_suplemento', servicio.id_plan_suplemento);
    }
    if(servicio.id_plan_ejercicio != "null" ){
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
                success: function(res, status, xhr){
                    console.log(res)
                    verServicios()
                },
                error: function(res, status, xhr){
                    console.log(res);
                    console.log(status);
                    const respuesta = JSON.parse(res.responseText);
                    mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
                }
            })
});


$('#btnGuardar').on('click', function(){
    if(!validate()){
        mensaje('#msjAlerta', '', 5);
        return;
    }
    let servicio = {
        nombre: $('#txtNombre').val(),
        descripcion: $('#txtDescripcion').val(),
        id_precio: $('#selPrecio').val(),
        id_plan_dieta: $('#selPlanDieta').val(),
        id_plan_ejercicio: $('#selPlanEjercicio').val(),
        id_plan_suplemento: $('#selPlanSuplemento').val(),
        id_especialidad:$('#selEspecialidad').val(),
        numero_visitas: $('#txtDuracion').val(),

    }

    const  url_imagen = $('#imgServicio').attr("src");

    console.log(oldServicio)
    console.log(servicio)
    if(oldServicio.nombre == servicio.nombre && oldServicio.descripcion == servicio.descripcion && oldServicio.id_precio == servicio.id_precio && oldServicio.id_plan_dieta == servicio.id_plan_dieta && oldServicio.id_plan_suplemento == servicio.id_plan_suplemento && oldServicio.id_plan_ejercicio == servicio.id_plan_ejercicio && oldServicio.id_especialidad == servicio.id_especialidad && oldServicio.numero_visitas == servicio.numero_visitas && oldServicio.url_imagen == url_imagen ){
        mensaje('#msjAlerta', '', 4);
        return;

    }

var file_data = $("#fileServicio").prop("files")[0];   // Getting the properties of file from file field
    var form_data = new FormData();                  // Creating object of FormData class
    form_data.append('nombre', servicio.nombre);
    form_data.append('descripcion', servicio.descripcion);
    form_data.append('id_precio', servicio.id_precio);
    form_data.append('id_plan_dieta', servicio.id_plan_dieta);
    if(servicio.id_plan_suplemento != "null"){
        form_data.append('id_plan_suplemento', servicio.id_plan_suplemento);
    }
    if(servicio.id_plan_ejercicio != "null" ){
        form_data.append('id_plan_ejercicio', servicio.id_plan_ejercicio);
    }
    form_data.append('id_especialidad', servicio.id_especialidad);
    form_data.append('numero_visitas', servicio.numero_visitas);
    if(url_imagen != servicio.url_imagen){
        form_data.append('imagen', file_data);
    }

    $.ajax({
        url: "https://api-sascha.herokuapp.com/servicio/"+id,
        cache: false,
        contentType: false,
        processData: false,
        method: 'PUT',
        type: 'PUT',
                data: form_data,                         // Setting the data attribute of ajax with file_data
                success: function(res, status, xhr){
                    console.log(res)
                    verServicios()
                },
                error: function(res, status, xhr){
                    console.log(res);
                    console.log(status);
                    const respuesta = JSON.parse(res.responseText);
                    mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
                }
            })



});
});

function verServicios(){
    window.location='conf_servicios.html';
}
