var datos=[];
$(document).ready(function() {
    /* Cargar Multiselect */
    // document.getElementById('selFuncionalidades').length = 1;
    // $.ajax({
    //     url: 'https://api-sascha.herokuapp.com/funcionalidades',
    //     contentType: 'application/json',
    //     type: 'GET',
    //     success: function(res, status, xhr) {
    //         res.data.map(function(funcionalidad) {
    //             let option = $(`<option value="${funcionalidad.id_funcionalidad}">${funcionalidad.nombre}</option>`)
    //             $('#ms_funcionalidades').append(option);
    //             $('#ms_funcionalidades').multiSelect('refresh')
    //         })

    //     },
    //     error: function(res, status, xhr) {

    //     }
    // })
    /* tabla tipo de parametros */
    const tablaRoles = $('#dtRoles').DataTable({ 
        "language": {
            "lengthMenu": "",
            "search": "Buscar:",
            "paginate": {
                "previous": "Anterior",
                "next": "Siguiente"
            },
            "emptyTable": "No se encontraron roles",
            "zeroRecords": "No se encontraron roles"
        },
        "searching": true,
        "ordering": true,
        "paging": true
    });
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/roles',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.map(function(roles) {
                
                let row = $(`<tr>
                    <td id="nombre-${roles.id_rol}">${roles.nombre}</td>
                    <td id="descripcion-${roles.id_rol}">${roles.descripcion}</td>                    
                    <td>
                        <button onclick="editarRoles(${roles.id_rol})" type='button' class='edit btn  btn-stransparent' data-toggle="modal" data-target="#editarRoles"  title='Editar'><i class='fa fa-pencil'></i></button>
                        <button onclick="abrirModalEliminarRoles(${roles.id_rol})" type='button' class='ver btn  btn-stransparent' data-toggle='modal' data-target="#eliminarRoles" title='Eliminar'><i class="fa fa-trash-o"></i></button>
                    </td>
                </tr>
                `);
                tablaRoles.row.add(row).draw();
            })

        },
        error: function() {
            
        }
    })
    
    $('#ms_funcionalidades').multiSelect({
    selectableHeader: "<input type='text' class='form-control search-input' autocomplete='off' placeholder='buscar...'>",
    selectionHeader: "<input type='text' class='form-control search-input' autocomplete='off' placeholder='buscar...'>",
    afterInit: function (ms) {

        var that = this,
            $selectableSearch = that.$selectableUl.prev(),
            $selectionSearch = that.$selectionUl.prev(),
            selectableSearchString = '#' + that.$container.attr('id') + ' .ms-elem-selectable:not(.ms-selected)',
            selectionSearchString = '#' + that.$container.attr('id') + ' .ms-elem-selection.ms-selected';

        that.qs1 = $selectableSearch.quicksearch(selectableSearchString)
            .on('keydown', function (e) {
                if (e.which === 40) {
                    that.$selectableUl.focus();
                    return false;
                }
            });

        that.qs2 = $selectionSearch.quicksearch(selectionSearchString)
            .on('keydown', function (e) {
                if (e.which == 40) {
                    that.$selectionUl.focus();
                    return false;
                }
            });
    },
    afterSelect: function (values) {
        this.qs1.cache();
        this.qs2.cache();
        datos.push(values[0]);
        console.log(datos);
    },
    afterDeselect: function (values) {
        this.qs1.cache();
        this.qs2.cache();
        const index = datos.indexOf(values[0])
        if (index != -1){
            datos.splice(index,1)
        }
        console.log(datos)
    }
});

    $('#btnAceptar').on('click', function() {
        
        if($('#txtNombre').val() == ""){
            $('#txtNombre').css('border', '1px solid red');
            return;
        }
        else{
            $('#txtNombre').css('border', '1px solid #767676');
        }
        if($('#txtDescripcion').val() == ""){
            $('#txtDescripcion').css('border', '1px solid red');
            return;
        }else{
            $('#txtDescripcion').css('border', '1px solid #858580');
        }
        console.log(datos.length)
        if(datos.length == '0'){
            mensaje('#msjAlertaA', `funcionalidades`, 5);
            return;
        }
        let func = []
        datos.map(function(funcionalidad){
             func.push({
                id_funcionalidad: funcionalidad
            })
        })
    

        let rol = {
            nombre: $('#txtNombre').val(),
            descripcion: $('#txtDescripcion').val(),
            funcionalidades: func
        }

        $.ajax({
            url: 'http://localhost:5000/roles', //'https://api-sascha.herokuapp.com/roles',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(rol),
            success: function(res, status, xhr) {                              
                console.log(res);
                console.log(status);
                const rol1 = res.data 
                limpiarRol()
                mensaje('#msjAlerta', `Tipo Unidad`, 1);
                addRowRoles(rol1.id_rol,rol1.nombre,rol1.descripcion);
               // agregarFuncionalidades(rol1.id_rol)
                $('#myModal .close').click();
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
            }
        })

    })

    $('#btnGuardarEdit').on('click', function() {
             if($('#txtNombreE').val() == ""){
            $('#txtNombreE').css('border', '1px solid red');
            return;
        }
        else{
            $('#txtNombreE').css('border', '1px solid #858580');
        }
        if($('#txtDescripcionE').val() == ""){
            $('#txtDescripcionE').css('border', '1px solid red');
            return;
        }else{
            $('#txtDescripcionE').css('border', '1px solid #858580');
        }

        let id = $('#txtIdRolE').val();
        if($('#txtDescripcionE').val() == $(`#descripcion-${id}`).text() && $('#txtNombreE').val() == $(`#nombre-${id}`).text()){
            mensaje('#msjAlerta',``,4);
            $('#editarRoles').modal('hide');
            return;
        }
        let rol = {
            nombre: $('#txtNombreE').val(),
            descripcion: $('#txtDescripcionE').val()
        }


        
        $.ajax({
            url: `https://api-sascha.herokuapp.com/role/${id}`,
            contentType: 'application/json',
            type: 'PUT',
            data: JSON.stringify(rol),
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                editRowRoles(id, rol.nombre, rol.descripcion)
                limpiarRol()
                $('#editarRoles .close').click();
                mensaje('#msjAlerta',  `Rol`, 3);
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
            }
        })
    })

   

});

    function agregarFuncionalidades(id){

        datos.map(function(funcionalidad){
            let rol = {
                id_rol: id,
                id_funcionalidad: funcionalidad
            }
            console.log(funcionalidad)
            
            $.ajax({
                url: 'https://api-sascha.herokuapp.com/rolfuncionalidades',
                contentType: 'application/json',
                type: 'POST',
                data: JSON.stringify(rol),
                success: function(res, status, xhr) {                              
                    console.log(res);
                    console.log(status);
                },
                error: function(res, status, xhr) {
                    console.log(res);
                    console.log(status);
                }
            })
        });
    }

    function addRowRoles(id, nombre, descripcion){
        let row = $(`<tr>
        <td id="nombre-${id}">${nombre}</td>
        <td id="descripcion-${id}">${descripcion}</td>
        <td>
            <button onclick="editarRoles(${id})" type='button' class='edit btn  btn-stransparent' data-toggle="modal" data-target="#editarrRoles"  title='Editar'><i class='fa fa-pencil'></i></button>
            <button onclick="abrirModalEliminarRoles(${id})" type='button' class='ver btn  btn-stransparent' data-toggle='modal' data-target="#eliminarRoles" title='Eliminar'><i class="fa fa-trash-o"></i></button>
        </td>
        </tr>
        `);
        $('#dtRoles').DataTable().row.add(row).draw();
    }

    function limpiarRol(){
        $('#txtNombre').val('');
        $('#txtDescripcion').val('');
        $('#txtNombreE').val('');
        $('#txtDescripcionE').val('');
    }   
    function editarRoles(id){
        $('#txtNombreE').val($(`#nombre-${id}`).text());
        $('#txtDescripcionE').val($(`#descripcion-${id}`).text());
        $('#txtIdRolE').val(id);
        $('#btnAceptar').css('display', 'none');
        $('#btnEditar').css('display', 'inline');
    }

    function abrirModalEliminarRoles(id){
        $('#txtIdRolEliminar').val(id);
    }

    function editRowRoles(id, nombre, descripcion){

        $(`#nombre-${id}`).text(nombre);
        $(`#descripcion-${id}`).text(descripcion);
    
    }

    function eliminarRoles(id){
        $.ajax({
            url: `https://api-sascha.herokuapp.com/role/${id}`,
            contentType: 'application/json',
            type: 'DELETE',
            success: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                mensaje('#msjAlerta',  `Rol`, 2);
                $('#dtRoles').DataTable().row($(`#nombre-${id}`).parent()).remove().draw();
                $('#eliminarRoles .close').click();
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
            }
        })
    }