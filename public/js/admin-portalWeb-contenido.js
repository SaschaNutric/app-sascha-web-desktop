

$(document).ready(function() {

 /* tabla Recomendaciones */
    const tablaRecomendaciones = $('#tabla-recomendacion').DataTable({ 
        "aoColumnDefs": [
        { "bSortable": false, "aTargets": [1] }
        ],
        "language": {
            "lengthMenu": "",
            "search": "Buscar:",
            "paginate": {
                "previous": "Anterior",
                "next": "Siguiente"
            },
            "emptyTable": "No se encontraron Recomendaciones",
            "zeroRecords": "No se encontraron Recomendaciones"
        },
        "searching": true,
        "ordering": true,
        "paging": true
    });


 /* tabla Preguntas */
    const tablaPreguntas = $('#tabla-preguntas').DataTable({ 
        "aoColumnDefs": [
        { "bSortable": false, "aTargets": [1] }
        ],
        "language": {
            "lengthMenu": "",
            "search": "Buscar:",
            "paginate": {
                "previous": "Anterior",
                "next": "Siguiente"
            },
            "emptyTable": "No se encontraron Preguntas",
            "zeroRecords": "No se encontraron Preguntas"
        },
        "searching": true,
        "ordering": true,
        "paging": true
    });

    $.ajax({
        url: 'https://api-sascha.herokuapp.com/slides',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            console.log(res);
            let galeria = $('#gallery');
            console.log(galeria);
            res.data.map(function(slider) {
                let imagen = `<div class="images item " id="slider-${slider.id_slide}">
                                <img src="${slider.url_imagen}" alt="" id="imagen-${slider.id_slide}" />
                                <input type="text" class="form-control" id="txtTituloS-${slider.id_slide}"  value="${slider.titulo}" style="display:none">
                                <input type="text" class="form-control" id="txtDescripcionS-${slider.id_slide}"  value="${slider.descripcion}" style="display:none"> 
                                <p> <span id="orden-${slider.id_slide}" style="display: none;" > ${slider.orden}</span>
                                    <button class="btn btn-transparente" type="button" onclick="verSlider(${slider.id_slide})" id="btnAceptarUnidad" data-toggle="modal" data-target="#agregarSlider" ><i class='fa fa-eye'></i></button>
                                    <button class="btn btn-transparente" type="button" onclick="editarSlider(${slider.id_slide})" id="btnAceptarUnidad" data-toggle="modal" data-target="#agregarSlider" ><i class='fa fa-pencil'></i></button>
                                    <button data-dismiss="modal" class="btn btn-transparente"  onclick="abrirModalEliminarSlider(${slider.id_slide})" data-toggle="modal" data-target="#eliminarSlider"><i class="fa fa-trash-o"></i></button>
                                </p>
                        </div>`;

                galeria.html(galeria.html() + imagen);
                
            })

        },
        error: function(res, status, xhr) {
            console.log(res)
            console.log(status)
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);

        }
    })

$.ajax({
        url: 'https://api-sascha.herokuapp.com/ayudas',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.map(function(ayuda) {
                addRowPregunta(ayuda.id_ayuda, ayuda.pregunta, ayuda.respuesta)
            })

        },
        error: function(res, status, xhr) {
            console.log(res)
            console.log(status)
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);

        }
    })

$.ajax({
        url: 'https://api-sascha.herokuapp.com/contenidos',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.map(function(recomendacion) {
                addRowRecomendaciones(recomendacion.id_contenido, recomendacion.titulo, recomendacion.texto, recomendacion.url_imagen)
            })

        },
        error: function(res, status, xhr) {
            console.log(res)
            console.log(status)
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);

        }
    })
})


