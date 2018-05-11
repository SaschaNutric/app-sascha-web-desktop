$(document).ready(function() {
    /* tabla de ofertas y promociones */
    const tabla = $('#dtofertapromociones').DataTable({ 
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
    var myParam = location.search.split('id=')[1];
    if(myParam != null){
            $.ajax({
                url: 'https://api-sascha.herokuapp.com/promocion/'+myParam,
                contentType: 'application/json',
                type: 'GET',
                success: function(res, status, xhr) {
                    let promocion = res.data;
                    $('#txtNombrePromo').val( promocion.nombre);    
                    $('#txtDescripcionPromo').val( promocion.descripcion);    
                    $('#txtDescuento').val( promocion.descuento);  
                },
                error: function(res, status, xhr) {
                    const respuesta = JSON.parse(res.responseText);
                    mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
                }
            });
        
    }
    // Carga el las promociones en la tabla (FALTA AGRAGAR LOS BOTONES VER, EDITAR, ELIMINAR Y CHECBOX)
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/promociones',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            console.log(res.data)

            res.data.map(function(promocion) {
                let row = $(`<tr>
                    <td> </td>
                    <td id="nombre-${promocion.id_promocion}">${promocion.nombre}</td>
                    <td id="servicio-${promocion.id_promocion}">${promocion.servicio.nombre}</td>
                    <td id="descripcion-${promocion.id_promocion}">${promocion.descripcion}</td>
                    <td id="descuento-${promocion.id_promocion}">${promocion.descuento}</td>
                    <td id="valido_desde-${promocion.id_promocion}">${promocion.valido_desde}</td>
                    <td id="valido_hasta-${promocion.id_promocion}">${promocion.valido_hasta}</td>
                    <td>
                        <a onclick="editarPromo(${promocion.id_promocion})"  class='edit btn  btn-stransparent' title='Editar'><i class='fa fa-pencil'></i></a>
                        <button onclick="abrirModalEliminarPromo(${promocion.id_promocion})" type='button' class='ver btn  btn-stransparent' data-toggle='modal' data-target="#modal-confirmar-1" title='Eliminar'><i class="fa fa-trash-o"></i></button>
                    </td>
                    </tr>
                    `);
                   tabla.row.add(row).draw();
                   }) 

              },
              error: function(res, status, xhr) {
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
          }
       })


    $('#btnAceptarPromo').on('click', function() {
        
        if($('#txtNombrePromo').val() == ""){
            $('#txtNombrePromo').css('border', '1px solid red');
            return;
        }
        if($('#selServicios').val() == "")
        {
            $('#selServicios').css('border', '1px solid red');
            return;
        }

        if($('#txtDescripcionPromo').val() == "") {
            $('#txtDescripcionPromo').css('border', '1px solid red');
            return;
        }
        if($('#txtDescuento').val() == ""){
            $('#txtDescuento').css('border', '1px solid red');
            return;
        }
        if($('#dpValidoDesde').val() == ""){
            $('#dpValidoDesde').css('border', '1px solid red');
            return;
        }
        if($('#dpValidoHasta').val() == ""){
            $('#dpValidoHasta').css('border', '1px solid red');
            return;
        }

        let ofertaPromo= {
            nombre: $('#txtNombrePromo').val(),
            id_servicio: $('#selServicios').val(),
            descripcion: $('#txtDescripcionPromo').val(),
            descuento: $('#txtDescuento').val(),
            valido_desde: $('#dpValidoDesde').val(),
            valido_hasta: $('#dpValidoHasta').val()
        }
        console.log(ofertaPromo)

        let id = $('#txtIdPromo').val();
        $.ajax({
            url: `https://api-sascha.herokuapp.com/promociones/`,
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(ofertaPromo),
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                $('#txtNombrePromo').val('');
                document.getElementById('selServicios').selectedIndex = 0
                $('#txtDescripcionPromo').val('');
                $('#txtDescuento').val('');
                $('#dpValidoDesde').val('');
                $('#dpValidoHasta').val('');
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
            }
        })
    })

    $('#btnEditarPromo').on('click', function() {
        alert($('#txtIdPromo').val());
        if($('#txtNombrePromo').val() == ""){
            $('#txtNombrePromo').css('border', '1px solid red');
            return;
        }
        if($('#selServicios').val() == "")
        {
            $('#selServicios').css('border', '1px solid red');
            return;
        }
    
        if($('#txtDescripcionPromo').val() == "") {
            $('#txtDescripcionPromo').css('border', '1px solid red');
            return;
        }
        if($('#txtDescuento').val() == ""){
            $('#txtDescuento').css('border', '1px solid red');
            return;
        }
        if($('#dpValidoDesde').val() == ""){
            $('#dpValidoDesde').css('border', '1px solid red');
            return;
        }
        if($('#dpValidoHasta').val() == ""){
            $('#dpValidoHasta').css('border', '1px solid red');
            return;
        }
    
        let ofertaPromo= {
            nombre: $('#txtNombrePromo').val(),
            id_servicio: $('#selServicios').val(),
            descripcion: $('#txtDescripcionPromo').val(),
            descuento: $('#txtDescuento').val(),
            valido_desde: $('#dpValidoDesde').val(),
            valido_hasta: $('#dpValidoHasta').val()
        }
        console.log(ofertaPromo)

 let id = $('#txtIdPromo').val();
        $.ajax({
            url: `https://api-sascha.herokuapp.com/promocion/${id}`,
            contentType: 'application/json',
            type: 'PUT',
            data: JSON.stringify(ofertaPromo),
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                $('#txtNombrePromo').val('');
                document.getElementById('selServicios').selectedIndex = 0
                $('#txtDescripcionPromo').val('');
                $('#txtDescuento').val('');
                $('#dpValidoDesde').val('');
                $('#dpValidoHasta').val('');                
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
            }
        })
    })

   /* $('#btnGuardar').on('click', function(){
        var myParam = location.search.split('id=')[1];
  
        var myData = new FormData();
        myData.append("nombre", "value");
        $.ajax({
            url: "https://api-sascha.herokuapp.com/promocion/19",
            type: "PUT",
            data: myData,
            crossDomain: true,
            contentType: "multipart/form-data",
            processData: false,
        });

       
    
    
  });*/
    




});  

