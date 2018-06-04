let arregloTipoParametros = [];
let arregloEspecialidades = [];
$(document).ready(function() {

    /* Caracteristicas del servicio */
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/servicios',
        contentType: 'application/json',
        type: 'GET',
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



/*llenando combo de motivos de solicitud*/
$.ajax({
    url: 'https://api-sascha.herokuapp.com/tipomotivo/1',

    contentType: 'application/json',
    type: 'GET',
    success: function(res, status, xhr) {
        res.data.motivos.map(function(tipo_motivo) {
            let option = $(`<option value="${tipo_motivo.id_motivo}">${tipo_motivo.descripcion}</option> `)
            $('#selMotivoSolicitud').append(option);
        })
    },
    error: function(res, status, xhr) {
        console.log(res);
    }
})


/*llenando combo de motivos de reclamos*/

    $.ajax({
        url: 'https://api-sascha.herokuapp.com/tipomotivo/2',

        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.motivos.map(function(tipo_motivo) {
                let option = $(`<option value="${tipo_motivo.id_motivo}">${tipo_motivo.descripcion}</option> `)
                $('#selMotivo').append(option);
            })
        },
        error: function(res, status, xhr) {
            console.log(res);
        }
    })
    
/*fin llenando combo de motivos*/

/*llenando combo de repuesta de reclamos*/

$.ajax({
    url: 'https://api-sascha.herokuapp.com/respuestas/tipomotivo/2',

    contentType: 'application/json',
    type: 'GET',
    success: function(res, status, xhr) {
        res.data.map(function(respuesta) {
            let option = $(`<option value="${respuesta.id_respuesta}">${respuesta.descripcion}</option> `)
            $('#selRespuestaReclamo').append(option);
        })
    },
    error: function(res, status, xhr) {
        console.log(res);
    }
})

/*fin llenando combo de respuestas*/


/*llenando combo de Nutricionista*/
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/empleados',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.map(function(empleado) {
                let option = $(`<option value="${empleado.id_empleado}">${empleado.nombres+" "+empleado.apellidos}</option> `)
                $('#selNutricionista').append(option);
            })
        },
        error: function(res, status, xhr) {
            console.log(res);
        }
    })
/*fin llenando combo de Nutricionista*/

/*llenando combo de tipo en estadistico de visita*/
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/tipocitas',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.map(function(tipo_visitas) {
                let option = $(`<option value="${tipo_visitas.id_tipo_cita}">${tipo_visitas.nombre}</option> `)
                $('#selTipoVisitas').append(option);
            })
        },
        error: function(res, status, xhr) {
            console.log(res);
        }
    })
/*fin llenando combo de tipo en estadistico de visita*/

/* llena el select de especialidades */
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/especialidades',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            console.log(res);
            res.data.map(function(especialidades) {     
            arregloEspecialidades.push(especialidades);           
                let optiontipo = $(`<option value="${especialidades.id_especialidad}">${especialidades.nombre}</option>`)
                $('#selEspecialidad').append(optiontipo);
            })
        },
        error: function(res, status, xhr) {
            console.log(res)
            console.log(status)
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
        }
    })
$( '#selEspecialidad').on('change',(function(){
    var str = $("#selEspecialidad").val();
    console.log(str)

     if(str==0)
        {
            $('#especialidadesGeneral').css('display', 'none');
        }
        else 
            $('#especialidadesGeneral').css('display', 'inline');
        
 $.ajax({
        url: 'https://api-sascha.herokuapp.com/servicios/especialidad/'+str,
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            console.log(res);
            res.data.servicios.map(function(servicio) {
                let optionservicio = $(`<option value="${servicio.id_servicio}">${servicio.nombre}</option>`)
                $('#selservicio').append(optionservicio);
            })
        },
        error: function(res, status, xhr) {
            console.log(res)
            console.log(status)
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
        }
    })
  }))
/* llena el select de plan de suplementos */


