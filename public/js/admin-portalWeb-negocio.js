

$(document).ready(function(){

 /* tabla Redes sociales*/
    const tablaRedesSociales = $('#redes-sociales').DataTable({ 
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
            "emptyTable": "No se encontraron Redes Sociales",
            "zeroRecords": "No se encontraron Redes Sociales"
        },
        "searching": true,
        "ordering": true,
        "paging": true
    });

     $.ajax({
          url: 'https://api-sascha.herokuapp.com/negocio/8',
          contentType: 'application/json',
          type: 'GET',
          success: function (res, status, xhr) {
             res.data.map(function(negocio) {
                  let razonsocial = document.getElementById('inputRazonSocial');
                  let rif = document.getElementById('inputRif');
                  let telefono = document.getElementById('inputTelefono');
                  let correo  = document.getElementById('inputCorreo');
                  let mision = document.getElementById('textMision');
                  let vision = document.getElementById('textVision');
                  let objetivos = document.getElementById('textObjetivos');
                  let imglogo = document.getElementById('imagenLogo');
                 // let inputlogo =document.getElementById('inputLogo');
                  razonsocial.value = `${negocio.razon_social}`;
                  rif.value = `${negocio.rif}`;
                  telefono.value = `${negocio.telefono}`;
                  correo.value = `${negocio.correo}`;
                  mision.value = `${negocio.mision}`;
                  vision.value = `${negocio.vision}`;
                  objetivos.value = `${negocio.objetivo}`;
                  imglogo.src= `${negocio.url_logo}`;
                  //inputlogo.value = `${negocio.url_logo}`;

              })
          }
      })

     $.ajax({
        url: 'https://api-sascha.herokuapp.com/redsociales',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.map(function(redsocial) {
                addRowRedesSociales(redsocial.id_red_social, redsocial.nombre, redsocial.url_logo, redsocial.url_base)
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

      $('#guardarRedSocial').on('click', function() {

    let redsocial = {
            nombre: $('#txtNombreRed').val(),
            url_base: $('#txtEnlace').val(),
            usuario:  $('#txtEnlace').val(),
        }


    var file_data = $("#imagenRedsocial").prop("files")[0];   // Getting the properties of file from file field
    var form_data = new FormData();                  // Creating object of FormData class
    form_data.append( 'nombre', redsocial.nombre);
    form_data.append('usuario', redsocial.usuario);
    form_data.append('url_base', redsocial.url_base);
     form_data.append('imagen', file_data);
     console.log(form_data);

  $.ajax({
        url: "https://api-sascha.herokuapp.com/redsociales",
          type:"POST",
        processData:false,
        contentType: false,
        data: form_data,
            success: function(res, status, xhr){
                    console.log(res);
                     mensaje('#msjAlerta', `Red Social`, 1);
                       const redSocial = res.data;
                 addRowRedesSociales( redSocial.id_red_social, redSocial.nombre, redSocial.url_logo, redSocial.url_base) 
                },
                error: function(res, status, xhr){
                    console.log(res);
                    console.log(status);
                  
                    
                }
            })
 $('#agregarRedsocial').modal('hide');
})

$('#btnguardarNosotros').on('click', function() {

     let negocio = {
            mision: $('#textMision').val(),
            vision: $('#textVision').val(),
            objetivo:  $('#textObjetivos').val()
        }
  $.ajax({
        url: `https://api-sascha.herokuapp.com/negocio/8`,
        contentType: 'application/json',
        type: 'PUT',
        data: JSON.stringify(negocio),
        success: function(res, status, xhr) {
            mensaje('#msjAlerta', `Seccion Nosotros`, 3);
            
        },
        error: function(res, status, xhr) {
            console.log(res);
            console.log(status);
           

        }
    })

})

$('#btn-guardar').on('click', function() {

let negocio = {
            razon_social: $('#inputRazonSocial').val(),
            rif: $('#inputRif').val(),
            telefono:  $('#inputTelefono').val(),
            correo:$('#inputCorreo').val()
        }


    var file_data = $("#inputLogo").prop("files")[0];   // Getting the properties of file from file field
    var form_data = new FormData();                  // Creating object of FormData class
    form_data.append( 'razon_social', negocio.razon_social);
    form_data.append('rif', negocio.rif);
    form_data.append('telefono', negocio.telefono);
    form_data.append('correo', negocio.correo);
     form_data.append('imagen', file_data);
     console.log(form_data);

  $.ajax({
        url: "https://api-sascha.herokuapp.com/negocio/8",
          type:"PUT",
        processData:false,
        contentType: false,
        data: form_data,
            success: function(res, status, xhr){
                    console.log(res);
                     console.log(status);
                    alert("list");
                    mensaje('#msjAlerta', `Seccion Nosotros`, 3);
                     },
                error: function(res, status, xhr){
                    console.log(res);
                    console.log(status);
                  
                    
                }
            })

})
    

     $('#btn-editar').click(function(){
       $('#btn-editar').hide();
        $("input").removeAttr('disabled');
           $('#btn-guardar').show();
             })


  function abrirModalEliminarRedsocial(id){
        $('#txtIdRedsocialEliminar').val(id);
      }

     function eliminarRedsocial(id){
        $.ajax({
        url: `https://api-sascha.herokuapp.com/redsocial/${id}`,
        contentType: 'application/json',
        type: 'DELETE',
        success: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            $('#redes-sociales').DataTable().row($(`#redsocial-${id}`).parent()).remove().draw();
            mensaje('#msjAlerta', `Red social`, 2);

        },
        error: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);

        }
    })

     }

     function addRowRedesSociales( id, redsocial,icono, enlace) {
    let row = $(`<tr>
        <td id="redsocial-${id}">${redsocial}</td>
        <td id="td-icono-${id}"><img src="${icono}" style="width:30px"></td>
        <td id="enlace-${id}">${enlace}</td>
        <td>  <button onclick="editarContenido(${id})" type='button' class='edit btn  btn-transparente' data-toggle="modal" data-target="#agregarContenido"  title='Editar'><i class='fa fa-pencil'></i></button>
        <button onclick="abrirModalEliminarRedsocial(${id})" type='button' class='ver btn  btn-transparente' data-toggle='modal' data-target="#eliminarRedsocial" title='Eliminar'><i class="fa fa-trash-o"></i></button>
        </td>
        </tr>
        `);
    $('#redes-sociales').DataTable().row.add(row).draw();
}

