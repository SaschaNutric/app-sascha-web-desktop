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
                $('#selTipoDieta').val(planDieta.id_tipo_dieta);
            },
            error: function (res, status, xhr) {
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
            }
        });
    }   
});