$('#btnguardarSlider').on('click', function() {

     let slider = {
            titulo: $('#txtTituloSlider1').val(),
            descripcion: $('#txtDescripcionSlider1').val(),
            orden: $('#txtOrden1').val()
        }

    console.log($(slider.titulo));
    var file_data = $("#imagenSlider1").prop("files")[0];   // Getting the properties of file from file field
    var form_data = new FormData();                  // Creating object of FormData class
    form_data.append('titulo', slider.titulo);
    form_data.append('descripcion', slider.descripcion);
    form_data.append('orden', slider.orden);
     form_data.append('imagen', file_data);
     console.log(form_data);

    $.ajax({
        url: "https://api-sascha.herokuapp.com/slides",
          type:"POST",
        processData:false,
        contentType: false,
        data: form_data,
            success: function(res, status, xhr){
                    console.log(res);
                       const slider = res.data;
                       let galeria = $('#gallery');
                       let imagen = `<div class="images item " id="slider-${slider.id_slide}">
                                <img src="${slider.url_imagen}" alt="" id="imagen-${slider.id_slide}" />
                                <input type="text" class="form-control" id="txtTituloS-${slider.id_slide}"  value="${slider.titulo}">
                                <input type="text" class="form-control" id="txtDescripcionS-${slider.id_slide}"  value="${slider.descripcion}"> 
                                <p> <span id="orden-${slider.id_slide}" style="display: none;" > ${slider.orden}</span>
                                    <button class="btn btn-transparente" type="button" onclick="verSlider(${slider.id_slide})" id="btnAceptarUnidad" data-toggle="modal" data-target="#agregarSlider" ><i class='fa fa-eye'></i></button>
                                    <button class="btn btn-transparente" type="button" onclick="editarSlider(${slider.id_slide})" id="btnAceptarUnidad" data-toggle="modal" data-target="#agregarSlider" ><i class='fa fa-pencil'></i></button>
                                    <button data-dismiss="modal" class="btn btn-transparente"  onclick="abrirModalEliminarSlider(${slider.id_slide})" data-toggle="modal" data-target="#eliminarSlider"><i class="fa fa-trash-o"></i></button>
                                </p>
                        </div>`;

                galeria.html(galeria.html() + imagen);
                mensaje('#msjAlertaSlider', 'Slider' , 1);
                limpiarModalSlider();
                 
                },
                error: function(res, status, xhr){
                    console.log(res);
                    console.log(status);
                    const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlertaSlider',`${respuesta.data.mensaje}`, 0);
            limpiarModalSlider();
                  
                    
                }
            })
    $('#agregarSlider1').modal('hide');


})

 $('#btnguardarContenido').on('click', function() {

     let contenido = {
            titulo: $('#tituloContenido').val(),
            texto: $('#contenidoContenido').val()
        }


    var file_data = $("#imagenContenido").prop("files")[0];   // Getting the properties of file from file field
    var form_data = new FormData();                  // Creating object of FormData class
    form_data.append('titulo', contenido.titulo);
    form_data.append('texto', contenido.texto);
     form_data.append('imagen', file_data);
     console.log(form_data);

    $.ajax({
        url: "https://api-sascha.herokuapp.com/contenidos",
          type:"POST",
        processData:false,
        contentType: false,
        data: form_data,
            success: function(res, status, xhr){
                    console.log(res);
                     mensaje('#msjAlertaContenido', `Pregunta Frecuente`, 1);
                       const contenido = res.data;
                 addRowRecomendaciones( contenido.id_contenido ,contenido.titulo, contenido.texto, contenido.url_imagen);
                },
                error: function(res, status, xhr){
                    console.log(res);
                    console.log(status);
                    const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlertaContenido',`${respuesta.data.mensaje}`, 0);
                  
                    
                }
            })
    $('#agregarContenido').modal('hide');


})

 $('#btnAceptarUnidad').on('click', function() {
   $('#btnAceptarUnidad').show();
    $('#btnEditarUnidad').hide();
    if($('#textPregunta').val() == "" && $('#textRespuesta').val() == ""){
            $('#textPregunta').css('border', '1px solid red');
             $('#textRespuesta').css('border', '1px solid red');
            return;
        }

    if($('#textPregunta').val() == ""){
            $('#textPregunta').css('border', '1px solid red');
            return;
        }

    if($('#textRespuesta').val() == ""){
            $('#textRespuesta').css('border', '1px solid red');
            return;
        }
    let pregunta = {
            pregunta: $('#textPregunta').val(),
            respuesta: $('#textRespuesta').val()
        }

 $.ajax({
            url: 'https://api-sascha.herokuapp.com/ayudas',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(pregunta),
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                 const ayuda = res.data;
                 addRowPregunta(ayuda.id_ayuda, ayuda.pregunta, ayuda.respuesta);
                 limpiarPregunta();
                 mensaje('#msjAlertaPregunta', 'Preguntas Frecuente',1);
              
            },
            error: function(res, status, xhr) {
                 const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlertaPregunta', `${respuesta.data.mensaje}`, 0);

            }
        })

  $('#agregarPregunta').modal('hide');
})

 function verSlider(id){
    console.log()
    $('#vistaPreliminar').attr('src', $(`#imagen-${id}`).attr('src'));
    $('#txtTituloSlider').val($(`#txtTituloS-${id}`).val());
    $('#txtDescripcionSlider').val($(`#txtDescripcionS-${id}`).val());
    $('#txtOrden').val($(`#orden-${id}`).text());
    $('#botones-slider').hide();
    $('#footerSlider').hide();
 }

 function limpiarModalSlider(){
    $('#vistaPreliminar1').attr('src', 'http://www.placehold.it/400x300/EFEFEF/AAAAAA&amp;text=Agregar+imagen ');
    $('#txtTituloSlider1').val(" ");
    $('#txtDescripcionSlider1').val(" ");
    $('#txtOrden1').val(" ");
 
 }

 function editarSlider(id)
 {
    $('#txtIdSlider').val(id);
    $('#vistaPreliminar').attr('src', $(`#imagen-${id}`).attr('src'));
    $('#txtTituloSlider').val($(`#txtTituloS-${id}`).val());
    $('#txtDescripcionSlider').val($(`#txtDescripcionS-${id}`).val());
    $('#txtOrden').val($(`#orden-${id}`).text());
 }

 function editarPregunta(id){
    $('#textPregunta').val($(`#ayuda-${id}`).text());
    $('#textRespuesta').val($(`#respuesta-${id}`).text());
    $('#txtIdPregunta').val(id);
    $('#btnAceptarUnidad').hide();
    $('#btnEditarPregunta').show();
 }

  function editarContenido(id){
    $('#txtIdContenido').val(id);
    $('#tituloContenidoE').val($(`#recomendacion-${id}`).text());
     $('#contenidoContenidoE').val($(`#texto-${id}`).text());
                  $("#vistaPreliminarE").attr("src", $(`#imagen-${id}`).attr('src'));
                  $("#imagenContenidoE").val($(`#imagen-${id}`).attr('src'));
 }

 function abrirModalEliminarPregunta(id){

    $('#txtIdPreguntaEliminar').val(id);
}

 function abrirModalEliminarContenido(id){
    $('#txtIdContenidoEliminar').val(id);
}

