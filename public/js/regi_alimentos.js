let arregloTipoUnidades = [];

$(document).ready(function() {
    /* tabla Grupos Alimenticios */
    
    const tablaGrupoAlimenticio = $('#dtGruposAlimenticios').DataTable({ 
        "aoColumnDefs": [
        { "bSortable": false, "aTargets": [3] }
        ],
        "language": {
            "lengthMenu": "",
            "search": "Buscar:",
            "paginate": {
                "previous": "Anterior",
                "next": "Siguiente"
            },
            "emptyTable": "No se encontraron grupos alimenticios",
            "zeroRecords": "No se encontraron grupos alimenticios"
        },
        "searching": true,
        "ordering": true,
        "paging": true
    });
    
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/tipounidades',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            console.log(res);
            res.data.map(function(tipoUnidad) {
                arregloTipoUnidades.push(tipoUnidad);
                let optiontipo = $(`<option value="${tipoUnidad.id_tipo_unidad}">${tipoUnidad.nombre}</option>`)
                $('#selTipoUnidad').append(optiontipo);
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
        url: 'https://api-sascha.herokuapp.com/grupoalimenticios',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            console.log(res);
            res.data.map(function(grupoalimenticio) {
                addRowGrupo(grupoalimenticio.id_grupo_alimenticio, grupoalimenticio.nombre, grupoalimenticio.unidad.tipo_unidad.nombre, grupoalimenticio.unidad.nombre)
            })
        },
        error: function(res, status, xhr) {
            console.log(res)
            console.log(status)
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);

        }

    })

    $('#btnAceptarGrupo').on('click', function() {

        if($('#txtNombreGrupoAlimenticio').val() == ""){
            $('#txtNombreGrupoAlimenticio').css('border', '1px solid red');
            return;
        }

        if($('select[name=tipo_unidad]').val() == "0"){
            $('select[name=tipo_unidad]').css('border', '1px solid red')
            return;
        }

        if($('select[name=unidad]').val() == "0"){
            $('select[name=unidad]').css('border', '1px solid red')
            return;
        }

        let grupoalimenticio = {
            nombre: $('#txtNombreGrupoAlimenticio').val(),
            id_unidad: $('select[name=unidad]').val()
        }

        const nombre_tipo_unidad = $('select[name="tipo_unidad"] option:selected').text()
        const nombre_unidad = $('select[name="unidad"] option:selected').text()

        $.ajax({
            url: 'https://api-sascha.herokuapp.com/grupoalimenticios',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(grupoalimenticio),
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                addRowGrupo(res.data.id_grupo_alimenticio, res.data.nombre, nombre_tipo_unidad, nombre_unidad)
                limpiarGrupo();
                mensaje('#msjAlerta', `Grupo Alimenticio`, 1);
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta',`${respuesta.data.mensaje}`, 0);
            }
        })
        $('#agregarGrupoAlimenticio').modal('hide');

    })

    $('#btnEditarGrupo').on('click', function() {

        if($('#txtNombreGrupoAlimenticio').val() == ""){
            $('#txtNombreGrupoAlimenticio').css('border', '1px solid red');
            return;
        }

        if($('select[name=unidad]').val() == "0"){
            $('select[name=unidad]').css('border', '1px solid red')
            return;
        }

        if($('select[name=tipo_unidad]').val() == "0"){
            $('select[name=tipo_unidad]').css('border', '1px solid red')
            return;
        }

        let grupoalimenticio = {
            nombre: $('#txtNombreGrupoAlimenticio').val(),
            id_unidad: $('select[name=unidad]').val()
        }

        const nombre_tipo_unidad = $('select[name="tipo_unidad"] option:selected').text()
        const nombre_unidad = $('select[name="unidad"] option:selected').text()

        let id = $('#txtIdGrupo').val();

        if(grupoalimenticio.nombre == $(`#nombregrupo-${id}`).text() && nombre_tipo_unidad == $(`#tipo_unidad-${id}`).text() && nombre_unidad == $(`#unidad-${id}`).text()){
            mensaje('#msjAlerta', ``, 4);
            $('#agregarGrupoAlimenticio').modal('hide');
            return;
        }
        $.ajax({
            url: `https://api-sascha.herokuapp.com/grupoalimenticio/${id}`,
            contentType: 'application/json',
            type: 'PUT',
            data: JSON.stringify(grupoalimenticio),
            success: function(res, status, xhr) {
                console.log(grupoalimenticio);
                mensaje('#msjAlerta', `Grupo Alimenticio`, 3);
                console.log(res.data)
                editRowGrupo(id, grupoalimenticio.nombre, nombre_tipo_unidad, nombre_unidad)
                limpiarGrupo();
            },
            error: function(res, status, xhr) {
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta',`${respuesta.data.mensaje}`, 0);
                
            }
        })
        $('#agregarGrupoAlimenticio').modal('hide');
    })


    $( '#selTipoUnidad' )
    .change(function () {
    document.getElementById('selUnidad').length=1;
    var str = "";
    $( "#selTipoUnidad option:selected" ).each(function() {
      str += $( this ).val() + " ";
    });
    arregloTipoUnidades.map(function(tipounidad){
        if(tipounidad.id_tipo_unidad == str){
            tipounidad.unidades.map(function(unidad) {
                let optionunidad = $(`<option value="${unidad.id_unidad}">${unidad.nombre}</option>`)
                $('#selUnidad').append(optionunidad);
            })
        }
    })
  })

  /* tabla Alimentos */
    const tabalAlimentos = $('#dtAlimentos').DataTable({ 

        "aoColumnDefs": [
        { "bSortable": false, "aTargets": [2] }
        ],               
        "language": {
            "lengthMenu": "",
            "search": "Buscar:",
            "paginate": {
                "previous": "Anterior",
                "next": "Siguiente"
            },
            "emptyTable": "No se encontraron alimentos",
            "zeroRecords": "No se encontraron alimentos"
        },
        "searching": true,
        "ordering": true,
        "paging": true  
    });

    $('#btnAceptarAlimento').on('click', function() {

        if($('#txtNombreAlimento').val() == ""){
            $('#txtNombreAlimento').css('border', '1px solid red');
            return;
        }

        if($('select[name=grupo_alimenticio]').val() == "0"){
            $('select[name=grupo_alimenticio]').css('border', '1px solid red')
            return;
        }

        let alimento = {
            nombre: $('#txtNombreAlimento').val(),
            id_grupo_alimenticio: $('select[name=grupo_alimenticio]').val()
        }

        const nombre_grupo_alimenticio = $('select[name="grupo_alimenticio"] option:selected').text()

        $.ajax({
            url: 'https://api-sascha.herokuapp.com/alimentos',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(alimento),
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                addRowAlimento(res.data.id_alimento, res.data.nombre, nombre_grupo_alimenticio)
                limpiarAlimentos();
                mensaje('#msjAlerta', `Alimento`, 1);
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta',`${respuesta.data.mensaje}`, 0);
            }
        })
        $('#agregarAlimentos').modal('hide');

    })

    $('#btnEditarAlimento').on('click', function() {

        if($('#txtNombreAlimento').val() == ""){
            $('#txtNombreAlimento').css('border', '1px solid red');
            return;
        }

        if($('select[name=grupo_alimenticio]').val() == "0"){
            $('select[name=grupo_alimenticio]').css('border', '1px solid red')
            return;
        }

        let alimento = {
            nombre: $('#txtNombreAlimento').val(),
            id_grupo_alimenticio: $('select[name=grupo_alimenticio]').val()
        }

        const nombre_grupo_alimenticio = $('select[name="grupo_alimenticio"] option:selected').text()

        let id = $('#txtIdAlimento').val();

        if(alimento.nombre == $(`#nombrealimento-${id}`).text() && nombre_grupo_alimenticio == $(`#grupo_alimenticio-${id}`).text()){
            mensaje('#msjAlerta', ``, 4);
            $('#agregarAlimentos').modal('hide');
            return;
        }
        $.ajax({
            url: `https://api-sascha.herokuapp.com/alimento/${id}`,
            contentType: 'application/json',
            type: 'PUT',
            data: JSON.stringify(alimento),
            success: function(res, status, xhr) {
                const alimento = res.data;
                mensaje('#msjAlerta', `alimento`, 3);
                console.log(res.data)
                editRowAlimento(id, alimento.nombre, nombre_grupo_alimenticio)
                limpiarAlimentos();
            },
            error: function(res, status, xhr) {
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta',`${respuesta.data.mensaje}`, 0);
                
            }
        })
        $('#agregarAlimentos').modal('hide');
    })

    });

    function limpiarGrupo(){
        $('#txtNombreGrupoAlimenticio').val('');
        $('#txtIdGrupo').val('');
        $('#selTipoUnidad option:contains(Seleccione)').prop('selected',true);
        $('#selUnidad option:contains(Seleccione)').prop('selected',true);
    }

    function addRowGrupo(id, nombre, tipo_unidad, unidad) {
        let row = $(`<tr>
            <td id="nombregrupo-${id}">${nombre}</td>
            <td id="tipo_unidad-${id}" style="display:none;">${tipo_unidad}</td>
            <td id="unidad-${id}">${unidad}</td>
            <td>
            <button onclick="editarGrupo(${id})" type='button' class='edit btn  btn-transparente' data-toggle="modal" data-target="#agregarGrupoAlimenticio"  title='Editar'><i class='fa fa-pencil'></i></button>
            <button onclick="abrirModalEliminarGrupo(${id})" type='button' class='ver btn  btn-transparente' data-toggle='modal' data-target="#eliminarGrupo" title='Eliminar'><i class="fa fa-trash-o"></i></button>
            </td>
            </tr>
            `);
        $('#dtGruposAlimenticios').DataTable().row.add(row).draw();
    }

    function editarGrupo(id){
        $('#txtNombreGrupoAlimenticio').val($(`#nombregrupo-${id}`).text());
        $('#selTipoUnidad option:contains('+ $(`#tipo_unidad-${id}`).text() + ')').prop('selected',true);
        const tipounidades = $('#selTipoUnidad option:contains('+ $(`#tipo_unidad-${id}`).text() + ')').val();
        arregloTipoUnidades.map(function(tipounidad){
        if(tipounidad.id_tipo_unidad == tipounidades){
            tipounidad.unidades.map(function(unidad) {
                let optionunidad = $(`<option value="${unidad.id_unidad}">${unidad.nombre}</option>`)
                $('#selUnidad').append(optionunidad);
            })
        }
        })
        $('#selUnidad option:contains('+ $(`#unidad-${id}`).text() + ')').prop('selected',true);
        $('#txtIdGrupo').val(id);
        $('#btnAceptarGrupo').css('display', 'none');
        $('#btnEditarGrupo').css('display', 'inline');
    }

    function editRowGrupo(id, nombre, tipo_unidad, unidad){
        $(`#nombregrupo-${id}`).text(nombre)
        $(`#tipo_unidad-${id}`).text(tipo_unidad)
        $(`#unidad-${id}`).text(unidad)
    }

    function abrirModalEliminarGrupo(id){
        $('#txtIdGrupoEliminar').val(id);
    }

    function eliminarGrupo(id){
        $.ajax({
            url: `https://api-sascha.herokuapp.com/grupoalimenticio/${id}`,
            contentType: 'application/json',
            type: 'DELETE',
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                $('#dtGruposAlimenticios').DataTable().row($(`#nombregrupo-${id}`).parent()).remove().draw();
                $('#txtIdGrupoEliminar').val('');
                mensaje('#msjAlerta', `Grupo Alimenticio`, 2);

            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta',`${respuesta.data.mensaje}`, 0);
            }
        })
    }

    function addRowAlimento(id, nombre, grupo_alimenticio) {
        let row = $(`<tr>
            <td id="nombrealimento-${id}">${nombre}</td>
            <td id="grupo_alimenticio-${id}">${grupo_alimenticio}</td>
            <td>
            <button onclick="editarAlimento(${id})" type='button' class='edit btn  btn-transparente' data-toggle="modal" data-target="#agregarAlimentos"  title='Editar'><i class='fa fa-pencil'></i></button>
            <button onclick="abrirModalEliminarAlimento(${id})" type='button' class='ver btn  btn-transparente' data-toggle='modal' data-target="#eliminarAlimento" title='Eliminar'><i class="fa fa-trash-o"></i></button>
            </td>
            </tr>
            `);
        $('#dtAlimentos').DataTable().row.add(row).draw();
    }

    function editarAlimento(id){
        $('#txtNombreAlimento').val($(`#nombrealimento-${id}`).text());
        $('#selGrupoAlimenticio option:contains('+ $(`#grupo_alimenticio-${id}`).text() + ')').prop('selected',true);
        $('#txtIdAlimento').val(id);
        $('#btnAceptarAlimento').css('display', 'none');
        $('#btnEditarAlimento').css('display', 'inline');
    }

    function editRowAlimento(id, nombre, grupo_alimenticio){
        console.log("entrooooooo")
        $(`#nombrealimento-${id}`).text(nombre)
        $(`#grupo_alimenticio-${id}`).text(grupo_alimenticio)
    }


    function limpiarAlimentos(){
        $('#txtNombreAlimento').val('');
        $('#txtIdAlimento').val('');
        $('#selGrupoAlimenticio option:contains(Seleccione)').prop('selected',true);
    }

    function cargarAlimentos(){
        $('#dtAlimentos').DataTable().clear();
        document.getElementById('selGrupoAlimenticio').length=1;
        $.ajax({
        url: 'https://api-sascha.herokuapp.com/grupoalimenticios',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            console.log(res);
            res.data.map(function(grupoalimenticio) {
                let optiongrupo = $(`<option value="${grupoalimenticio.id_grupo_alimenticio}">${grupoalimenticio.nombre}</option>`)
                $('#selGrupoAlimenticio').append(optiongrupo);
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
        url: 'https://api-sascha.herokuapp.com/alimentos',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.map(function(alimento) {
                addRowAlimento(alimento.id_alimento, alimento.nombre, alimento.grupo_alimenticio.nombre)
            })
        },
        error: function() {
            
        }
    })   
    }

    function abrirModalEliminarAlimento(id){
        $('#txtIdAlimentoEliminar').val(id);
    }

    function eliminarAlimento(id){
        $.ajax({
            url: `https://api-sascha.herokuapp.com/alimento/${id}`,
            contentType: 'application/json',
            type: 'DELETE',
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                $('#dtAlimentos').DataTable().row($(`#nombrealimento-${id}`).parent()).remove().draw();
                $('#txtIdAlimentoEliminar').val('');
                mensaje('#msjAlerta', `Alimento`, 2);

            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta',`${respuesta.data.mensaje}`, 0);
            }
        })
    }