// /**/
// $.ajax({
//         url: 'https://api-sascha.herokuapp.com/plansuplementos',
//         contentType: 'application/json',
//         type: 'GET',
//         success: function(res, status, xhr) {
//             console.log(res);
//             res.data.map(function(planSuplementos) {
//                 let optiontipo = $(`<option value="${planSuplementos.id_suplemento}">${planSuplementos.nombre}</option>`)
//                 $('#selPlanSuplemento').append(optiontipo);
//             })
//         },
//         error: function(res, status, xhr) {
//             console.log(res)
//             console.log(status)
//             const respuesta = JSON.parse(res.responseText);
//             mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);

//         }
//     })

// /**/

    /* llena el select de estadistico valoracion--- tipo de valoracion */
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/tipovaloraciones',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            console.log(res);
            res.data.map(function(tipo_valoracion) {
                let optiontipo = $(`<option value="${tipo_valoracion.id_tipo_valoracion}">${tipo_valoracion.nombre}</option>`)
                $('#selTipoValoracion').append(optiontipo);
            })
        },
        error: function(res, status, xhr) {
            console.log(res)
            console.log(status)
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
        }
    })
    /* fin llena el select de estadistico valoracion--- tipo de valoracion  */


    /*select que llena tipo de de contacto canal de escucha*/
      $.ajax({
        url: 'https://api-sascha.herokuapp.com/tipomotivos/canalescucha',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            console.log(res);
            res.data.map(function(contacto) {
                let optiontipo = $(`<option value="${contacto.id_tipo_motivo}">${contacto.nombre}</option>`)
                $('#selTipocontacto').append(optiontipo);
            })
        },
        error: function(res, status, xhr) {
            console.log(res)
            console.log(status)
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
        }
    })
    /*fin select que llena tipo de de contacto canal de escucha*/

    /* llena el select de plan de dieta */
    // $.ajax({
    //     url: 'https://api-sascha.herokuapp.com/plandietas',
    //     contentType: 'application/json',
    //     type: 'GET',
    //     success: function(res, status, xhr) {
    //         console.log(res);
    //         res.data.map(function(planDieta) {
    //             let optiontipo = $(`<option value="${planDieta.id_plan_dieta}">${planDieta.nombre}</option>`)
    //             $('#selPlanDieta').append(optiontipo);
    //         })
    //     },
    //     error: function(res, status, xhr) {
    //         console.log(res)
    //         console.log(status)
    //         const respuesta = JSON.parse(res.responseText);
    //         mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
    //     }
    // })

    /* llena el select de plan de ejercicios */
    // $.ajax({
    //     url: 'https://api-sascha.herokuapp.com/planejercicios',
    //     contentType: 'application/json',
    //     type: 'GET',
    //     success: function(res, status, xhr) {
    //         console.log(res);
    //         res.data.map(function(planEjercicios) {
    //             let optiontipo = $(`<option value="${planEjercicios.id_plan_ejercicio}">${planEjercicios.nombre}</option>`)
    //             $('#selPlanEjercicios').append(optiontipo);
    //         })
    //     },
    //     error: function(res, status, xhr) {
    //         console.log(res)
    //         console.log(status)
    //         const respuesta = JSON.parse(res.responseText);
    //         mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);

    //     }
    // })

    /* Otros paramentros */
    /* llena el select de tipo de parametros */
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/tipoparametros',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.map(function(tipoParametro) {
                arregloTipoParametros.push(tipoParametro);
                let optiontipo = $(`<option value="${tipoParametro.id_tipo_parametro}">${tipoParametro.nombre}</option>`)
                $('#selTipoParametro').append(optiontipo);
            })
        },
        error: function(res, status, xhr) {
            console.log(res)
            console.log(status)
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);

        }
    })

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


    /*Caracteristicas del cliente */
    // Carga el Combo del Estado civil
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/estadociviles',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.map(function(estado_civil) {
                let option = $(`<option value="${estado_civil.id_estado_civil}">${estado_civil.nombre}</option>`)
                $('#selEdoCivil').append(option);
                
            })

        },
        error: function() {
            
        }
    })
    // Carga el Combo del Rango de Edad
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/rangoedades',
        contentType: 'application/json',
        type: 'GET',
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


});