function abrirModalEliminarSlider(id){
    $('#txtIdSliderEliminar').val(id);
}

function eliminarSlider(id){
     $.ajax({
        url: `https://api-sascha.herokuapp.com/slide/${id}`,
        contentType: 'application/json',
        type: 'DELETE',
        success: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            mensaje('#msjAlertaSlider', `Imagen de Slider`, 2);
            console.log ($(`#slider-${id}`));
            $(`#slider-${id}`).remove();
            $(`#slider-${id}`).hide();
            

        },
        error: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);

        }
    })
}

function eliminarPregunta(id){
    $.ajax({
        url: `https://api-sascha.herokuapp.com/ayuda/${id}`,
        contentType: 'application/json',
        type: 'DELETE',
        success: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            $('#tabla-preguntas').DataTable().row($(`#ayuda-${id}`).parent()).remove().draw();
            mensaje('#msjAlertaPregunta', `Pregunta Frecuente`, 2);

        },
        error: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlertaPregunta', `${respuesta.data.mensaje}`, 0);

        }
    })
}

function eliminarContenido(id){
    $.ajax({
        url: `https://api-sascha.herokuapp.com/contenido/${id}`,
        contentType: 'application/json',
        type: 'DELETE',
        success: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            $('#tabla-recomendacion').DataTable().row($(`#recomendacion-${id}`).parent()).remove().draw();
            mensaje('#msjAlertaContenido', `Contenido`, 2);

        },
        error: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlertaContenido', `${respuesta.data.mensaje}`, 0);

        }
    })
}