function editarPromo(id){

     var params = {
     id_promocion : id}
    
     window.location=`ofer_registrarPromocion.html?id=${id}`;
}

function abrirModalEliminarPromo(id){
    $('#txtIdPromoEliminar').val(id);
}

function eliminarPromo(id){
    $.ajax({
        url: `https://api-sascha.herokuapp.com/promocion/${id}`,
        contentType: 'application/json',
        type: 'DELETE',
        success: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            $('#dtofertapromociones').DataTable().row($(`#nombre-${id}`).parent()).remove().draw();
            $('#txtNombrePromo').val('');
            document.getElementById('selServicios').selectedIndex = 0
            $('#txtDescripcionPromo').val('');
            $('#txtDescuento').val('');
            $('#dpValidoDesde').val('');
            $('#dpValidoHasta').val('');
            mensaje('#msjAlerta', `Servicio`, 2);
            
        },
        error: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
        }
    })
}

//Busqueda del id de la promocion a editar
var paramstr = window.location.search.substr(1);
var paramarr = paramstr.split ("=");
var params = {};
params[paramarr[0]] = paramarr[1];
const id = params['id'];

//Llena el formulario con informacion de la Promocion a editar
if(id!=undefined){
    $('#btnGuardar').css('display', 'inline');
    $('#btnRegistrar').css('display', 'none');
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/promocion/'+id,
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            let ofertaPromo = res.data;
            $('#txtNombrePromo').val( promocion.nombre);
            $('#selServicios').val(promocion.servicio.nombre);
            $('#txtDescripcionPromo').val(promocion.descripcion);
            $('#txtDescuento').val(promocion.descuento);
            $('#dpValidoDesde').val(promocion.valido_desde);
            $('#dpValidoHasta').val(promocion.valido_hasta);
        },
        error: function(res, status, xhr) {
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
        }
    });
};
