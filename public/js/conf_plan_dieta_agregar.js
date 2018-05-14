$(document).ready(function() {
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/tipodietas',
        contentType: 'application/json',
        type: 'GET',
        success: function (res, status, xhr) {
            console.log(res);
            res.data.map(function (tipoDieta) {
                let option = $(`<option value="${tipoDieta.id_tipo_dieta}">${tipoDieta.nombre}</option>`)
                $('#selTipoDieta').append(option);
            })
        },
        error: function (res, status, xhr) {
            console.log(res)
            console.log(status)
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);

        }
    })

    //Busqueda del id del servicio a editar
    var paramstr = window.location.search.substr(1);
    var paramarr = paramstr.split("=");
    var params = {};
    params[paramarr[0]] = paramarr[1];
    const id = params['id'];
    
    //Lena el formulario con informacion del servicio a editar
    if (id != undefined) {
        $('#btnGuardar').css('display', 'inline');
        $('#btnRegistrar').css('display', 'none');
        $.ajax({
            url: 'https://api-sascha.herokuapp.com/plandieta/' + id,
            contentType: 'application/json',
            type: 'GET',
            success: function (res, status, xhr) {
                console.log(res.data);
                let planDieta = res.data;
                oldPlanDieta = planDieta;
                $('#txtNombreDieta').val(planDieta.nombre);
                $('#txtDescripcion').val(planDieta.descripcion);
                $('#selTipoDieta').val(planDieta.tipo_dieta.id_tipo_dieta);
            },
            error: function (res, status, xhr) {
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
            }
        });
    }

    $('#btnAgregarComida').on('click', function() {

        if($('#txtNombre').val() == ""){
            $('#txtNombre').css('border', '1px solid red');
            return;
        }

        if($('#txtDescripcion').val() == ""){
            $('#txtDescripcion').css('border', '1px solid red');
            return;
        }

        /*console.log(valor);
        // Convierte el arreglo de ids en un arreglo de objetos JSON. Ej. { id_suplemento: id }
        let suplementos = [];
        valor.map(function(val) {
            suplementos.push({
                id_suplemento: val
            })
        })*/
        let planActividad = {
            nombre: $('#txtNombre').val(),
            descripcion: $('#txtDescripcion').val(),
            //suplementos: suplementos
            ejercicios: $('select[name=ejercicios]').val()
        }
        console.log(planActividad);
        $.ajax({
            url: 'https://api-sascha.herokuapp.com/planejercicios',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(planActividad),
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                // Busca en el multiselect el nombre de los suplementos
                // y crea arreglo de objetos JSON Ej. { id_suplemento: 1, nombre: "Vitamina" }
                let ejercicios = [];
                res.data.ejercicios.map(function(ejercicio) {
                    ejercicios.push({ 
                        id_ejercicio: ejercicio,
                        nombre: $(`option[value="${ejercicio}"]`).text()
                    })
                });
                
                addRowPlan(res.data.id_plan_ejercicio, res.data.nombre, res.data.descripcion, ejercicios)
                limpiarPlan();
                mensaje('#msjAlerta', `Plan de Entrenamiento`, 1);
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta',`${respuesta.data.mensaje}`, 0);
            }
        })
        $('#agregarPlan').modal('hide');

    })


});
