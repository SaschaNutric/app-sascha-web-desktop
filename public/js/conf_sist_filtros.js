/* tabla filtros */
$(document).ready(function() {
      
    /* tabla filtros */
    const tablaFiltros = $('#dtFiltros').DataTable({ 
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
            "emptyTable": "No se encontraron tipos de parametros",
            "zeroRecords": "No se encontraron tipos de parametros"
        },
        "searching": true,
        "ordering": true,
        "paging": true
    });

    $.ajax({
        url: 'https://api-sascha.herokuapp.com/tipoparametros',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.map(function(tipoParametro) {        
                addRowTipoParametro(tipoParametro.id_tipo_parametro,tipoParametro.nombre, tipoParametro.filtrable)
            })

        },
        error: function(res, status, xhr) {
            console.log(res)
            console.log(status)
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);

        }
    })
});

function addRowTipoParametro(id, nombre, filtrable){
    let row;
    if(filtrable == false){
        row = $(`<tr>
        <td id="nombre-${id}">${nombre}</td>
        <td>
            <button onclick="filtrable(${id})" type='button' class='edit btn  btn-aceptar' title='filtrable'>Filtrable</i></button>
        </td>
        </tr>
        `);
    }else{
    row = $(`<tr>
        <td id="nombre-${id}">${nombre}</td>
        <td>
            <button onclick="noFiltrable(${id})" type='button' class='ver btn  btn-cancelar' title='noFiltrable'>No Filtrable</i></button>
        </td>
        </tr>
        `);
    }
   $('#dtFiltros').DataTable().row.add(row).draw();
}

function filtrable(id){
    let parametro = {
        filtrable: true
    }
    $.ajax({
        url: `https://api-sascha.herokuapp.com/tipoparametro/${id}/filtrable`,
        contentType: 'application/json',
        type: 'PUT',
        data: JSON.stringify(parametro),
        success: function(res, status, xhr) {
            console.log(res.data)
            let row = $(`<tr>
            <td id="nombre-${res.data.id_tipo_parametro}">${res.data.nombre}</td>
            <td>
                <button onclick="noFiltrable(${res.data.id_tipo_parametro})" type='button' class='ver btn  btn-cancelar' title='noFiltrable'>No Filtrable</i></button>
            </td>
            </tr>
            `);
            $('#dtFiltros').DataTable().row($(`#nombre-${id}`).parent()).remove().draw();
            $('#dtFiltros').DataTable().row.add(row).draw();
            mensaje('#msjAlerta', `Tipo de parametro`, 8);
        },
        error: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta',`${respuesta.data.mensaje}`, 0);

        }
    })
}

function noFiltrable(id){
    let parametro = {
        filtrable: false
    }
    $.ajax({
        url: `https://api-sascha.herokuapp.com/tipoparametro/${id}/filtrable`,
        contentType: 'application/json',
        type: 'PUT',
        data: JSON.stringify(parametro),
        success: function(res, status, xhr) {
            console.log(res.data)
            let row = $(`<tr>
            <td id="nombre-${res.data.id_tipo_parametro}">${res.data.nombre}</td>
            <td>
                <button onclick="filtrable(${res.data.id_tipo_parametro})" type='button' class='edit btn  btn-aceptar' title='filtrable'>Filtrable</i></button>
            </td>
            </tr>
            `);
            $('#dtFiltros').DataTable().row($(`#nombre-${id}`).parent()).remove().draw();
            $('#dtFiltros').DataTable().row.add(row).draw();
            mensaje('#msjAlerta', `Tipo de parametro`, 9);
        },
        error: function(res, status, xhr) {
            console.log(res);
            console.log(status);
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta',`${respuesta.data.mensaje}`, 0);

        }
    })
}

