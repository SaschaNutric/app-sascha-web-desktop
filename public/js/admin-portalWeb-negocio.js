

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
                  let inputlogo =document.getElementById('inputLogo');
                  razonsocial.value = `${negocio.razon_social}`;
                  rif.value = `${negocio.rif}`;
                  telefono.value = `${negocio.telefono}`;
                  correo.value = `${negocio.correo}`;
                  mision.value = `${negocio.mision}`;
                  vision.value = `${negocio.vision}`;
                  objetivos.value = `${negocio.objetivo}`;
                  imglogo.src= `${negocio.url_logo}`;
                  inputlogo.value = `${negocio.url_logo}`;

              })
          }
      })

     $.ajax({
        url: 'https://api-sascha.herokuapp.com/redsociales',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.map(function(redsocial) {
                addRowRedesSociales(redsocial.nombre, redsocial.url_logo, redsocial.url_base)
            })

        },
        error: function(res, status, xhr) {
            console.log(res)
            console.log(status)
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);

        }
    })

      $('#guardarRedSocial').on('click', function() {

    let redsocial = {
            nombre: $('#inputNombreRed').val(),
            url_base: $('#inpuEnlace').val()
        }

 $.ajax({
            url: 'https://api-sascha.herokuapp.com/redsociales',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(redsocial),
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                 mensaje('#msjAlerta', `Red Social`, 1);
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);

            }
        })
 $('#agregarRedsocial').modal('hide');
})


     function addRowRedesSociales( redsocial,icono, enlace) {
    let row = $(`<tr>
        <td>${redsocial}</td>
        <td><img src="${icono}" style="width:30px"></td>
        <td>${enlace}</td>
        <td><a class="edit btn btn-stransparent" href="javascript:;"><span class="glyphicon glyphicon-pencil"></span></a> <a class="delete btn btn-stransparent" href="javascript:;"><span class="glyphicon glyphicon-trash"></span></a></td>
        </tr>
        `);
    $('#redes-sociales').DataTable().row.add(row).draw();
}

     $('#btn-editar').click(function(){
       $('#btn-editar').hide();
        $("input").removeAttr('disabled');
           $('#btn-guardar').show();
             })


    })