$('#btnEditarSlider').on('click', function(){
       let slider = {
            titulo: $('#txtTituloSlider').val(),
            descripcion: $('#txtDescripcionSlider').val(),
            orden: $('#txtOrden').val()
        }

        let id = $('#txtIdSlider').val();
        imagen = $('.fileupload-exists img').attr('src');
        console.log(slider.descripcion);
        console.log($(`#txtDescripcionS-${id}`).val());
    if(slider.orden == $(`#orden-${id}`).text() && slider.titulo == $(`#txtTituloS-${id}`).val() && slider.descripcion == $(`#txtDescripcionS-${id}`).val() && imagen === undefined ){
       mensaje('#msjAlertaSlider', 'Slider' , 4);
        return;
    } 
       var file_data = $("#imagenSlider").prop("files")[0];   // Getting the properties of file from file field
    var form_data = new FormData();     
    console.log("por aca")  ;           // Creating object of FormData class
    form_data.append('titulo', slider.titulo);
    form_data.append('descripcion', slider.descripcion);
    form_data.append('orden', slider.orden);
     form_data.append('imagen', file_data);
     console.log(form_data);


          $.ajax({
        url: `https://api-sascha.herokuapp.com/slide/${id}`,
          type:"PUT",
        processData:false,
        contentType: false,
        data: form_data,
            success: function(res, status, xhr){
                    console.log(res);
                     console.log(status);
                     const slide = res.data;
                     $(`#imagen-${id}`).attr('src', slide.url_imagen );
                     $(`#txtTituloS-${id}`).val(slide.titulo);
                     $(`#txtDescripcionS-${id}`).val(slide.descripcion);
                     $(`#orden-${id}`).text(slide.orden)
                    mensaje('#msjAlertaSlider', `Slider`, 3);
                     limpiarModalSlider();
                     },
        error: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlertaSlider',`${respuesta.data.mensaje}`, 0);
             limpiarModalSlider();
           

        }
    })
          $('#agregarSlider').modal('hide');
})

$('#btnEditarContenido').on('click', function(){
            let contenido = {
            titulo: $('#tituloContenidoE').val(),
            texto: $('#contenidoContenidoE').val()
        }
           let id = $('#txtIdContenido').val();
           imagen = $('.fileupload-exists img').attr('src');
           if(contenido.titulo == $(`#recomendacion-${id}`).text() && contenido.texto == $(`#texto-${id}`).text() && imagen === undefined  ){
       mensaje('#msjAlertaContenido', 'Recomendacion' , 4);
        $('#editarContenido').modal('hide');
        return;
    } 

    var file_data = $("#imagenContenidoE").prop("files")[0];   // Getting the properties of file from file field
    var form_data = new FormData();                  // Creating object of FormData class
    form_data.append('titulo', contenido.titulo);
    form_data.append('texto', contenido.texto);
     form_data.append('imagen', file_data);
     console.log(form_data);

          $.ajax({
        url: `https://api-sascha.herokuapp.com/contenido/${id}`,
          type:"PUT",
        processData:false,
        contentType: false,
        data: form_data,
            success: function(res, status, xhr){
                    console.log(res);
                     console.log(status);
                     const cont = res.data;
                     editRowRecomendacion(cont.id_contenido ,cont.titulo, cont.texto, cont.url_imagen);
                    mensaje('#msjAlertaContenido', `Slider`, 3);
                     },
        error: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlertaContenido',`${respuesta.data.mensaje}`, 0);
             limpiarModalSlider();
           

        }
    })
          $('#editarContenido').modal('hide');
})

