$(document).ready(function() {
    /* tabla de ofertas y promociones */
    const tabla = $('#dtreclamos1').DataTable({ 
        "language": {
            "lengthMenu": "",
            "search": "Buscar:",
            "paginate": {
                "previous": "Anterior",
                "next": "Siguiente"
            },
            "emptyTable": "No se encontraron Reclamos",
            "zeroRecords": "No se encontraron Reclamos"
        },
        "searching": true,
        "ordering": true,
        "paging": true
    });



 // Carga los reclamos en la tabla
 $.ajax({
    url: 'https://api-sascha.herokuapp.com/reclamos',
    contentType: 'application/json',
    type: 'GET',
    success: function(res, status, xhr) {
        res.data.map(function(reclamo) {
            let row = $(`<tr>
                <td id="cliente-${reclamo.id_reclamo}">${reclamo.cliente}</td>
                <td id="servicio-${reclamo.id_reclamo}">${reclamo.servicio}</td>
                <td id="motivo-${reclamo.id_reclamo}">${reclamo.motivo}</td>
                <td id="fecha_creacion-${reclamo.id_reclamo}">${moment(reclamo.fecha).format('DD-MM-YYYY')}</td>
                <td id="editar-${reclamo.id_reclamo}">
                <button class="ver btn btn-stransparent" onclick="cargarModal('${reclamo.cliente}','${reclamo.motivo}','${reclamo.id_reclamo}',${reclamo.id_servicio})" title="Ver Más" type="button">
                <i class="fa fa-share"></i> 
              </button>
                </td>
                </tr>
            `);
            tabla.row.add(row).draw();
        })

    },
    error: function (res, status, xhr) {
        const respuesta = JSON.parse(res.responseText);
        mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
        
    }
});

// Carga el Combo de Respuesta para tipo de motivo reclamo
$.ajax({
    url: 'https://api-sascha.herokuapp.com/respuestas',
    contentType: 'application/json',
    type: 'GET',
    success: function(res, status, xhr) {
        res.data.map(function(reclamo) {
            if(reclamo.tipo_respuesta.id_tipo_motivo == 2){
            let option = $(`<option value="${reclamo.id_respuesta}">${reclamo.descripcion}</option>`)
            $('#SelRespuesta').append(option);
            }
        })

    },
    error: function(res, status, xhr) {
        const respuesta = JSON.parse(res.responseText);
        mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
        
    }
})




});


function llenarCondiciones(id){

    // Carga las condiciones 


}

function cargarModal(nombre,motivo,id, id_servicio) {
    document.getElementById('condicionesreclamo').innerHTML = "";

    $.ajax({
        url: `https://api-sascha.herokuapp.com/servicio/${id_servicio}`,
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.condiciones_garantia.map(function(reclamo) {
                document.getElementById("condicionesreclamo").append("• ");
                document.getElementById("condicionesreclamo").append(reclamo.descripcion);
                document.getElementById("condicionesreclamo").append("\n");
            })
    
        },
        error: function(res, status, xhr) {
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
            
        }
    })
    var mymodal = $('#modal-atender');
    document.getElementById("txtClienteReclamoInput").value = nombre;
    document.getElementById("txtClienteMotivoInput").value = motivo;
    document.getElementById("numeroReclamo").innerHTML = id;
    
    mymodal.modal('show');
}

function actualizarReclamos(){
    var numeroReclamo;
    numeroReclamo = $('#numeroReclamo').text();
    let consulta = {
        id_respuesta: $('#SelRespuesta').val()
    }
// enviar respuesta de reclamo al cliente
    $.ajax({
        url: "https://api-sascha.herokuapp.com/reclamo/" + numeroReclamo,
        cache: false,
        contentType: 'application/json',
        type: 'PUT',
        data: JSON.stringify(consulta),                         // Setting the data attribute of ajax with file_data
        success: function (res, status, xhr) {
            console.log(res)   
            $('#dtreclamos1').DataTable().row($(`#cliente-${numeroReclamo}`).parent()).remove().draw();
            mensaje('#msjAlerta', `Su reclamo fue respodido con éxito`, 15);
            
        },
        error: function (res, status, xhr) {
            console.log(res)
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.mensaje}`, 0);
        }
    })
}