$('#btnEditarPregunta').on('click', function() {
    if($('#textPregunta').val() == "" && $('#textRespuesta').val() == ""){
            $('#textPregunta').css('border', '1px solid red');
             $('#textRespuesta').css('border', '1px solid red');
            return;
        }

    if($('#textPregunta').val() == ""){
            $('#textPregunta').css('border', '1px solid red');
            return;
        }

    if($('#textRespuesta').val() == ""){
            $('#textRespuesta').css('border', '1px solid red');
            return;
        }

    let pregunta = {
            pregunta: $('#textPregunta').val(),
            respuesta: $('#textRespuesta').val()
        }
        let id = $('#txtIdPregunta').val();
        


    if(pregunta.pregunta == $(`#ayuda-${id}`).text() && pregunta.respuesta == $(`#respuesta-${id}`).text()){
        mensaje('#msjAlerta', ``, 4);
        $('#agregarPregunta').modal('hide');
        return;
    }

          $.ajax({
        url: `https://api-sascha.herokuapp.com/ayuda/${id}`,
        contentType: 'application/json',
        type: 'PUT',
        data: JSON.stringify(pregunta),
        success: function(res, status, xhr) {
            console.log(pregunta)
            mensaje('#msjAlerta', `Pregunta Frecuente`, 3);
            editRowPregunta(id, pregunta.pregunta, pregunta.respuesta)
            limpiarPregunta()
            
        },
        error: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta',`${respuesta.data.mensaje}`, 0);
            limpiarPregunta()

        }
    })
         $('#agregarPregunta').modal('hide');
})


function limpiarPregunta(){
     $('#textPregunta').val(" ");
    $('#textRespuesta').val(" ");
    $('#textPregunta').css('border', '1px solid #ccc');
             $('#textRespuesta').css('border', '1px solid #ccc');
}



function addRowPregunta(id, pregunta, respuesta) {
    let row = $(`<tr>
        <td  id="ayuda-${id}">${pregunta}</td>
        <td id="respuesta-${id}">${respuesta}</td>
        <td><div class="btn-group">
        <button onclick="editarPregunta(${id})" type='button' class='edit btn  btn-transparente' data-toggle="modal" data-target="#agregarPregunta"  title='Editar'><i class='fa fa-pencil'></i></button>
        <button onclick="abrirModalEliminarPregunta(${id})" type='button' class='ver btn  btn-transparente' data-toggle='modal' data-target="#eliminarPregunta" title='Eliminar'><i class="fa fa-trash-o"></i></button>
        </td>
        </tr>
        `);
    $('#tabla-preguntas').DataTable().row.add(row).draw();
}

function addRowRecomendaciones( id,titulo, texto, image) {
    let row = $(`<tr>
                        <td id="recomendacion-${id}">${titulo}</td>
                        <td id="td-imagen-${id}"><img class="imagen-recomendaciones" src="${image}" id="imagen-${id}"/></td>
                         <td id="texto-${id}">${texto}</td>
                         <td><div class="btn-group">
        <button onclick="editarContenido(${id})" type='button' class='edit btn  btn-transparente' data-toggle="modal" data-target="#editarContenido"  title='Editar'><i class='fa fa-pencil'></i></button>
        <button onclick="abrirModalEliminarContenido(${id})" type='button' class='ver btn  btn-transparente' data-toggle='modal' data-target="#eliminarContenido" title='Eliminar'><i class="fa fa-trash-o"></i></button>
        </td>
        </tr>
        `);
    $('#tabla-recomendacion').DataTable().row.add(row).draw();
}

function editRowRecomendacion(id,titulo, texto, image){
    $(`#recomendacion-${id}`).text(titulo);
    $(`#imagen-${id}`).attr('src',image);
    $(`#texto-${id}`).text(texto);
}


function editRowPregunta(id, pregunta, respuesta){
    $(`#ayuda-${id}`).text(pregunta);
    $(`#respuesta-${id}`).text(respuesta);
}